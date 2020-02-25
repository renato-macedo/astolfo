/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

/*
  Data structure for handling music requests
*/
// const ytdl = require('ytdl-core-discord');
const ytdl = require('ytdl-core');

class SongQueue {
  constructor() {
    this.connection = null;
    this.requestChannel = null;
    this.queue = [];
    this.initialized = false;
  }

  init(connection, requestChannel) {
    this.connection = connection;
    this.requestChannel = requestChannel;
    this.initialized = true;
  }

  async playSong(url) {
    // await this.connection.play(await ytdl(url), { type: 'opus' }).on('finish', callback);
    const dispatcher = this.connection.play(ytdl(url), { highWaterMark: 50 });

    dispatcher.on('end', () => {
      this.queue.shift();
      this.checkQueueStatus();
    });


    dispatcher.on('error', console.error);
  }

  async add(song) {
    if (this.queue.length === 10) {
      this.requestChannel.send('Queue reached its limit');
      return;
    }

    // add the song to the queue
    this.queue.push(song);


    // if the queue has only one song, just play it
    if (this.queue.length === 1) {
      await this.playSong(song.url);
    } else if (song.title) {
      // else send a custom message, the song will be played when the current finish
      await this.requestChannel.send(`${song.title} added to playlist`);
    } else {
      await this.requestChannel.send('Request added to playlist');
    }
  }

  async checkQueueStatus() {
    // if the queue still have something to play

    if (this.queue.length >= 1) {
      const nextSong = this.queue[0];
      if (nextSong.title) {
        await this.requestChannel.send(`Now playing ${nextSong.title}`);
      }
      this.playSong(nextSong.url);
    }

    // if the queue is empty
    if (this.queue.length === 0) {
      this.requestChannel.send('End of playlist');
    }
  }

  getLength() {
    return this.queue.length;
  }

  getActiveSong() {
    return this.activeElem;
  }

  next() {
    console.log('Current queue', this.queue);
    if (this.queue.length === 0) {
      return this.requestChannel.send('No songs in playlist');
    }
    this.queue.shift();
    return this.checkQueueStatus();
  }

  remove(title) {
    if (title) {
      this.queue = this.queue.filter(elem => elem.title !== title);
    } else {
      this.queue.pop();
    }
  }
}

module.exports = new SongQueue();
