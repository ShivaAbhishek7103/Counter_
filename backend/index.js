const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv=require("dotenv");
const path=require("path");
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://challenge:challenge_1@cluster0.5pxjqcg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    dbName: "counter",
    appName: "Counter"
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));



// Define counter schema and model
const counterSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    mycount: { type: Number, default: 0 }
},{ collection: 'counters' });

const Counter = mongoose.model('Counter', counterSchema);



// Routes
app.get('/api/counter', async (req, res) => {
    console.log("Reached GET method")
    try {
        const counter = await Counter.findOne();
        console.log(counter);
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
        
app.post('/api/counter/increment/:key', async (req, res) => {
    const { key } = req.params;
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        if (key === "count") {
            counter.count++;
        } else if (key === "mycount") {
            counter.mycount++;
        }
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/decrement/:key', async (req, res) => {
    const { key } = req.params;
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        if (key === "count") {
            counter.count--;
        } else if (key === "mycount") {
            counter.mycount--;
        }
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});