/* eslint-disable no-console */
const axios = require('axios');
const queue = require('../Structures/SongQueue');

module.exports = {
  name: 'play',
  description: 'Play a song from youtube',
  async execute(message, args) {
    const searchText = args[0];
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel
        .join()
        .catch((err) => {
          console.log(err.message);
          message.channel.send('Cannot connect to the channel');
        });
      if (queue.initialized === false) {
        console.log('iniciando a queue');
        queue.init(connection, message.channel);
      }
      if (searchText.split('/watch?v=')[1]) {
        queue.add({ title: '', url: `https://www.youtube.com/watch?v=${searchText.split('/watch?v=')[1]}` });
        return;
      }

      const queryResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURI(args.join(' '))}&type=video&key=${process.env.YOUTUBE_API_KEY}`).catch(err => console.log(err.message));

      if (!queryResponse || queryResponse.data.items.length === 0) {
        message.channel.send('I couldn\'t find anything for your request');
        return;
      }
      const firstResult = queryResponse.data.items[0];
      const { videoId } = firstResult.id;
      const { title } = firstResult.snippet;
      console.log(title);


      queue.add({ title, url: `https://www.youtube.com/watch?v=${videoId}` });
    } else {
      message.channel.send('You must be in a voice channel to make a request');
    }
  },
};
