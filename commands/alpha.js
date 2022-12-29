const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alpha')
        .setDescription('Teams for the Alpha Raids')
        .addStringOption(option =>
             option.setName('alpha-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'global', value: 'global'},
                {name: 'cosmic', value: 'cosmic'},
				{name: 'city', value: 'city'}
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

        await get(child(dbref, '/infographics/alpha/' + interaction.options.getString("alpha-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/alpha/' + interaction.options.getString("alpha-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("alpha-team"))
		.setFields(
			{name: 'Raid List', value: postUrl},
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};