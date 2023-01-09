const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Weekly and Monthly Events')
        .addStringOption(option =>
             option.setName('event')
             .setDescription('Name of the event')
             .setRequired(true)
             .addChoices(
                //{name: 'super patriot', value: 'super patriot'},
                {name: 'war zone milestone', value: 'war zone milestone'},
                //{name: 'hostile forces web milestone', value: 'hostile forces web milestone'},
				//{name: 'war of shadows quick rumble (underworld)', value: 'war of shadows quick rumble (underworld)'},
                //{name: 'power broker bargain milestone - main weekly event', value: 'power broker bargain milestone - main weekly event'},
                //{name: 'war inc. web milestone', value: 'war inc. web milestone'},
                //{name: 'arachni ambush quick rumble (web-warriors)'}
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

        await get(child(dbref, '/infographics/event/' + interaction.options.getString("event") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "Not found";
			}
		})

		await get(child(dbref, '/infographics/event/' + interaction.options.getString("event") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("event"))
		.setFields(
			{name: 'More info: ', value: postUrl},
		)
        .setImage(imageUrl)

        interaction.channel.send({embeds: [embedSent]})

		await interaction.reply('Good luck Commander!');
    },
};
