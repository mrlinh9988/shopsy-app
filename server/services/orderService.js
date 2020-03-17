const Models = require('../models/sequelize');

let client = null;
let models = null;

async function inTransaction(work) {
    try {
        const t = await client.transaction();
        work(t);
        return t.commit();
    } catch (error) {
        t.rollback();
        throw error;
    }
}

// Create order
async function create(user, items, t) {
    try {
        const order = await models.Order.create({
            userId: user.id,
            email: user.email,
            status: 'Not Shipped',
        }, {
            transaction: t
        });

        return Promise.all(items.map(async (item) => {
            const orderItem = await models.OrderItem.create({
                sku: item.sku,
                qty: item.qty,
                price: item.price,
                name: item.name,
            });

            return order.addOrderItem(orderItem, {
                transaction: t
            });
        }));
    } catch (error) {
        throw error;
    }
}

async function getAll() {
    console.log('model order: ', models.Order.findAll({ where: {} }));
    return models.Order.findAll({ where: {}, include: [models.OrderItem] });
}

module.exports = (_client) => {
    models = Models(_client);
    client = _client;

    return {
        inTransaction,
        create,
        getAll
    }
}