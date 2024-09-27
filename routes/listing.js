const express=require("express");
const router=express.Router();
const listing=require("../models/listing.js");
const wrapAsync=require("../util/wrapasync.js");
const ExpressError=require("../util/ExpressError.js");
const { listingSchema , reviewSchema }=require("../schema.js");
const { isloggedin,isowner } = require("../middleware.js");
const multer=require("multer");
const {storage} =require("../cloudconfig.js");
const upload=multer({storage});


//validation
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

//index route
router.get("/",wrapAsync(async (req,res)=>{
    let alllisting = await listing.find({});
    res.render("listings/index.ejs",{alllisting});
}));

//create route
router.post("/",isloggedin,upload.single('listing[image]'),validateListing,wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send a valid listing");
    }
    let url=req.file.path;
    let filename=req.file.filename;
    
    const newlist=new listing(req.body.listing);
    newlist.owner=req.user._id;
    newlist.image={url,filename};
    await newlist.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

//new route
router.get("/new",isloggedin,(req,res)=>{
    //console.log(req.user);
    res.render("listings/new.ejs");
});



//edit route
router.get("/:id/edit",isloggedin,isowner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const editlist= await listing.findById(id);
    let originalimageURL = editlist.image.url;
    originalimagrURL =originalimageURL.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{editlist,originalimageURL});
}));



//update route
router.put("/:id",isloggedin, isowner ,upload.single('listing[image]') ,validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let Listing = await listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    Listing.image={url,filename};
    await Listing.save();
    }

    req.flash("success","New Listing Updated!");
    res.redirect(`/listings/${id}`);
}));



//delete route
router.delete("/:id",isloggedin,isowner,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const deletedlist=await listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

//show route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const singlelist= await listing.findById(id)
    .populate({
        path:"review", 
        populate :{path:"author",
        },
    })
    .populate("owner");

    if(!singlelist){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{singlelist});
}));

module.exports=router;