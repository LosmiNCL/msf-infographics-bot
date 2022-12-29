const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('arena')
		.setDescription('Teams for the Arena')
		.addStringOption(option =>
			option.setName('arena-team')
			.setDescription('Name of the Team')
			.setRequired(true)
			.addChoices(
				{name: 'arena meta horsemen', value: 'arena meta horsemen'},
				{name: 'arena meta eternals', value: 'arena meta eternals'},
			)),
	async execute(interaction) {
		var postUrl = null;
		var youtubeUrl = null;

		await get(child(dbref, '/infographics/arena/' + interaction.options.getString("arena-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

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

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
	},
};