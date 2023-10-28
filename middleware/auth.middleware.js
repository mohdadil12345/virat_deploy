


require("dotenv").config()
const jwt = require("jsonwebtoken")
const { blacklistModel } = require("../models/blacklist.model")

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    try {

        // let prev_token = await blacklistModel.find({ blacklist: { $in: token } })


        // if (prev_token) {
        //     res.status(200).json("please login!")
        // }


        // else {
            const decoded = jwt.verify(token, "masai")
            if (decoded) {
                console.log('decoded' , decoded , parseInt(decoded.userID))
                
                req.body.userID = decoded.userID
                req.body.name = decoded.name
    
                console.log('req body',req.body)
            }

            next()
        // }


    } catch (err) {
        res.status(400).json({ err: err.message })
    }


}



module.exports = {
    auth
}
