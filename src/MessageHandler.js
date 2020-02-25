/* eslint-disable no-console */
// const PlayRequestHandler = require('./PlayRequestHandler');


const prefix = '?';
module.exports = (message, client) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;


  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();


  if (command === 'args-info') {
    if (!args.length) {
      message.channel.send(`You didn't provide any arguments, ${message.author}!`);
      return;
    }

    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  }

  if (command === 'ping') {
    client.commands.get('ping').execute(message, args);
  } else if (command === 'play') {
    client.commands.get('play').execute(message, args);
  } else if (command === 'leave') {
    client.commands.get('leave').execute(message, args);
  }
  // if (message.content.startsWith('?leave')) {
  //   message.member.voice.channel.leave();
  // }

  // if (message.content.startsWith('?AYT')) {
  //   message.channel.send('Yep');
  // }
};
