const mongoose = require("mongoose");


const dbUri = (process.env.NODE_ENV === "production")
    ? process.env.MONGODB_URI
    : "mongodb://localhost/Loc8r";

mongoose.connect(dbUri);

mongoose.connection.on("connected", () => {
    console.log(`Mongoose connected to ${dbUri}`);
});

mongoose.connection.on("error", (err) => {
    console.log(`Mongoose connection error in ${dbUri}:\n ${err}`);
});

mongoose.connection.on("disconnected", () => {
    console.log(`Mongoose disconnected ${dbUri}`);
});


const dbLogUri = "mongodb://localhost/Loc8rLog";
const logDb = mongoose.createConnection(dbLogUri);

logDb.on("connected", () => {
    console.log(`Mongoose connected to ${dbLogUri}`);
});

logDb.on("error", (err) => {
    console.log(`Mongoose connection error in ${dbLogUri}:\n ${err}`);
});

logDb.on("disconnected", () => {
    console.log(`Mongoose disconnected ${dbLogUri}`);
});



const gracefulShutdown = function (msg, callback) {
    console.log(`Mongoose disconnected through ${msg}`);
    mongoose.connection.close(() => {
        logDb.close(callback);
    });
};


// Прослушиваем процессы Node
process.on("SIGINT", () => {
    gracefulShutdown("app termination", () => process.exit(0));
});

process.on("SIGTERM", () => {
    gracefulShutdown("Heroku app shutdown", () => process.exit(0));
});

process.on("SIGUSR2", () => {
    gracefulShutdown("nodemon restart", () => process.kill(process.pid, "SIGUSR2"));
});



require("./locations");


