import express from 'express';
import cors    from 'cors';

import './loadEnv.mjs';

import homeRoutes     from './routes/home.mjs';
import contactsRoutes from './routes/contacts.mjs';

// Web server
const PORT = process.env.PORT || 8080;
const app  = express();

app.use(cors());
app.use(express.json());

// BaseRoutes
app.use('/', homeRoutes);
app.use('/contacts', contactsRoutes);


// Global error handling
app.use((err, _req, res, _next) => {
  console.log(err)
  res.status(500).send({ error: "Uh oh! An unexpected error occured." });
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
