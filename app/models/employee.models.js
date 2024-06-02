const db = require("../config/db")
const sequelize = db.sequelize;
const { DataTypes } = require("sequelize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Employee = sequelize.define("Employee", {
    userName: {
        type: DataTypes.STRING,
        unique: true,
        trim: true
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isNumeric: true,
            len: [10, 15]
        }
    },

    password: {
        type: DataTypes.STRING,
    },
    otp: {
        type: DataTypes.STRING,
    },
    token: {
        type: DataTypes.STRING
    }
},
    {
        hooks: {
            beforeCreate: async (employee) => {
                if (employee.password) {
                    const hashpassword = await bcrypt.hash(employee.password, 10)
                    employee.password = hashpassword
                }
            }
        }
    })

Employee.prototype.generateAuthToken = function () {

    const payload = {
        id: this.id,
        userName: this.userName,
        email: this.email
    }

    const options = {
        expiresIn: '1h'
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options)

    this.token = token
    return token
}


module.exports = Employee
