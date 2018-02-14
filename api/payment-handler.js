var stripe = require("stripe")(
    "sk_test_uZ0zTpnH8INQOKazAv5T3GBl"
);
const amount = 1999; //Amount cannot be specified by UI... should get this from a DB.

module.exports = function(req, res){
    let userid = req.body.userid;
    let chargeToken = req.body.token;
    /**
      * Receive a token and a userid via Stripe Checkout
      * Create a charge in stripe
      * Return status from stripe
      */
        stripe.charges.create({
            amount: amount,
            currency: "usd",
            source: chargeToken, // obtained with Stripe.js
            description: "Subscription for " +  userid
    }, function(err, charge) {
            if (err) {
                //Do error stuff
                console.log("Error processing charge, we should seriously look at this", err);
                }
            else {

                    }
        });
};