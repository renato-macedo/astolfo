/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const MessageHandler = require('./MessageHandler');
// const SongQueue = require('./Structures/SongQueue');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// read file names inside commands folder
const commandFiles = fs.readdirSync(path.resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));


commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
});


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// const queue = new SongQueue();

client.on('message', message => MessageHandler(message, client));
client.login(process.env.BOT_TOKEN);
