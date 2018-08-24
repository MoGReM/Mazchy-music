const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const request = require('request');
const devs = ['451579764055080960','396958215377780747'];
const child_process = require("child_process");
const adminprefix = "هنا البرفكس";
const fs = require('fs');
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
 
const yt_api_key = "AIzaSyDeoIH0u1e72AtfpwSKKOSy3IPp2UHzqi4";
const prefix = '-';
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('')
  console.log('')
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log(`[Start] ${new Date()}`);
  console.log('╚[═════════════════════════════════════════════════════════════════]╝')
  console.log('')
  console.log('╔[════════════════════════════════════]╗');
  console.log(`Logged in as * [ " ${client.user.username} " ]`);
  console.log('')
  console.log('Informations :')
  console.log('')
  console.log(`servers! [ " ${client.guilds.size} " ]`);
  console.log(`Users! [ " ${client.users.size} " ]`);
  console.log(`channels! [ " ${client.channels.size} " ]`);
  console.log('╚[════════════════════════════════════]╝')
  console.log('')
  console.log('╔[════════════]╗')
  console.log(' Bot Is Online')
  console.log('╚[════════════]╝')
  console.log('')
  console.log('')
});
 
client.on('message', message => {
    var argresult = message.content.split(` `).slice(1).join(' ');
      if (!devs.includes(message.author.id)) return;
     
  if (message.content.startsWith(adminprefix + 'ply')) {
    client.user.setGame(argresult);
      message.channel.sendMessage(`**:white_check_mark:   ${argresult}**`)
  } else
    if (message.content === (adminprefix + "Percie")) {
    message.guild.leave();        
  } else  
  if (message.content.startsWith(adminprefix + 'wt')) {
  client.user.setActivity(argresult, {type:'WATCHING'});
      message.channel.sendMessage(`**:white_check_mark:   ${argresult}**`)
  } else
  if (message.content.startsWith(adminprefix + 'ls')) {
  client.user.setActivity(argresult , {type:'LISTENING'});
      message.channel.sendMessage(`**:white_check_mark:   ${argresult}**`)
  } else    
    if (message.content.startsWith(adminprefix + 'setname')) {
  client.user.setUsername(argresult).then
      message.channel.sendMessage(`**${argresult}** : Done :>`)
  return message.reply("**You Can't Change Your Name ,Only After Two Hours :>**");
} else
    if (message.content.startsWith(adminprefix + 'setavatar')) {
  client.user.setAvatar(argresult);
    message.channel.sendMessage(`**${argresult}** : تم تغير صورة البوت`);
        } else    
  if (message.content.startsWith(adminprefix + 'st')) {
    client.user.setGame(argresult, "https://www.twitch.tv/idk");
      message.channel.sendMessage(`**:white_check_mark:   ${argresult}**`)
  }
});
 
 
 
 
 
 
 
 
 
 
 
 
/*
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\
*/
var servers = [];
var queue = [];
var guilds = [];
var queueNames = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipReq = 0;
var skippers = [];
var now_playing = [];
/*
\\\\\\\\\\\\\\\\\\\\\\\\/////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\/////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\/////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\/////////////////////////
*/



client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`in ${client.guilds.size} servers `)
    console.log(`[user] ${client.users.size}`)
    client.user.setStatus("idle")
});

client.on('message', message => {
if(!message.channel.guild) return;
if (message.content.startsWith("-ping")) {
    message.channel.sendMessage(`**Time Taken : **\`${Date.now() - message.createdTimestamp} ms\`
**Discord API :** \`${Math.round(client.ping)}\` `);
    }
});
  

  client.on('message',async message => {
      if(message.content.startsWith("-restart")){
		  if(message.author.id !== "445630664671232000") return message.reply('You aren\'t the bot owner.');
        message.channel.send('**Restarting.**').then(msg => {
            setTimeout(() => {
               msg.edit('**Restarting..**');
            },1000);
            setTimeout(() => {
               msg.edit('**:white_check_mark: **').then(message =>{message.delete(5000)})
            },2000);
        });
        console.log(`Restarting..`);
        setTimeout(() => {
            client.destroy();
        },3000);
    }
});
// This Code Edit By Mazchy .     
client.on('message', async msg => { 
	
	if (msg.author.bot) return undefined;

	if (!msg.content.startsWith(prefix)) return undefined;
	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');

	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
	
	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)
	
	if (command === `play`) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('**You should be in a voice channel**');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {

			return msg.channel.send('**i have no perms to get in this room**');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('**i have no perms to Speek in this room**');
		}

		if (!permissions.has('EMBED_LINKS')) {
			return msg.channel.sendMessage("**i should have `EMBED LINKS` perm**")
		}
// This Code Edit By Mazchy . 
		if (url.match(/^https?:\/\/(www.youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();

			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`**added to list \`${playlist.title}\` white_check_mark**`);
		} else {
			try {

				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 5);
					let index = 0;
					const embed1 = new Discord.RichEmbed()
					.setAuthor(msg.author.username,client.user.avatarURL)
			        .setDescription(`**Choose a number** : 
${videos.map(video2 => `[ **${++index}** ] \`${video2.title}\``).join('\n')}`)

					msg.channel.sendEmbed(embed1).then(message =>{message.delete(5000)})
					
					
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 7000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						msg.reply('**you did not choose a number **').then(message =>{message.delete(5000)})
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
				}
			}
// This Code Edit By Mazchy . 
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === `skip`) {
		if (!msg.member.voiceChannel) return msg.channel.send('**you are not in a voice channel**');
		if (!serverQueue) return msg.channel.send('**skepped :white_check_mark: **');
		serverQueue.connection.dispatcher.end('');
		return undefined;
	} else if (command === `stop`) {
		
		if (!msg.member.voiceChannel) return msg.channel.send('**you are not in a voice channel**');
		if (!serverQueue) return msg.channel.send('**stopped :white_check_mark: **');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('');
		return undefined;
		// This Code Edit By Mazchy . 
	} else if (command === `vol`) {
		if (!msg.member.voiceChannel) return msg.channel.send('**you are not in a voice channel**');
		if (!serverQueue) return msg.channel.send('**there is no thing playing**');
		if (!args[1]) return msg.channel.send(`**:loud_sound: volume** \`${serverQueue.volume}\``);
        serverQueue.volume = args[1];
		
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
		return msg.channel.send(`**:speaker:** \`${args[1]}\``);		} else if (command === `nowplaying`) {
		if (!serverQueue) return msg.channel.send('**there is no thing playing**');
		const embedNP = new Discord.RichEmbed()
	.setDescription(`**:notes: playing :** \`${serverQueue.songs[0].title}\``)
		return msg.channel.sendEmbed(embedNP);
	} else if (command === `queue`) {
		
		if (!serverQueue) return msg.channel.send('**there is no thing playing**').then(message =>{message.delete(5000)})
		let index = 0;
		
		const embedqu = new Discord.RichEmbed() 

.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** \`${song.title}\``).join('\n')}
**now playing** \`${serverQueue.songs[0].title}\``)
		return msg.channel.sendEmbed(embedqu);
	} else if (command === `pause`) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('Done :white_check_mark: ');
		}
		return msg.channel.send('**there is no thing playing**');
		} else if (command === "resume") {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();// This Code Edit By Mazchy . 
			return msg.channel.send('Done :white_check_mark:  .');
		}
		return msg.channel.send('**there is no thing playing**');
		}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {// This Code Edit By Mazchy . 
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);// This Code Edit By Mazchy . 

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`\`I could not join the voice channel:\` **${error}**`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`\`i can not get in this room\` **${error}**`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(` **added to list \`${song.title}\` :white_check_mark: **`);
	}
	return undefined;
}// This Code Edit By Mazchy . 

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.')
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));// This Code Edit By Mazchy . 
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`**Start Playing** : \`${song.title}\` :white_check_mark: `);
}




 client.on('message', message => {
  if (message.content === 'mjoin') {   // This Code Edit By Mazchy . 
    const channel = message.member.voiceChannel;
    channel.join()
message.reply("**:grinning: k**").then(message =>{message.delete(5000)})

  }
});

 client.on('message', message => {
  if (message.content === 'mleave') {  
  	message.reply("**:cry: k**").then(message =>{message.delete(5000)})
    const channel = message.member.voiceChannel;

    channel.leave()
  }
});

    

    // This Code Edit By Mazchy . 
    
    
    


client.on('message', message => {
if (message.content === 'mhelp'){
message.author.send(`
**Music,Maazçhy .** commands:

\`${prefix}about\` - **shows info about the bot**
\`${prefix}ping\` - **checks the bot's latency**

  __Music__

\`${prefix}nowplaying\` - **shows the song that is currently playing**
\`${prefix}play\` - **plays the provided song**
\`${prefix}queue\` - **shows the current queue**
\`${prefix}skip\` - **skip the current song**
\`${prefix}Stop\` - **Stop the current song**
\`${prefix}vol\` - **set volume Bot**
\`${prefix}pause\` - **pauses the current song**
\`${prefix}resume\` - **mresume the current song**
\`${prefix}join\` - **Join To Room**
\`${prefix}leave\` - **Leave From Room**

__Owner__

\`${prefix}setavatar <url> \` - **sets the avatar of the bot**
\`${prefix}setname <name>\` - **sets the name of the bot**
\`${prefix}Streaming\` - **Change Game Bot to Stream**
\`${prefix}watching\` - **Change Game Bot to Watching**
\`${prefix}playing\` - **Change Game Bot to Playing**
\`${prefix}listening\` - **Change Game Bot to listening**
\`${prefix}shutdown\` - **safely shuts down**

For additional help, contact **.Maazçhy**

`);
}});

  client.on('message' , message => {
    if (message.content.startsWith(prefix + "shutdown")) {
        if(message.author.id !== "445630664671232000") return message.reply('**You aren\'t the bot owner.**');
        if ((r=>[""].includes(r.name)) ) {
                     message.channel.sendMessage("**Currently Shutting down...** ") // This Code Edit By Mazchy . 
        setTimeout(function() {
            client.destroy();
            process.exit(0);
        }, 2000);
        } else {

            return message.reply(`I cannot do that for you unfortunately`)
                .then(message => {
                    message.delete(10000);
                }).catch(console.log);
        }
       
    }
});
  

client.on('message', message => {
       if (message.content === prefix + "about") {// This Code Edit By Mazchy . 
       let embed = new Discord.RichEmbed()
         .setURL('https://discordapp.com/oauth2/authorize?client_id=465693387253874694&scope=bot&permissions=2080374975')
    .setColor("#7e7e7e")
.setTitle('\`invite\`')
    .setDescription(`Hello Im **.Maazçhy Music Bot** :notes: 
    
    **im owned By** \`.Maazçhy\`
  
    **Type \`${prefix}help\` to see my commands!**
    
    **Plase invite Me To Your Server !**
    `)  
     .setFooter('Requested by '+message.author.username, message.author.avatarURL)
  .setURL('https://discordapp.com/oauth2/authorize?client_id=465693387253874694&scope=bot&permissions=2080374975')
    message.channel.sendEmbed(embed);
      }
  });
 
client.on('message', message => {
  if (!message.content.startsWith(adminprefix)) return;
  var args = message.content.split(' ').slice(1);
  var argresult = args.join(' ');
  if (message.author.id !== "445630664671232000") return;

  
  if (message.content.startsWith(adminprefix + 'watching')) {
  client.user.setActivity(argresult, {type: 'WATCHING'})
    message.channel.sendMessage(`watching Now: **${argresult}**`).then(message =>{message.delete(5000)})
} 
// This Code Edit By Mazchy . 
  if (message.content.startsWith(adminprefix + 'listening')) {
  client.user.setActivity(argresult, {type: 'LISTENING'})
    message.channel.sendMessage(`listening Now: **${argresult}**`).then(message =>{message.delete(5000)})
} 
// This Code Edit By Mazchy . 

if (message.content.startsWith(adminprefix + 'setname')) {
  client.user.setUsername(argresult).then
      message.channel.sendMessage(`Username Changed To **${argresult}**`).then(message =>{message.delete(5000)})
} 
// This Code Edit By Mazchy . 
if (message.content.startsWith(adminprefix + 'setavatar')) {
  client.user.setAvatar(argresult);
   message.channel.sendMessage(`Avatar Changed :white_check_mark:  `).then(message =>{message.delete(5000)})
}
// This Code Edit By Mazchy . 
if (message.content.startsWith(adminprefix + 'streming')) {
  client.user.setGame(argresult, "https://www.twitch.tv/v5bz");
    message.channel.sendMessage(`Streaming Now: **${argresult}**`).then(message =>{message.delete(5000)})
} 
if (message.content.startsWith(adminprefix + 'playing')) {
  client.user.setGame(argresult);
    message.channel.sendMessage(`Playing Now: **${argresult}**`).then(message =>{message.delete(5000)})
} 

});
    


client.login(process.env.BOT_TOKEN);
