const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");

if(process.env.NOVE_ENV!=="production")
    require("dotenv").config();

const campgroundRoutes=require("./routes/campgrounds");
const reviewRoutes=require("./routes/reviews");
const userRoutes=require("./routes/users");


mongoose.set("strictQuery",true);
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("Database connected");
});

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

const sessionConfig={
    secret:"won'ttellyou",
    resave:false,
    saveUninitialized:true,
    cookie :{
        httpOnly: true,
        expires : Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/reviews",reviewRoutes);
app.use("/",userRoutes);

app.get("/",function(req,res){
    res.render("home");
})

app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not Found",404));
})

app.use((err,req,res,next)=>{
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render("error",{err});
})

app.listen(3000,()=>{
    console.log("Serving on port 3000");
})