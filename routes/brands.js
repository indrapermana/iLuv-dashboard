var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var database = firebase.database();

router.get('/', function (req, res, next) {
	var brandsRef = database.ref('brands');

	brandsRef.once('value', function (snapshot) {
		var data = [];
		snapshot.forEach(function (childSnapshot) {
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			data.push({
				id: key,
				name: childData.name
			});
		});
		res.render('brands/index', { brands: data });
	});
});

router.get('/add', function (req, res, next) {
	res.render('brands/add');
});

router.post('/add', function (req, res, next) {
	var event = {
		name: req.body.name
	}
	console.log(event);
	database.ref('brands').push().set(event);

	req.flash('success_msg', 'Brand Saved');
	res.redirect('/brands');
});

router.get('/edit/:id', function (req, res, next) {
	var id = req.params.id;
	
	var brandRef = database.ref('/brands/' + id);
	brandRef.once('value', function (snapshot) {
		var brand = snapshot.val();
		res.render('brands/edit', { brand: brand, id: id });
	});
});

router.post('/edit/:id', function (req, res, next) {
	var id = req.params.id;
	var brand = {
		name: req.body.name
	}

	var brandRef = database.ref('/brands/' + id);
	brandRef.update(brand);

	res.redirect('/brands');
});

router.delete('/delete/:id', function (req, res, next) {
	var id = req.params.id;	
	var brandRef = database.ref('/brands/' + id);
	brandRef.remove();
	
	req.flash('success_msg', 'Brand removed');
	res.send(200);
});
module.exports = router;
