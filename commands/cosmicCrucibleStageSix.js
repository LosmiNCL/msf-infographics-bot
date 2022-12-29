const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cc6')
        .setDescription('Teams for the Cosmic Crucible Stage 6')
        .addStringOption(option =>
             option.setName('cc6-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'custom legendary', value: 'custom legendary'},
                {name: 'darkhold', value: 'darkhold'},
				{name: 'death seed', value: 'death seed'},
				{name: 'unlimited x-men', value: 'unlimited x-men'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrlDefSetup = null;
		var postUrlCounters = null;

        await get(child(dbref, '/infographics/cosmic-crucible-s6/' + interaction.options.getString("cc6-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/cosmic-crucible-s6/' + interaction.options.getString("cc6-team") + '/post-url-def-setup')).then((snapshot) => {
			if (snapshot.exists()){
				postUrlDefSetup = snapshot.val();

			} else {
				postUrlDefSetup = "Not found";
			}
		})

		await get(child(dbref, '/infographics/cosmic-crucible-s6/' + interaction.options.getString("cc6-team") + '/post-url-counters')).then((snapshot) => {
			if (snapshot.exists()){
				postUrlCounters = snapshot.val();

			} else {
				postUrlCounters = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("cc6-team"))
		.setFields(
			{name: 'Cosmic Crucible - the best Defensive Setup', value: postUrlDefSetup},
			{name: 'Cosmic Crucible - Team Counters', value: postUrlCounters}
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};