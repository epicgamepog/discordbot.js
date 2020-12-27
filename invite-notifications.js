const mongo = require('./mongo')
const command = require('./command')
const inviteNotificationsSchema = require('./schemas/invite-notification-schema')

module.exports = (client) => {
    const invites = {}

    const getInviteCounts = async (guild) => {
        return await new Promise((resolve) => {
            guild.fetchInvites().then((invites) => {
                const inviteCounter = {}

                invites.forEach((invite) => {
                    const { uses, inviter } = invite
                    const { username, discriminator } = inviter

                    const name = `${username}#${discriminator}`

                    inviteCounter[name] = (inviteCounter[name] || 0)
                })

                resolve(inviteCounter)
            })
        })
    }

    client.guilds.cache.forEach(async (guild) => {
        invites[guild.id] = await getInviteCounts(guild)
    })

    client.on('guildMemberAdd', async (member) => {
        const { guild, id } = member

        const invitesBefore = invites[guild.id]
        const invitesAfter = await getInviteCounts(guild)

        console.log('beFore', invitesBefore)
        console.log('afgter', invitesAfter)

        for (const inviter in invitesAfter) {
            // if (invitesBefore[inviter] === invitesAfter[inviter] - 1) {
            //     const channelId = ''
            //     const channel = guild.channels.cache.get(channelId)
            //     const count = inviteAfter[inviter]
            //     channel.send(`Please welcome <@${id}> to the Discord! Invited by ${inviter} (${count} invites)`)
            // }

            // command(client, 'setinvite', async (message) => {
            //     const { member, channel, content, guild } = message

            //     if (!member.hasPermission('ADMINISTRATOR')) {
            //         channel.send('You do not have the correct permission(s) to run this command.')
            //         return
            //     }

            //     let text = content

            //     const split = text.split(' ')

            //     if (split.length < 2) {
            //         channel.send('Please provide the invite message')
            //         return
            //     }

            //     split.shift()
            //     text = split.join(' ')
                
            //     await mongo().then(async (mongoose) => {
            //         try {
            //             await new inviteNotificationsSchema({
            //                 _id: guild.id,
            //                 channelId: channel.id,
            //                 text,
            //             }).save()
            //         } finally {
            //             mongoose.connection.close()
            //         }
            //     })
            // })
            

            invites[guild.id] = inviteAfter
            return
        }
    })
}