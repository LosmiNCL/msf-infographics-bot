const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ward')
        .setDescription('Teams for the War Defense')
        .addStringOption(option =>
             option.setName('ward-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'aim', value: 'aim'},
                {name: 'astonishing x-men', value: 'astonishing x-men'},
				{name: 'black order', value: 'black order'},
                {name: 'darkhold', value: 'darkhold'},
                {name: 'death seed', value: 'death seed'},
				{name: 'emma frost - madelyine pryor - marauders', value: 'emma frost - madelyine pryor - marauders'},
                {name: 'gamma', value: 'gamma'},
                {name: 'hero asgardian', value: 'hero asgardian'},
				{name: 'heroes for hire', value: 'heroes for hire'},
                {name: 'infinity watch', value: 'infinity watch'},
                {name: 'pym tech', value: 'pym tech'},
				{name: 'red skull and hydra', value: 'red skull and hydra'},
                {name: 'shadowlands', value: 'shadowlands'},
                {name: 'tangled web', value: 'tangled web'},
                {name: 'weapon x', value: 'weapon x'},
                {name: 'young avengers', value: 'young avengers'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

        await get(child(dbref, '/infographics/war-defense/' + interaction.options.getString("ward-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/war-defense/' + interaction.options.getString("ward-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("ward-team"))
		.setFields(
			{name: 'Detailed Guide', value: postUrl},
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};