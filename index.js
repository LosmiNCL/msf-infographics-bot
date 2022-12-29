const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const firebase = require('firebase/app');
const database = require('firebase/database');
const { getAuth } = require('firebase/auth');

const {initializeApp} = require('firebase/compat/app');

const { getDatabase, ref, get, child } = require('firebase/database');
const { channel } = require('diagnostics_channel');

const firebaseConfig = {
	apiKey: "AIzaSyADmYEPD-lWPqXaMjlRROCrz_Kl-zprtjA",
	authDomain: "msf-discord-bot.firebaseapp.com",
	databaseURL: "https://msf-discord-bot-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "msf-discord-bot",
	storageBucket: "msf-discord-bot.appspot.com",
	messagingSenderId: "59125595521",
	appId: "1:59125595521:web:6646fe42c356aa41b13c80",
	measurementId: "G-D5YNRELPN1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
const dbref = ref(db);

module.exports = {firebase, database, app, auth, db, dbref}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.BOT_TOKEN)