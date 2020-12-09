'use strict';
const UserModel = require('../models/User');
const validator = require('validator');
const crypto = require('crypto');

const userController = {

  viewRegister: (req, res) =>  {
    const locals = {
      action: `/register`,
      title: 'Register',
      message: ''
    }
    res.render('register', locals);
  },

  register: (req, res) => {

    const name = !validator.isEmpty(req.body.name);
    const email = validator.isEmail(req.body.email);
    const password = !validator.isEmpty(req.body.password);

    if (!name || !email || !password) return res.render('error');

    const newUser = {
      name: req.body.name,
      email: req.body.email, 
      password: req.body.password
    }
  
    crypto.randomBytes(16, (err, salt) => {
      const newSalt = salt.toString('base64');

      crypto.pbkdf2(newUser.password, newSalt, 1000, 64, 'sha1', (err, key) => {
        const encryptedPassword = key.toString('base64');

        UserModel.findOne({email: newUser.email}, (err, user) => {
          if(err) return res.render('error');
          if(user) return res.render('register', {
            action: `/register`,
            title: 'Register',
            message: 'El usuario ya existe'
          });

          UserModel.create({
            name: newUser.name, 
            email: newUser.email,
            password: encryptedPassword,
            salt: newSalt
          }, (err, user) => {
            if(err) return res.render('error');
            req.session.user = user;
            return res.redirect('/');
          });
        });
      });
    });

  },

  viewLogin: (req, res) => {
    const locals = {
      title: "Login",
      action: "/login",
      message: "Login"
    }

    return res.render('login', locals);
  },

  login: (req, res) => {
    let email = validator.isEmail(req.body.email);
    let password = !validator.isEmpty(req.body.password);

    if(!email || !password) return res.render('error', {
      message: 'Error al autenticarse'
    });

    email = req.body.email;
    password = req.body.password;

    UserModel.findOne({email: email}).exec()
      .then(user => {
        if(!user) return render('login', {
          title: "Login",
          action: "/login",
          message: 'El Usuario no existe'
        })

        crypto.pbkdf2(password, user.salt, 1000, 64, 'sha1', (err, key) => {
          const encryptedPassword = key.toString('base64');

          if (encryptedPassword === user.password) {
            req.session.user = user;
            var hour = 3600000
            req.session.cookie.expires = new Date(Date.now() + hour)
            req.session.cookie.maxAge = hour
            return res.redirect('/');
          }

          return res.render('login', {
            title: "Login",
            action: "/login",
            message: 'Usuario o Contraseña incorrecta'
          });
        });
      });
  },

  me: (req, res) => {
    
  },

  exit: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  }
}

module.exports = userController;