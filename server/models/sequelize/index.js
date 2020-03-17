// from https://github.com/sequelize/express-example/blob/master/models/index.js

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const db = {};

  fs
    .readdirSync(__dirname)  // đọc toàn bộ file trong thư mục hiện tại tức thư mục sequelize
    .filter(file => {
      // Lọc ra các file model, trừ file index.js, kết quả nhận được là mảng ["Order.js", "OrderItem.js"]
      console.log('file1: ', file);
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach((file) => {
      // Lọc qua mảng ["Order", "OrderItem"]
      console.log('file: ', file);

      // import model configuration vào file Order.js và file OrderItem.js
      const model = sequelize.import(path.join(__dirname, file));

      console.log('model: ', model);

      // kết quả { "Order", "OrderItem" }
      db[model.name] = model; 
    });

   // Lọc mảng [ "Order", "OrderItem" ] 
  Object.keys(db).forEach((modelName) => {
   
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  // Is asynchronous but we won't wait here
  sequelize.sync();

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db; // db lúc này là object có 2 thuộc tính là Order và OrderItem
}; 
