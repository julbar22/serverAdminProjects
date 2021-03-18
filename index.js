const express = require('express');
const conectarDB = require('./config/db');

const app = express();

conectarDB();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.status(200).json({ result: 'El servidor funciona' });
});

app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})