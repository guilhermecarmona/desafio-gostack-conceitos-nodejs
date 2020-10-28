const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function ensureValidUuid(request, response, next){
  const {id} = request.params;
  
  if(!isUuid(id)) return response.status(400).json();
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0};
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", ensureValidUuid, (request, response) => {
  const {id} = request.params;
  const {title,url,techs} = request.body;
  const repositoryIdx = repositories.findIndex(rep => rep.id === id);
  const updatedRepository = {...repositories[repositoryIdx],title,url,techs};
  repositories[repositoryIdx] = updatedRepository;
  return response.json(updatedRepository);
});

app.delete("/repositories/:id", ensureValidUuid, (request, response) => {
  const {id} = request.params;
  const repositoryIdx = repositories.findIndex(rep => rep.id === id);
  repositories.splice(repositoryIdx,1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", ensureValidUuid, (request, response) => {
  const {id} = request.params;
  const repositoryIdx = repositories.findIndex(rep => rep.id === id);
  if(repositoryIdx < 0) return response.status(400);
  const likes = repositories[repositoryIdx].likes + 1;
  repositories.splice(repositoryIdx,1,{...repositories[repositoryIdx],likes});
  return response.status(201).json(repositories[repositoryIdx]);
});

module.exports = app;
