import stripePackage  from 'stripe';
import UserModel from '../../db/model/userModel.js';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);


export const createCustomer = async (req, res) => {
    try {
        //create customer on stripe
        const customer = await stripe.customers.create(req.body);
        console.log(customer, 'customer');
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
        console.log(error);
        if (error instanceof stripe.errors.StripeConnectionError) {
            // Handle Stripe connection error
            res.status(500).json({ status: false, message: "Stripe connection error occurred" });
        } else {
            // Handle other errors
            res.status(500).json({ error: error.message });
        }
    }
};