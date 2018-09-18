var express = require('express');
var router = express.Router();

var shirtsController = require('../controllers/shirtController');
var userController = require('../controllers/userController');
router.get('/:id', function (req, res) {
    req.app.locals.layout = 'layout_member';
    userController.getById(parseInt(req.params.id), function (user) {
        res.render('member', {
            user: user
        });
        
    });
   
});

router.post('/:id', function (req, res) {
    req.app.locals.layout = 'layout_member';
    userController.updateById(parseInt(req.params.id),req.body.name,req.body.phone,req.body.address, function (user) {
        res.render('member', {
            user: user
        });
        
    });
   
});

router.post('/password/:id', function (req, res) {
    var id=parseInt(req.params.id);
    var oldPassword = req.body.oldpassword;
	var password = req.body.password;
	var cfm_pwd = req.body.cfm_pwd;
    console.log("id"+id);
    console.log("new Password:"+password);
    console.log("old Password:"+oldPassword);
    console.log("confirm Password:"+cfm_pwd);
   
	req.checkBody('oldpassword', 'Old Password is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('cfm_pwd', 'Confirm Password is required').notEmpty();
	req.checkBody('cfm_pwd', 'Confirm Password Must Matches With Password').equals(password);

	userController.getById(id, function (user) {
        var errors = req.validationErrors();
        if (errors) {
            console.log("Change password Failed: not enough info!");
            console.log(errors);
            req.flash('error_message', errors[0].msg);
		    res.redirect('/order/'+id);
        }
        else {
            userController.comparePassword(oldPassword, user.password, function (err, isMatch) {
                if (err) { 
                    console.log("Change password Failed!: password wrong");
                    req.flash('error_message', err.msg);
		            res.redirect('/order/'+id);                    
                }
				if (isMatch){
                    userController.changePasswordById(id,password,function(user){
                        res.redirect('/users');                    
                    })
                }
                else{
                    req.flash('error_message', "Wrong password!");
		            res.redirect('/order/'+id);                 
                }
            });
        }
    });
});

module.exports = router;