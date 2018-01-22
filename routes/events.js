var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var database = firebase.database();

router.get('/', function (req, res, next) {
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
		res.render('events/index', { events: data });
	});
});

router.get('/add', function (req, res, next) {
	res.render('events/add');
});

router.post('/add', function (req, res, next) {
	var event = {
		name: req.body.name
	}
	console.log(event);
	database.ref('events').push().set(event);

	req.flash('success_msg', 'Event Saved');
	res.redirect('/events');
});

router.get('/edit/:id', function (req, res, next) {
	var id = req.params.id;
	
	var eventRef = database.ref('/events/' + id);
	eventRef.once('value', function (snapshot) {
		var event = snapshot.val();
		res.render('events/edit', { event: event, id: id });
	});
});

router.post('/edit/:id', function (req, res, next) {
	var id = req.params.id;
	var event = {
		name: req.body.name
	}

	var eventRef = database.ref('/events/' + id);
	eventRef.update();

	res.redirect('/events');
});

router.delete('/delete/:id', function (req, res, next) {
	var id = req.params.id;	
	var eventRef = database.ref('/events/' + id);
	eventRef.remove();
	
	req.flash('success_msg', 'Event removed');
	res.send(200);
});
module.exports = router;
