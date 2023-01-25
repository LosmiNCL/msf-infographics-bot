const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
                {name: 'war zone milestone', value: 'war zone milestone'},
				{name: 'woman out of time', value: 'woman out of time'},
				{name: 'rising star and battlefield ready events', value: 'rising star and battlefield ready events'},
				{name: 'super patriot weekly events 4th week', value: 'super patriot weekly events 4th week'}
             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

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

		if(interaction.options.getString("event") === 'super patriot weekly events 4th week'){
			const embedSent = new EmbedBuilder()
			.setTitle(interaction.options.getString("event"))
			.setFields(
				{name: 'Detailed guide available at: ', value: postUrl},
				{name: 'Infographic available at: ', value: imageUrl}
			)
		}
		else{
			const embedSent = new EmbedBuilder()
			.setTitle(interaction.options.getString("event"))
			.setFields(
				{name: 'More info: ', value: postUrl},
			)
			.setImage(imageUrl)
		}

		try{
			await interaction.channel.send({embeds: [embedSent]});

			await interaction.reply('Good luck Commander!');
			
		} catch(err){
			await interaction.reply('Inform the Admin of your Discord server to give me required permissions. We cannot stop Ultimus like this!');
			catchErr(err);
		}
    },
};
