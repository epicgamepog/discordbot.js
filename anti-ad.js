module.exports = (client) => {
    const isInvite = async (guild, code) => {
        return await new Promise((resolve) => {
            guild.fetchInvites().then((invites) => {
                for (const invite of invites) {
                    if (code === invite[0]) {
                        resolve(true)
                        return
                    }
                    
                    resolve(false)
                }
            })
        })
    }
    
    client.on('message', async (message) => {
        const { guild, member, content } = message

        const code = content.split('discord.gg/')[1]
        // console.log('CODE:', code)

        if (content.includes('discord.gg/')) {
            const isOurInvite = await isInvite(guild, code)
            if (!isOurInvite) {
                const tag = `<@${member.id}>`
                
                message.delete(
                    // { timeout: 0500 }
                    )
                    .then(msg => console.log(`Deleted message from ${msg.author.username} that was an invite to another server`))
                    .catch(console.error);
                    message.channel.send(`${tag}, Do not send invites from other servers or you risk being punished`)
            }
        }
    })
}