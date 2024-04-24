const {campgroundSchema,reviewSchema}=require("./schemas");
const ExpressError=require("./utils/ExpressError");
const Campground=require("./models/campground");
const Review = require("./models/review");
const review = require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be signed in!");
        req.session.returnTo=req.originalUrl;
        return res.redirect("/login")
    }
    next();
}

module.exports.validateCampground= (req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e=>e.message).join(",");
        throw new ExpressError(msg,400);
    }
    else
        next();
}

module.exports.isAuthor=async(req,res,next)=>{
    let {id}=req.params;
    let campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error","You do not have permisssion to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(review.author.equals(req.user._id)){
        req.flash("error","You do not have permisssion to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(e=>e.message).join(",");
        throw new ExpressError(msg,400);
    }
    else
        next();
}