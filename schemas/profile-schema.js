const { User } = require('discord.js')
const mongoose = require('mongoose')

const reqString = {
    type: String,
    requried: true
}

const profileSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    coins: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('profiles', profileSchema)