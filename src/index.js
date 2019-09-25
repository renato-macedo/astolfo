/* eslint-disable no-console */
require('dotenv').config();
const { Client } = require('discord.js');
const MessageHandler = require('./Message/MessageHandler');
const SongQueue = require('./Structures/SongQueue');

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const queue = new SongQueue();
client.on('message', (message) => {
  MessageHandler(message, queue);
});

client.login(process.env.BOT_TOKEN);
