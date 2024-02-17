import { db } from '../database.js';
const USERS_TABLE = 'users';

class UserModel {
    async getUsers() {
        return db(USERS_TABLE).select('*');
    }

    async getUserById(id) {
        return db(USERS_TABLE).where({id}).first();
    }

    async createUser(user) {
        return db(USERS_TABLE).insert(user);
    }


}

export default UserModel;
