var express = require('express');
var router = express.Router();

var shirtsController = require('../controllers/shirtController');
var customController = require('../controllers/customController');
var billController = require('../controllers/billController');
var userController = require('../controllers/userController');

router.get('/:customerId', function (req, res) {
    req.app.locals.layout = 'layout';
    var shi;
    shirtsController.getById(parseInt(1), function (shirt) {
        shi=shirt;
    });
    shirtsController.getAll(function (shirts) {
        //console.log(shirts);
        userController.getById(parseInt(req.params.customerId), function (user) {
            res.render('design', {    
                shirts:shirts,
                shirt:shi,
                user: user
            });
        });
    });
});

router.get('/:customerId/:id', function (req, res) {
    
    req.app.locals.layout = 'layout';
    var shi;
    shirtsController.getById(parseInt(req.params.id), function (shirt) {
        shi=shirt;
    });
   
    shirtsController.getAll(function (shirts) {
        //console.log(shirts);
        userController.getById(parseInt(req.params.customerId), function (user) {
            res.render('design', {    
                shirts:shirts,
                shirt:shi,
                user: user
            });
        });
       
    });
});

router.post('/delete', function (req, res) {
    req.app.locals.layout = 'layout';
    userController.deleteCustomShirtById(parseInt(req.body.id), function (user) {
        res.render('design', {    
            user: user
        });
    });
});


router.post('/upload', function (req, res) {

    var base64Data = req.body.imagedata.replace(/^data:image\/png;base64,/, "");
    var filename= (new Date().getTime()).toString(36) + ".png";
    // //console.log(req.body.id);
    customController.create(req.body.id,req.body.name,"/upload/"+filename,req.body.price,function(customShirts){
        
        res.sendStatus(201);
        res.end();
    });
    
    require("fs").writeFileSync("./public/upload/"+filename, base64Data, 'base64', function(err) {
        console.log(err);
    });
    
    //res.render('/cart');
});

router.post('/order', function (req, res) {
    var userId=req.body.userId;
    var name=req.body.name;
    var total=req.body.total;
    var firstname=req.body.firstname;
	var lastname=req.body.lastname;
	var countrycode=req.body.countrycode;
	var postalcode=req.body.postalcode;
	var state=req.body.state;
	var phone=req.body.phone;
	var city=req.body.city;
	var address=req.body.address;
	var method=req.body.method;
    var customShirts=req.body.customShirts;
    var a=JSON.parse(customShirts);
    var shirts=a.a;
    // console.log(shirts);
    billController.create(userId,name,total, firstname,
        lastname,
        countrycode,
        postalcode,
        state, 
        phone,
        city,
        address,
        method,function(bill){
        shirts.forEach(function(value){
            var sname=value.name;
            var price=value.price;
            var image=value.image;
            var base64Data = image.replace(/^data:image\/png;base64,/, "");
            var filename= (new Date().getTime()).toString(36) + ".png";
           
            customController.create(bill.id,userId,sname,"/upload/"+filename,price,function(customShirts){
                
            });
            require("fs").writeFileSync("./public/upload/"+filename, base64Data, 'base64', function(err) {
                console.log(err);
            });
        });
        res.json({'billId':bill.id})
        res.sendStatus(201);
        res.end();
    });

  
});
    
module.exports = router;