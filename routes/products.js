var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var database = firebase.database();
var multer = require('multer');
var upload = multer({ dest: './public/images/uploads' });
var fs = require("fs");

router.get('/', function (req, res, next) {
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
		res.render('products/index', { products: data });
	});
});

router.get('/add', function (req, res, next) {
	var eventsRef = database.ref('events');

	eventsRef.once('value', function (snapshot) {
		var data = [];
		snapshot.forEach(function (childSnapshot) {
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			data.push({
				id: key,
				name: childData.name
			});
		});
		res.render('products/add', { events: data });
	});

});

router.post('/add', upload.single('img'), function (req, res, next) {
	// Check File Upload
	if (req.file) {
		console.log('Uploading File...');
		var img = req.file.filename;
	} else {
		console.log('No File Uploaded...');
		var img = 'noimage.jpg';
	}

	// Build Album Object
	var product = {
		name: req.body.name,
		url_site: req.body.url_site,
		event: req.body.event,
		site_name: req.body.site_name,
		price: req.body.price,
		description: req.body.description,
		img: img,
	}

	// Create Reference
	database.ref('products').push().set(product);

	req.flash('success_msg', 'Product Saved');
	res.redirect('/products');
});

router.get('/details/:id', function (req, res) {
	var id = req.params.id;
	var productsRef = database.ref('/products/' + id);

	productsRef.once('value', function (snapshot) {
		var product = snapshot.val();
		res.render('products/details', { product: product, id: id });
	});

});

router.get('/edit/:id', function (req, res, next) {
	var id = req.params.id;
	var productsRef = database.ref('/products/' + id);
	var eventsRef = database.ref('events');

	eventsRef.once('value', function (snapshot) {
		var data = [];
		snapshot.forEach(function (childSnapshot) {
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			data.push({
				id: key,
				name: childData.name
			});
		});
		productsRef.once('value', function (snapshot) {
			var product = snapshot.val();
			res.render('products/edit', { product: product, id: id, events: data });
		});
	});

});

router.post('/edit/:id', upload.single('img'), function (req, res, next) {
	var id = req.params.id;
	var productsRef = database.ref('/products/' + id);

	if (req.file) {
		var img = req.file.filename;

		var product = {
			name: req.body.name,
			url_site: req.body.url_site,
			event: req.body.event,
			site_name: req.body.site_name,
			price: req.body.price,
			description: req.body.description,
			img: img,
		}

		productsRef.update(product);
	} else {
		var product = {
			name: req.body.name,
			url_site: req.body.url_site,
			event: req.body.event,
			site_name: req.body.site_name,
			price: req.body.price,
			description: req.body.description
		}

		productsRef.update(product);
	}

	req.flash('success_msg', 'Product Updated');
	res.redirect('/products');
});


router.delete('/delete/:id', function (req, res, next) {
	var id = req.params.id;
	var productsRef = database.ref('/products/' + id);
	productsRef.remove();

	req.flash('success_msg', 'Product removed');
	res.send(200);
});

router.get('/export/:id', function (req, res) {
	var id = req.params.id;
	var productsRef = database.ref('/products/' + id);

	productsRef.once('value', function (snapshot) {
		var product = snapshot.val();
		var exportedProduct = {
			id: id,
			name: product.name,
			url_site: product.url_site,
			event: product.event,
			site_name: product.site_name,
			price: product.price,
			description: product.description,
			img: product.img
		}
		var json = JSON.stringify(exportedProduct);
		var filename = product.name+'.json';
		var mimetype = 'application/json';
		res.setHeader('Content-Type', mimetype);
		res.setHeader('Content-disposition','attachment; filename='+filename);
		res.send( json );
	});

});

module.exports = router;
