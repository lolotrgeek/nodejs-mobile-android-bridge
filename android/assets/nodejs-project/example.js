console.log('The node project has started.');

// Require the 'native-bridge' to enable communications between the
// Node.js app and the Native app.
const native = require('./native-bridge');

// Send a message to Native.
native.channel.send('main.js loaded');

// Post an event to Native.
native.channel.post('started');

// Post an event with a message.
native.channel.post('started', 'main.js loaded');

// A sample object to show how the channel supports generic
// JavaScript objects.
class Reply {
  constructor(replyMsg, originalMsg) {
    this.reply = replyMsg;
    this.original = originalMsg;
  }
};

// Listen to messages from Native.
native.channel.on('message', (msg) => {
  console.log('[node] MESSAGE received: "%s"', msg);
  // Reply sending a user defined object.
  native.channel.send(new Reply('Message received!', msg));
});

// Listen to event 'myevent' from Native.
native.channel.on('myevent', (msg) => {
  console.log('[node] MYEVENT received with message: "%s"', msg);
});

// Handle the 'pause' and 'resume' events.
// These are events raised automatically when the app switched to the
// background/foreground.
native.app.on('pause', (pauseLock) => {
  console.log('[node] app paused.');
  pauseLock.release();
});

native.app.on('resume', () => {
  console.log('[node] app resumed.');
  native.channel.post('engine', 'resumed');
});

native.app.on('alive', () => {
  console.log('[node] app alive.');
});
