/* eslint-disable no-console */
const PlayRequestHandler = require('./PlayRequestHandler');

module.exports = async (message, queue) => {
  /*
    For now I think the best approach is separate
    the music commands from the others (which doesn't exist yet).
    So when the user type '?play' for the first time we need to instantiate a new queue
    and we gonna do this inside this module because we need access the same queue when the user
    type '?next'

  */

  if (message.content.startsWith('?play')) {
    const search = message.content.split('?play')[1];
    PlayRequestHandler(search, message, queue);
  }

  if (message.content.startsWith('?next')) {
    queue.next();
  }

  if (message.content.startsWith('?leave')) {
    message.member.voice.channel.leave();
  }

  if (message.content.startsWith('?AYT')) {
    message.channel.send('Yep');
  }
};
