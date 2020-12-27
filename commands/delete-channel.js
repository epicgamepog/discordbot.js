module.exports = {
    commands: ['deletechannel', 'delchannel'],
    maxArgs: 0,
    permissionError: 'You must be an admin to use this command.',
    permission: 'ADMINISTRATOR',
    description: 'Deletes the channel that the command was used in',
    callback: (message, arguments, text) => {
        message.channel.delete()
    }
}