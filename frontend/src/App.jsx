import React, { useState, useEffect } from 'react';
import axios from 'axios';
import editIcon from './components/img/edit.png';
import binIcon from './components/img/bin.png';
import cross from './components/img/x-button.png';
import tick from './components/img/accept.png';
import plus from './components/img/plus.png';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null); // Track the ID of the task being edited
  const [editingTitle, setEditingTitle] = useState(''); // Track the new title for editing

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://todobackend-8hg4.onrender.com/tasks');
      setTasks(response.data);
      
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  }; 

  const addTask = async () => {
    try {
      const response = await axios.post('https://todobackend-8hg4.onrender.com/tasks', { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://todobackend-8hg4.onrender.com/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id); // Set the task to be edited
    setEditingTitle(task.title); // Set the current title in the input field
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`https://todobackend-8hg4.onrender.com/tasks/${id}`, { title: editingTitle });
      setTasks(tasks.map(task => (task._id === id ? response.data : task))); // Update the task in state
      cancelEdit(); // Exit editing mode
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null); // Exit editing mode
    setEditingTitle('');
  };

  return (
    <div>
    <div className='mainbody'>
      <h1>Todo App</h1>
      <input className='input'
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <img className='plus' src={plus} onClick={addTask}></img>
      <ul className='list'>
        {tasks.map((task) => (
          <li key={task._id} className='listitem'>
            {editingTaskId === task._id ? (
              // If this task is being edited, show input field and Save/Cancel buttons
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <img src={tick} onClick={() => saveEdit(task._id)}></img>
                <img src={cross} onClick={cancelEdit}></img>
              </>
            ) : (
              // Otherwise, show task title and Edit/Delete buttons
              <>
                {task.title}
                <img className='editimg' src={editIcon} onClick={() => startEditing(task)} alt="Edit" />
                <img src={binIcon} onClick={() => deleteTask(task._id)} alt="Delete" />

              </>
            )}
          </li>
        ))}
      </ul>
      <h4> &#169;PratikShinde</h4>
      </div>
    </div>
  );
}

export default App;
