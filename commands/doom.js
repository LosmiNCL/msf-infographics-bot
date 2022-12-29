const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('doom')
        .setDescription('Teams for the Doom Raids')
        .addStringOption(option =>
             option.setName('doom-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'tech', value: 'tech'},
                {name: 'skill', value: 'skill'},
				{name: 'mystic', value: 'mystic'},
				{name: 'bio 1', value: 'bio 1'},
				{name: 'mutant', value: 'mutant'},
				{name: 'bio 2', value: 'bio 2'},

             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

        await get(child(dbref, '/infographics/doom/' + interaction.options.getString("doom-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/doom/' + interaction.options.getString("doom-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("doom-team"))
		.setFields(
			{name: 'Raid List', value: postUrl},
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};