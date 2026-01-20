import dotenv from 'dotenv/config'
import express from 'express';
import router from './routes/rutas.js';

const app = express();

app.use(express.json());
app.use('/', router);

app.listen(process.env.PUERTO || 3000, console.log("http://localhost:" + process.env.PUERTO));