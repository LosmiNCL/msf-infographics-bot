const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('arena')
		.setDescription('Teams for the Arena')
		.addStringOption(option =>
			option.setName('arena-team')
			.setDescription('Name of the Team')
			.setRequired(true)
			.addChoices(
				{name: 'ultimate arena meta - offense and defense', value: 'ultimate arena meta - offense and defense'},
				{name: 'secret defenders - offense and defense', value: 'secret defenders - offense and defense'},
				{name: 'secret defenders and apocalypse - offense and defense', value: 'secret defenders and apocalypse - offense and defense'},
				{name: 'apocalypse horsemen and nick fury - offense', value: 'apocalypse horsemen and nick fury - offense'},
				{name: 'apocalypse horsemen and kang - offense defense', value: 'apocalypse horsemen and kang - offense defense'},
				{name: 'apocalypse horsemen and cable - defense', value: 'apocalypse horsemen and cable - defense'}
			)),
	async execute(interaction) {
		var postUrl = null;
		var youtubeUrl = null;
		var imageUrl = null;

		await get(child(dbref, '/infographics/arena/' + interaction.options.getString("arena-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

		await get(child(dbref, '/infographics/arena/' + interaction.options.getString("arena-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		if(interaction.options.getString("arena-team") === 'arena meta horsemen tangled web' || interaction.options.getString("arena-team") === 'arena defense tangled web emma eternals'){
			await get(child(dbref, '/infographics/arena/' + interaction.options.getString("arena-team") + '/youtube-url')).then((snapshot) => {
				if (snapshot.exists()){
					youtubeUrl = snapshot.val();

				} else {
					youtubeUrl = "Not found";
				}
			})

			const embedSent = new EmbedBuilder()
			.setTitle(interaction.options.getString("arena-team"))
			.setFields(
				{name: 'Detailed Guide', value: postUrl},
				{name: 'Youtube video', value: youtubeUrl}
			)
			.setImage(imageUrl)

			try{
				await interaction.channel.send({embeds: [embedSent]})
			} catch(err){
			await interaction.reply('Inform the Admin of your Discord server to give me required permissions. We cannot stop Ultimus like this!');
			catchErr(err);
			}
		}
		else if(interaction.options.getString("arena-team") === 'arena offense tangled web kang dormammu rogue' || interaction.options.getString("arena-team") === 'arena offense tangled web kang dormammu red hulk'
					|| interaction.options.getString("arena-team") === 'arena offense horsemen apocalypse kang' || interaction.options.getString("arena-team") === 'arena defense horsemen apocalypse emma'
					|| interaction.options.getString("arena-team") === 'arena offense horsemen apocalypse and nick furry' || interaction.options.getString("arena-team") === 'arena defense horsemen apocalypse absorbing men and doctor doom') {
			const embedSent = new EmbedBuilder()
			.setTitle(interaction.options.getString("arena-team"))
			.setImage(imageUrl)

			try{
				await interaction.channel.send({embeds: [embedSent]})
			} catch(err){
			await interaction.reply('Inform the Admin of your Discord server to give me required permissions. We cannot stop Ultimus like this!');
			catchErr(err);
			}
		}
		else{
			const embedSent = new EmbedBuilder()
			.setTitle(interaction.options.getString("arena-team"))
			.setFields(
				{name: 'Detailed Guide', value: postUrl},
			)
			.setImage(imageUrl)
	
			try{
				await interaction.channel.send({embeds: [embedSent]})
			} catch(err){
			await interaction.reply('Inform the Admin of your Discord server to give me required permissions. We cannot stop Ultimus like this!');
			catchErr(err);
			}
		}

		try{
			await interaction.reply('Good luck Commander!');
		} catch(err){
			await interaction.reply('Permissions required for this channel!');
		}
	},
};
