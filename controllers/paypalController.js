var controller ={};
var paypal = require("paypal-rest-sdk");

paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': 'AQ2pHzy2mHcLnWIZQMGFmVUL8fNU9teZvr9xfnU7kRv5FP07TRqCq3VNitW0No7RnnAyAkLB7RG_DNZD', // please provide your client id here 
  'client_secret': 'EKbJA0A4LEwWorjcYcFLjoHZukbUyC8YYhKnR5WMYUIorTxzl1IndgHDczVHTjB6AZ3fmYGV3GZ1fP4y' // provide your client secret here 
});

controller.checkoutPaypal=function(req, res) {
  console.log("userId: "+req.body.userId);
	console.log("billId: "+req.body.billId);
    var payment = {
        "intent": "sale",
        "payer": {
        "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://${req.headers.host}/checkout/callback/`+req.body.userId
            +'/'+req.body.billId+'/2',
            "cancel_url": `http://${req.headers.host}/err`
        }
      };
    payment.transactions = res.locals.transactions;
    console.log(res.locals.transactions);
    console.log(payment);
    return createPay(payment)
        .then(transaction => {
          req.session.paymentId = transaction.id;
          var links = transaction.links;
          var counter = links.length;
          while (counter--) {
            if (links[counter].method == "REDIRECT") {
              // redirect to paypal where user approves the transaction
              
              var checkoutUrl = links[counter];
              res.locals.checkoutUrl = checkoutUrl;

		          return checkoutUrl;
            }
          }
        })
        
}

controller.callbackPaypal=function  (req, res) {
	
  const paymentId = req.session.paymentId;
  const payerId = req.query.PayerID;    
  const details = { payer_id: payerId };

  return executePay(paymentId, details)
    .then(payment => {
        res.locals.email = payment.payer.payer_info.email;
        res.locals.orderId = payment.id || '';
        res.locals.price = payment.transactions[0].amount.total;
        res.locals.address = payment.payer.payer_info.shipping_address.line1;
        res.locals.country = payment.payer.payer_info.shipping_address.country_code;
        res.locals.state = payment.payer.payer_info.shipping_address.state;
        res.locals.city = payment.payer.payer_info.shipping_address.city;
        res.locals.postalCode = payment.payer.payer_info.shipping_address.postal_code;
        res.locals.currency = "USD";
        res.locals.isSucceed = true;
        res.locals.message = "";     
    })
    .catch((err) => {
      res.locals.isSucceed = false;
      res.locals.message = err.message;
    });
}

// helper functions
var createPay = payment => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(payment, function(err, payment) {
      if (err) {
        reject(err);
      } else {
        resolve(payment);
      }
    });
  });
};

var executePay = (paymentId, details) => {
    return new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, details, (err, payment) => {
            if (err) {
              reject(err);
            } else {
              resolve(payment);
            }
          });
    });
};

module.exports=controller;