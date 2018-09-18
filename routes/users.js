var express = require('express');
var usersController = require('../controllers/userController.js');
var passport = require('passport');
var request = require('request');

let LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
var delay = require('delay');
var csrf = require('csurf');
var csrfProtection=csrf();
router.use(csrfProtection);

var jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
router.get('/', function (req, res) {
	req.app.locals.layout = 'layout_login';
	res.render('login', {
		crsfToken:req.csrfToken()
	});
});

router.post('/register', function (req, res) {
	//console.log(req.g-recaptcha-response);
	var email = req.body.email;
	var password = req.body.password;
	var cfm_pwd = req.body.cfm_pwd;
	var name = req.body.name;
	var phone = req.body.phone;
	var address = req.body.address;
	var grecaptcha=req.body['g-recaptcha-response'];
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('cfm_pwd', 'Confirm Password is required').notEmpty();
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('phone', 'Phone is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	//req.checkBody('v', 'Captcha is required').notEmpty();
	req.checkBody('cfm_pwd', 'Confirm Password Must Matches With Password').equals(password);
	
	if( grecaptcha=== undefined || grecaptcha === '' || grecaptcha === null)
	{
		req.flash('error_message', 'Please select captcha');
		res.redirect('/users');
		return;
	}
	var secretKey = "6LdnrVYUAAAAAClSSzRdt1FlrVICjLSCBaYJoOf-";
	var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + grecaptcha + "&remoteip=" + req.connection.remoteAddress;
	console.log(req.connection.remoteAddress);
	request(verificationUrl,function(error,response,body) {
		body = JSON.parse(body);
		console.log(body);
		if(body.success !== undefined && !body.success) {
			req.flash('error_message', 'Failed captcha verification');
			res.redirect('/users');
			return;
		}
		usersController.getByEmail(email, function (u) {
			if (u) {
				req.flash('error_message', 'That email is already taken.');
				res.redirect('/users');
			}
			else {
				var errors = req.validationErrors();
				if (errors) {
					console.log("Failed me roi!");
					req.flash('error_message', errors[0].msg);
					res.redirect('/users');
				}
				else {
	
					var user = {
						email: email,
						password: password,
						isAdmin: false,
						isEnable: true,
						name: name,
						phone: phone,
						address: address
					}
					usersController.createUser(user, function (err) {
						if (err) throw err;
						else {
							console.log(user);
						}
	
					});
					req.flash('success_message', 'You have registered, Now please login');
					res.redirect('/users');
				}
			}
		});
	});

	
	
});


passport.serializeUser(function (user, done) {

	done(null, user.id);
});

passport.deserializeUser(function (id, done) {

	usersController.getUserById(id, function (err, user) {

		done(err, user);
	});
});
var check;
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},
	function (req, email, password, done) {
		usersController.getUserByEmail(email, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, req.flash('error_message', 'No email is found'));
			}
			usersController.comparePassword(password, user.password, function (err, isMatch) {
				if (err) { return done(err); }
				if (isMatch) {
					if (user.isEnable){
						check=user;
						return done(null, user, req.flash('success_message', 'You have successfully logged in!!'));
					}else
						return done(null, false, req.flash('error_message', 'Your account is disable'));
				}
				else {
					return done(null, false, req.flash('error_message', 'Incorrect Password'));
				}
			});
		});
	}
));


passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
	secretOrKey   : 'SecretKeee'
},
function (jwtPayload, cb) {
	console.log("AA");
	console.log(jwtPayload.id);
	//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
	return usersController.getById(jwtPayload.id)
		.then(user => {
			console.log("BB");

			return cb(null, user);
		})
		.catch(err => {
			return cb(err);
		});
}
));
router.post('/login', passport.authenticate('local', {
		failureRedirect: '/users', failureFlash: true
	}),
	function (req, res) {
		
		// var payload = check.toJSON(); 
		// var token = jwt.sign(payload, 'SecretKeee');
		
   		// res.status(300).json({user: check.id, token: 'JWT  ' + token});
		res.redirect( '/');
		console.log('Dang nhap thanh cong');
		
			
	}
);
router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_message', 'You are logged out');
	res.redirect('/users');
});




module.exports = router;