module.exports = {
    port: 3000,
    db: {
      production: "mongodb://user:rami@altran.com:1234/todosdb",
      development: "mongodb://localhost:27017/todosdb",
      test: "mongodb://localhost:27017/todosdbtest",
    },
    dbParams: {
        useNewUrlParser: true
    }
};