const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beta')
        .setDescription('Teams for the Beta Raids')
        .addStringOption(option =>
             option.setName('beta-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'tech', value: 'tech'},
                {name: 'mystic', value: 'mystic'},
				{name: 'skill', value: 'skill'},
				{name: 'mutant', value: 'mutant'},
				{name: 'bio', value: 'bio'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

        await get(child(dbref, '/infographics/beta/' + interaction.options.getString("beta-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/beta/' + interaction.options.getString("beta-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("beta-team"))
		.setFields(
			{name: 'Raid List', value: postUrl},
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};