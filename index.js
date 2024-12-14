// index.js
const { server } = require('./server'); // Importer le serveur WebSocket
const WebSocket = require('ws');  // Importation de WebSocket
require('dotenv').config();  // Charger les variables d'environnement

// Connexion WebSocket à localhost:3002
const ws = new WebSocket('ws://localhost:3003');

// Commandes de contrôle
let leaderboardsActive = false;

// Lors de l'ouverture de la connexion WebSocket
ws.on('open', () => {
    console.log('Connexion WebSocket établie avec succès');
});

// Lors de la réception de messages WebSocket
ws.on('message', (message) => {
    console.log('Message du serveur WebSocket:', message);
    const data = JSON.parse(message);

    // Exemple de données leaderboards envoyées par le serveur
    console.log('Données des leaderboards:', data);
});

// Exemple de fonction pour activer les leaderboards via WebSocket
function activateLeaderboards() {
    if (!leaderboardsActive) {
        leaderboardsActive = true;
        ws.send(JSON.stringify({ action: 'activate_leaderboards' }));
        console.log('Leaderboards activés');
    } else {
        console.log('Les leaderboards sont déjà activés');
    }
}

// Exemple de fonction pour désactiver les leaderboards
function deactivateLeaderboards() {
    if (leaderboardsActive) {
        leaderboardsActive = false;
        ws.send(JSON.stringify({ action: 'deactivate_leaderboards' }));
        console.log('Leaderboards désactivés');
    } else {
        console.log('Les leaderboards sont déjà inactifs');
    }
}

// Démarrage du serveur WebSocket
server.listen(process.env.PORT || 3003, () => {
    console.log('Serveur actif sur le port 3003');
});

// Exporter pour d'autres fichiers si nécessaire
module.exports = { activateLeaderboards, deactivateLeaderboards };
