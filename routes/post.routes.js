

const express = require("express")
const { PostModel } = require("../models/post.model")
const { auth } = require("../middleware/auth.middleware")

const postRouter = express.Router()


// post
postRouter.post("/add", auth, async (req, res) => {
    const { userID } = req.body
    try {

        const data = new PostModel({ ...req.body, userID })
        await data.save()

        res.status(200).json({ "msg": "post added", data })


    } catch (err) {
        res.status(400).json({ error: err.message })

    }
})


// get 
postRouter.get("/", auth, async (req, res) => {
    const { min_com, max_com, laptop, tablet, page } = req.query
    const query = { ...req.query }

    const limit = 3;
    const skip = (page - 1) * limit;

    delete query.min_com
    delete query.max_com
    delete query.laptop
    delete query.tablet
    delete query.page


    if (min_com) {
        if (!query.no_of_comments) {
            query.no_of_comments = {}
        }
        query.no_of_comments.$gt = min_com
    }
    if (max_com) {
        if (!query.no_of_comments) {
            query.no_of_comments = {}
        }
        query.no_of_comments.$lt = max_com
    }

    try {
        const data = await PostModel.find({userID: req.body.userID , ...query}).skip(skip).limit(limit)
        res.status(200).send({ "msg": "Get all data", data })


    } catch (err) {
        res.status(400).send({ "msg": err.message })
    }

})


//  top
postRouter.get("/top", async (req, res) => {
    const { page } = req.query
    const limit = 3;
    const skip = (page - 1) * limit;

    try {
        const topdata = await PostModel.find().skip(skip).limit(limit)

        res.status(200).json({ msg: "user post", topdata });

    } catch (err) {
        res.status(400).send({ "err": err });
    }
});



// patch
postRouter.patch("/update/:id", auth, async (req, res) => {
    const { id } = req.params
    const abc = await PostModel.findOne({ _id: id })
    try {

        if (req.body.userID == abc.userID) {
            await PostModel.findByIdAndUpdate({ _id: id }, req.body)
            res.status(200).send({ "msg": `The note with ID:${id} has been updated` })
        } else {
            res.status(400).send({ "msg": " not authorized" })
        }



    } catch (err) {
        res.status(400).json({ error: err.message })

    }
})




//  delete
postRouter.delete("/delete/:id", auth, async (req, res) => {
    const { id } = req.params
    const abc = await PostModel.findOne({ _id: id })
    try {

        if (req.body.userID == abc.userID) {
            await PostModel.findByIdAndDelete({ _id: id }, req.body)
            res.status(200).send({ "msg": `The note with ID:${id} has been deleted` })
        } else {
            res.status(400).send({ "msg": " not authorized" })
        }



    } catch (err) {
        res.status(400).json({ error: err.message })

    }
})



module.exports = {
    postRouter
}















