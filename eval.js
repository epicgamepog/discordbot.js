const command = require('./command')
const ownerId = '523005398672998400'
// const channelId = '784667647412797480'

module.exports = client => {
    command(client, 'eval', message => {
        const { member, channel, content } = message

        if (member.id === ownerId // && channel.id === channelId
            ) {
            const result = eval(content.replace('!eval ', ''))
            channel.send(result)
        } 
    })
}