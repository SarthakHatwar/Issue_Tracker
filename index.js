const express = require('express');
const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let projects = [];
let issues = [];

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/show-projects', (req, res) => {
  res.render('showProjects', { projects });
});

app.get('/create-project', (req, res) => {
  res.render('createProject');
});

app.post('/create-project', (req, res) => {
  const { name, description, author } = req.body;
  const newProject = { name, description, author, issues: [] };
  projects.push(newProject);
  res.redirect('/');
});

app.get('/project/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  const project = projects[projectId];
  
  if (!project) {
    return res.status(404).send('Project not found');
  }
  
  const projectIssues = project.issues.map(issueIndex => issues[issueIndex]);

  res.render('projectDetail', { project, projectIssues, projectId });
});
app.get('/create-issue/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  const projectIndex = parseInt(projectId);
  const project = projects[projectIndex];

  if (!project) {
    return res.status(404).send('Project not found');
  }

  res.render('createIssue', { projectId: projectIndex });
});

app.post('/create-issue/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  const { title, description, author } = req.body;
  const projectIndex = parseInt(projectId);

  if (!projects[projectIndex]) {
    return res.status(404).send('Project not found');
  }

  const newIssue = { title, description, author };
  issues.push(newIssue);
  projects[projectIndex].issues.push(issues.length - 1);

  res.redirect(`/project/${projectIndex}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
