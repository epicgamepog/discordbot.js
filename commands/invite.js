module.exports = {
    commands: 'invites',
    description: 'Displays who has invited the most members',
    callback: (message) => {
        const { guild } = message

        guild.fetchInvites().then((invites) => {
            const inviteCounter = {}

            invites.forEach((invite) => {
                const { uses, inviter } = invite
                const { username, discriminator } = inviter

                const name = `${username}#${discriminator}`

                inviteCounter[name] = (inviteCounter[name] || 0) + uses
            })

            let replyText = 'TOP 5 Inviters:' //'Inviters:'

            const sortedInvites = Object.keys(inviteCounter).sort((a, b) => inviteCounter[b] - inviteCounter[a])
            
            // console.log(sortedInvites)

            sortedInvites.length = 5

            for (const invite of sortedInvites) {
                const count = inviteCounter[invite]
                replyText += `\n${invite} has invited ${count} member(s)!`
            }
            
            message.reply(replyText)
        })
    },
}