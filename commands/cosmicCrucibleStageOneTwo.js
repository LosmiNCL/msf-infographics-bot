const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cc1-2')
        .setDescription('Teams for the Cosmic Crucible Stage 1 and 2')
        .addStringOption(option =>
             option.setName('cc1-2-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'black order', value: 'black order'},
                {name: 'eternals', value: 'eternals'},
				{name: 'infinity watch', value: 'infinity watch'},
				{name: 'x-factor', value: 'x-factor'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrlDefSetup = null;
		var postUrlCounters = null;

        await get(child(dbref, '/infographics/cosmic-crucible-s1-s2/' + interaction.options.getString("cc1-2-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/cosmic-crucible-s1-s2/' + interaction.options.getString("cc1-2-team") + '/post-url-def-setup')).then((snapshot) => {
			if (snapshot.exists()){
				postUrlDefSetup = snapshot.val();

			} else {
				postUrlDefSetup = "Not found";
			}
		})

		await get(child(dbref, '/infographics/cosmic-crucible-s1-s2/' + interaction.options.getString("cc1-2-team") + '/post-url-counters')).then((snapshot) => {
			if (snapshot.exists()){
				postUrlCounters = snapshot.val();

			} else {
				postUrlCounters = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("cc1-2-team"))
		.setFields(
			{name: 'Cosmic Crucible - the best Defensive Setup', value: postUrlDefSetup},
			{name: 'Cosmic Crucible - Team Counters', value: postUrlCounters}
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};