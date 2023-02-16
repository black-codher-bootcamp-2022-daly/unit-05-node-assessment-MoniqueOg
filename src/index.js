require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const todoFilePath = process.env.BASE_JSON_PATH;

//Read todos from todos.json into variable todos
const todos = require(__dirname + todoFilePath);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
  res.sendFile("./public/index.html", { root: __dirname }, (err) => {
    console.log(err);
  });

});
//Add GET request with path '/todos'
app.get('/todos', (_req, res) => {
  console.log(todos);
  res.header("Content-Type", "application/json");
  res.sendFile("./public/todos.json", { root: __dirname }, (err) => {
    console.log(err);
    res.send(todos);
  });
});

//Add GET request with path '/todos/overdue'
app.get('/todos/overdue', (_req, res) => {
  const todosOverdue = todos.filter((todo) => todo.dueDate < new Date());
  res.send(todosOverdue);
  console.log(todosOverdue);
});

//Add GET request with path '/todos/completed'
app.get('/todos/completed', (_req, res) => {
  const todosCompleted = todos.filter((todo) => todo.completed === true);
  res.send(todosCompleted);
  console.log(todosCompleted);
});

//Add POST request with path '/todos'
app.post('/todos', (req, res) => {
  const newTodo = req.body;
  if (newTodo) {
    newTodo.id = uuidv4();
    //uuidv4() is a function that generates a unique id
    newTodo.id = todos.length + 1;
    newTodo.created = new Date();
    newTodo.completed = false;
    todos.push(newTodo);
    res.send(201);
    console.log(todos)
  }
  else {
    res.send(400);
  };
});

//Add PATCH request with path '/todos/:id'
app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let todo = todos.find((todo) => todo.id === id);
  if (todo) {

    todo.description = req.body.description;
    res.status(200).send(todo);
  } else {
    res.status(400).send();
  }
});



//Add POST request with path '/todos/:id/complete'
app.post('/todos/:id/complete', (req, res) => {
  let id = req.params.id;
  let todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = true;
    res.send(todo);
  } else {
    res.status(400).send("Bad Request");
  }
});

//Add POST request with path '/todos/:id/undo'
app.post('/todos/:id/undo', (req, res) => {
  let id = req.params.id;
  let todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = false;
    res.send(todo);
  } else {
    res.status(400).send();
  }
});

//Add DELETE request with path '/todos/:id'
app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;
  let todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todos.splice(todos.indexOf(todo), 1);
    res.status(200).send(todo);
  } else {
    res.status(400).send();
  }
});

app.listen(port, function () {
  console.log(`Node server is running... http://localhost:${port}`);
});

module.exports = app;