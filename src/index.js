const express = require("express");

const { v4: uuidv4, validate  } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs: [...techs],
    likes: 0
  };
  
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  if(!validate(id)){
    return response.status(404).json({ error: "Id invalid" });
  }

  const existsRepository = repositories.find(repository => repository.id === id);

  if(!existsRepository){
    return response.status(400).send({error: "User not exists!"});
  }

  let tempRepository = null;  
  repositories.forEach(repository =>{
    if(repository.id === id){
      if(title !== undefined && repository.title !== title) repository.title = title;
      if(url !== undefined && repository.url !== url) repository.url = url;
      if(techs !== undefined && repository.techs != techs) repository.techs = techs;
      tempRepository = repository;
    }
  })

  return response.status(200).json(tempRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if(!validate(id)){
    return response.status(404).json({ error: "Id invalid" });
  }

  let repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if(!validate(id)){
    return response.status(404).json({ error: "Id invalid" });
  }

  let repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex].likes++;

  return response.status(201).json(repositories[repositoryIndex]);
});

module.exports = app;
