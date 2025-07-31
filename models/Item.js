const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  nfcCode: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  reference: { type: String },
  quantity: { type: Number, default: 0 }
});

module.exports = mongoose.model('Item', ItemSchema);
