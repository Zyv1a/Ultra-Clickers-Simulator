const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.end('Le serveur backend est opérationnel !');
});

server.listen(PORT, () => {
    console.log(`Serveur actif sur le port ${PORT}`);
});
