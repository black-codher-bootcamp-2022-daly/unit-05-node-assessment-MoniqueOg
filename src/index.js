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

//Add GET request with path '/todos'. Should be listening and respond with the content type set to application/json. Should return array of all todos. Should return empty array if there are no todos.
app.get('/todos', (_req, res) => {
  res.header("Content-Type", "application/json");
  if (todos) {
    //res.sendFile(path.join(__dirname, "/models/todos.json"));
    res.sendFile("/models/todos.json", { root: __dirname }, (err) => {
      console.log(todos);
      res.status(200).send(todos);
      //done()
    });
  }
  else {
    res.status(404).res.send();   
  }
});


//Add Get request with path '/todos/:id'
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  const todo = todos.find((todo) => todo.id === id);
  if (todos) {
    //res.sendFile(path.join(__dirname, "/models/todos.json"));
    res.sendFile("/models/todos.json", { root: __dirname }, (err) => {
      console.log(todos);
      res.status(200).send(todos);
    });
  }
  else {
    res.status(404).res.send([0]);
  }
});

//Add GET request with path '/todos/overdue'.
app.get('/todos/overdue', (_req, res) => {
  const todosOverdue = todos.filter((todo) => todo.dueDate < new Date());

  if (todosOverdue) {
    res.header("Content-Type", "application/json");
    console.log(todosOverdue);
    res.status(201).send(todosOverdue);
  }
  else {
    res.status(404).send([0]);
  }
});

//Add GET request with path '/todos/completed'.
app.get('/todos/completed', (_req, res) => {
  const todosCompleted = todos.filter((todo) => todo.completed === true);
  res.header("Content-Type", "/application/json/");
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
    res.status(201).send(newTodo)
  }
  else {
    res.status(400).send();
  };
});

//Add PATCH request with path '/todos/:id'
app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {

    todo.description = req.body.description;
    res.status(200).send(todo);
  } else {
    res.status(404).send();
  }
});

//Add POST request with path '/todos/:id/complete'.  should contain COMPLETED todo with id '19d539a11189-bb60-u663-8sd4-01507581':
app.post('/todos/:id/complete', (req, res) => {
  const id = req.params.id;

  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = true;
    res.send(todo);
  } else {
    res.status(404).send("Not Found");
  }
});

//Add POST request with path '/todos/:id/undo'
app.post('/todos/:id/undo', (req, res) => {
  const id = req.params.id;

  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = false;
    res.send(todo);
  } else {
    res.status(404).send();
  }
});

//Add DELETE request with path '/todos/:id'
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todos.splice(todos.indexOf(todo), 1);
    res.status(200).send(todo);
  } else {
    res.status(404).send();
  }
});

app.listen(port, function () {
  console.log(`Node server is running... http://localhost:${port}`);
});

module.exports = app;
