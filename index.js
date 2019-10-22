const express = require('express');
const App = express();

const projects = [];
let contador = 0;

App.use(express.json());

//Middleware com funçao de contar quantas requisições estão sendo feitas pelo usuário
function countReq(req, res, next) {
  next();
  contador++; 
  console.log(contador);
}
//Middleare com funçao de checar se o id requisitado existe no BD
function checkId(req, res, next) {
  const { id } = req.params;
  
  const project = projects.findIndex(obj => obj.id === id);

  if (project == -1) {
    return res.status(400).json({ message: "This id not exist" });
  }
  req.project = project;

  return next();
}

//CRUD projetos
App.post("/projects", countReq, (req, res) =>{
  const { id, title } = req.body;
  
  const project = {
    'id': id,
    'title': title,
    'tasks': []
  };

  projects.push(project);
  return res.json({ message: "OK" });

});

App.get("/projects", countReq, (req, res) => {
  return res.json(projects);
});

App.put("/projects/:id", countReq, checkId, (req, res) =>{
  const { id } = req.params;
  projects[id].title = req.body.title;

  return res.json({ projects })
});

App.delete("/projects/:id", countReq, checkId, (req, res) => {
  
  projects.splice(req.project, 1);

  return res.json(projects);
});

App.post("/projects/:id/tasks", countReq, checkId, (req, res) => {
  const { title } = req.body;

  projects[req.project].tasks.push(title);

  return res.json(projects);
});

App.listen(3000);