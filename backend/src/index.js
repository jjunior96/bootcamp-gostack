const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do backend
 * POST: Criar uma informação
 * PUT/PATCH: Alterar uma informação no backend
 * DELETE: Deletar uma informação no backend
 * 
**/

/**
 * Tipo de parâmetros
 * 
 * Query Params: Filtros e paginação
 * Route Params: Identificar recursos (Atualizar/Deletar)
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 * 
**/

/**
 * Middleware: 
 * 
 * Intecepatador de requisições
 * - interromper a requisição ou
 * - alterar dados da requisição
**/

const projects = [];

// Middleware
function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] - ${url}`;

  console.log(logLabel);

  next(); // Próximo middleware
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

 if(!isUuid(id)) {
  return response.status(400).json({ error: 'Invalid project ID.' });
 }

  next(); // Próximo middleware
}

// Usando os Middlewares
app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  const { title } = request.query; 

  const results = title 
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
});

app.post('/projects/', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  // Caso não tenha encontrado o projeto, retorna um numero negativo
  if(projectIndex < 0) {
    return response.status(404).json({ error: 'Project not found.' })
  }

  const project = {
    id, 
    title,
    owner,
  };

  project[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;
  const projectIndex = projects.findIndex(project => project.id === id);

  // Caso não tenha encontrado o projeto, retorna um numero negativo
  if(projectIndex < 0) {
    return response.status(404).json({ error: 'Project not found.' })
  }

  projects.splice(projectIndex, 1);

  return response.status(204).json();
});


app.listen(3333, () => {
  console.log('🚀 - running!')
});