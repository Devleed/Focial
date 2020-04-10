const io = require('./server').io;

module.exports = (socket) => {
  console.log('connected => ', socket.id);
  io.on('disconnect', () => {
    console.log('disconnected');
  });
};
