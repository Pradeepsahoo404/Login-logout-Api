function errorResponse(res, err, defaultMessage = "Some error Occurred") {
    res.status(500).json({
        status: "error",
        message: err.message || defaultMessage,
        data: null,
    })
}

function dataResponse(res, data, message = "success") {
    res.status(200).json({
        message: message,
        data: data,
        status: "success"
    })
}

function clientErrorResponse(res, message = "Bad Request") {
    res.status(400).json({
        message: message,
        data: null,
        status: "error"
    });
}

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert number to string (if needed)
}


module.exports = {
    errorResponse,
    dataResponse,
    clientErrorResponse,
    generateOTP,
}
