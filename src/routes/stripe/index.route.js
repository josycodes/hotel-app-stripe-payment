import { router } from '../../middleware/app.middleware.js';
import { celebrate, Segments } from 'celebrate';
import Joi from 'joi';
import { createCustomer, attachPaymentMethod, getPaymentMethod, createPaymentIntent, confirmPaymentIntent } from "../../controller/stripe/index.controller.js";

router.post('/customer/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required()
        })
    }),
    createCustomer);

router.post('/payment/method/attach',
    celebrate({
        [Segments.BODY]: Joi.object({
            paymentMethodID: Joi.string().required(),
            customer_email: Joi.string().required()
        })
    }),
    attachPaymentMethod);

router.post('/payment/method/get',
    celebrate({
        [Segments.BODY]: Joi.object({
            customer_email: Joi.string().required()
        })
    }),
    getPaymentMethod);

router.post('/payment/intent/create',
    celebrate({
        [Segments.BODY]: Joi.object({
            paymentMethodID: Joi.string().required(),
            customer_email: Joi.string().required(),
            total_amount: Joi.number().required(),
            description: Joi.string().required(),
        })
    }),
    createPaymentIntent);

router.post('/payment/intent/confirm',
    celebrate({
        [Segments.BODY]: Joi.object({
            paymentIntentID: Joi.string().required(),
            paymentMethodID: Joi.string().required()
        })
    }),
    confirmPaymentIntent);

export default router;