const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waro')
        .setDescription('Teams for the War Offense')
        .addStringOption(option =>
             option.setName('waro-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'a force and silver surfer', value: 'a force and silver surfer'},
                {name: 'bionic avengers', value: 'bionic avengers'},
				{name: 'dark hunter', value: 'dark hunter'},
                {name: 'darkhold', value: 'darkhold'},
                {name: 'death seed', value: 'death seed'},
				{name: 'eternals and new warriors', value: 'eternals and new warriors'},
                {name: 'gamma', value: 'gamma'},
                {name: 'infinity watch', value: 'infinity watch'},
				{name: 'ravagers and t\'challa', value: 'ravagers and t\'challa'},
                {name: 'shadowland', value: 'shadowland'},
                {name: 'underworld', value: 'underworld'},
				{name: 'undying and tangled web', value: 'undying and tangled web'},
                {name: 'unlimited x-men', value: 'unlimited x-men'},
                {name: 'war dogs', value: 'war dogs'},
                {name: 'weapon x', value: 'weapon x'},
                {name: 'x-factor and kestrel', value: 'x-factor and kestrel'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;
        var postUrlCounters = null;

        let apostrophChecker = interaction.options.getString("waro-team").toLowerCase();

        if(apostrophChecker === 'ravagers and t\'challa'){
            apostrophChecker = apostrophChecker.slice(0,14) + apostrophChecker.slice(15);
        }

        await get(child(dbref, '/infographics/war-offense/' + apostrophChecker + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/war-offense/' + apostrophChecker + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})


		await get(child(dbref, '/infographics/war-offense/' + apostrophChecker + '/post-url-counters')).then((snapshot) => {
			if (snapshot.exists()){
				postUrlCounters = snapshot.val();

			} else {
				postUrlCounters = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("waro-team"))
		.setFields(
			{name: 'Detailed Guide', value: postUrl},
            {name: 'Counters', value: postUrlCounters},
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};