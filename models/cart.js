const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    items: [
        {
           productId: String,
           quantity: Number
        }
     ]
});

module.exports = mongoose.model('Cart', CartSchema);