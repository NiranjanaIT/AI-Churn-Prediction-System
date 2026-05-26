const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('./models/User');
const Prediction = require('./models/Prediction');

(async () => {
    try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log("Memory DB running at", uri);

        process.env.MONGODB_URI = uri;
        process.env.PORT = 5000;

        // Connect and Seed
        await mongoose.connect(uri);

        const users = [
            { name: 'John Doe', email: 'john@example.com', lastActiveDays: 2, watchHours: 15, paymentDelay: 0, churnRisk: 'LOW' },
            { name: 'Jane Smith', email: 'jane@example.com', lastActiveDays: 45, watchHours: 2, paymentDelay: 12, churnRisk: 'HIGH' },
            { name: 'Alice Johnson', email: 'alice@example.com', lastActiveDays: 10, watchHours: 8, paymentDelay: 5, churnRisk: 'MEDIUM' },
            { name: 'Bob Brown', email: 'bob@example.com', lastActiveDays: 1, watchHours: 25, paymentDelay: 0, churnRisk: 'LOW' },
            { name: 'Charlie Davis', email: 'charlie@example.com', lastActiveDays: 60, watchHours: 0, paymentDelay: 20, churnRisk: 'HIGH' },
        ];

        await User.deleteMany({});
        await Prediction.deleteMany({});
        await User.insertMany(users);
        console.log('Data Seeded in Memory DB!');

        // Start Server
        // We defer requiring server.js until environment is set
        require('./server.js');
    } catch (err) {
        console.error("Failed to start memory server:", err);
        process.exit(1);
    }
})();
