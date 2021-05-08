const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: String,
    price: String,
    image: {type: String, default: "https://scotturb.com/wp-content/uploads/2016/11/product-placeholder.jpg"},
    description: String,
    producer: String,
    isAvailable: {type: Boolean, default: true}
});

module.exports = mongoose.model('Product', ProductSchema);