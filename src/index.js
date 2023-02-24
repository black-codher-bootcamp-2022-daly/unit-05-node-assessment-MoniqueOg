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

/*const todosbuttn = document.createTextNode("Full todos.");
  todosbuttn.setAttribute("class", "todoslnk");
  todosbuttn.setAttribute("href", "/todos");
  todos.appendChild(todosbuttn);*/


/*import { routes } from '../Router';

const todoBtns = [
  {
    route: routes.todos,
    property: `${routes.todos}/todos`,
    text: 'Full Todo List',
  },
  {
    route: routes.overdue,
    id: `${routes.due}/todos/overdue`,
    text: 'Overdue',
  },
  {
    route: routes.completed,
    property: `${routes.completed}/todos/completed`,
    text: 'Completed',
  },
];

  <Fragment>
  <div className={styles.todoBtns}>
  {todoBtns.map((item) => (
      <TodoBtn key={item.text} route={item.route} icon={item.icon} text={item.text} />
    ))}
  </div>
  </Fragment>*/

app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname }, (err) => {
    console.log(err);
  });

});

//Add GET request with path '/todos'
app.get('/todos', (_, res) => {
 const todos = getTodos();
  res.setHeader("Content-Type", "application/json").send(todos);
});


//Add Get request with path '/todos/:id'
app.get('/todos/:id', (_, res) => {
  const todos = getTodos();
  const id = _.params.id;
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    res.setHeader("Content-Type", "application/json").send(todo);
  }
  else {
    res.status(404).send();
  }

});

//Add GET request with path '/todos/overdue'.
app.get('/todos/overdue', (_, res) => {
  const todos = getTodos();
  const todosOverdue = todos.filter((todo) => todo.dueDate < new Date());
  const id = _.params.id;
  const todo = todos.find((todo) => todo.id === id);
  if (todosOverdue) {
    res.header("Content-Type", "application/json");
    //console.log(todosOverdue);
    res.status(201).send(todosOverdue);
  }
  else {
    res.status(404).send([0]);
  }
});

//Add GET request with path '/todos/completed'.
app.get('/todos/completed', (__, res) => {
  const todos = getTodos();
  const id = _.params.id;
  const todo = todos.find((todo) => todo.id === id);
  const todosCompleted = todos.filter((todo) => todo.completed === true);
  res.header("Content-Type", "/application/json/");
  res.send(todosCompleted);
  // console.log(todosCompleted);
});

//Add POST request with path '/todos'
app.post('/todos', (_, res) => {
  const todos = getTodos();
  const id = _.params.id;
  const todo = todos.find((todo) => todo.id === id);
  res.header("Content-Type", "/application/json/");
  const newTodo = _.body;
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
app.patch('/todos/:id', (_, res) => {
  const todos = getTodos();
  const id = _.params.id;
  const todo = todos.find((todo) => todo.id === id);
  res.header("Content-Type", "/application/json/");
  if (todo) {

    todo.description = req.body.description;
    res.status(200).send();
  } else {
    res.status(400).send();
  }
});

//Add POST request with path '/todos/:id/complete'.  should contain COMPLETED todo with id '19d539a11189-bb60-u663-8sd4-01507581':
app.post('/todos/:id/complete', (_, res) => {
  const todos = getTodos();
  const id = _.params.id;
  res.header("Content-Type", "/application/json/");
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = true;
    res.send(todo);
  } else {
    res.status(404).send("Not Found");
  }
});

//Add POST request with path '/todos/:id/undo'
app.post('/todos/:id/undo', (_, res) => {
  const todos = getTodos();
  const id = _.params.id;
  res.header("Content-Type", "/application/json/");
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.completed = false;
    res.send(todo);
  } else {
    res.status(404).send();
  }
});

//Add DELETE request with path '/todos/:id'
app.delete('/todos/:id', (_, res) => {
  const todos = getTodos();
  const id = _.params.id;
  res.header("Content-Type", "/application/json/");
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
