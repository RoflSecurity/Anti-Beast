const { ActivityType } = require('discord.js');

module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        console.log(`${client.user.tag} ready !`);
        client.user.setPresence({
            activities: [{
                name: 'fire at will',
                type: ActivityType.Playing
            }],
            status: 'online'
        });
    }
};