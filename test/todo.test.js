const expect = require("chai").expect;
const request = require("supertest");
const { Todo } = require("../models/todo.model");
const app = require("../app");
const mongoose = require('mongoose');
const config = require('../config');
const env = process.env.NODE_ENV || 'test';

let todoId = '';

describe("api/todos", () => {
  before(async () => {
    // before each test delete all todos table data
    await Todo.deleteMany({});
  });

  after(async () => {
    mongoose.disconnect();
  });

  it("should connect and disconnect to mongodb", async () => {
      // console.log(mongoose.connection.states);
      mongoose.disconnect();
      mongoose.connection.on('disconnected', () => {
        expect(mongoose.connection.readyState).to.equal(0);
      });
      mongoose.connection.on('connected', () => {
        expect(mongoose.connection.readyState).to.equal(1);
      });
      mongoose.connection.on('error', () => {
        expect(mongoose.connection.readyState).to.equal(99);
      });

      await mongoose.connect(config.db[env], config.dbParams);
  });

  describe("GET /", () => {
    it("should return all todos", async () => {
      const todos = [
        { title: "test 1", author: "admin", status: false, content: "test test test" },
        { title: "test 2", author: "admin", status: true, content: "test2 test2 test2" }
      ];
      await Todo.insertMany(todos);
      console.log(todos);
      const res = await request(app).get("/api/todos");
      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
    });
  });

  describe("GET/:id", () => {
    it("should return a todo if valid id is passed", async () => {
      const todo = new Todo({
        title: "Par Carl",
        author: "Carl",
        status: false,
        content: "Une tache pour des tests"
      });
      await todo.save();
      const res = await request(app).get("/api/todos/" + todo._id);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("title", todo.title);
    });

    it("should return 400 error when invalid object id is passed", async () => {
      const res = await request(app).get("/api/todos/1");
      expect(res.status).to.equal(400);
    });

    it("should return 404 error when valid object id is passed but does not exist", async () => {
      const res = await request(app).get("/api/todos/5f43ef20c1d4a133e4628181");
      expect(res.status).to.equal(404);
    });
  });

  describe("POST /", () => {
    it("should return todo when the all request body is valid", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({
            title: "Par Polo",
            author: "Marco",
            status: false,
            content: "Une tache pour des tests de Marco POLO"
        });
      const data = res.body;
      expect(res.status).to.equal(200);
      expect(data).to.have.property("_id");
      expect(data).to.have.property("title", "Par Polo");
      expect(data).to.have.property("author", "Marco");
      expect(data).to.have.property("status", false);
      expect(data).to.have.property("content", "Une tache pour des tests de Marco POLO");

      const todo = await Todo.findOne({ title: 'Par Polo' });
      expect(todo.author).to.equal('Marco');
      expect(todo.title).to.equal('Par Polo');
    });
  });

  describe("PUT /:id", () => {
    it("should update the existing todo and return 200", async() => {
        const todo = new Todo({
            title: "Par Lola",
            author: "Lola",
            status: true,
            content: "Test test test de Lola"
        });
        await todo.save();
        const res = await request(app)
            .put("/api/todos/" + todo._id)
            .send({
                title: "Par Albert",
                author: "Albert",
                status: false,
                content: "Test test test"
            });

      expect(res.status).to.equal(200);

      expect(res.body).to.have.property("status", "200");
      expect(res.body).to.have.property("message", "Updated");
    });
  });

  describe("DELETE /:id", () => {
    it("should delete requested id and return response 200", async () => {
      const todo = new Todo({
        title: "Par Albert",
        author: "Albert",
        status: false,
        content: "Test test test"
      });
      await todo.save();
      todoId = todo._id;
      const res = await request(app).delete("/api/todos/" + todoId);
      expect(res.status).to.be.equal(200);
    });

    it("should return 404 when deleted todo is requested", async () => {
      let res = await request(app).get("/api/todos/" + todoId);
      expect(res.status).to.be.equal(404);
    });
  });
});