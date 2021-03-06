
const express = require('express');
const authRoutes = express.Router();
const passport = require('passport')
const bcrypt = require('bcryptjs')

const Parent = require('../models/Parent');
const Child = require('../models/Child');
const Teacher = require('../models/Teacher');

authRoutes.post('/signup', (req, res, next) => {
	const name = req.body.name;
	const lastName = req.body.lastName;
	const address = req.body.address;
	const phone = req.body.phone;
	const username = req.body.username;
	const password = req.body.password;
	
	if (!username || !password) {
		res.status(400).json({ message: 'Provide username and password' });
		return;
	}

	if (password.length < 12) {
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
			name: name,
			lastName: lastName,
			address: address,
			phone: phone,
			username: username,
			password: hashPass,
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

authRoutes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong authenticating user' });
            return;
        }
    
        if (!theUser) {
            // "failureDetails" contains the error messages
            // from our logic in "LocalStrategy" { message: '...' }.
            res.status(401).json(failureDetails);
            return;
        }

        // save user in session
        req.login(theUser, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session save went bad.' });
                return;
            }

            // We are now logged in (that's why we can also send req.user)
            res.status(200).json(theUser);
        });
    })(req, res, next);
});

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
  res.status(403).json({ message: 'Unauthorized' });
});

authRoutes.post('/add_child', (req, res, next)=>{
  Child.create({
		name: req.body.name,
		lastName: req.body.lastName,
		gender: req.body.gender,
		birth: req.body.birth,
		lunch: req.body.lunch,
		morning: req.body.morning,
    owner: req.body.userId
  })
  .then(response => {
  res.json(response);
  })
  .catch(err => {
  res.json(err);
  })
});

authRoutes.post('/add_teacher', (req, res, next)=>{

  Teacher.create({
    name: req.body.name,
		age: req.body.age,
		speciality: req.body.speciality,
		education: req.body.education,
		role: req.body.role,
  })
  .then(response => {
  res.json(response);
  })
  .catch(err => {
  res.json(err);
  })
});

authRoutes.get('/children/:id', (req, res, next)=>{
	const id = req.params.id;
	Child.find({owner:id})
	.then((result)=>{
		res.send(result)

	})
	.catch((err)=>{
		res.send(err)
	})
})

authRoutes.get('/teacher/:id', (req, res, next)=>{
	const id = req.params.id;
	Teacher.findById(id)
	.then((result)=>{
		console.log(result)
	})
	.catch((err)=>{
		console.log(err)
	})
})

authRoutes.post('/edit_address/:id', (req, res, next)=>{
	const id = req.params.id
	console.log(req.body)
	Parent.findByIdAndUpdate(id, {address: req.body.address})
	.then((result)=>{
		console.log(result)
		res.send(result)
	})
	.catch((err)=>{
		console.log(err)
	})
})

authRoutes.post('/edit_phone/:id', (req, res, next)=>{
	const id = req.params.id
	console.log(req.body)
	Parent.findByIdAndUpdate(id,  {phone: req.body.phone})
	.then((result)=>{
		console.log(result)
		res.send(result)
	})
	.catch((err)=>{
		console.log(err)
	})
})

module.exports = authRoutes;