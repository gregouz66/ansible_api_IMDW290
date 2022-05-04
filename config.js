module.exports = {
    port: 3000,
    db: {
      production: "mongodb+srv://admin:admin@cluster0.gpzng.mongodb.net/tasksdb?retryWrites=true&w=majority",
      development: "mongodb+srv://admin:admin@cluster0.gpzng.mongodb.net/tasksdb?retryWrites=true&w=majority",
      test: "mongodb+srv://admin:admin@cluster0.gpzng.mongodb.net/tasksdbtest?retryWrites=true&w=majority",
    },
    dbParams: {
        useNewUrlParser: true
    }
};