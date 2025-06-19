const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./Routes/routes.js');

app.use(express.json());
app.use(cors());
app.use('/api', apiRoutes);
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
