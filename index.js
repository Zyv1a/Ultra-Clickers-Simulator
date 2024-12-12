// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importer les bibliothèques nécessaires
const http = require('http');
const WebSocket = require('ws');
const { Client, GatewayIntentBits } = require('discord.js');

// Utiliser le port défini par Vercel ou 3001 par défaut
const PORT = process.env.PORT || 3001;

// Définir l'ID du salon où les commandes sont autorisées
const ALLOWED_CHANNEL_ID = '1316848219690369024';  // Salon autorisé

// Créer une instance du client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Connexion au bot Discord avec le token chargé depuis .env
client.login(process.env.DISCORD_TOKEN);

// Variables pour gérer l'état du WebSocket
let wssActive = false;
let leaderboardInterval = null;

// Connexion au serveur HTTP et WebSocket
const server = http.createServer((req, res) => {
    res.end('Le serveur backend est opérationnel !');
});

// Créer un serveur WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Nouvelle connexion WebSocket établie');

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

    // Si le serveur WebSocket est actif, envoyer les données du leaderboard toutes les 5 secondes
    if (wssActive) {
        leaderboardInterval = setInterval(() => {
            ws.send(JSON.stringify(leaderboardData));
        }, 5000);
    }

    // Gérer les messages reçus par WebSocket
    ws.on('message', (message) => {
        console.log('Message reçu du client:', message);
    });

    // Gérer la fermeture de la connexion WebSocket
    ws.on('close', () => {
        console.log('Connexion WebSocket fermée');
    });
});

// Événement : lorsque le bot est prêt
client.once('ready', () => {
    console.log(`Le bot ${client.user.tag} est prêt et connecté !`);

    // Gérer les messages reçus dans Discord
    client.on('messageCreate', (message) => {
        // Ne pas répondre si le message vient d'un bot ou s'il n'est pas dans le salon autorisé
        if (message.author.bot || message.channel.id !== ALLOWED_CHANNEL_ID) {
            return;
        }

        // Commande pour démarrer l'envoi des données WebSocket
        if (message.content.toLowerCase() === '!start') {
            if (!wssActive) {
                wssActive = true;
                message.channel.send('Le serveur WebSocket est maintenant actif et envoie les données du leaderboard.');
            } else {
                message.channel.send('Le serveur WebSocket est déjà actif.');
            }
        }

        // Commande pour arrêter l'envoi des données WebSocket
        if (message.content.toLowerCase() === '!stop') {
            if (wssActive) {
                wssActive = false;
                clearInterval(leaderboardInterval);  // Arrêter l'envoi des données
                message.channel.send('Le serveur WebSocket est maintenant inactif.');
            } else {
                message.channel.send('Le serveur WebSocket est déjà inactif.');
            }
        }
    });
});

// Démarrer le serveur HTTP et WebSocket
server.listen(PORT, () => {
    console.log(`Serveur actif sur le port ${PORT}`);
});
