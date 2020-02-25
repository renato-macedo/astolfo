
module.exports = {
  name: 'leave',
  description: 'leave',
  execute(message, args) {
    message.member.voice.channel.leave();
  },
};
