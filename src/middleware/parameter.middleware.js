const validateParams = (requestParams) => {
    return (req, res, next) => {
        for (let param of requestParams) {
            if (checkParamPresent(Object.keys(req.params), param)) {
                let reqParam = req.params[param.param_key];
                if (!checkParamType(reqParam, param)) {
                    return res.status(401).send({
                        success: 400,
                        message: `${param.param_key} is of type ${typeof reqParam} but should be ${param.type}`
                    });
                } else if (!runValidators(reqParam, param)) {
                    return res.status(401).send({
                        success: 400,
                        message: `Validation failed for ${param.param_key}`
                    });
                }
            } else if (param.required) {
                return res.status(401).send({
                    success: 400,
                    message: `Missing Parameter ${param.param_key}`
                });
            }
        }
        next();
    };
};

const checkParamPresent = (reqParams, paramObj) => {
    return reqParams.includes(paramObj.param_key);
};

const checkParamType = (reqParam, paramObj) => {
    if (paramObj.type === 'number') {
        const param = parseInt(reqParam);
        const reqParamType = typeof param;
        return !isNaN(param) && reqParamType === paramObj.type;
    } else {
        const reqParamType = typeof reqParam;
        return reqParamType === paramObj.type;
    }
};

const runValidators = (reqParam, paramObj) => {
    for (let validator of paramObj.validator_functions) {
        if (!validator(reqParam)) {
            return false;
        }
    }
    return true;
};

export { validateParams };
