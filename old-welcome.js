module.exports = client => {
    const channelId = '782539553075888189'
    const targetChannelID = '779956593684250625'
    
    client.on('guildMemberAdd', member => {
        console.log(member)

        const message = `Please welcome <@${member.id}> to the server! Please check out ${member.guild.channels.cache.get(targetChannelID)
            .toString()}`

        const channel = member.guild.channels.cache.get(channelId)
        channel.send(message)
    })
}