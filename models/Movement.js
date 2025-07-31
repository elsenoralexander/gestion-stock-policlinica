const mongoose = require('mongoose');

const MovementSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  change: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movement', MovementSchema);
