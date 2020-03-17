module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: DataTypes.STRING(24),
    email: DataTypes.STRING,
    status: DataTypes.STRING,
  });

  // Thiết lập quan hệ giữa model Order và model OrderItem
  Order.associate = models => Order.hasMany(models.OrderItem);
  return Order;
};
