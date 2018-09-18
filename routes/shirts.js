var express = require('express');
var router = express.Router();

var shirtsController = require('../controllers/shirtController');
var mailController = require('../controllers/mailController');

router.get('/', function (req, res) {
    req.app.locals.layout = 'layout_home';
    shirtsController.getAll(function (shirts) {
        //console.log(shirts);
        res.render('index', {
            shirts:shirts
        });
       
    });
});

router.post('/mail', function (req, res) {
    mailController.create(req.body.email,function(contactMails){
        res.sendStatus(201);
        res.end();
    });
});

module.exports = router;