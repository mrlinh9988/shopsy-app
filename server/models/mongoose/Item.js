const mongoose = require('mongoose');

const itemShema = mongoose.Schema({
  sku: { type: Number, required: true, index: { unique: true } }, 
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true, index: false },
}, { timeStamps: true });

module.exports = mongoose.model('Item', itemShema);
