// routes/auth.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET Register Page
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// POST Register
router.post('/register', async (req, res) => {
    const { username, password, password2 } = req.body;
    let errors = [];

    // Basic Validation
    if (!username || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('auth/register', {
            errors,
            username,
            password,
            password2
        });
    } else {
        try {
            const user = await User.findOne({ username: username });
            if (user) {
                errors.push({ msg: 'Username already exists' });
                res.render('auth/register', {
                    errors,
                    username,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    username,
                    password
                });

                await newUser.save();
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/login');
            }
        } catch (err) {
            console.error(err);
            res.redirect('/register', { message: `err` });
        }
    }
});

// GET Login Page
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// POST Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
});

// GET Logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
});

module.exports = router;
