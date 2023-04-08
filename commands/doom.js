const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('doom')
        .setDescription('Teams for the Doom Raids')
        .addStringOption(option =>
             option.setName('doom-team')
             .setDescription('Name of the team')
             .setRequired(true)
             .addChoices(
				{name: 'test', value: 'test'},
				{name: 'skill - invaders', value: 'skill - invaders'},
                {name: 'tech', value: 'tech'},
                {name: 'skill', value: 'skill'},
				{name: 'mystic', value: 'mystic'},
				{name: 'bio 1', value: 'bio 1'},
				{name: 'mutant', value: 'mutant'},
				{name: 'bio 2', value: 'bio 2'},

             )),
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

        await get(child(dbref, '/infographics/doom/' + interaction.options.getString("doom-team") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

		await get(child(dbref, '/infographics/doom/' + interaction.options.getString("doom-team") + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("doom-team"))
		.setFields(
			{name: 'Raid List', value: postUrl},
		)
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