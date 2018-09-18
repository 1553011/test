var controller ={};
const { NganLuong }   = require('vn-payments');

const TEST_CONFIG = NganLuong.TEST_CONFIG;
const nganluong = new NganLuong({
	paymentGateway: TEST_CONFIG.paymentGateway,
	merchant: TEST_CONFIG.merchant,
	receiverEmail: TEST_CONFIG.receiverEmail,
	secureSecret: TEST_CONFIG.secureSecret,
});

controller.checkoutVNPay=function(req, res) {
	const checkoutData = res.locals.checkoutData;
	checkoutData.returnUrl =`http://${req.headers.host}/checkout/callback/`+req.body.userId
	+'/'+req.body.billId+'/3';
	checkoutData.cancelUrl = `http://${req.headers.host}/order/`+req.body.userId;
	checkoutData.orderInfo = 'Demo NodeJS Payment';
	checkoutData.locale = checkoutData.locale === 'en' ? 'en' : 'vi';
	checkoutData.paymentType = '1';
	checkoutData.totalItem = '1';

	return nganluong.buildCheckoutUrl(checkoutData).then(checkoutUrl => {
		res.locals.checkoutUrl = checkoutUrl;
		return checkoutUrl;
	});
}

controller.callbackVNPay=function(req, res) {
	const query = req.query;
	return nganluong.verifyReturnUrl(query).then(results => {
		if (results) {
			res.locals.email = results.customerEmail;
			res.locals.orderId = results.transactionId || '';
			res.locals.price = results.amount;
			res.locals.isSucceed = results.isSuccess;
			res.locals.message = results.message;
		} else {
			res.locals.isSucceed = false;
		}
	});
}

module.exports=controller;

