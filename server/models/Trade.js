const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const tradeSchema = new Schema({
  tradeText: {
    type: String,
    required: 'You need to leave a trade!',
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  tradeAuthor: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  comments: [
    {
      commentText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      commentAuthor: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
      },
    },
  ],
});

const Trade = model('Trade', tradeSchema);

module.exports = Trade;
