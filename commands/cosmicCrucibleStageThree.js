const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cc3')
        .setDescription('Teams for the Cosmic Crucible Stage 3')
        .addStringOption(option =>
             option.setName('cc3-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
				{name: 'knowhere', value: 'knowhere'},
                {name: 'knowhere and apocalypse', value: 'knowhere and apocalypse'},
				{name: 'infinity watch', value: 'infinity watch'},
				{name: 'hero asgardian', value: 'hero asgardian'}
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrlDefSetup = null;

        await get(child(dbref, '/infographics/cosmic-crucible-s3/' + interaction.options.getString("cc3-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

		await get(child(dbref, '/infographics/cosmic-crucible-s3/' + interaction.options.getString("cc3-team") + '/post-url-def-setup')).then((snapshot) => {
			if (snapshot.exists()){
				postUrlDefSetup = snapshot.val();

			} else {
				postUrlDefSetup = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("cc3-team"))
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