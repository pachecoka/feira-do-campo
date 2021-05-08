require("dotenv").config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const multer = require('multer');
const upload = multer();
const cookieSession = require('cookie-session');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require("./controller/auth")(passport);
const indexRoutes = require('./controller/routes/index');
const productsRoutes = require('./controller/routes/products');
const cartsRoutes = require('./controller/routes/carts');
const userRoutes = require('./controller/routes/user');
const orderRoutes = require('./controller/routes/order');

app.set('view engine', 'ejs') ;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array()); 
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.locals.moment = require('moment');
app.use(
  cookieSession({
    keys: ['digaamigoeentre']
  })
);

//sessão
app.use(session({
  secret: 'feiralovelace',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.info = req.flash('info');
  res.locals.user_global = req.user;
  next()
});

mongoose.connect(
    process.env.DATABASEURL,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
    (error) => {
        if(error) console.log(error);

        console.log('Aplicação conectada ao banco de dados!');
    }
);

app.use('/', indexRoutes);
app.use('/products', productsRoutes);
app.use('/cart', cartsRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);

app.listen(process.env.PORT, () => {
    console.log('A Feira do Campo está no ar!');
});