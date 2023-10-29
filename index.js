
const express = require("express")
require("dotenv").config()
const { connection } = require("./db")
const { userRouter } = require("./routes/user.routes")
const { postRouter } = require("./routes/post.routes")




const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("welcome to home page")
})

app.use("/users", userRouter)
app.use("/posts", postRouter)







app.listen(8080, async () => {
    try {

        await connection

        console.log("connct to db")
        console.log("port running at 8080")


    } catch (err) {
        console.log(err)
    }
})