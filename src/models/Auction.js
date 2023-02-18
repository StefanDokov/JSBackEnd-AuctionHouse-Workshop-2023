const mongoose = require('mongoose');


const auctionSchema = new mongoose.Schema({

   title: {
    type: String,
    required: true,
    minLength: 4,
   },
   description: {
    type: String,
    required: true,
    maxLength: 200,
   },
   category: {
    type: String,
    required: true,
    enum: {
        values: ['vehicles', 'estate', 'electronics', 'furniture', 'other'], 
        message: 'Invalid category!'},
   },
   imageUrl: {
    type: String,
    required: true,
   },
   price: {
    type: Number,
    required: true,
    min: 0,
   },
   author: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
   },
   bidder: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
   },
   isClosed: {
      type: Boolean
   }


});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;