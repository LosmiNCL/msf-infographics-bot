const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ref, child, get } = require('firebase/database');
const { db, dbref } = require('..');

const catchErr = err => {
	console.log(err)
  }

module.exports = {
    data: new SlashCommandBuilder()
    .setName('character')
    .setDescription('Choose a Character')
    .addStringOption(option =>
        option.setName('character-name')
        .setDescription('Name of the Character')
        .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = ['odin', 'omega sentinel', 'nimrod', 'sentinel','thanos endgame',
                        'gorr', 'gladiator', 'ares', 'captain britain', 'hank pym',
                        'black panther shuri','sasquatch', 'northstar', 'guardian', 'old man logan',
                        'daken', 'pandapool', 'spider-man pavitr', 'peni parker', 'peter b parker',
                        'mephisto', 'iron patriot', 'the leader', 'red goblin', 'starbrand',
                        'cosmic ghost rider', 'black knight', 'void knight', 'gwenom', 'nightcrawler',
                        'forge', 'sunspot', 'green goblin classic', 'kraven the hunter', 'lizard',
                        'spider-slayer','juggernaut zombie', 'iron man infinity war', 'darkhawk', 'ironheart mk ii',
                        'tigra' ,'ronin', 'mockingbird', 'photon','ms marvel hard light',
                        'ghost rider robbie','black cat','spider-man big time','vahl' ,'beta ray bill',
                        'sylvie' ,'loki teen' ,'super skrull' ,'korg', 'gwenpool',
                        'nova', 'cosmo', 'thor infinity war', 'star-lord annihilation', 'quicksilver',
                        'captain america wwii', 'bucky barnes', 'union jack', 'iron fist wwii', 'firestar',
                        'apocalypse', 'moonstone', 'kang the conqueror', 'absorbing man',
                        'agent venom', 'archangel', 'captain carter', 'nemesis', 'titania',
                        'us agent', 'captain america', 'ultron', 'winter soldier', 'aim assaulter',
                        'aim infector', 'aim monstrosity', 'aim researcher', 'aim security', 'abomination',
                        'adam warlock', 'agatha harkness', 'agent coulson', 'america chavez', 'ant-man',
                        'anti-venom', 'baron zemo', 'beast', 'bishop', 'black bolt',
                        'black panther', 'black panther 1mm', 'black widow', 'blob', 'brawn',
                        'bullseye', 'cable', 'captain america sam', 'captain marvel', 'carnage',
                        'cloak', 'colleen wing', 'colossus', 'corvus glaive', 'crossbones',
                        'crystal', 'cull obsidian', 'cyclops', 'dagger', 'daredevil',
                        'dark beast', 'dazzler', 'deadpool', 'deathlok', 'deathpool',
                        'doctor doom', 'doctor octopus', 'doctor strange', 'doctor vodoo', 'domino',
                        'dormammu', 'drax', 'ebony maw', 'echo', 'electro',
                        'elektra', 'elsa bloodstone', 'emma frost', 'falcon', 'fantomex',
                        'gambit', 'gamora', 'ghost', 'ghost rider', 'ghost-spider',
                        'graviton', 'green goblin', 'groot', 'hand archer', 'hand assassin',
                        'hand blademaster', 'hand sentry', 'hand sorceress', 'hawkeye', 'heimdall',
                        'hela', 'hulk', 'hulkbuster', 'human torch', 'hydra armored guard',
                        'hydra grenadier', 'hydra rifle trooper', 'hydra scientist', 'hydra sniper', 'iceman',
                        'ikaris', 'invisible woman', 'iron fist', 'iron man', 'iron man zombie',
                        'ironheart', 'jessica jones', 'jubilee', 'juggernaut', 'karnak',
                        'kate bishop', 'kestrel', 'killmonger', 'kingpin', 'kitty pryde',
                        'korath the pursuer', 'kree cyborg', 'kree noble', 'kree oracle', 'kree reaper',
                        'kree royal guard', 'lady deathstrike', 'loki', 'longshot', 'luke cage',
                        'm\'baku', 'madelyne pryor', 'magik', 'magneto', 'mantis',
                        'maria hill', 'mercenary lieutenant', 'mercenary riot guard', 'mercenary sniper', 'mercenary soldier',
                        'mighty thor', 'minn-erva', 'mister fantastic', 'mister negative', 'mister sinister',
                        'misty knight', 'moon knight', 'moondragon', 'morbius', 'mordo',
                        'morgan le fay', 'ms. marvel', 'multiple man', 'mysterio', 'mystique',
                        'nakia', 'namor', 'nebula', 'negasonic', 'nick fury',
                        'nico minoru', 'night nurse', 'nobu', 'okoye', 'omega red',
                        'phoenix', 'phyla-vell', 'polaris', 'proxima midnight', 'psylocke',
                        'punisher', 'pyro', 'quake', 'ravager boomer', 'ravager bruiser',
                        'ravager stitcher', 'red guardian', 'red hulk', 'red skull', 'rescue',
                        'rhino', 'rocket raccoon', 'rogue', 'ronan the accuser', 'shield assault',
                        'shield medic', 'shield operative', 'shield security', 'shield trooper', 'sabretooth',
                        'scarlet spider', 'scarlet witch', 'scientist supreme', 'scream', 'sersi',
                        'shang-chi', 'sharon carter', 'shatterstar', 'she-hulk', 'shocker',
                        'shuri', 'sif', 'silver samurai', 'silver surfer', 'spider-man',
                        'spider-man miles', 'spider-man noir', 'spider-man symbiote', 'spider-man 2099', 'spider-punk',
                        'spider-weaver', 'spider-woman', 'squirrel girl', 'star-lord', 'star-lord t\'Challa',
                        'stature', 'storm', 'strange heartless', 'stryfe', 'sunfire',
                        'swarm', 'taskmaster', 'thanos', 'the thing', 'thor',
                        'toad', 'ultimus', 'valkyrie', 'venom', 'vision',
                        'viv vision', 'vulture', 'war machine', 'wasp', 'white tiger',
                        'wolverine', 'wong', 'x-23', 'yelena belova', 'yellowjacket',
                        'yo-yo', 'yondu'];
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

        let apostrophChecker = interaction.options.getString("character-name").toLowerCase();

        if(apostrophChecker === 'm\'baku'){
            apostrophChecker = apostrophChecker.slice(0,1) + apostrophChecker.slice(2);
        }
        if(apostrophChecker === 'ms. marvel'){
            apostrophChecker = apostrophChecker.slice(0,2) + apostrophChecker.slice(3);
        }
        if(apostrophChecker === 'star-lord t\'challa'){
            apostrophChecker = apostrophChecker.slice(0,11) + apostrophChecker.slice(12);
        }

        await get(child(dbref, '/infographics/character/' + apostrophChecker + '/image-url')).then((snapshot) => {
			if (snapshot.exists()){
				imageUrl = snapshot.val();

			} else {
				imageUrl = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131__480.png";
			}
		})

		await get(child(dbref, '/infographics/character/' + apostrophChecker + '/post-url')).then((snapshot) => {
			if (snapshot.exists()){
				postUrl = snapshot.val();

			} else {
				postUrl = "Not found";
			}
		})

		const embedSent = new EmbedBuilder()
		.setTitle(interaction.options.getString("character-name").toLowerCase())
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