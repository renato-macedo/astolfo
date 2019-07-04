/* eslint-disable no-console */
const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const { Client } = require('discord.js');

const app = express();
const { YOUTUBE_API_KEY, BOT_TOKEN } = require('./src/config.json');

const client = new Client();

app.listen(process.env.PORT, () => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on('message', async (message) => {
    if (message.content.startsWith('?play')) {
      const search = message.content.split('?play')[1];

      axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${process.env.YOUTUBE_API_KEY || YOUTUBE_API_KEY}`).then((response) => {
        console.log(response.data);
        const { videoId } = response.data.items[0].id;

        message.channel.send(`Now playing ${response.data.items[0].snippet.title}`);

        message.member.voice.channel.join().then((connection) => {
          connection.play(ytdl(`https://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' })).on('finish', () => {
            message.channel.send('Song Finished');
          });
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err.response.data);
      });
    }

    if (message.content.startsWith('?leave')) {
      message.member.voice.channel.leave();
    }

    if (message.content.startsWith('?AYT')) {
      message.channel.send('Yep');
    }
  });

  client.login(process.env.BOT_TOKEN || BOT_TOKEN);
});

app.get('/', (req, res) => {
  res.send('ok');
});
