const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === 'ping') {
    	message.reply('pong');
  	}
    if (message.content === '!farm') {
        var nick = encodeURI(message.guild.members.get(message.author.id).nickname);
    	message.channel.send('Смотри свою стату здесь: http://aces.lol-info.ru/s/'+nick);
  	}
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
