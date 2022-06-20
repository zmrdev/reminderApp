const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/remainderApp", {
    useNewUrlParser: true
})

const User = mongoose.model('User', {
    user_id: Number,
    uname: String,
    password: String,
    events:[]
})
module.exports = {
    User
}