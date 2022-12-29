const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saga')
        .setDescription('Teams for the Sagas')
        .addStringOption(option =>
             option.setName('saga-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
                {name: 'war saga gamma', value: 'war saga gamma'},
                {name: 'famine saga unlimited x-men', value: 'famine saga unlimited x-men'},
				{name: 'pestilence saga darkhold', value: 'pestilence saga darkhold'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;
		var youtubeUrl = null;
		var postAllSagasUrl = null;
		var youtubeUrlHeroic = null;
		//post-all-sagas-url

		if(interaction.options.getString("saga-team") === 'war saga gamma'){
			await get(child(dbref, '/infographics/saga/' + interaction.options.getString("saga-team") + '/image-url')).then((snapshot) => {
				if (snapshot.exists()){
					imageUrl = snapshot.val();
	
				} else {
					imageUrl = "Not found";
				}
			})
			
			const embedSent = new EmbedBuilder()
			.setTitle(interaction.options.getString("saga-team"))
			.setImage(imageUrl)

			interaction.channel.send({embeds: [embedSent]})

			await interaction.reply('Good luck Commander!');

		} else {

			await get(child(dbref, '/infographics/saga/' + interaction.options.getString("saga-team") + '/image-url')).then((snapshot) => {
				if (snapshot.exists()){
					imageUrl = snapshot.val();
	
				} else {
					imageUrl = "Not found";
				}
			})
	
			await get(child(dbref, '/infographics/saga/' + interaction.options.getString("saga-team") + '/post-url')).then((snapshot) => {
				if (snapshot.exists()){
					postUrl = snapshot.val();
	
				} else {
					postUrl = "Not found";
				}
			})

			await get(child(dbref, '/infographics/saga/' + interaction.options.getString("saga-team") + '/post-all-sagas-url')).then((snapshot) => {
				if (snapshot.exists()){
					postAllSagasUrl = snapshot.val();
	
				} else {
					postAllSagasUrl = "Not found";
				}
			})
	
			await get(child(dbref, '/infographics/saga/' + interaction.options.getString("saga-team") + '/youtube-url')).then((snapshot) => {
				if (snapshot.exists()){
					youtubeUrl = snapshot.val();
	
				} else {
					youtubeUrl = "Not found";
				}
			})

			if(interaction.options.getString("saga-team") === 'pestilence saga darkhold'){
				await get(child(dbref, '/infographics/saga/' + interaction.options.getString("saga-team") + '/youtube-url-heroic')).then((snapshot) => {
					if (snapshot.exists()){
						youtubeUrlHeroic = snapshot.val();
		
					} else {
						youtubeUrlHeroic = "Not found";
					}
				})
			}
	

			if(interaction.options.getString("saga-team") === 'pestilence saga darkhold'){
				const embedSent = new EmbedBuilder()
				.setTitle(interaction.options.getString("saga-team"))
				.setFields(
					{name: 'Detailed Guide', value: postUrl},
					{name: 'List of Sagas', value: postAllSagasUrl},
					{name: 'Youtube video - hard difficulty', value: youtubeUrl},
					{name: 'Youtube video - heroic difficulty', value: youtubeUrlHeroic},
				)
				.setImage(imageUrl)
			} else{
				const embedSent = new EmbedBuilder()
				.setTitle(interaction.options.getString("saga-team"))
				.setFields(
					{name: 'Detailed Guide', value: postUrl},
					{name: 'List of Sagas', value: postAllSagasUrl},
					{name: 'Youtube video', value: youtubeUrl},
				)
				.setImage(imageUrl)
			}

			interaction.channel.send({embeds: [embedSent]})
	
			await interaction.reply('Good luck Commander!');
		}

    },
};
