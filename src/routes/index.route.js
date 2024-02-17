import { router } from '../middleware/app.middleware.js';
import stripeRoutes from '../routes/stripe/index.route.js';


/** Stripe Routes */
router.use('/stripe', stripeRoutes);

export default router;
