const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb://localhost/mern-stack-db', { useNewUrlParser: true, useUnifiedTopology: true });
// Get MongoDB driver connection
const dbo = require("./db/conn");
 
app.listen(port, () => {
  // Perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});

const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
  });

  const Todo = mongoose.model('Todo', todoSchema);

  // Add this to server.js

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
  });

  // Update App.js

// ... (existing code)
useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error(error));
  }, []);
// ... (existing code)

// Create a new todo
app.post('/todos', async (req, res) => {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.json(newTodo);
  });
// Update an existing todo
app.put('/todos/:id', async (req, res) => {
const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(updatedTodo);
});
// Delete a todo
app.delete('/todos/:id', async (req, res) => {
await Todo.findByIdAndRemove(req.params.id);
res.json({ message: 'Todo deleted successfully' });
});