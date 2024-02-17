import { db } from '../database.js';
const TABLE = 'users';

class UserModel {
    /**
     *
     * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection.AddUnionMember<UnwrapArrayMember<TResult>, undefined>>>}
     * @param email
     */
    async getUserByEmail(email) {
        return db(TABLE).where({email}).first();
    }

    /**
     *
     * @param user
     * @returns {Promise<Knex.QueryBuilder<TRecord, number[]>>}
     */
    async createUser(user) {
        return db(TABLE).insert(user);
    }
}

export default UserModel;
