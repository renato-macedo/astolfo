/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

/*
  Data structure for handling music requests
*/
const ytdl = require('ytdl-core');

class SongQueue {
  constructor() {
    this.connection = null;
    this.requestChannel = null;
    this.queue = [];
    this.inialized = false;
  }

  init(connection, requestChannel) {
    this.connection = connection;
    this.requestChannel = requestChannel;
    this.inialized = true;
  }

  async playSong(song, callback) {
    await this.connection.play(ytdl(song.url, { filter: 'audioonly' })).on('finish', callback);
  }

  async add(song) {
    if (this.queue.length === 10) {
      this.requestChannel.send('Queue reached its limit');
      return;
    }

    if (this.queue.length === 0) {
      this.queue.push(song);
      await this.requestChannel.send(`${song.title} added to playlist`);
      console.log('aaaa');
      this.checkQueueStatus();
      // await this.requestChannel.send(`Now Playing ${song.title}`);
    } else {
      this.queue.push(song);
      await this.requestChannel.send(`${song.title} added to playlist`);
    }
  }

  async checkQueueStatus() {
    // if the queue still have something to play
    console.log('Current queue', this.queue);
    if (this.queue.length >= 1) {
      console.log(this.queue[0]);
      const nextSong = this.queue[0];
      await this.requestChannel.send(`Now playing ${nextSong.title}`);
      this.playSong(nextSong, async () => {
        this.queue.shift();
        await this.checkQueueStatus();
      });
    }
    // if the queue has nothing more
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

module.exports = SongQueue;
