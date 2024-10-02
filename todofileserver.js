const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      let todos = JSON.parse(data);
      res.json(todos);
    }
  });
});

app.get("/todos/:id", (req, res) => {
    fs.readFile('todos.json','utf8',(err, data)=>{
        if(err) throw err;
        let todos = JSON.parse(data);
        // console.log(todos);
        let findIndex = todos.findIndex((i)=> i.id === parseInt(req.params.id));
        // console.log(findIndex);
        if (findIndex !== -1) {
          res.status(200).json(todos[findIndex]);
        } else {
          res.status(404).send("404 not found");
        }
    })
});

app.post("/todos", (req, res) => {
  let newtodo = {
    id: Math.floor(Math.random() * 1000000),
    title: req.body.title,
    description: req.body.description,
  };
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const addtodo = JSON.parse(data);
    // console.log(addtodo);
    addtodo.push(newtodo);
    // console.log(addtodo);
    fs.writeFile("todos.json", JSON.stringify(addtodo), (err, data) => {
      if (err) {
        throw err;
      } else {
        res.status(201).json({ msg: "todo added successfully" });
      }
    });
  });
});

app.put("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    // console.log(todos);
    const findIndex = todos.findIndex((i) => i.id === parseInt(req.params.id));
    // console.log(findIndex);
    if (findIndex !== -1) {
      let updatedObj = {
        id: parseInt(req.params.id),
        title: req.body.title,
        description: req.body.description,
      };
      todos[findIndex] = updatedObj;
      fs.writeFile('todos.json', JSON.stringify(todos), (err, data)=>{
        if(err) throw err;
        res.status(200).json({ msg: "updated successfully" });
      })
    } else {
      res.status(404).send("404 not found");
    }
  });
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile('todos.json', 'utf8', (err, data)=>{
    if(err) throw err;
    let todos = JSON.parse(data);
    // console.log(todos);
    let findIndex = todos.findIndex((i)=>i.id === parseInt(req.params.id));
    // console.log(findIndex);
    let newArray = [];
    if (findIndex !== -1) {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i] !== todos[findIndex]) {
          newArray.push(todos[i]);
        }
      }
      todos = newArray;
      fs.writeFile('todos.json', JSON.stringify(todos), (err, data)=>{
        if(err) throw err;
        res.status(200).json({ msg: "todo deleted" });
      })
    } else {
      res.status(404).send("404 not found");
    }
  })
});

app.listen(3000, () => {
  console.log("app is listening to server 3000");
});
