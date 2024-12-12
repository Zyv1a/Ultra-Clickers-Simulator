// Importer les modules nécessaires
const http = require('http');
const WebSocket = require('ws');  // Importer la bibliothèque WebSocket

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
    res.end('Le serveur backend est opérationnel !');
});

// Créer un serveur WebSocket
const wss = new WebSocket.Server({ server });

// Gérer les connexions WebSocket
wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket établie');

    // Envoyer un message au client lorsque la connexion est établie
    ws.send('Bienvenue sur le serveur WebSocket !');

    // Simuler des données de classement
    const leaderboardData = {
        clicks: [
            { playerName: 'Player1', score: 1500 },
            { playerName: 'Player2', score: 1200 },
            { playerName: 'Player3', score: 1000 }
        ],
        rebirths: [
            { playerName: 'Player1', score: 10 },
            { playerName: 'Player2', score: 8 },
            { playerName: 'Player3', score: 6 }
        ],
        eggs: [
            { playerName: 'Player1', score: 50 },
            { playerName: 'Player2', score: 40 },
            { playerName: 'Player3', score: 30 }
        ]
    };

    // Envoyer les données de classement toutes les 5 secondes
    setInterval(() => {
        ws.send(JSON.stringify(leaderboardData));  // Envoyer les données en JSON
    }, 5000);

    // Gérer les messages reçus du client
    ws.on('message', (message) => {
        console.log('Message reçu du client:', message);
        // Vous pouvez traiter les messages reçus ici
    });

    // Gérer la fermeture de la connexion WebSocket
    ws.on('close', () => {
        console.log('Connexion WebSocket fermée');
    });
});

// Lancer le serveur sur le port défini par Vercel (ou le port par défaut 3000)
server.listen(process.env.PORT || 3000, () => {
    console.log(`Serveur actif sur le port ${process.env.PORT || 3000}`);
});
