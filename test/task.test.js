const expect = require("chai").expect;
const request = require("supertest");
const { Task } = require("../models/task.model");
const app = require("../app");
const mongoose = require('mongoose');
const config = require('../config');
const env = process.env.NODE_ENV || 'test';

let taskId = '';

describe("api/tasks", () => {
  before(async () => {
    // before each test delete all tasks table data
    await Task.deleteMany({});
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
    it("should return all tasks", async () => {
      const tasks = [
        { title: "test 1", author: "admin", description: "test test test" },
        { title: "test 2", author: "admin", description: "test2 test2 test2" }
      ];
      await Task.insertMany(tasks);
      console.log(tasks);
      const res = await request(app).get("/api/tasks");
      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
    });
  });

  describe("GET/:id", () => {
    it("should return a task if valid id is passed", async () => {
      const task = new Task({
        title: "Par Carl",
        author: "Carl",
        description: "Une tache pour des tests"
      });
      await task.save();
      const res = await request(app).get("/api/tasks/" + task._id);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("title", task.title);
    });

    it("should return 400 error when invalid object id is passed", async () => {
      const res = await request(app).get("/api/tasks/1");
      expect(res.status).to.equal(400);
    });

    it("should return 404 error when valid object id is passed but does not exist", async () => {
      const res = await request(app).get("/api/tasks/5f43ef20c1d4a133e4628181");
      expect(res.status).to.equal(404);
    });
  });

  describe("POST /", () => {
    it("should return task when the all request body is valid", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({
            title: "Par Polo",
            author: "Marco",
            description: "Une tache pour des tests de Marco POLO"
        });
      const data = res.body;
      expect(res.status).to.equal(200);
      expect(data).to.have.property("_id");
      expect(data).to.have.property("title", "Par Polo");
      expect(data).to.have.property("author", "Marco");
      expect(data).to.have.property("description", "Une tache pour des tests de Marco POLO");

      const task = await Task.findOne({ title: 'Par Polo' });
      expect(task.author).to.equal('Marco');
      expect(task.title).to.equal('Par Polo');
    });
  });

  describe("PUT /:id", () => {
    it("should update the existing task and return 200", async() => {
        const task = new Task({
            title: "Par Lola",
            author: "Lola",
            description: "Test test test de Lola"
        });
        // await task.save();
        const res = await request(app)
            .put("/api/tasks/" + task._id)
            .send({
                title: "Par Albert",
                author: "Albert",
                description: "Test test test"
            });

      expect(res.status).to.equal(200);

      expect(res.body).to.have.property("status", "200");
      expect(res.body).to.have.property("message", "Updated");
    });
  });

  describe("DELETE /:id", () => {
    it("should delete requested id and return response 200", async () => {
      const task = new Task({
        title: "Par Albert",
        author: "Albert",
        description: "Test test test"
      });
      await task.save();
      taskId = task._id;
      const res = await request(app).delete("/api/tasks/" + taskId);
      expect(res.status).to.be.equal(200);
    });

    it("should return 404 when deleted task is requested", async () => {
      let res = await request(app).get("/api/tasks/" + taskId);
      expect(res.status).to.be.equal(404);
    });
  });
});