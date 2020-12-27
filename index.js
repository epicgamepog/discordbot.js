require('events').EventEmitter.prototype._maxListeners = 100;

const path = require('path')
const fs = require('fs')

const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json') // when running with heroku, disable this with "command+/". Then enable client.login(process.env.DJS_TOKEN), and disable client.login(config.token)
const loadCommands = require('./commands/load-commands')

const command = require('./command')
const firstMessage = require('./first-message')
const privateMessage = require('./private-message')
const roleClaim = require('./role-claim')
const poll = require('./poll')
const oldWelcome = require('./old-welcome.js')
const memberCount = require('./member-count')
const sendMessage = require('./send-message');
// const { send } = require('process');
const mongo = require('./mongo')
const welcome = require('./welcome')
const messageCount = require('./message-counter')
const mute = require('./mute')
const eval = require('./eval')
const antiAd = require('./anti-ad')
const inviteNotifcations = require('./invite-notifications')
const scalingChannels = require('./scaling-channel')
const advancedPolls = require('./advanced-polls')

client.on('ready', async() => {
    console.log('The client is ready!')

    loadCommands(client)



    await mongo().then(mongoose => {
        mongoose.set('useFindAndModify', false)
        try {
            console.log('Connect to mongo!')
        } finally {
            mongoose.connection.close()
        }
    })


    command(client, ['ping', 'test'], (message) => {
        message.channel.send('Pong!')
    })

    command(client, 'servers', (message) => {
        client.guilds.cache.forEach(guild => {
            message.channel.send(`${guild.name} has a total of ${guild.memberCount} members`
            )
        })
    })

    command(client, ['cc', 'clearchannel'], (message) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results)
            })
        }
    })

    command(client, 'status', (message) => {
        const ownerId = '523005398672998400'
        const { member } = message

        if (member.id === ownerId) {
            const content = message.content.replace('!status', '')

            client.user.setPresence({
                activity: {
                    name: content,
                    type: 0,
            }
        })
        }
    })

    firstMessage(client, '781817813933228032', 'hello world!!!', ['🪀', '🧊'])

    privateMessage(client, 'ping', 'Pong!')

    // client.users.fetch('USER_ID').then(user => {
    //     user.send('Hello World!')
    // })

    command(client, 'createtextchannel', (message) => {
        const name = message.content.replace('!createtextchannel ', '')

        message.guild.channels
        .create(name, {
            type: 'text'
        }).then((channel) => {
            const categoryId = '780698080055918612'
            channel.setParent(categoryId)
        })
    })

    command(client, 'createvoicechannel', (message) => {
        const name = message.content.replace('!createvoicechannel ', '')

        message.guild.channels.create(name, {
            type: 'voice'
        })
        .then((channel) => {
            const categoryId = '780698080055918612'
            channel.setParent(categoryId)
            channel.setUserLimit(10)
        })
    })      

    command(client, 'embed', (message) => {
        console.log(message.author)
        const logo = 'https://www.freepnglogos.com/uploads/discord-logo-png/discord-logo-logodownload-download-logotipos-1.png'

        const embed = new Discord.MessageEmbed()
            .setTitle('Example Title')
            .setURL('https://discord.com/')
            .setAuthor(message.author.username)
            .setImage(logo)
            .setThumbnail(logo)
            .setFooter('Example Foot + Image', logo)
            .setColor('#1287e0')
            .addFields(
                {
                name: 'Field 1',
                value: 'Hello World',
                inline: false
            },
            {
                name: 'Field 2',
                value: 'Hello World',
                inline: false
            },
            {
                name: 'Field 3',
                value: 'Hello World',
                inline: false
            }
            )

        message.channel.send(embed)
    })

    command(client, 'serverinfo', message => {
        const { guild } = message

        const { name, region, memberCount, owner, afkTimeout, approximatePresenceCount,
                id, maximumMembers, maximumPresences, partnered, verified, publicUpdatesChannel, 
                rulesChannel, vanityURLCode, verificationLevel } = guild
        const icon = guild.iconURL()

        const embed = new Discord.MessageEmbed()
            .setTitle(`Server Info for \`${name}\``)
            .setThumbnail(icon)
            .addFields({
                name: 'Name:',
                value: name,
            },{
                name: 'Server ID:',
                value: id,
            },{
                name: 'Server Region:',
                value: region,
            },{
                name: 'Amount of Members:',
                value: memberCount,
            },{
                name: 'Maximum Amount of Members:',
                value: maximumMembers,
            },{
                name: 'Amount of Members That are Online:',
                value: approximatePresenceCount,
            },{
                name: 'Rules Channel:',
                value: rulesChannel,
            },{
                name: 'Vanity/Custom URL:',
                value: vanityURLCode,
            },{
                name: 'Verification Level:',
                value: verificationLevel,
            },{
                name: 'Is the Server Partnered?:',
                value: partnered,
            },{
                name: 'Is the Server Verified?:',
                value: verified,
            },{
                name: 'AFK Timer (in Minutes):',
                value: afkTimeout / 60,
            },{
                name: 'Server Owner:',
                value: owner.user.tag,
            })
            .setFooter(`Null Means: None, Nothing or The Amount is Too Little`)
        message.channel.send(embed)
    })

    // command(client, 'help', (message) => {
    //     message.channel.send

    //     const embed = new Discord.MessageEmbed()
    //         .setTitle(`Commands for \`CD-Bot\``)
    //         .addFields({
    //             name: `\`${prefix}Help\`:`,
    //             value: 'Sends this message',
    //         },{
    //             name: `\`${prefix}Ping\`:`,
    //             value: 'Sends Pong',
    //         },{
    //             name: `\`${prefix}serverinfo\`:`,
    //             value: 'Displays Information about the server',
    //         },{
    //             name: `\`${prefix}add <num1> <num2>\`:`,
    //             value: 'Adds the two numbers together',
    //         },{
    //             name: `\`${prefix}poll\`:`,
    //             value: 'Adds a thumbs up or down to the previous message',
    //         },{
    //             name: `\`${prefix}servers\`:`,
    //             value: 'Displays how many people are in the server',
    //         },{
    //             name: `\`${prefix}clearchannel\` or \`cc\`:`,
    //             value: 'Deletes all of the messages in the channel the command was sent in',
    //         },{
    //             name: `\`${prefix}status\`:`,
    //             value: 'Can be used to change the default status',
    //         },{
    //             name: `\`${prefix}createtextchannel\`:`,
    //             value: 'Creates a text channel',
    //         },{
    //             name: `\`${prefix}createvoicechannel\`:`,
    //             value: 'Creates a voice channel (vc)',
    //         },{
    //             name: `\`${prefix}embed\`:`,
    //             value: 'Sends a example embed message',
    //         })

    //     message.channel.send(embed)

    // //     (`
    // //    These are my supported commands:
       
    // //     **!help** - Displays the help menu
    // //     **!add <num1> <num2>** - Add two numbers
    // //     **!sub <num1> <num2>** - Subtracts two numbers
    // //     `)


    // })    
    
    const { prefix } = config

    client.user.setPresence({
        activity: {
            name: `"${prefix}help" for help`,
        }
    })
    
    roleClaim(client)

    command(client, 'ban', (message) => {
        const { member, mentions } = message
        const ownerId = '523005398672998400'
        const tag = `<@${member.id}>`

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('BAN_MEMBERS') ||
            member.id === ownerId
        ) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.ban()
                message.channel.send(`${tag} That user had been banned.`)
            } else {
            message.channel.send(`${tag} Please specify someone to ban.`)
            }
            } else {
            message.channel.send(
                `${tag} You do not have permissions to use this command`
            )
        }
    })

    command(client, 'kick', (message) => {
        const { member, mentions } = message
        const ownerId = '523005398672998400'
        const tag = `<@${member.id}>`

        if (
            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('KICK_MEMBERS') || 
            member.id === ownerId
        ) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.kick()
                message.channel.send(`${tag} That user had been kicked.`)
            } else {
            message.channel.send(`${tag} Please specify someone to kick.`)
            }
            } else {
            message.channel.send(
                `${tag} You do not have permissions to use this command`
            )
        }
    })

    poll(client)

    oldWelcome(client)

    memberCount(client)

    const guild = client.guilds.cache.get('777123788521078794')
    const channel = guild.channels.cache.get('784563088879255582')

    sendMessage(channel, 'hello world', // 3 - seconds
    )

    welcome(client)

    messageCount(client)

    mute(client)

    eval(client)

    antiAd(client)

    inviteNotifcations(client)

    scalingChannels(client)

    advancedPolls(client)

    // // client.user.setActivity('<activity>', { type: 'WATCHING' });
    // // client.user.setActivity('<activity>', { type: 'LISTENING' });
    
})



// client.login(process.env.DJS_TOKEN)
client.login(config.token)