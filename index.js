const express = require('express');

const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log('listening at 3000'))
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
const Database = new Datastore('database.db');
Database.loadDatabase();

app.post('/api', (request, response) => {
    const data = request.body;
    Database.insert(data);
    response.json(data);
});