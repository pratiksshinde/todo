const express = require("express")
const mongoose = require("mongoose")
const cors= require("cors")
const bodyParser = require("body-parser")

const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(bodyParser.json());

//MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/todoApp', {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=> console.log('MongoDB connected'))
.catch( err => console.error('MongoDB connection server :',err));

//Simple Route
app.get('/',(req,res)=>{
    res.send('Backend is Running');
})

//start server
app.listen(port,()=> console.log(`server is running on http://localhost:${port}`));


const Task = require('./models/Task');

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a task
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


