const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
   customer: String,
   customerEmail: String,
   customerFirstName: String,
   customerLastName: String,
   producer: String,
   products: [
      {
         productId: String,
         title: String,
         quantity: Number,
         price: String
      }
   ],
   createdAt: { type: Date, default: Date.now },
   status: { type: Number, default: 0}
});

module.exports = mongoose.model('Order', OrderSchema);