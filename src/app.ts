import express from 'express';
import cors from 'cors'; 
import routerAuth from './routes/user.route';
import routerTache from './routes/tache.route';
import googleAuthRouter from './routes/googleAuth.route';

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', 
}));

app.use(express.json());
app.use('/api/v1/auth', routerAuth);
app.use('/api/v1/taches', routerTache);
app.use('/api/v1/auth', googleAuthRouter);

export default app;
