var express = require('express');
var router = express.Router();

var shirtsController = require('../controllers/shirtController');
var customController = require('../controllers/customController');
var mailController = require('../controllers/mailController');
var usersController = require('../controllers/userController.js');
var billsController = require('../controllers/billController.js');
router.get('/', function (req, res) {
    req.app.locals.layout = 'layout_admin';
    var m,u,c;
    var revenue,totalBill,totalProduct,totalUser;
    var bills;
    mailController.getAll(function (contactMails) {
        m=contactMails;
    });

    usersController.getAll(function (userss) {
        u= userss;    
    });
    usersController.count(function (c) {
        totalUser=c;
    });
    billsController.count(function (c) {
        totalBill=c;
    });
    shirtsController.count(function (c) {
        totalProduct=c;
    });
    billsController.sum(function (c) {
        revenue=c;
    });
    billsController.getAll(function (c) {
        bills=c;
    });
    mailController.count(function (c) {
        console.log(c);
        
    });



    shirtsController.getAll(function (shirts) {
        //console.log(shirts);   
        res.render('admin', {    
            shirts:shirts,      
            mails:m,
            users:u,
            revenue:revenue,
            totalBill:totalBill,
            totalProduct:totalProduct,
            totalUser:totalUser,
            bills:bills
        });
    });
});
router.post('/create-shirt', function (req, res) {
    //console.log("AAA");
    //console.log(req.body.image);
    // var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
    // var filename= (new Date().getTime()).toString(36) + ".png";
    
    shirtsController.create(req.body.name,req.body.image,req.body.price,function(shirts){
        
        res.sendStatus(203);
        res.end();
    });
    
    // require("fs").writeFileSync("./public/upload/"+filename, base64Data, 'base64', function(err) {
    //     console.log(err);
    // });
    
    //res.render('/cart');
});

router.post('/findBill', function (req, res) {
    billsController.getById(req.body.id,function(shirts){
        res.send(shirts);
        res.end();
    });
 
});

router.post('/delete-shirt', function (req, res) {
   
    
    shirtsController.destroy(req.body.id,function(shirts){
        
        res.sendStatus(204);
        res.end();
    });
 
});
router.post('/update-shirt', function (req, res) {
   
    
    shirtsController.update(req.body.id,req.body.price,req.body.name,function(shirts){
        
        res.sendStatus(205);
        res.end();
    });
 
});
router.post('/status-user', function (req, res) {
   
    
    usersController.update(req.body.id,req.body.select,function(shirts){
        
        res.sendStatus(206);
        res.end();
    });
 
});

router.post('/search-mail', function (req, res) {
    console.log('a');  
    mailController.findAllArr('%'+req.body.arr+'%',function(m){
        
        res.send(m);
        res.end();
    });
});

router.post('/search-account', function (req, res) {
     
    usersController.findAllArr('%'+req.body.arr+'%',function(m){
        
        res.send(m);
        res.end();
    });
});
router.post('/search-product', function (req, res) {
   
    shirtsController.findAllArr('%'+req.body.arr+'%',function(m){
        
        res.send(m);
        res.end();
    });
});
router.post('/get-data', function (req, res) {
   
    billsController.getSumbyDate(function (c) {
        res.send(c);
        res.end();
    });
});

router.post('/delete-bill', function (req, res) {
   
    billsController.delete(req.body.id,true,function (c) {
        res.send(205);
        res.end();
    });
});
module.exports = router;