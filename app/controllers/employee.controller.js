const { where } = require("sequelize");
const Employee = require("../models/employee.models")
const helperFunction = require("../utils/helperFunction")
const sequelize = require("../config/db")
const bcrypt = require("bcrypt")
const mailService = require("../utils/mailSender")


exports.registerEmployee = async (req, res) => {
    try {
        const { userName, firstName, lastName, email, phone, password } = req.body;
        if (!req.body) {
            return helperFunction.clientErrorResponse(res, "All fields are required.");
        }

        const existEmployee = await Employee.findOne({ where: { email: email } })
        if (existEmployee) {
            return helperFunction.clientErrorResponse(res, "Employee already Register with this email.");
        }

        const otp = helperFunction.generateOTP();
        //sent mail
        const toMail = email;
        const subject = "Verification user for Registration";
        const OTP = otp;
        await mailService.sendMail(toMail, subject, OTP)

        const newEmployee = await Employee.create({
            userName,
            firstName,
            lastName,
            email,
            phone,
            password,
            otp
        })
        return helperFunction.dataResponse(res, "", "Employee created successfully Please verify email");

    } catch (err) {
        return helperFunction.errorResponse(res, err, "Employee cannot be Register");
    }
}

exports.verificationEmail = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return helperFunction.clientErrorResponse(res, "All fields are required.");
        }

        const employee = await Employee.findOne({ where: { email: email } });

        if (!employee) {
            return helperFunction.clientErrorResponse(res, "Employee is not register with this email");
        }

        if (employee.otp !== otp) {
            return helperFunction.clientErrorResponse(res, "OTP is incorrect.");
        }

        await Employee.update({ otp: null }, { where: { id: employee.id } });
        return helperFunction.dataResponse(res, employee, "OTP verified successfully");

    } catch (err) {
        return helperFunction.errorResponse(res, err, "something went wrong");
    }
};


exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const employee = await Employee.findOne({ where: { email: email } });
        if (!employee) {
            return helperFunction.clientErrorResponse(res, "Email is incorrect.");
        }
        const newOtp = helperFunction.generateOTP()
        //sent mail
        const toMail = email;
        const subject = "Verification user for Registration";
        const OTP = newOtp;

        await mailService.sendMail(toMail, subject, OTP)

        await Employee.update({ otp: newOtp }, { where: { id: employee.id } })
        return helperFunction.dataResponse(res, newOtp, "OTP resent successfully");
    } catch (err) {
        return helperFunction.errorResponse(res, err, "something went wrong");
    }
}

exports.loginEmployee = async (req, res) => {
    try {

        const { email, password } = req.body
        const employee = await Employee.findOne({ where: { email: email } })

        if (!employee) {
            return helperFunction.clientErrorResponse(res, "This Email/Username is not registered.");
        }

        const decrypassword = await bcrypt.compare(password, employee.password)

        if (!decrypassword) {
            return helperFunction.clientErrorResponse(res, "Password is incorrect. Enter correct password.");
        }

        const token = await employee.generateAuthToken();
        const option = {
            httpOnly: true,
            secure: true,
        }

        res.cookie('token', token, option);

        await employee.update({ token: token });

        return helperFunction.dataResponse(res, employee, "login successfully");

    } catch (err) {
        return helperFunction.errorResponse(res, err, "login fail");
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, re_typePassword } = req.body;
        const employeeId = req.employee.id;

        const employee = await Employee.findByPk(employeeId);

        if (!employee) {
            return helperFunction.clientErrorResponse(res, "Employee not found.");
        }

        if (newPassword !== re_typePassword) {
            return helperFunction.clientErrorResponse(res, "new password and re_type password not match.");
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, employee.password);

        if (!isPasswordMatch) {
            return helperFunction.clientErrorResponse(res, "Incorrect old password.");
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await employee.update({ password: hashedNewPassword });

        return helperFunction.dataResponse(res, "", "Password updated successfully.");

    } catch (err) {
        return helperFunction.errorResponse(res, err, "Failed to change password.");
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { email, password, re_typePassword } = req.body;
        if (!email) {
            return helperFunction.clientErrorResponse(res, "email is required.");
        }
        const existEmployee = await Employee.findOne(email)
        if (!existEmployee) {
            return helperFunction.clientErrorResponse(res, "Email is not register");
        }

        if (password !== re_typePassword) {
            return helperFunction.clientErrorResponse(res, "new password and re_type password not match.");
        }

        const hashedNewPassword = await bcrypt.hash(password, 10);

        await existEmployee.update({ password: hashedNewPassword });

        return helperFunction.dataResponse(res, existEmployee, "Password updated successfully.");

    } catch (err) {
        return helperFunction.errorResponse(res, err, "Failed to change password.");
    }
}
