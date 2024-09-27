const listing=require("./models/listing.js");

module.exports.isloggedin = (req,res,next)=>{
   // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isowner= async (req,res,next)=>{
    let {id}=req.params;
    let Listing= await listing.findById(id);
    if(!Listing.owner.equals(res.locals.curruser.id)){
        req.flash("error","You are not the owner of the listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isreviewauthor= async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser.id)){
        req.flash("error","You didn't create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}