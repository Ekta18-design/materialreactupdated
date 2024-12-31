// src/app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import userMasterRoutes from './routes/usermaster.js';
import partyMasterRoute from './routes/partymaster.js';
import fetchCatRoute from './routes/fetchcat.js';
import expenseMasterRoute from './routes/expensemaster.js';
import loginRoute from './routes/login.js';
import registrationRoute from './routes/registration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());


app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve static files from the "uploads" directory
app.use('/expensefolder', express.static(path.join(__dirname, 'expensefolder')));

app.use('/usermaster', userMasterRoutes);
app.use('/partymaster',partyMasterRoute);
app.use('/fetchcat',fetchCatRoute);
app.use('/expensemaster',expenseMasterRoute);
app.use('/login', loginRoute);
app.use('/registration',registrationRoute);


export default app;
