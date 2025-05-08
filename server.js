// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mailRoutes = require('./routes/mailRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/mail', mailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mail server running on port ${PORT}`);
});
