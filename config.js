module.exports = {
    port: 3000,
    db: {
      production: "mongodb://user:rami@altran.com:1234/tasksdb",
      development: "mongodb://localhost:27017/tasksdb",
      test: "mongodb://localhost:27017/tasksdbtest",
    },
    dbParams: {
        useNewUrlParser: true
    }
};