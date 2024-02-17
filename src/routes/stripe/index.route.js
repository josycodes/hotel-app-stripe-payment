import { router } from '../../middleware/app.middleware.js';
import { celebrate, Segments } from 'celebrate';
import Joi from 'joi';
import { createCustomer } from "../../controller/stripe/index.controller.js";

router.post('/customer/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required()
        })
    }),
    createCustomer);

export default router;