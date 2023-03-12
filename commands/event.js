const { SlashCommandBuilder, EmbedBuilder, hyperlink } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('All Events')
        .addStringOption(option =>
             option.setName('event')
             .setDescription('Name of the event')
             .setRequired(true)
             .addChoices(
				{name: 'historic encounter', value: 'historic encounter'},
				{name: "commander's cache", value: "commander's cache"},
				{name: 'cold storage quick resume', value: 'cold storage quick resume'},
				{name: 'cold storage', value: 'cold storage'},
				{name: 'charging station events', value: 'charging station events'},
				{name: 'return to the shadows', value: 'return to the shadows'},
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;
		var formattedImageUrl = null;
		var formattedPostUrl = null;

        await get(child(dbref, '/infographics/event/' + interaction.options.getString("event") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

		await get(child(dbref, '/infographics/event/' + interaction.options.getString("event") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		if(interaction.options.getString("event") === 'war zone milestone' || interaction.options.getString("event") === 'woman out of time'
			|| interaction.options.getString("event") === 'rising star and battlefield ready events'){
				
				var commandName = interaction.options.getString("event");
				formattedPostUrl = hyperlink(commandName + ' details', postUrl);

				const embedSent = new EmbedBuilder()
				.setTitle(interaction.options.getString("event"))
				.setFields(
					{name: 'More info: ', value: formattedPostUrl},
				)
				.setImage(imageUrl)
	
				try{
					await interaction.channel.send({embeds: [embedSent]});
		
					await interaction.reply('Good luck Commander!');
					
				} catch(err){
					await interaction.reply('Inform the Admin of your Discord server to give me required permissions. We cannot stop Ultimus like this!');
					catchErr(err);
				}				
			}
			else{
				var commandName = interaction.options.getString("event");
				formattedImageUrl = hyperlink(commandName + ' infographic', imageUrl);
				formattedPostUrl = hyperlink(commandName + ' details', postUrl);

				const embedSent = new EmbedBuilder()
				.setTitle(interaction.options.getString("event"))
				.setFields(
					{name: 'Detailed guide available at: ', value: formattedPostUrl},
					{name: 'Infographic available at: ', value: formattedImageUrl},
				)
	
				try{
					await interaction.channel.send({embeds: [embedSent]});
		
					await interaction.reply('Good luck Commander!');
					
				} catch(err){
					await interaction.reply('Inform the Admin of your Discord server to give me required permissions. We cannot stop Ultimus like this!');
					catchErr(err);
				}				
			}

    },
};