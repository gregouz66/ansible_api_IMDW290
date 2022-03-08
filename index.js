const express = require('express')
const cors = require('cors')
const app = express()
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const { MongoClient, ObjectId } = require('mongodb');

const jwtPrivateKey = "secretkey!*%£04792*°)"

const client = new MongoClient('mongodb://localhost:27017/taskdb');
console.error("Connexion à Mongo DB en cours...")
client.connect()
    .then(() => {
        //Connect to MongoDB
        console.log('Connected successfully to Mongo DB');
        const db = client.db('task-app-db');
        const tasksCollection = db.collection('tasks');

        //Apply middleware
        app.use(cors())
        app.use(express.json())
        app.use(logRequest)

        function logRequest(req, res, next) {
            console.log(new Date(), `Appel de l'URL ${req.method} ${req.url}`)
            next()
        }

        app.get('/tasks', async (req, res) => {
            try {
                const tasks = await tasksCollection.find({}).toArray()
                res.json(tasks)
            } catch (err) {
                res.status(500).json({ error: err.message })
            }
        })

        app.get('/tasks/all', async (req, res) => {
            try {
                const tasks = await tasksCollection.find({}).toArray()
                res.json(tasks)
            } catch (err) {
                res.status(500).json({ error: err.message })
            }
        })

        app.get('/tasks/:taskId', async (req, res) => {
            try {
                const task = await tasksCollection.findOne({ _id: ObjectId(req.params.taskId) })
                if (task) {
                    res.json(task)
                } else {
                    res.status(404).json({ error: `Task ${req.params.taskId} not found` })
                }
            } catch (err) {
                res.status(500).json({ error: err.message })
            }
        })

        app.post('/tasks', async (req, res) => {
            try {
                const task = req.body
                delete task._id // the client is not allowed to decide the ID, Mongo will decide the ID
                task.userid = req.user.id // force the userid with the token user
                const insertResult = await tasksCollection.insertOne(task);
                res.status(201).json(insertResult)
            } catch (err) {
                res.status(500).json({ error: err.message })
            }
        })

        app.put('/tasks/:taskId', async (req, res) => {
            try {
                const task = req.body
                delete task._id // the client is not allowed to change the ID
                task.userid = req.user.id // force the userid with the token user
                const updateResult = await tasksCollection.replaceOne({ _id: ObjectId(req.params.taskId) }, task);
                res.status(200).json(updateResult)
            } catch (err) {
                res.status(500).json({ error: err.message })
            }
        })

        app.patch('/tasks/:taskId', async (req, res) => {
            try {
                const task = req.body
                delete task._id // the client is not allowed to change the ID
                task.userid = req.user.id // force the userid with the token user
                const updateResult = await tasksCollection.updateOne({ _id: ObjectId(req.params.taskId) }, { $set: task });
                res.status(200).json(updateResult)
            } catch (err) {
                res.status(500).json({ error: err.message })
            }
        })

        app.delete('/tasks/:taskId', async (req, res) => {
            try {
                await tasksCollection.deleteOne({ _id: ObjectId(req.params.taskId) })
                res.status(200).json({})
            } catch (err) {
                res.status(500).json({ error: err.message })
            }
        })

        app.listen(8080, () => {
            console.log(`API listening at http://localhost:8080`)
        })
    })
    .catch(error => console.error("Erreur lors de la connexion à Mongo DB", error))
