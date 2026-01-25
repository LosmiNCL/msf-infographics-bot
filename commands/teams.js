const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
    data: new SlashCommandBuilder()
    .setName('teams')
    .setDescription('Choose a Team')
    .addStringOption(option =>
        option.setName('team-name')
        .setDescription('Name of the Team')
        .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = ['galactic council', 'retcon', 'winter guard', 'new mutant', 'immortal weapon',
                        'brimstone', 'insidious six', 'secret warrior', 'hellfire club', 'fantastic four mcu',
                        'accursed', 'thunderbolt', 'vigilante', 'starjammer', 'phoenix force',
                        'liberty', 'immortal x-men', 'mighty avenger', 'uncanny avenger', 'absolute a-force',
                        'astral', 'nightstalker', 'orchis', 'mercs for money', 'annihilator',
                        'illuminati', 'alpha flight', 'out of time', 'spider-society', 'cabal',
                        'hive-mind', 'x-treme x-men', 'superior six', 'p.e.g.a.s.u.s.', 'undying',
                        'new avenger', 'sinister six', 'secret defender', 'darkhold', 'death seed',
                        'bifrost', 'a-force', 'unlimited x-men', 'gamma', 'war dog',
                        'marauder', 'infinity watch', 'hero asgardians', 'rebirth', 'black order',
                        'bionic avenger', 'secret avengers', 'ravagers', 'tangled web', 'web-warrior',
                        'new warrior', 'dark hunter', 'young avenger', 'knowhere', 'masters of evil',
                        'invader', 'infestation', 'shadowland', 'pym tech', 'underworld',
                        'weapon x', 'x-factor', 'uncanny x-men', 'heroes for hire', 'symbiotes',
                        'x-force'];
        const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));
        let options;
        if (filtered.length > 10) {
            options = filtered.slice(0, 10);
        } else {
            options = filtered;
        }
        await interaction.respond(
            options.map((choice) => ({ name: choice, value: choice })),
        )
    },
    async execute(interaction) {

		var imageUrl = null;
		var postUrl = null;

        let apostrophChecker = interaction.options.getString("team-name").toLowerCase();

        if(apostrophChecker === 'p.e.g.a.s.u.s.'){
            apostrophChecker = 'pegasus';
        }
        
        await get(child(dbref, '/infographics/teams/' + apostrophChecker + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

		await get(child(dbref, '/infographics/teams/' + apostrophChecker + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("team-name").toLowerCase())
		.setFields(
			{name: 'Detailed Guide', value: postUrl},
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