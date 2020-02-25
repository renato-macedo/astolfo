
const queue = require('../Structures/SongQueue');

module.exports = {
  name: 'next',
  description: 'Skip the current song!',
  execute() {
    queue.next();
  },
};
