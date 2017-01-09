const mongoose = require('mongoose');

const mongodbUrlDefault = 'mongodb://localhost/react-template';

module.exports = {
  start: (mongodbUrl) => {
    const dbUrl = mongodbUrl || mongodbUrlDefault;

    mongoose.connect(dbUrl);
    // db connection and error logging
    const db = mongoose.connection;
    db.once('open', function() {
      console.log('Connection established with MongoDB at: ' + dbUrl);
    });
    db.on('error', console.error.bind(console, 'Connection error: unable to establish connection with MongoDB at: ' + dbUrl));
    db.on('diconnected', mongoose.connect);
  }
};
