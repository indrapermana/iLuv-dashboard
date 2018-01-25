var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var auth = firebase.auth();
var database = firebase.database();

router.post('/user/register', function (req, res, next) {
	var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

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

        res.statusCode = 201;
        return res.json({
            errors: "",
            data: user
        });
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        res.statusCode = 500;
        return res.json({
            errors: errorMessage
        });
    });
});

router.post('/user/login', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    auth.signInWithEmailAndPassword(email, password).then(function (user) {
        res.statusCode = 200;
        return res.json({
            errors: "",
            data: user
        });
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        res.statusCode = 500;
        return res.json({
            errors: errorMessage
        });
    });
});

// Logout User
router.get('/user/logout', function (req, res) {
	auth.signOut().then(function () {
		res.statusCode = 200;
        return res.json({
            errors: "",
            data: []
        });

    }).catch(function (error) {
        var errorMessage = error.message;

        res.statusCode = 500;
        return res.json({
            errors: errorMessage
        });
	});

});

router.get('/products', function (req, res) {
    var productsRef = database.ref('products');

    productsRef.once('value', function (snapshot) {
        var data = [];
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            data.push({
                id: key,
                name: childData.name,
                description: childData.description,
                event: childData.event,
                img: childData.img,
                price: childData.price,
                site_name: childData.site_name,
                url_site: childData.url_site
            });
        });
        res.statusCode = 200;
        return res.json({
            errors: "",
            data: data
        });
    }).catch(function (error){
        var errorMessage = error.message;
        
        res.statusCode = 500;
        return res.json({
            errors: errorMessage
        });
    });

});

module.exports = router;
