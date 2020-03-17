const ItemModel = require('../models/mongoose/Item');

async function getAll() {
  return ItemModel.find({}).sort({ createdAd: -1 });
}

async function getOne(id) {
  return ItemModel.findOne({ _id: id });
}

async function create(data) {
  const item = new ItemModel(data);
  return item.save();
}

async function update(id, data) {
  const item = await getOne(id);

  if(!item) throw new Error('Could not find the requested item');

  Object.keys(data).forEach(key => {
    item[key] = data[key];
  });
  return item.save();
}

async function remove(query){
  const result = await ItemModel.deleteOne(query);
  return result.result.n;
}
module.exports = { getAll, getOne, create, update, remove };
