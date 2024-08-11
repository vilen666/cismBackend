let bcrypt = require("bcrypt")
let adminModel = require("../models/admin-model")
require("dotenv").config()
let cookie = require("cookie-parser")

module.exports.register = async (req, res) => {
    console.log("hello");
    if (process.env.NODE_ENV === "development") {
        let admin = await adminModel.find();
        if (admin.length > 0) {
            return res.send({ data: "One admin can only Exist" })
        }
        let { user, password } = req.body
        try {

            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    res.send({ success: false, data: `Contact Developer` })
                }
                else {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        if (err) {
                            return res.send(err)
                        }
                        let admin = await adminModel.findOne({ user })
                        if (admin) {
                            return res.json({ success: false, data: `Contact Developer` })
                        }
                        admin = await adminModel.create({
                            username: user,
                            password: hash,
                        })
                        return res.json({ success: true, data: `Admin registered` })
                    })
                }
            })
        }
        catch (err) {
            return res.json({ success: false, data: `Contact Developer` })
        }
    }
    else {
        res.json({ success: false, data: `Contact Developer` })
    }
}

let { generateToken } = require("../utils/generateToken")
module.exports.login = async (req, res) => {
    let { user, password } = req.body
    let admin = await adminModel.findOne({ username: user });
    if (!admin) {
        return res.send({ success: false, data: "username not found" })
    }
    else {
        bcrypt.compare(password, admin.password, (err, result) => {
            if (!result) {
                return res.json({ success: false, data: "Password Incorrect" })
            }
            else {
                let token = generateToken(admin)
                res.cookie("token", token,{
                    httpOnly:true,
                    sameSite:"None",
                    secure:true
                });
                return res.send({ success: true, data: "You are Successfully logged in" })

            }
        })
    }
}

module.exports.fetchData = async (req, res) => {
    let admin = await adminModel.find()
    res.send({success: true, data: admin[0]})
}

module.exports.edit = async (req, res) => {
    let { oldUser, user, pass } = req.body
    let admin = await adminModel.findOne({ username: oldUser })
    if (admin.password !== pass && pass!=="") {
        try {
            console.log("okok")
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    res.send({ success: false, data: `Contact Developer` })
                }
                else {
                    bcrypt.hash(pass, salt, async function (err, hash) {
                        if (err) {
                            return res.send({ success: false, data: `Contact Developer` })
                        }
                        await adminModel.findByIdAndUpdate(admin.id, { username:user, password: hash })
                        return res.json({ success: true, data: `Admin updated` })
                    })
                }
            })
        }
        catch (err) {
            return res.json({ success: false, data: `There was an error while updating` })
        }
    }
    else{
        try{
            admin=await adminModel.findByIdAndUpdate(admin.id, { username:user })
            console.log(admin)
            return res.json({ success: true, data: `Admin updated` })
        }
       catch(err)
       {
        return res.json({ success: false, data: `There was an error while updating` })
       }
    }

}