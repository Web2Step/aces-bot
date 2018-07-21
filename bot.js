const Discord = require('discord.js');
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.prefix contains the message prefix.

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Янв','Фев','Мар','Апр','Май','Июнь','Июль','Авг','Сент','Окт','Нояб','Декабрь'];
  var year = a.getFullYear();
  //var month = months[a.getMonth()];
  var month = a.getMonth();
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  //var sec = a.getSeconds();
  var time = date + '.' + month + '.' + year + ' ' + hour + ':' + min;
  return time;
}

// ----------- FUNCTION ISARRAY --------------- //
isArray = function(a) {
    return (!!a) && (a.constructor === Array);
};
// -------------------------------------------//

// ----------- FUNCTION TIMER1 ------------------------------- //
function checkTop1(arg) {
    console.log(`Checking ${arg} ..`);
    let url = 'http://aces-now.lol-info.ru/api/discord-bot/showchannel_top1.php?param=top1';
    global.getdata = 'Нет данных';
    console.log('URL TIMER: ' + url);

    const request = require('request');
    var baseRequest = request.defaults({
        pool: false,
        agent: false,
        jar: true,
        json: true,
        timeout: 5000,
        gzip: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    var options = {
        url: url,
        method: 'GET'
    };
    baseRequest(options, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            let infos =  body;
            console.log(body);
            if (!isArray(infos)) return;
            infos.forEach(function(info) {
                console.log('INFO: '+info);
                //var avatar = message.author.avatarURL;
                const embed = new Discord.RichEmbed();
                //if (info.show_who !== false) embed.setAuthor(me + ' запрашивает..', avatar);
                //else
                if (info.author_name !== undefined) embed.setAuthor(info.author_name, info.author_avatar);
                if (info.title !== undefined) embed.setTitle(info.title);
                if (info.color !== undefined) embed.setColor(info.color);
                if (info.description !== undefined) embed.setDescription(info.description);
                if (info.footer !== undefined) embed.setFooter(info.footer, info.footer_icon);
                if (info.image !== undefined) embed.setImage(info.image);    //- ФОТКА НА ПОЛЭКРАНА!!!
                if (info.thumbnail !== undefined) embed.setThumbnail(info.thumbnail);
                if (info.timestamp !== undefined) embed.setTimestamp();
                if (info.url !== undefined) embed.setURL(info.url);

                // -------- СОЗДАТЬ СЕТКУ ЗНАЧЕНИЙ -------
                var fields = info.fields;
                fields.forEach(function (field) {
                    if (field['insertline'] !== false) embed.addBlankField(field['insertline_group']);
                    embed.addField(field['title'], field['value'], field['group']);
                    //console.log(field);
                });
                // ----------------------------------------
                client.channels.get(info.guild_channel).send({embed});
            });
            //console.log(body);
        }
    });
}
// ----------------- FUNCTION TIMER1 END ------------------------------ //





client.on('ready', () => {
    console.log('I am ready!');
    setInterval(checkTop1, config.timer_check_top1, 'top1');
});

client.on('message', message => {

   // --- Выйти если это не бот или не команда бота ---- //
   if(message.author.bot) return;
   if(message.content.indexOf(config.prefix) !== 0) return;
   // -------------------------------------------------- //

   if (message.content === '!ping') {
    	message.reply('!pong');
   }

    // --- Аргументы и команды ----------
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // --- Какой ник взять -----------
    var nick_serv = message.author.username;
    var nick_guild = message.guild.members.get(message.author.id).nickname;
    var nick = ''; // universal nick
    var me = nick_guild;
    if (nick_guild === null) {
      nick = nick_serv; me = nick_serv;
    } else nick = nick_guild;
    var nick_url = encodeURI(nick);
    var param_str = args.join(" ").trim();

    // ------------- FARM COMMAND BEGIN ----------------- //
    if (command === 'farm' || command === 'club' || command === 'stat') {
			let nick2 = param_str;
			if (nick2.length > 2) {
				nick_url=encodeURI(nick2);
				nick = nick2;
			}
			var url = 'http://aces-now.lol-info.ru/api/discord-bot/getfarm.php?name='+nick_url+'&param='+args[0];
			global.getdata = 'Нет данных';

		  const request = require('request');
		  var baseRequest = request.defaults({
		 	  pool: false,
			  agent: false,
			  jar: true,
			  json: true,
			  timeout: 5000,
			  gzip: true,
			  headers: {
			  	'Content-Type': 'application/json'
			 }
		  });

		  var options = {
		 	 url: url,
			 method: 'GET'
		  };

		  baseRequest(options, function(error, response, body) {
			 if (error) {
				 console.log(error);
			 } else {
			 var info =  body;
			 var icon = 'http://ddragon.leagueoflegends.com/cdn/'+info.apiImageVersion+'/img/profileicon/'+info.profileIconId+'.png';
			 var avatar = message.author.avatarURL;
			 var roles = info.roles;
			 if (roles===null)  roles='нет';
			 var active = info.active;
			 if (active)  active='В клубе';
			 else active='Не в клубе';

					const embed = new Discord.RichEmbed()
					.setTitle("Профиль игрока: "+info.name.toUpperCase())
					.setAuthor(me + ' запрашивает..', avatar)
					.setColor(0x00AE86)
					.setDescription("Клубные характеристики игрока")
					.setFooter("(c) ACES.LOL-INFO.RU CLUB", "http://smiles.lol-info.ru/aces.png")
					//.setImage(mainpic)    //- ФОТКА НА ПОЛЭКРАНА!!!
					.setThumbnail(icon)
					.setTimestamp()
					.setURL(info.club_site+"/u/"+encodeURI(info.name))
					.addField("Дата регистрации:", timeConverter(+info.gi_firstgame + 10800), true)
					.addField("Дата игры:", timeConverter(+info.gi_lastgame + 10800), true)
					.addField("Фарм Сезона:", info.gi_pointsAll, true)
					.addField("Фарм Этапа", info.gi_pointsStep,true)
					.addField("Игры Сезона:", info.gi_gamesSeason, true)
					.addField("Игры Этапа", info.gi_gamesStep,true)
					.addField("Роли:", info.roles_favorite_shortcode, true)
					.addField("Чемпионы", info.champions_favorite,true)
					.addField("WinRate Season:", info.gi_winrate+'%', true)
					.addField("WinRate Step:", info.gi_winrateStep+'%', true)
					.addField("Ранг игрока:", info.solo_tier+' '+info.solo_rank, true)
					.addField("Статус:", active, true)
					.addField(":star2:Достижения:", roles, false);

					if (command === 'club' || command === 'stat') embed.setImage(info.main_image);

					if (info.relevant<10) {
						var str2 = '' + message.author.username + ' - Игрока **' + nick + '** нет в Клубе! :thinking:';
						message.channel.send(str2);
					}
					else message.channel.send({embed});
				 console.log(body);
			}
		});
	}
	// END !FARM

	// START !BEST
	else if ((command === 'best' || command === 'BEST') && (args[0] === undefined)) {
		let nick2 = param_str;
		if (nick2.length > 2) {
			nick_url=encodeURI(nick2);
			nick = nick2;
		}
		var url = 'http://aces-now.lol-info.ru/api/discord-bot/getbest.php?name='+nick_url;
		global.getdata = 'Нет данных';

	const request = require('request');
	var baseRequest = request.defaults({
		pool: false,
		agent: false,
		jar: true,
		json: true,
		timeout: 5000,
		gzip: true,
		headers: {
			'Content-Type': 'application/json'
		}
	});

	var options = {
		url: url,
		method: 'GET'
	};

	baseRequest(options, function(error, response, body) {

		if (error) {
			console.log(error);
		} else {
		var info =  body;
		//var icon = 'http://smiles.lol-info.ru/aces.png';
		var avatar = message.author.avatarURL;
		const embed = new Discord.RichEmbed()
			  .setTitle('Лучшие игроки клуба "'+info.club_name.toUpperCase()+'"')
				.setAuthor(me + ' запрашивает..', avatar)
				.setColor(0x00CE26)
				.setDescription("Статистика обновляется не моментально!")
				.setFooter(info.footer, info.footer_icon)
				//.setImage(mainpic)    //- ФОТКА НА ПОЛЭКРАНА!!!
				.setThumbnail(info.thumbnail)
				.setTimestamp()
				.setURL(info.club_site+'/season')
				.addField(":boom:Лучшие игроки Сезона:",  info.best_season, true)
				.addBlankField(false)
				.addField(":boom:Лучшие игроки Этапа:", info.best_step, true)
				.addBlankField(true)
				.addField(":boom:Лучшие игроки Дня:", info.best_today, true)
		message.channel.send({embed});
		console.log(body);
		}
	});
}
// END !BEST

// START !BAD
else if ((command === 'bad' || command === 'BAD') && (args[0] === undefined)) {
		let nick2 = param_str;
		if (nick2.length > 2) {
			nick_url=encodeURI(nick2);
			nick = nick2;
		}
		var url = 'http://aces-now.lol-info.ru/api/discord-bot/getbad.php?name='+nick_url;
		global.getdata = 'Нет данных';

	const request = require('request');
	var baseRequest = request.defaults({
		pool: false,
		agent: false,
		jar: true,
		json: true,
		timeout: 5000,
		gzip: true,
		headers: {
			'Content-Type': 'application/json'
		}
	});

	var options = {
		url: url,
		method: 'GET'
	};

	baseRequest(options, function(error, response, body) {

		if (error) {
			console.log(error);
		} else {
		var info =  body;
		//var icon = 'http://smiles.lol-info.ru/aces.png';
		var avatar = message.author.avatarURL;
				const embed = new Discord.RichEmbed()
				.setTitle('Худшие игроки клуба "'+info.club_name.toUpperCase()+'"')
				.setAuthor(me + ' запрашивает..', avatar)
				.setColor(0x00CE26)
				.setDescription("Статистика обновляется не моментально!")
				.setFooter(info.footer, info.footer_icon)
				//.setImage(mainpic)    //- ФОТКА НА ПОЛЭКРАНА!!!
				.setThumbnail(info.thumbnail)
				.setTimestamp()
				.setURL(info.club_site+'/season')
				.addField(":fire:Худшие игроки Сезона:",  info.bad_season, true)
				.addBlankField(false)
				.addField(":fire:Худшие игроки Этапа:", info.bad_step, true)
				.addBlankField(true)
				.addField(":fire:Худшие игроки Дня:", info.bad_today, true)

				message.channel.send({embed});
		    console.log(body);
		}
	});
}
// END !BAD


// START !BAD SEASON OR STEP
else if (((command === 'bad' || command === 'best') && (args[0] === 'season' || args[0] === 'step')) || (command === 'badseason' || command === 'badstep' || command === 'beststep' || command === 'bestseason')) {
    var param_send = null;
    if ((command === 'bad') || (command === 'best')) param_send=args[1]; else param_send=args[0];
    if  (param_send === null) param_send=0;
    //console.log('0-'+args[0]+'1-'+args[1]);

		var url = '';
	 	if (((command==='bad')&&(args[0]==='season')) || (command==='badseason')) url = 'http://aces-now.lol-info.ru/api/discord-bot/getbadseason.php?name='+nick_url+'&stage='+args[0]+'&param='+param_send;
		else if (((command==='bad')&&(args[0]==='step')) || (command==='badstep')) url = 'http://aces-now.lol-info.ru/api/discord-bot/getbadstep.php?name='+nick_url+'&stage='+args[0]+'&param='+param_send;
		else if (((command==='best')&&(args[0]==='step')) || (command==='beststep')) url = 'http://aces-now.lol-info.ru/api/discord-bot/getbeststep.php?name='+nick_url+'&stage='+args[0]+'&param='+param_send;
		else if (((command==='best')&&(args[0]==='season')) || (command==='bestseason')) url = 'http://aces-now.lol-info.ru/api/discord-bot/getbestseason.php?name='+nick_url+'&stage='+args[0]+'&param='+param_send;
		global.getdata = 'Нет данных';
		console.log('URL: ' + url);

	const request = require('request');
	var baseRequest = request.defaults({
		pool: false,
		agent: false,
		jar: true,
		json: true,
		timeout: 5000,
		gzip: true,
		headers: {
			'Content-Type': 'application/json'
		}
	});

	var options = {
		url: url,
		method: 'GET'
	};
	baseRequest(options, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
		var info =  body;
		var avatar = message.author.avatarURL;
				const embed = new Discord.RichEmbed();
				if (info.show_who !== false) embed.setAuthor(me + ' запрашивает..', avatar);
			  else embed.setAuthor(info.author_name, info.author_avatar);
				if (info.title !== undefined) embed.setTitle(info.title);
				if (info.color !== undefined) embed.setColor(info.color);
				if (info.description !== undefined) embed.setDescription(info.description);
				if (info.footer !== undefined) embed.setFooter(info.footer, info.footer_icon);
				if (info.image !== undefined) embed.setImage(info.image);    //- ФОТКА НА ПОЛЭКРАНА!!!
				if (info.thumbnail !== undefined) embed.setThumbnail(info.thumbnail);
				if (info.timestamp !== undefined) embed.setTimestamp();
				if (info.url !== undefined) embed.setURL(info.url);

			  // -------- СОЗДАТЬ СЕТКУ ЗНАЧЕНИЙ -------
			  var fields = info.fields;
			  fields.forEach(function(field) {
				  if (field['insertline'] !== false) embed.addBlankField(field['insertline_group']);
   			  embed.addField(field['title'], field['value'], field['group']);
				  //console.log(field);
				});
				// ----------------------------------------
			 message.channel.send({embed});
			 console.log(body);
		}
	});
}
// END !BAD SEASON OR STEP

// START !RATING
else	if (command === 'rating' || command === 'RATING') {
		var nick = message.guild.members.get(message.author.id).nickname;
		var me = message.guild.members.get(message.author.id).nickname;
		var params_url = encodeURI(param_str);
		if (param_str.length > 2) {
			params=encodeURI(nick);
		}
		var url = 'http://aces-now.lol-info.ru/api/discord-bot/getrating.php?name='+nick_url+'&param2='+params_url;
		global.getdata = 'Нет данных';

	const request = require('request');
	var baseRequest = request.defaults({
		pool: false,
		agent: false,
		jar: true,
		json: true,
		timeout: 5000,
		gzip: true,
		headers: {
			'Content-Type': 'application/json'
		}
	});

	var options = {
		url: url,
		method: 'GET'
	};

	baseRequest(options, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
		var info =  body;
		console.log(body);
		var icon = 'http://smiles.lol-info.ru/aces.png';
		var avatar = message.author.avatarURL;

			  const embed = new Discord.RichEmbed()
				.setTitle('Статистика Клубов Сезона')
				.setAuthor(me + ' запрашивает..', avatar)
				.setColor(0x00CE26)
				.setDescription("Статистика по клубам!")
				.setFooter("(c) ACES.LOL-INFO.RU CLUB", "http://smiles.lol-info.ru/aces.png")
				//.setImage(mainpic)    //- ФОТКА НА ПОЛЭКРАНА!!!
				.setThumbnail(icon)
				.setTimestamp()
				.setURL('https://clubs.ru.leagueoflegends.com/rating');
				embed.addField("Название клуба №"+info.results[0].rank+'', info.results[0].club.lol_name,true);
				embed.addField("Глава клуба:", info.results[0].club.owner.summoner_name,true);
			    embed.addField("Число игроков:", info.results[0].club.members_count,true);
				embed.addField("Сезоны клуба:", info.results[0].club.seasons_count,true);
				embed.addField("Очки клуба:", info.results[0].points,true);
				embed.addField("Игры клуба:", info.results[0].games,true);
				//embed.addField("Завершенные Этапы:", info.results[0].completed_stages,true);
                //embed.addField("Ранг:", info.results[0].rank,true);
				embed.addField("Дата вступления:", info.results[0].joined,false);
			 	embed.addBlankField(false);
				embed.addField("Название клуба №"+info.results[1].rank+'', info.results[1].club.lol_name,true);
				embed.addField("Глава клуба:", info.results[1].club.owner.summoner_name,true);
                embed.addField("Число игроков:", info.results[1].club.members_count,true);
				embed.addField("Сезоны клуба:", info.results[1].club.seasons_count,true);
				embed.addField("Очки клуба:", info.results[1].points,true);
				embed.addField("Игры клуба:", info.results[1].games,true);
				//embed.addField("Завершенные Этапы:", info.results[1].completed_stages,true);
                //embed.addField("Ранг:", info.results[1].rank,true);
				embed.addField("Дата вступления:", info.results[1].joined,false);

			 	embed.addBlankField(false);

				embed.addField("Название клуба №"+info.results[2].rank+'', info.results[2].club.lol_name,true);
				embed.addField("Глава клуба:", info.results[2].club.owner.summoner_name,true);
                embed.addField("Число игроков:", info.results[2].club.members_count,true);
				embed.addField("Сезоны клуба:", info.results[2].club.seasons_count+9,true);
				embed.addField("Очки клуба:", info.results[2].points,true);
				embed.addField("Игры клуба:", info.results[2].games,true);
				//embed.addField("Завершенные Этапы:", info.results[2].completed_stages,true);
                //embed.addField("Ранг:", info.results[2].rank,true);
				embed.addField("Дата вступления:", info.results[2].joined,true);
			    /*
 				embed.addBlankField(true);

				embed.addField("Название клуба:", info.results[3].club.lol_name,true);
				embed.addField("Глава клуба:", info.results[3].club.owner.summoner_name,true);
			        embed.addField("Число игроков:", info.results[3].club.members_count,true);
				embed.addField("Сезоны клуба:", info.results[3].club.seasons_count,true);
				embed.addField("Очки клуба:", info.results[3].points,true);
				embed.addField("Игры клуба:", info.results[3].games,true);
				//embed.addField("Завершенные Этапы:", info.results[3].completed_stages,true);
			        embed.addField("Ранг:", info.results[3].rank,true);
				embed.addField("Дата вступления:", info.results[3].joined,true);
			    */

		message.channel.send({embed});
		console.log(body);
		}
	});
}
// END !RATING

// START !INVITE
else if (command === 'invite' || command === 'INVITE') {
		var nick = message.guild.members.get(message.author.id).nickname;
		var me = message.guild.members.get(message.author.id).nickname;
		var nick_url = encodeURI(nick);
		//const args = message.content.trim().split(/ +/g);
		//const command = args.toLowerCase();
		let nick2 = args.join(" ").trim();
		if (nick2.length > 2) {
			nick_url=encodeURI(nick2);
			nick = nick2;
		}

	  if(message.member.roles.some(r=>["Клуб", "Mod", "Server Staff", "Proficient"].includes(r.name)) ) {
       var Role=message.guild.roles.find('name',config.chan_invite);
		   // message.channel.send(Role.name); return;
       if (Role.id) message.guild.members.get(message.author.id).addRole(Role); else message.channel.send('HAVENT ROLE!');
		   message.channel.send(nick+' допущен и ждёт!');
       return;
	  } else {
       message.channel.send(nick+' не допущен!');
       return;
    }

    message.channel.send(nick+' в поиске стака!');
		console.log('поиск стака запущен..');
}
// END !INVITE



});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
