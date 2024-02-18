import stripePackage  from 'stripe';
import UserModel from '../../db/model/userModel.js';
import PaymentModel from "../../db/model/paymentModel.js";
import LoggerLib from "../../libs/Logger.lib.js";
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const createCustomer = async (req, res) => {
    try {
        //create customer on stripe
        const customer = await stripe.customers.create(req.body);
        const user_data = {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            stripe_customer_id: customer.id
        }

        // create customer on DB with Stripe Customer ID
        await new UserModel().createUser(user_data);

        return res.status(200).json({
            status: true,
            message: 'User created'
        })
    } catch (error) {
        LoggerLib.error(error);
        if (error instanceof stripe.errors.StripeConnectionError) {
            // Handle Stripe connection error
            res.status(500).json({ status: false, message: "Stripe connection error occurred" });
        } else {
            // Handle other errors
            res.status(500).json({ error: error.message });
        }
    }
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const attachPaymentMethod = async (req, res) => {
    try {
        //parse request body
        const { paymentMethodID , customer_email } = req.body;

        //get customer_id from DB
        const customer = await new UserModel().getUserByEmail(customer_email);

        if(customer === undefined){
            return res.status(400).json({
                status: false,
                message: 'Customer Not on Stripe'
            });
        }

        //attach payment method on stripe
        await stripe.paymentMethods.attach(paymentMethodID, {
            customer: customer.stripe_customer_id,
        });

        return res.status(200).json({
            status: true,
            message: 'Payment Method attached'
        });
    } catch (error) {
        LoggerLib.error(error);
        if (error instanceof stripe.errors.StripeConnectionError) {
            // Handle Stripe connection error
            res.status(500).json({ status: false, message: "Stripe connection error occurred" });
        }else if(error instanceof stripe.errors.StripeInvalidRequestError){
            res.status(500).json({ status: false, message: error.message });
        } else {
            // Handle other errors
            res.status(500).json({ error: error.message });
        }
    }
};

export const getPaymentMethod = async (req, res) => {
    try {
        //parse request body
        const { customer_email } = req.body;

        //get customer_id from DB
        const customer = await new UserModel().getUserByEmail(customer_email);

        if(customer === undefined){
            return res.status(400).json({
                status: false,
                message: 'Customer Not on Stripe'
            });
        }

        //get customer's payment methods on stripe
        const paymentMethods = await stripe.customers.listPaymentMethods(customer.stripe_customer_id, {
            type: "card",
        });

        return res.status(200).json({
            status: true,
            message: 'Payment Method attached',
            data: paymentMethods
        });
    } catch (error) {
        LoggerLib.error(error);
        if (error instanceof stripe.errors.StripeConnectionError) {
            // Handle Stripe connection error
            res.status(500).json({ status: false, message: "Stripe connection error occurred" });
        }else if(error instanceof stripe.errors.StripeInvalidRequestError){
            res.status(500).json({ status: false, message: error.message });
        } else {
            // Handle other errors
            res.status(500).json({ error: error.message });
        }
    }
};

export const createPaymentIntent = async (req, res) => {
    try {
        //parse request body
        const { paymentMethodID, customer_email, total_amount, description } = req.body;

        //get customer_id from DB
        const customer = await new UserModel().getUserByEmail(customer_email);

        if(customer === undefined){
            return res.status(400).json({
                status: false,
                message: 'Customer Not on Stripe'
            });
        }
        const amount = Math.round(Number(total_amount) * 100);

        //create payment intent on stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "gbp",
            customer: customer.stripe_customer_id,
            payment_method: paymentMethodID,
            description: description
        });

        //Add the payment intent record to the DB (Payments Table)
        await new PaymentModel().createPayment({
            total_amount: amount,
            description,
            payment_intent_id: paymentIntent.id,
            status: paymentIntent.status,
            currency: "gbp",
            user_id: customer.id
        });

        return res.status(200).json({
            status: true,
            message: 'Payment Method attached',
            data: paymentIntent.client_secret
        });
    } catch (error) {
        LoggerLib.error(error);
        if (error instanceof stripe.errors.StripeConnectionError) {
            // Handle Stripe connection error
            res.status(400).json({ status: false, message: "Stripe connection error occurred" });
        }else if(error instanceof stripe.errors.StripeInvalidRequestError){
            res.status(400).json({ status: false, message: error.message });
        } else {
            // Handle other errors
            res.status(500).json({ error: error.message });
        }
    }
};


export const confirmPaymentIntent = async (req, res) => {
    try {
        //parse request body
        const { paymentIntentID, paymentMethodID  } = req.body;

        //call the payment intent confirmation on stripe
        const intent = await stripe.paymentIntents.confirm(paymentIntentID, {
            payment_method: paymentMethodID,
        });

        //Update Payments Table on the DB with intent status
        await new PaymentModel().updatePayment({
            payment_intent_id: paymentIntentID
        },{
            status: intent.status
        });

        return res.status(200).json({
            status: true,
            data: intent
        });

    } catch (error) {
        LoggerLib.error(error);
        if (error instanceof stripe.errors.StripeConnectionError) {
            // Handle Stripe connection Error
            res.status(500).json({ status: false, message: "Stripe connection error occurred" });
        }else if(error instanceof stripe.errors.StripeInvalidRequestError){
            // Handle Stripe Invalid Request Error
            res.status(500).json({ status: false, message: error.message });
        } else {
            // Handle other errors
            res.status(500).json({ status: false, message: error.message });
        }
    }
};