import express from 'express'
import router from './routers/rutas.js';

const PUERTO = 3000;
const app = express();

app.use(express.json());

app.use('/url/short/', router);

app.listen(PUERTO, console.log(`Escuchando en localhost:${PUERTO}`));