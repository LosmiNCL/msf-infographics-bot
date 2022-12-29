const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ultimus-seven')
        .setDescription('Teams for the Ultimus Raids')
        .addStringOption(option =>
             option.setName('ultimus-seven-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'custom raid team', value: 'custom raid team'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

        await get(child(dbref, '/infographics/ultimus7/' + interaction.options.getString("ultimus-seven-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/ultimus7/' + interaction.options.getString("ultimus-seven-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("ultimus-seven-team"))
		.setFields(
			{name: 'Raid List', value: postUrl},
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};