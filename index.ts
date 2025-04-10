import { registerRootComponent } from 'expo';

import App from './app/index';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let tasks: any[] = [];
let reminders: any[] = [];
let importantDates: string[] = ['2025-04-10', '2025-04-15'];

let id = 1;

app.get('/tasks', (req: express.Request, res: express.Response): void => {
  res.json(tasks);
});
app.post('/tasks', (req, res) => {
  const task = { id: id++, ...req.body };
  tasks.push(task);
  res.status(201).json(task);
});
app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== +req.params.id);
  res.json({ message: 'Deleted' });
});

app.get('/reminders', (req: express.Request, res: express.Response): void => {
  res.json(reminders);
});
app.post('/reminders', (req, res) => {
  const reminder = { id: id++, ...req.body };
  reminders.push(reminder);
  res.status(201).json(reminder);
});
app.get('/important-dates', (req: express.Request, res: express.Response): void => {
  res.json(importantDates);
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));