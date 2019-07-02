/* eslint-disable no-console */

const axios = require('axios');
const ytdl = require('ytdl-core');
const { Client } = require('discord.js');

const { YOUTUBE_API_KEY, BOT_TOKEN } = require('./config.json');

const client = new Client();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (message.content.startsWith('?play')) {
    const search = message.content.split('?play')[1];
    message.channel.send(`Searching for ${message.content.split('?play')[1]}`);
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${YOUTUBE_API_KEY}`).then((response) => {
      // console.log(response.data);
      const { videoId } = response.data.items[0].id;
      // message.channel.send(`I found https://www.youtube.com/watch?v=${videoId}`);
      message.member.voice.channel.join().then((connection) => {
        connection.play(ytdl(`https://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' })).on('finish', () => {
          message.channel.send('Song Finished');
        });
      });
    });
  }

  if (message.content.startsWith('?leave')) {
    message.member.voice.channel.leave();
  }
});

client.login(BOT_TOKEN);
