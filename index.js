const http = require('http');
const WebSocket = require('ws');  // Importation de WebSocket pour gérer le serveur WebSocket
require('dotenv').config();  // Pour charger les variables d'environnement

const PORT = process.env.PORT || 3002;  // Le port du serveur WebSocket

// Création d'un serveur HTTP pour accueillir WebSocket
const server = http.createServer((req, res) => {
    res.end('Serveur backend actif !');
});

// Création du serveur WebSocket
const wss = new WebSocket.Server({ server });

let leaderboardsActive = false;

// Gestion des connexions WebSocket
wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket établie');

    ws.on('message', (message) => {
        console.log('Message reçu du client:', message);
        
        const data = JSON.parse(message);

        // Activer ou désactiver les leaderboards en fonction des actions
        if (data.action === 'activate_leaderboards') {
            leaderboardsActive = true;
            console.log('Leaderboards activés');
        } else if (data.action === 'deactivate_leaderboards') {
            leaderboardsActive = false;
            console.log('Leaderboards désactivés');
        }
    });

    // Envoi des données des leaderboards toutes les 5 secondes si activés
    setInterval(() => {
        if (leaderboardsActive) {
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

            ws.send(JSON.stringify(leaderboardData));  // Envoi des données à chaque client toutes les 5 secondes
        }
    }, 5000);
});

// Démarrage du serveur WebSocket
server.listen(PORT, () => {
    console.log(`Serveur WebSocket actif sur le port ${PORT}`);
});

module.exports = { server };
