const express=require("express");
const router=express.Router({mergeParams:true});
const listing=require("../models/listing.js");
const wrapAsync=require("../util/wrapasync.js");
const ExpressError=require("../util/ExpressError.js");
const { reviewSchema }=require("../schema.js");
const review=require("../models/review.js");
const {isloggedin, isowner,isreviewauthor}= require("../middleware.js");


const validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }
    next();
};

//reviews //post route
router.post("/",isloggedin,validatereview,wrapAsync(async (req,res)=>{
    let listings= await listing.findById(req.params.id);
    let newreview=new review(req.body.review);
    newreview.author=req.user._id;

    listings.review.push(newreview);

    await newreview.save();
    await listings.save();
    req.flash("success","New review Created!");
    res.redirect(`/listings/${listings._id}`);
}));

// //delete route
// router.delete("/:reviewId", isloggedin, isreviewauthor, wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await review.findByIdAndDelete(reviewId);
//     req.flash("success", "Review Deleted");
//     res.redirect(`/listing/${id}`);
// }));


module.exports=router;

