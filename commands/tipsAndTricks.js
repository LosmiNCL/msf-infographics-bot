const { SlashCommandBuilder, EmbedBuilder, hyperlink } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tips-and-tricks')
        .setDescription('Tips and Tricks')
        .addStringOption(option =>
             option.setName('tips-and-tricks')
             .setDescription('Tips and Tricks')
             .setRequired(true)
             .addChoices(
                {name: 'general hoarding tips', value: 'general hoarding tips'}
             )),
    async execute(interaction) {

		var imageUrl = null;
        var formattedImageUrl = null;

        await get(child(dbref, '/infographics/tips-and-tricks/' + interaction.options.getString("tips-and-tricks") + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

        var commandName = interaction.options.getString("tips-and-tricks");
        formattedImageUrl = hyperlink(commandName + ' infographic', imageUrl);



		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("tips-and-tricks"))
		.setFields(
			{name: 'Infographic available at: ', value: formattedImageUrl},
		)

		try{
			await interaction.channel.send({embeds: [embedSent]});

			await interaction.reply('Good luck Commander!');
			
		} catch(err){
			await interaction.reply('Inform the Admin of your Discord server to give me required permissions. We cannot stop Ultimus like this!');
			catchErr(err);
		}
    },
};