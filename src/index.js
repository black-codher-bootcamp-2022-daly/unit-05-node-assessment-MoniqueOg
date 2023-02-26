require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { doesNotMatch } = require('assert');
const todoFilePath = process.env.BASE_JSON_PATH;


//Read todos from todos.json into variable todos
const getTodos = () => {
  return JSON.parse(fs.readFileSync(__dirname + todoFilePath))
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//Add GET request with path '/'

app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname }, (err) => {
    console.log(err);
  });

});

//Add GET request with path '/todos'
app.get('/todos', (_, res) => {
  const todos = getTodos();
  if (todos) {
    res.setHeader("Content-Type", "application/json").send(todos);

  }
  else {
    res.status(404).send([]);
  }

});

// //Add GET request with path '/todos/overdue'
app.get('/todos/overdue', (_, res) => {
  const todos = getTodos();
  const overdueTodos = todos.filter((todo) => Date.parse(todo.due) < new Date() && todo.completed === false);
  res.setHeader("Content-Type", "application/json").send(overdueTodos);
});

// //Add GET request with path '/todos/completed'.should be listening and respond with the content type set to application/json 6) should return array of completed todos 7) should return empty array if there are no completed todos
app.get('/todos/completed', (_, res) => {
  const todos = getTodos();
  const completedTodos = todos.filter((todo) => todo.completed === true);
  if (completedTodos.length && completedTodos) {
    res.setHeader("Content-Type", "application/json").send(completedTodos);
  }
  else {
    res.send([]);
  }
});

//Add Get request with path '/todos/:id'
app.get('/todos/:id', (_, res) => {
  const todos = getTodos();
  let id = _.params.id;
  let todo = todos.find((todo) => todo.id === id);
  if (todo) {
    res.setHeader("Content-Type", "application/json").send(todo);
  }
  else {
    res.status(404).send([]);
  }

});

// //Add POST request with path '/todos'
app.post('/todos', (req, res) => {
  const todos = getTodos();
  const id = req.params.id;
  const { name, due } = req.body;
  if (req.body && new Date(due) != "Invalid Date") {
    const newTodo = {
      id: uuidv4(),
      name,
      created: new Date().toISOString(),
      due,
      completed: false,
  };
    todos.push(newTodo);
    const todosJSON = JSON.stringify(todos && newTodo, null, 2);
    fs.writeFileSync("newTodo.json", todosJSON);
    console.log(JSON.parse(todosJSON))
    res.setHeader("Content-Type", "application/json").status(201).send(newTodo);
  }
  else {
    res.status(400).send();
  }
});

// //Add PATCH request with path '/todos/:id'
app.patch('/todos/:id', (req, res) => {
  const todos = getTodos();
  let id = req.params.id;
  let newTodo = req.body.name;
  const todo = todos.find((todo) => todo.id === id);

  if (todo) {
    todo.name = newTodo;
    todo.id = uuidv4()
    console.log(todo)
    res.setHeader("Content-Type", "application/json").status(200).send();
  } else {
    res.status(404).send();
  }
});

// //Add POST request with path '/todos/:id/complete'
app.post('/todos/:id/complete', (req, res) => {
  const todos = getTodos();
  const id = req.body.id;

  const todo = todos.find((todo) => todo.id === id);
  if (todo && todo.completed === false) {
    res.setHeader("Content-Type", "/application/json/").send(todos);
  } else {
    res.status(404).send();
  }
});

// //Add POST request with path '/todos/:id/undo'
app.post('/todos/:id/undo', (_, res) => {
  const todos = getTodos();
  const id = _.params.id;
  const todo = todos.find((todo) => todo.id === id && todo.completed === true);

  if (todos) {
    res.header("Content-Type", "/application/json/").send(todo);
  } else {
    res.status(404).send();
  }
});

// //Add DELETE request with path '/todos/:id'
app.delete('/todos/:id', (_, res) => {
  const todos = getTodos();
  const id = _.params.id;

  const todo = todos.find((todo) => todo.id === id);
  if (todos === -1) {
    res.setHeader("Content-Type", "/application/json/");
    todos.splice(todos.indexOf(todos), 3);
    res.json(todos);
  } else {
    res.status(404).send();
  }
});

module.exports = app;
