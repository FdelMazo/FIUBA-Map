import express from 'express';
import dotenv from 'dotenv';

import load from './api/load.js';

const app = express();
const port = 3001;

dotenv.config();

app.all("/api/load", load);

app.listen(port, () => {
  console.log(`dev server is running at http://localhost:${port}`);
});
