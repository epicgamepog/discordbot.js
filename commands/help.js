const loadCommands = require('./load-commands')
const { prefix } = require('../config.json')

module.exports = {
    commands: [ 'broken-command-that-breaks-the-bot'
        // 'help', 'h'
                ],
    description: "Describes all of this bot's commands",
    callback: (message, arguments, text) => {
        let reply = 'I am the one and only CD Bot, here are my supported commands:\n\n'

        const commands = loadCommands()

        for (const command of commands) {
            let permissions = command.permission

            if (permissions) {
                let hasPermission = true
                if (typeof permissions === 'string') {
                    permissions = [permissions]
                }

                for (const permission of permissions) {
                    if (!message.member.hasPermission(permission)) {
                        hasPermission = false
                        break
                    }
                }

                if (!hasPermission) {
                    continue
                }
            }

            const mainCommand = typeof command.commands === 'string'
                ? command.commands 
                : command.commands[0]   
            const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
            const { description } = command

            reply += `**${mainCommand}${args}** = ${description}\n`
        }

        message.channel.send(reply)
    },
}