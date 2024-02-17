const validator = require('../helpers/validate');
const formidable = require("formidable");

module.exports = {

    /**
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    student_reg_step_1: async (req, res, next) => {

        const validationRule = {
            "jamb_number": "required",
            "first_name": "required|string",
            "last_name": "required|string",
            "middle_name": "required|string",
            "phone": "required|string",
            "email": "required|email",
            "password": "required|string|min:8|strict"
        }

        await validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(412)
                    .send({
                        status: false,
                        message: 'Validation failed',
                        data: err.errors
                    });
            } else {
                next();
            }
        }).catch(err => console.log(err))
    },

    student_reg_step_2: async (req, res, next) => {

        const validationRule = {
            "nin": "required",
            "dob": "required"
        }

        await validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(412)
                    .send({
                        status: false,
                        message: 'Validation failed',
                        data: err.errors
                    });
            } else {
                next();
            }
        }).catch(err => console.log(err))
    },
}