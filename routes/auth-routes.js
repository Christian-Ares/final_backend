
const express = require('express');
const authRoutes = express.Router();
const passport = require('passport')
const bcrypt = require('bcryptjs')
// import passport from 'passport';
// import bcrypt from 'bcryptjs';

const Parent = require('../models/Parent')

authRoutes.post('/signup', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		res.status(400).json({ message: 'Provide username and password' });
		return;
	}

	if (password.length < 9) {
		res
			.status(400)
			.json({ message: 'Please make your password at least 9 characters long for security purposes.' });
		return;
	}

	Parent.findOne({ username }, (err, foundParent) => {
		if (err) {
			res.status(500).json({ message: 'Username check went bad.' });
			return;
		}

		if (foundParent) {
			res.status(400).json({ message: 'Username taken. Choose another one.' });
			return;
		}

		const salt = bcrypt.genSaltSync(10);
		const hashPass = bcrypt.hashSync(password, salt);

		const addNewParent = new Parent({
			username: username,
      password: hashPass
		});

		addNewParent.save((err) => {
			if (err) {
				res.status(400).json({ message: 'Saving user to database went wrong.' });
				return;
			}
			// Automatically log in user after sign up
			// .login() here is actually predefined passport method
			req.login(addNewParent, (err) => {
				if (err) {
					res.status(500).json({ message: 'Login after signup went bad.' });
					return;
				}

				// Send the user's information to the frontend
				// We can use also: res.status(200).json(req.user);
				res.status(200).json(addNewParent);
			});
		});
	});
});

authRoutes.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

authRoutes.post('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

authRoutes.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
  }
  res.json({ });
});

module.exports = authRoutes;