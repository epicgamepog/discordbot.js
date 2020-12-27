const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const inviteNotificationsSchema = mongoose.Schema({
    _id: reqString,
    channelId: reqString,
    text: reqString,
})

module.exports = mongoose.model('invite-notifications', inviteNotificationsSchema)