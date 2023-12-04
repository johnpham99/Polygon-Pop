const express = require("express")
const app = express()

app.get("/play", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.listen(8000, () => {console.log("Server started on port 8000")})