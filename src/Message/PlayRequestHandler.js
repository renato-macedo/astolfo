/* eslint-disable no-console */
const axios = require('axios');

module.exports = async (searchText, messsageFromUser, queue) => {
  if (messsageFromUser.member.voice.channel) {
    const connection = await messsageFromUser.member.voice.channel
      .join()
      .catch((err) => {
        console.log(err.message);
        messsageFromUser.channel.send('Cannot connect to the channel');
      });
    if (queue.initialized === false) {
      console.log('iniciando a queue');
      queue.init(connection, messsageFromUser.channel);
    }
    if (searchText.split('/watch?v=')[1]) {
      queue.add({ title: '', url: `https://www.youtube.com/watch?v=${searchText.split('/watch?v=')[1]}` });
      return;
    }
    const queryResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${searchText}&key=${process.env.YOUTUBE_API_KEY}`).catch(err => console.log(err.message));
    const { data } = queryResponse;
    if (data.items.length === 0) {
      messsageFromUser.channel.send('I couldn\'t find anything for your request');
      return;
    }
    const { videoId } = queryResponse.data.items[0].id;
    const { title } = queryResponse.data.items[0].snippet;
    console.log(title);


    queue.add({ title, url: `https://www.youtube.com/watch?v=${videoId}` });
  } else {
    messsageFromUser.channel.send('You must be in a voice channel to make a request');
  }
};
