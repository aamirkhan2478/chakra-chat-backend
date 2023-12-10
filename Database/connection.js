const mongoose = require('mongoose');
const DB = process.env.MONGO_URL;
mongoose.connect(
  DB,
  async () => {
    try {
      await console.log('Connection Successfully');
    } catch (error) {
      console.error('Connection Error');
    }
  }
);