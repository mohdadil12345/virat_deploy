
const express = require("express")
require("dotenv").config()
const { UserModel } = require("../models/user.model")
const { BlacklistModel } = require("../models/blacklist.model")



const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


userRouter.post("/register", async (req, res) => {

    try {
        const { password, email, name } = req.body
        const user = await  UserModel.findOne({ email })

        if (user) {
            res.status(400).json({ msg: "User already exist please login" })

        } else {

            bcrypt.hash(password, 5, async (err, hash) => {


                if (hash) {
                    const newuser = new UserModel({  email, password: hash, name })
                    await newuser.save()
                    res.status(200).json({ "msg": "Registration successfull" })
                }

            });


        }



    } catch (err) {
        res.status(400).json({ error:err.message })
    }
})




// login
userRouter.post("/login", async (req, res) => {

    try {
        const { password, email } = req.body
       
        const user = await  UserModel.findOne({ email })

        if (user) {

            bcrypt.compare(password, user.password,  async (err, result) =>  {

                if (result) {
                    console.log('user' , user)
                 const token = jwt.sign({userID : user._id ,name: user.name }, "masai", {expiresIn:"7days"})
                 res.status(200).json({ "msg": "Login successfull", token })
                }else{
                    res.status(400).json({  "msg": "wrong password" })
                }

            });


        }



    } catch (err) {
        res.status(400).json({ error:err.message })
    }
})


// loogout
userRouter.post("/logout", async (req, res) => {

    try {

        const token = req.headers.authorization?.split(" ")[1] || null

        let atleastonetokenexist = await BlacklistModel.findOne()
        
        if(token){
            if (atleastonetokenexist) {
                await BlacklistModel.updateMany({}, { $push : {blacklist : [token]}})
                res.status(200).json({ "msg": "Logout successfull" })
            }
            else{
                const blacklistUser = new BlacklistModel({  blacklist: [token]  })
                await blacklistUser.save()
                res.status(200).json({ "msg": "Logout successfull" })
            }
        }

    } catch (err) {
        res.status(400).json({ error:err.message })
    }



})









module.exports = {
    userRouter
}