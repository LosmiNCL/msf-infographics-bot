const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scourge')
        .setDescription('Teams for the Scourges')
        .addStringOption(option =>
             option.setName('scourge-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'war scourge hero asgardians', value: 'war scourge hero asgardians'},
                {name: 'pestilence scourge web warriors', value: 'pestilence scourge web warriors'},
				{name: 'famine scourge young avengers', value: 'famine scourge young avengers'},
				{name: 'death scourge wakandan', value: 'death scourge wakandan'},
				{name: 'death scourge bionic avengers', value: 'death scourge bionic avengers'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;
		var youtubeUrl = null;

        await get(child(dbref, '/infographics/scourge/' + interaction.options.getString("scourge-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

		await get(child(dbref, '/infographics/scourge/' + interaction.options.getString("scourge-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/scourge/' + interaction.options.getString("scourge-team") + '/youtube-url')).then((snapshot) => {
			if (snapshot.exists()){
				youtubeUrl = snapshot.val();

			} else {
				youtubeUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("scourge-team"))
		.setFields(
			{name: 'Detailed Guide', value: postUrl},
			{name: 'Youtube video', value: youtubeUrl}
		)
        .setImage(imageUrl)

		try{
			await interaction.channel.send({embeds: [embedSent]});

			await interaction.reply('Good luck Commander!');
			
		} catch(err){
			await interaction.reply('Inform the Admin of your Discord server to give me required permissions. We cannot stop Ultimus like this!');
			catchErr(err);
		}
    },
};