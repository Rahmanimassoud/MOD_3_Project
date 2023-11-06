
/*eslint-disable no-undef*/

const mongoose = require('mongoose')

// Schema
const listingSchema = new mongoose.Schema({

    name: {type: String,required: true},
    description: {type: String,required: true},
    address: {type: String,required: true},
    regularPrice: {type: Number,required: true},
    discountPrice: {type: Number,required: true},
    bathrooms: {type: Number, required: true},
    bedrooms: {type: Number, required: true},
    furnished: {type: Boolean, required: true},
    offer: {type: Boolean, required: true},
    petsAllowed: {type: Boolean, required: true},
    type:{type: String, required: true},
    imageUrls:{type: Array,required: true},
    userRef: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}

)

// create Model with that schema

const Listing = mongoose.model("Listing", listingSchema)


module.exports = Listing;