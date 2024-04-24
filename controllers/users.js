const User=require("../models/user");

module.exports.renderRegister=(req,res)=>{
    res.render("users/register");
}

module.exports.register=async(req,res,next)=>{
    try{
        const {email,username,password}=req.body;
        let user= new User({email,username});
        let registeredUser= await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err)
                next(err);
            req.flash("success","Welcome to YelpCamp");
            res.redirect("/campgrounds");
        })
    }
    catch(e){
        req.flash("error","e.message");
        res.redirect("/register");
    }
}

module.exports.renderLogin=(req,res)=>{
    redirectUrl=req.session.returnTo || "/campgrounds";  // not the right way but working
    res.render("users/login");
}

module.exports.login=(req,res)=>{
    console.log("Inside post login",req.session.returnTo,"Not redirecting to correct path");
    // let redirectUrl=req.session.returnTo || "/campgrounds";
    // delete req.session.returnTo;  // correct way but not warking
    req.flash("success","Welcome Back!");
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout(function(err) {
        if (err) 
            return next(err); 
        req.flash("success","Goodbye!");
        res.redirect("/campgrounds");
    });
}