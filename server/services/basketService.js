let client = null;


// add item to basket
async function add(itemId, userId) {
    return new Promise((resolve, reject) => {
        client.hget(`basket:${userId}`, itemId, (err, object) => {
            if (err) return reject(err);

            // Nếu trong basket (giỏ hảng) chưa có item nào thì set quantity của item đó 
            // console.log('item: ', object);
            if (!object) {
                client.hset(`basket:${userId}`, itemId, 1, (seterr, res) => {
        
                    if (seterr) return reject(seterr);
                    return resolve(res);
                });
            } else {
      
                // Nếu basket đã có item đó, tăng giá trị quantity thêm 1 đơn vị
                client.hincrby(`basket:${userId}`, itemId, 1, (err1, res1) => {
                    if (err1) return reject(err1);
                    return resolve(res1);
                });
            }

        });
    });
}


// getAll item in basket
async function getAll(userId) {
    return new Promise((resolve, reject) => {
        client.hgetall(`basket:${userId}`, (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
}

// remove item in basket
async function remove(itemId, userId) {
    return new Promise((resolve, reject) => {
        client.hdel(`basket:${userId}`, itemId, (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
}

module.exports = (_client) => {
    if (!_client) throw new Error('Missing redis client object');

    client = _client;

    return {
        add,
        getAll,
        remove,
    }
}