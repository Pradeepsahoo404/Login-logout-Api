
//# router
var router = require("express").Router()
//controller
const employee = require("../controllers/employee.controller")
//middleware
const { auth } = require("../middleware/auth")

router.post("/register", employee.registerEmployee);  //register employee
router.post("/verify-email", employee.verificationEmail);  //verify email
router.post("/resend-otp", employee.resendOtp)  //resend otp
router.post("/login", employee.loginEmployee)   //login
router.post("/change-password", auth, employee.changePassword)   //change-password
router.post("/forget-password", employee.forgetPassword)   //change-password





module.exports = router;

