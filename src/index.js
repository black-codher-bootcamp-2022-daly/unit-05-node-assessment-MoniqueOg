require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const todoFilePath = process.env.BASE_JSON_PATH;

//Read todos from todos.json into variable
let todos = require(__dirname + todoFilePath);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname }, (err) => {
    console.log(err);
    });
  //res.end(); loses content and content aborted before having chance to load
});

app.get('/todos', (_, res) => {
  console.log(todos);
  res.header("Content-Type","application/json");
  res.sendFile(todoFilePath, { root: __dirname });
  res.send();
});

//Add GET request with path '/todos/overdue'
app.get('/todos/overdue', (_, res) => {
  console.log(todos);
  let todosList = todos.filter((todo) => todo.dueDate < new Date());
  res.send(todosList);
  });

//Add GET request with path '/todos/completed'
app.get('/todos/completed', (_, res) => {
  console.log(todos);
  let todosList = todos.filter((todo) => todo.completed === true);
  res.send(todosList);
  });

//Add POST request with path '/todos'
app.post('/todos', (req, res) => {
  let newTodo = req.body;
  newTodo.id = uuidv4();
  newTodo.completed = false;
  todos.push(newTodo);
  res.send(newTodo);
});

//Add PATCH request with path '/todos/:id
app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.title = req.body.title;
    todo.description = req.body.description;
    todo.dueDate = req.body.dueDate;
    todo.priority = req.body.priority;
    todo.completed = req.body.completed;
    res.send(todo);
  } else {
    res.status(404).send();
  }
});

//Add POST request with path '/todos/:id/complete
app.post('/todos/:id/complete', (req, res) => {
  let id = req.params.id;
  let todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = true;
    res.send(todo);
  } else {
    res.status(404).send();
  }
});

//Add POST request with path '/todos/:id/undo
app.post('/todos/:id/undo', (req, res) => {
  let id = req.params.id;
  let todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = false;
    res.send(todo);
  } else {
    res.status(404).send();
  }
});

//Add DELETE request with path '/todos/:id
app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;
  let todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todos = todos.filter((todo) => todo.id !== id);
    res.send(todo);
  } else {
    res.status(404).send();
  }
});

app.listen(port, function () {
    console.log(`Node server is running... http://localhost:${port}`);
});

module.exports = app;