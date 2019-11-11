const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/login',  (req, res, next) => {
    try {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.send({success:false, error: info.message}) }
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              return res.send({success: true})
            });
          })(req, res, next);

    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/register', async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
    
        let errors = []
               
        const user = await User.findOne({email: email});

        if (user) {
            errors.push({message: 'User already exists'})

            res.send({success: false, errors})

        } else {
            const hash = await bcrypt.hash(password, 10)

            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password: hash
            })

            req.login(newUser, (err) => {
                if (err) { 
                    return res.status(500).send({success: false, err});
                } else {
                    return res.send({success: true})
                }
            });
        }
        
      } catch(err) {
        res.status(500).send(err)
      }
})

router.get('/user', async (req, res, next) => {

    try {

        if (req.user) {
            const user = await User.findById(req.user._id);
            const { firstName, lastName, email } = user;
            res.send({ 
                loggedIn: true,
                firstName, 
                lastName, 
                email
             })
        } else {
            res.send({
                loggedIn:false
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

// google

router.get('/auth/google',
  passport.authenticate('google', { 
      scope: [
          'profile', 
          'email'
        ] 
    }));

router.get( '/google/cobalt', (req, res, next) => {
    passport.authenticate('google', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(404).send({success:false, message: info.message}) }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('http://localhost:3000/')
        });
      })(req, res, next);
})

// facebook

router.get('/auth/facebook',
  passport.authenticate('facebook'));
    
router.get('/facebook/cobalt', (req, res, next) => {
    passport.authenticate('facebook', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(404).send({success:false, message: info.message}) }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('http://localhost:3000/')
        });
    })(req, res, next);
    
});


router.get('/logout', (req, res) => {
    req.logout();
    res.send({loggedOut: true})
})


module.exports = router;