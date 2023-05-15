const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('new-team')
        .setDescription('New Teams')
        .addStringOption(option =>
             option.setName('new-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
				{name: 'new warriors', value: 'new warriors'},
				{name: 'invaders', value: 'invaders'},
                {name: 'masters of evil', value: 'masters of evil'}
             )),
    async execute(interaction) {

		var imageUrl = null;

        await get(child(dbref, '/infographics/new-teams/' + interaction.options.getString("new-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("new-team"))
        .setImage(imageUrl)

		try{
			await interaction.channel.send({embeds: [embedSent]});

			await interaction.reply('Good luck Commander!');
			
		} catch(err){
			await interaction.reply('Inform the Admin of your Discord server to give me required permissions. We cannot stop Ultimus like this!');
			catchErr(err);
		}
    },
};