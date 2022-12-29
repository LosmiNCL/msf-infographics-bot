const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('challenge')
        .setDescription('Teams for Challenges')
        .addStringOption(option =>
             option.setName('difficulty')
             .setDescription('Choose Difficulty')
             .setRequired(true)
             .addChoices(
                {name: 'difficulty 4', value: 'difficulty 4'},
                {name: 'difficulty 5', value: 'difficulty 5'},
             )),
    async execute(interaction) {

		var postUrl = null;
		var youtubeUrl = null;

		await get(child(dbref, '/infographics/challenge/' + interaction.options.getString("difficulty") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/challenge/' + interaction.options.getString("difficulty") + '/youtube-url')).then((snapshot) => {
			if (snapshot.exists()){
				youtubeUrl = snapshot.val();

			} else {
				youtubeUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("difficulty"))
		.setFields(
			{name: 'Detailed Guide', value: postUrl},
			{name: 'Youtube video', value: youtubeUrl}
		)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};
