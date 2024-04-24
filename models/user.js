const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

const UserSchema= new mongoose.Schema({
    email:{
        type: "string",
        required:true,
        unique: true
    }
})
UserSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User",UserSchema);