const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url:String,
        filename:String,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    review:[
        {                                      //one to many 
            type:Schema.Types.ObjectId,
            ref:"review" ,
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
    // category:{
    //     type:String,
    //     enum:["mountains","beaches","farms","deserts"]
    // }

    
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
