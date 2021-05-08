const localStrategy = require("passport-local").Strategy
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = function(passport){

  passport.use(new localStrategy({usernameField: 'email'}, (email, senha, done) => {

    User.findOne({email: email}).then((user) => {
      if(!user){
        return done(null, false, {message: "Esta conta não existe"});
      }

      //console.log(user);
      const saltRounds = 10;
      bcrypt.compare(senha, user.password, async(err, result) => {
          if(result){
          return done(null, user);
        } else {
          return done (null, false, {message: "A senha está incorreta"});
        }
      })
      
    })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}