const jwt = require('jsonwebtoken')

const db = require('../db')

const register = (user_id, password, uname) => {

    return db.User.findOne({ user_id })
        .then(user => {
            if (user) {
                return {
                    statusCode: 422,
                    status: false,
                    message: "user already exists... please login!!!"
                }
            }
            else {

                const newUser = new db.User({
                    user_id,
                    uname,
                    password,
                    events: []
                })
                newUser.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: "successfully registered"
                }
            }
        })


}

const login = (user_id, password) => {
    return db.User.findOne({ user_id, password })
        .then(user => {
            if (user) {
                currentId = user_id
                currentUname = user.uname
                const token = jwt.sign({
                    currentId: user_id
                }, 'secretkey123')
                return {
                    statusCode: 200,
                    status: true,
                    message: "successfully logged in!!!",
                    currentId,
                    currentUname,
                    token
                }
            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: "invalid user_id or password"
                }
            }

        })
}

const event = (edate, description, user_id) => {
    return db.User.findOne({ user_id })
        .then(user => {
            if (user) {
                user.events.push({
                    date: edate,
                    description: description
                })
                user.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: `An event on ${edate} has been added to your account`
                }
            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: "invalid user_id"
                }
            }
        })

}


const getReminder = (user_id) => {
    return db.User.findOne({ user_id })
        .then(user => {
            if (user) {
                return {
                    statusCode: 200,
                    status: true,
                    event: user.events
                }
            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: "user does not exist"
                }
            }
        })

}

const deleteEvent = (description, user_id) => {

    return db.User.updateOne({ "user_id": user_id }, { $pull: { events: { description: description } } })
        .then(result => {
            if (!result) {
                return {
                    statusCode: 422,
                    status: false,
                    message: "Failed to add"
                }
            }
            else {


                return {
                    statusCode: 200,
                    status: true,
                    message: "deleted one row"
                }
            }
        })

}

const updateReminder = (user_id, indexNum, edate, description) => {
    let index = parseInt(indexNum)
    return db.User.findOne({ user_id })
        .then(user => {
            if (!user) {
                return {
                    statusCode: 422,
                    status: false,
                    message: "Failed to update"
                }
            }
            else {
                if (user.events[index]["date"] != description && edate != "") {
                    user.events[index].date = edate
                }
                if (user.events[index]["description"] != description && description != "") {
                    user.events[index].description = description
                }
                user.markModified('events')
                user.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: `updated successfully`
                }
            }
        })

}

const deleteAcc = (user_id) => {
    return db.User.deleteOne({ user_id })
        .then(user => {
            if (!user) {
                return {
                    statusCode: 422,
                    status: false,
                    message: "operation failed"
                }
            }
            return {
                statusCode: 200,
                status: true,
                message: `Your user_id ${user_id} has been deleted successfully`
            }
        })
}

module.exports = {
    register,
    login,
    event,
    getReminder,
    deleteEvent,
    updateReminder,
    deleteAcc
}