const express = require('express');
const router  = express.Router();
const User = require('../../models/user');
const {isAuthenticated} = require('../middlewares/isAuthenticated');
const bcrypt = require('bcrypt');

// INDEX - GET to show view for editing a user
router.get("/", isAuthenticated, function(req, res){
  var userId;
    userId = req.user._id;

  User.findById(userId, (err, foundUser) => {
    if(err){
      req.flash("error", "Um erro inesperado aconteceu, entre em contato para assitência!");
      console.log('Error getting user from DB');
    }
    res.render('pages/users/edit', { user: foundUser });
  });
});

// UPDATE - update a user
router.put('/', isAuthenticated, async (req, res) => {
  var userId;
  userId = req.user._id;
    
  const { firstName, lastName, password, repeatedPassword } = req.body;
  const user = { firstName, lastName };

  if (password) {
    if(repeatedPassword != password ){
      console.log("Senhas incorretas.");
      req.flash("error", "As senhas informadas diferem, verifique as informações inseridas!");
      res.redirect('/user');
      return;
    } else {
      await bcrypt.hash(password, 10, async (err, hash) => {
        user.password = hash; 
        User.findByIdAndUpdate(userId, user, (err, updatedUser) => {
          if(err) {
            console.log(err);
            req.flash("error", "Ocorreu um erro ao editar os dados, entre em contato para assitência!");
          }
          req.flash("success", "Dados atualizados com sucesso!");
          console.log('User updated successfully, id: ' + updatedUser.id);
          res.redirect('/user');
        });
      });
    }
  } else {
    User.findByIdAndUpdate(userId, user, (err, updatedUser) => {
      if(err) {
        console.log(err);
        req.flash("error", "Ocorreu um erro ao editar os dados, entre em contato para assitência!");
      }
      req.flash("success", "Dados atualizados com sucesso!");
      console.log('User updated successfully, id: ' + updatedUser.id);
      res.redirect('/user');
    });
  } 
});

module.exports = router;