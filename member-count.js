module.exports = client => {
    const channelId =  '784365001963208714'

    const updateMembers = guild => {
        const channel = guild.channels.cache.get(channelId)
        channel.setName(`Members: ${guild.memberCount.toLocaleString()}`)
    }

    client.on('guildMemberAdd', member => updateMembers(member.guild))
    client.on('guildMemberRemove', member => updateMembers(member.guild))

    // const guild = client.guilds.cache.get('777123788521078794')
    // updateMembers(guild)
}