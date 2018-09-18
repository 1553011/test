/* eslint-disable no-param-reassign */
var express = require('express');
var routes = express.Router();
var paypal= require('../controllers/paypalController.js');
var billController = require('../controllers/billController');
var userController = require('../controllers/userController');
var vnpayController = require('../controllers/vnpayController');

// Shopping cart
var cart = {
    "items": [
        {
            "name": "Product Name",
            "description": "Brief description.",
            "quantity": "1",
            "price": "12",
            "tax": "0.00",
            "sku": "product1",
            "currency": "USD"
        },
        {
            "name": "Second Product",
            "description": "Brief description.",
            "quantity": "1",
            "price": "8",
            "tax": "0.00",
            "sku": "product2",
            "currency": "USD"
        },
        {
            "name": "Third item",
            "description": "Brief description.",
            "quantity": "1",
            "price": "5",
            "tax": "0.00",
            "sku": "product3",
            "currency": "USD"
        }
    ],
    "tax": "0.00",
    "shipping": "0.00",
    "handling_fee": "0.00",
    "shipping_discount": "0.00",
    "insurance": "0.00",
    "currency": "USD"
};

function subtotal(items) {
    var subtotal = 0;
    for (var i=0; i<items.length; i++){
        var item = items[i];
        subtotal += parseInt(item.quantity) * parseFloat(item.price) + parseFloat(item.tax);
    }
    return subtotal;
}

function total(subtotal) {
    var total = subtotal + parseFloat(cart.tax) + parseFloat(cart.shipping) 
        + parseFloat(cart.handling_fee) + parseFloat(cart.shipping_discount) 
        + parseFloat(cart.insurance);
    return total;
}
/**
 * Payment
 */

routes.post('/', (req, res) => {
	const userAgent = req.headers['user-agent'];
	console.log('userAgent', userAgent);
	console.log("userId: "+req.body.userId);
	console.log("billId: "+req.body.billId);
	var shirts=[];
	billController.getById(req.body.billId,function(bill){
		bill.CustomShirts.forEach(function(i) {
			shirts.push({
                "name" : i.name, 
                "description": i.description,
				"quantity": i.quantity,
				"price": i.usprice,
				"tax": i.tax,
				"sku": i.sku,
				"currency": i.currency
			});
		});

		var firstname=bill.firstname;
		var lastname=bill.lastname;
		var countrycode=bill.countrycode;
		var postalcode=bill.postalcode;
		var state=bill.state;
		var phone=bill.phone;
		var city=bill.city;
		var address=bill.address;
		var email=req.body.email;
		var method=req.body.method;
		console.log("first name:"+firstname);
		console.log("last name:"+lastname);
		console.log("country code:"+countrycode);
		console.log("postal code:"+postalcode);
		console.log("state:"+state);
		console.log("phone:"+phone);
		console.log("city:"+city);
		console.log("address:"+address);
		console.log("email:"+email);
		console.log("method:"+method);

		var s=subtotal(shirts);
		var t=total(s);
		const params = Object.assign({}, req.body);
		const clientIp =
			req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			(req.connection.socket ? req.connection.socket.remoteAddress : null);

		const amount =bill.price;
		const now = new Date();
		// NOTE: only set the common required fields and optional fields from all gateways here, redundant fields will invalidate the payload schema checker
		const checkoutData = {
			amount,
			clientIp: clientIp.length > 15 ? '127.0.0.1' : clientIp,
			locale: 'vn',
			billingCity: city || '',
			billingPostCode: postalcode || '',
			billingStateProvince: state || '',
			billingStreet: address || '',
			billingCountry: countrycode || '',
			deliveryAddress: address || '',
			deliveryCity: city || '',
			deliveryCountry: countrycode || '',
			currency: 'VND',
			deliveryProvince: state || '',
			customerEmail: email,
			customerPhone: phone,
			orderId: `node-${now.toISOString()}`,
			// returnUrl: ,
			transactionId: `node-${now.toISOString()}`, // same as orderId (we don't have retry mechanism)
			customerId: email,
		};

		// pass checkoutData to gateway middleware via res.locals
		res.locals.checkoutData = checkoutData;
		// Note: these handler are asynchronous
		let asyncCheckout = null;
		if (method=="2"){
			console.log("paypal")
			var transactions = [
			{
				"amount": {
				"total": t,
				"currency": "USD",
				"details": {
					"subtotal": s,
					"tax": cart.tax,
					"shipping": cart.shipping,
					"handling_fee": cart.handling_fee,
					"shipping_discount": cart.shipping_discount,
					"insurance": cart.insurance			
				}
				},
				"description": "The payment transaction description.",
				"item_list": {
					"items":shirts,
					"shipping_address": {
						"recipient_name": `${firstname || ''} ${lastname || ''}`.trim(),
						"line1": address || "333/3 Bo De, Ke Thanh, Ke Sach,Soc Trang,Viet Nam",
						"line2": "",
						"city": city || "Portland",
						"country_code": countrycode || "US",
						"postal_code": postalcode || "97227",
						"phone": phone || "+841649005909",
						"state": state || "OR"
					}
				}
			}
			];
			res.locals.transactions = transactions;
			asyncCheckout = paypal.checkoutPaypal(req, res);
		}
		else{
			checkoutData.customerName = `${firstname || ''} ${lastname || ''}`.trim();
			checkoutData.paymentMethod = 'ATM_ONLINE';
			checkoutData.bankCode = 'BAB';
			asyncCheckout = vnpayController.checkoutVNPay(req, res);
		}
		if (asyncCheckout) {
			asyncCheckout
				.then(checkoutUrl => {
					console.log(checkoutUrl);
					res.json({'link':checkoutUrl.href})
					res.sendStatus(201);
					res.end();
				})
				.catch(err => {
					res.send(err);
				});
		} else {
			res.send('Payment method not found');
		}
	});

	
});

routes.get('/callback/:userId/:id/:method', (req, res) => {
	var method=req.params.method;
	if (method=="1"){
		if (res.locals.isSuccess){
			billController.setPaidById(req.params.id,true,function(bill){
				res.redirect('/order/'+req.params.userId);
			});
		}
		else{
			res.sendFile(__dirname + "/public/web/err.html");
		}
	}
	else{
		let asyncFunc = null;
		asyncFunc = paypal.callbackPaypal(req, res);
		if (asyncFunc) {
			asyncFunc.then(() => {
				console.log("checked out");
				console.log("userId: "+req.params.userId);
				console.log("billId: "+req.params.id);
				billController.setPaidById(req.params.id,true,function(bill){
					res.redirect('/order/'+req.params.userId);
				});
			})
			.catch((err) => {
				res.send(err);
			});
		} else {
			res.send('No callback found');
		}
	}
});

routes.get('/callback/:userId/:id/:method', (req, res) => {
	var method=req.params.method;
	let asyncFunc = null;
	asyncFunc = paypal.callbackPaypal(req, res);
	if (asyncFunc) {
		asyncFunc.then(() => {
			console.log("checked out");
			console.log("userId: "+req.params.userId);
			console.log("billId: "+req.params.id);
			billController.setPaidById(req.params.id,true,function(bill){
				res.redirect('/order/'+req.params.userId);
			});
		})
		.catch((err) => {
			res.send(err);
		});
	} else {
		res.send('No callback found');
	}
});
routes.get('/cod/:userId/:id', (req, res) => {
	billController.setPaidById(req.params.id,false,function(bill){
		res.redirect('/order/'+req.params.userId);
	});
});

routes.get('/callback/:userId/:id/:method', (req, res) => {
	var method=req.params.method;
	let asyncFunc = null;
	if (method=="2"){
		asyncFunc = paypal.callbackPaypal(req, res);		
	}
	else{
		asyncFunc =vnpayController.callbackPaypal(req, res);		
	}
	if (asyncFunc) {
		asyncFunc.then(() => {
			console.log("checked out");
			console.log("userId: "+req.params.userId);
			console.log("billId: "+req.params.id);
			if (req.body.isSucceed)
				console.log("isSuccess");
			else
				console.log("isFailed");
			billController.setPaidById(req.params.id,true,function(bill){
				res.redirect('/order/'+req.params.userId);

			});
		})
		.catch((err) => {
			res.send(err);
		});
	} else {
		res.send('No callback found');
	}
});
module.exports = routes;
