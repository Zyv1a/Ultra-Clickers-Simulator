const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const PORT = 3001;

const server = http.createServer((req, res) => {
    res.end('Serveur en cours d\'exécution');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket établie');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.action === 'start') {
            // Activer les fonctionnalités
            console.log('Activation des fonctionnalités...');
            // Par exemple, tu peux activer des fonctionnalités ici
            activateFeature('leaderboard');
            activateFeature('rebirths');
        }

        if (data.action === 'stop') {
            // Désactiver les fonctionnalités
            console.log('Désactivation des fonctionnalités...');
            // Par exemple, tu peux désactiver des fonctionnalités ici
            deactivateFeature('leaderboard');
            deactivateFeature('rebirths');
        }
    });

    ws.on('close', () => {
        console.log('Connexion WebSocket fermée');
    });
});

server.listen(PORT, () => {
    console.log(`Serveur actif sur le port ${PORT}`);
});

// Exemple de fonctions pour activer ou désactiver les fonctionnalités
const activateFeature = (feature) => {
    const status = JSON.parse(fs.readFileSync('status.json', 'utf8'));
    status.features[feature] = true;
    fs.writeFileSync('status.json', JSON.stringify(status, null, 2));
};

const deactivateFeature = (feature) => {
    const status = JSON.parse(fs.readFileSync('status.json', 'utf8'));
    status.features[feature] = false;
    fs.writeFileSync('status.json', JSON.stringify(status, null, 2));
};
