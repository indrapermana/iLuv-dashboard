var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var auth = firebase.auth();
var database = firebase.database();

router.get('/register', function (req, res, next) {
	res.render('users/register');
});

router.get('/login', function (req, res, next) {
	res.render('users/login');
});

router.post('/register', function (req, res, next) {
	var firstName = req.body.first_name;
	var lastName = req.body.last_name;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('first_name', 'First name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('users/register', {
			errors: errors
		});
	} else {
		auth.createUserWithEmailAndPassword(email, password).then(function (user) {
			console.log("Successfully created user with uid:", user.uid);
			var user = {
				uid: user.uid,
				email: email,
				first_name: firstName,
				last_name: lastName
			}

			var usersRef = database.ref('users');
			usersRef.push().set(user);

			req.flash('success_msg', 'You are now registered and can login');
			res.redirect('/users/login');
		}).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;

			console.log("Error creating user: ", error);
			req.flash('error_msg', error.message);
			res.redirect('/users/register');
		});
	}
});

router.post('/login', function (req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	// Validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('users/login', {
			errors: errors
		});
	} else {
		auth.signInWithEmailAndPassword(email, password).then(function (user) {
			req.flash('success_msg', 'You are now logged in');
			res.redirect('/products');
		}).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;

			console.log("Login Failed: ", error);
			req.flash('error_msg', errorMessage);
			res.redirect('/users/login');
		});
	}
});

// Logout User
router.get('/logout', function (req, res) {
	auth.signOut().then(function () {
		req.flash('success_msg', 'You are logged out');
		res.redirect('/users/login');
		// Sign-out successful.
	}).catch(function (error) {
		req.flash('error_msg', error.message);
		// An error happened.
	});

});

module.exports = router;
