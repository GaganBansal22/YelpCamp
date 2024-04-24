const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.set("strictQuery",true);
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:"63d64cb0a2f00df7d5b09173",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente, cum deserunt ut nam inventore quaerat quae necessitatibus tenetur aperiam nihil voluptates repellat nulla illum debitis dolores enim optio ducimus veritatis!",
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dvhf8dfpy/image/upload/v1675337843/YelpCamp/reuuxl8tvucmlefmbfod.png',
                  filename: 'YelpCamp/reuuxl8tvucmlefmbfod'
                },
                {
                  url: 'https://res.cloudinary.com/dvhf8dfpy/image/upload/v1675337844/YelpCamp/gw6pzu3ptt3nircfubci.png',
                  filename: 'YelpCamp/gw6pzu3ptt3nircfubci'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})