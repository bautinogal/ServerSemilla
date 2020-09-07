const workers = {
    postUsersQueue2DB: () => {
        const queueName = 'POST/' + config.usersDB + '/' + config.usersCollection;
        consume(queueName, (document) => {
            console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueName}`);
            post(config.usersDB, config.usersCollection, document)
                .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueName}`))
                .catch(err => console.log(`Routes@queueToDb error: ${err}`));
        });
    },
    deleteUsersQueue2DB: () => {
        const queueName = 'DELETE/' + config.usersDB + '/' + config.usersCollection;
        queue.receive(queueName, (query) => {
            console.log(`Worker@consume: ${JSON.stringify(query)} to ${queueName}`);
            mongoDbHelper.deleteMany(config.usersDB, config.usersCollection, query, queryOptions)
                .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} deleted from ${queueName}`))
                .catch(err => console.log(`Routes@queueToDb error: ${err}`));
        });
    },
    postINTIQueue2DB: () => {
        const queueName = 'POST/Masterbus-IOT/INTI';
        consume(queueName, (document) => {
            console.log(`Worker@consume: ${JSON.stringify(document)} to ${queueName}`);
            save(config.usersDB, config.usersCollection, document)
                .then(res => console.log(`Routes@queueToDb ${JSON.stringify(document)} saved in ${queueName}`))
                .catch(err => console.log(`Routes@queueToDb error: ${err}`));
        });
    }
};

module.exports = { workers }