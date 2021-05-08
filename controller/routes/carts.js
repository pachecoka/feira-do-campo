const express = require('express');
const cartsRepo = require('../../models/cart');
const productsRepo = require('../../models/product');

const router = express.Router();

// Receive a post request to add an item to a cart
router.post('/products/:id', async (req, res) => {
  // Figure out the cart!
  let cartId;
  let cart;
  if(req.user && req.user.idCart) {
    cartId = req.user.idCart;
  } else {
    cartId = req.session.cartId;
  }

  const productId = req.params.id;
  if (!cartId) {
    // We dont have a cart, we need to create one,
    // and store the cart id on the req.session.cartId
    // property
    cart = await cartsRepo.create( { items: [] } );
    console.log(cart)
    if(req.user){
      req.user.idCart = cart.id;
      req.user.save();
    } else {
      req.session.cartId = cart.id;
    }
  } else {
    // We have a cart! Lets get it from the repository
    cart = await cartsRepo.findById(cartId);
  }

  const existingItem = cart.items.find(item => item.productId === productId);
  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new product id to items array
    cart.items.push({ productId: productId, quantity: 1 });
  }
  cart.save();
  res.send();
});

// Receive a GET request to show all items in cart
router.get('/', async (req, res) => {
  if (!req.session.cartId && (!req.user || !req.user.idCart)) {
    return res.redirect('/');
  }
  let cartId;
  
  if(req.user && req.user.idCart) {
    cartId = req.user.idCart;
  } else {
    cartId = req.session.cartId;
  }

  const cart = await cartsRepo.findById(cartId);
  let products = [];
  
  for (let item of cart.items) {
    let foundProduct = await productsRepo.findById(item.productId);
    if (foundProduct != null){
      let { id, title, price, image, isAvailable, producer } = foundProduct;
      let product = { id, title, price, image, isAvailable, producer };
      product.quantity = item.quantity;
      products.push(product);
    } else {
      continue;
    }
  }
  
  res.render('pages/carts/show', { products, cart });
  
});

// Receive a post request to delete an item from a cart
router.delete('/products/:id', async (req, res) => {
  let cartId;
  
  if(req.user && req.user.idCart) {
    cartId = req.user.idCart;
  } else {
    cartId = req.session.cartId;
  }

  await cartsRepo.findByIdAndUpdate(
    cartId, { 
      $pull: { "items": { productId: req.params.id } } 
    }, { safe: true, upsert: true }
  );
    
  res.redirect('/cart');
});

module.exports = router;
