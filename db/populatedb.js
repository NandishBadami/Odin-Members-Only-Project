const { Client } = require('pg');

const SQL = `
    CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    email VARCHAR ( 255 ) NOT NULL,
    password VARCHAR ( 255 ) NOT NULL,
    member BOOLEAN DEFAULT FALSE NOT NULL,
    admin BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE user_messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR (255) NOT NULL,
    message VARCHAR (255) NOT NULL,
    date_added VARCHAR (255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);
`;


/* 

*/

const client = new Client({
    connectionString: 'postgresql://postgres:SRdABQPJPEPSgerYKfoGEQhrTiGWOviG@shuttle.proxy.rlwy.net:23284/railway'
});

client.connect(console.log('Seeding...'))
.then(client.query(SQL).then(res => {
    console.log(res.rows);
    client.end()
    .then(console.log('Done!'));
}));