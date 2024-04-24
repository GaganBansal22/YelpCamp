const mongoose=require("mongoose");
const Review=require("./review");

const ImageSchema=new mongoose.Schema({
    url:"string",
    filename:"string"
})

ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_200");
})

const CampgroundSchema= new mongoose.Schema({
    title: "string",
    price: "number",
    images: [ImageSchema],
    description: "string",
    location: "string",
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }]
});

CampgroundSchema.post("findOneAndDelete",async (doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in :doc.reviews
            }
        })
    }
})

module.exports=mongoose.model("Campground",CampgroundSchema);