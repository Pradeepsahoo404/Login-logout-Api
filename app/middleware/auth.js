const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        else if (req.body && req.body.token) {
            token = req.body.token;
        }

        if (!token) {
            return helperFunction.clientErrorResponse(res, "Authentication token not found.");
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.employee = decoded;
            next();

        } catch (err) {
            return helperFunction.errorResponse(res, err, "Unable to verify token.");
        }

    } catch (err) {
        return helperFunction.errorResponse(res, err, "Authentication failed.");
    }
};
