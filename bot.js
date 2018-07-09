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
    	
    	var url = 'http://aces.lol-info.ru';
        const https = require('https');

		https.get('http://aces.lol-info.ru', (resp) => {
		  let data = '';
		 
		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
		    data += chunk;
		  });
		 
		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
		 //   console.log(JSON.parse(data).explanation);
		 	    message.channel.send('Смотри свою стату: '+JSON.parse(data).explanation);

		  });
		 
		}).on("error", (err) => {
		  // console.log("Error: " + err.message);
		});
		    	 
    		
    	//data = data.toString();
	   // message.channel.send('Смотри свою стату: '+data);
    
  	}
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
