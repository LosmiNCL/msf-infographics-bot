const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamma')
        .setDescription('Teams for the Gamma Raids')
        .addStringOption(option =>
             option.setName('gamma-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'avenger guardian spider-verse', value: 'avenger guardian spider-verse'},
                {name: 'brotherhood mercenary x-men', value: 'brotherhood mercenary x-men'},
				{name: 'defender heroes for hire hydra mercenary', value: 'defender heroes for hire hydra mercenary'},
				{name: 'guardian x-men mercenary', value: 'guardian x-men mercenary'},
				{name: 'kree pym tech', value: 'kree pym tech'},
				{name: 'kree spider-verse guardian', value: 'kree spider-verse guardian'},
				{name: 'pym tech wakandan', value: 'pym tech wakandan'},
				{name: 'shield aim brotherhood', value: 'shield aim brotherhood'},
				{name: 'shield wakandan defender heroes for hire', value: 'shield wakandan defender heroes for hire'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

        await get(child(dbref, '/infographics/gamma/' + interaction.options.getString("gamma-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/gamma/' + interaction.options.getString("gamma-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("gamma-team"))
		.setFields(
			{name: 'Raid List', value: postUrl},
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};