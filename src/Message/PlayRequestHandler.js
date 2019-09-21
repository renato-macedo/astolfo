/* eslint-disable no-console */
const axios = require('axios');

module.exports = async (searchText, messsageFromUser, queue) => {
  const connection = await messsageFromUser.member.voice.channel
    .join()
    .catch((err) => {
      console.log(err.message);
      messsageFromUser.channel.send('Cannot connect to the channel');
    });
  if (queue.inialized === false) {
    console.log('iniciando a queue');
    queue.init(connection, messsageFromUser.channel);
  }

  const queryResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchText}&key=${process.env.YOUTUBE_API_KEY}`).catch(err => console.log(err.message));
  const { videoId } = queryResponse.data.items[0].id;
  const { title } = queryResponse.data.items[0].snippet;
  console.log(title);


  queue.add({ title, url: `https://www.youtube.com/watch?v=${videoId}` });
};
