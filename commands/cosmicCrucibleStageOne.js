const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cc1')
        .setDescription('Teams for the Cosmic Crucible Stage 1')
        .addStringOption(option =>
             option.setName('cc1-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
				{name: 'undying and dormammu', value: 'undying and dormammu'},
				{name: 'infinity watch', value: 'infinity watch'},
				{name: 'gamma', value: 'gamma'},
				{name: 'gamma and apocalypse', value: 'gamma and apocalypse'}
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrlDefSetup = null;

        await get(child(dbref, '/infographics/cosmic-crucible-s1/' + interaction.options.getString("cc1-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

		await get(child(dbref, '/infographics/cosmic-crucible-s1/' + interaction.options.getString("cc1-team") + '/post-url-def-setup')).then((snapshot) => {
			if (snapshot.exists()){
				postUrlDefSetup = snapshot.val();

			} else {
				postUrlDefSetup = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("cc1-team"))
		.setFields(
			{name: 'Cosmic Crucible - the best Defensive Setup', value: postUrlDefSetup}
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