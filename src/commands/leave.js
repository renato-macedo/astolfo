
module.exports = {
  name: 'leave',
  description: 'leave',
  execute(message) {
    message.member.voice.channel.leave();
  },
};
