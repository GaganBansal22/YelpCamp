const Campground=require("../models/campground");
const {cloudinary}=require("../cloudinary");
const campground = require("../models/campground");


module.exports.index=async function(req,res){
    let campgrounds=await Campground.find();
    res.render("campgrounds/index.ejs",{campgrounds});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("campgrounds/new");
}

module.exports.createCampground=async(req,res,next)=>{
    let campground=new Campground(req.body.campground);
    campground.images=req.files.map(f => ({url:f.path,filename:f.filename}));
    campground.author=req.user._id;
    await campground.save();
    req.flash("success","Sucessfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground=async function(req,res){
    let campground=await Campground.findById(req.params.id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("author");
    if(!campground){
        req.flash("error","Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show",{campground});
}

module.exports.renderEditForm=async (req,res)=>{
    let campground=await Campground.findById(req.params.id);
    if(!campground){
        req.flash("error","Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit",{campground});    
}

module.exports.updateCampgound=async (req,res)=>{
    let {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,req.body.campground);
    let imgs=req.files.map(f => ({url:f.path,filename:f.filename}));
    campground.images.push(...imgs);
    if(req.body.deleteImages){
        for(let f of req.body.deleteImages)
            await cloudinary.uploader.destroy(f);
        await campground.updateOne({$pull: {images: {filename: {$in : req.body.deleteImages}}}});
    }
    await campground.save();
    req.flash("success","Successfully updated campground!");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampgrounds=async (req,res)=>{
    let {id}=req.params;
    let campground=await Campground.findById(id);
    for(let i of campground.images){
        await cloudinary.uploader.destroy(i.filename);
    }
    await Campground.findByIdAndDelete(id);
    req.flash("success","Successfully deleted campground");
    res.redirect("/campgrounds");
}