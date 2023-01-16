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
				{name: 'arena meta horsemen tangled web', value: 'arena meta horsemen tangled web'},
				{name: 'arena defense horsemen dormammu', value: 'arena defense horsemen dormammu'},
				{name: 'arena defense tangled web emma dormammu red hulk', value: 'arena defense tangled web emma dormammu red hulk'},
				{name: 'arena defense emma dormammu rogue', value: 'arena defense emma dormammu rogue'},
				{name: 'arena defense tangled web emma eternals', value: 'arena defense tangled web emma eternals'}
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
