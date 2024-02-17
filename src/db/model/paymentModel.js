import { db } from '../database.js';
const TABLE = 'payments';

class PaymentModel {
    async createPayment(payment_data) {
        return db(TABLE).create(payment_data);
    }

    async updatePayment(where_data,update_data){
        return db(TABLE).where(where_data).update(update_data);
    }

}
export default PaymentModel;
