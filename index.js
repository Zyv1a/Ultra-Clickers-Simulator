const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');
const WebSocket = require('ws');  // Importer la bibliothèque WebSocket
require('dotenv').config();  // Pour utiliser les variables d'environnement

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const PORT = process.env.PORT || 3000;  // Utiliser le port défini par Vercel, sinon 3001

const server = http.createServer((req, res) => {
    res.end('Le serveur backend est opérationnel !');
});

const wss = new WebSocket.Server({ server });

client.once('ready', () => {
    console.log('Bot Discord connecté');
});

client.on('messageCreate', (message) => {
    if (message.channel.id === process.env.ALLOWED_CHANNEL_ID) {  // Vérifier que le message provient du salon autorisé
        if (message.content === '!start') {
            // Démarrer la fonctionnalité de WebSocket lorsque la commande est envoyée
            console.log('Commande !start reçue, démarrage du WebSocket...');
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

                setInterval(() => {
                    ws.send(JSON.stringify(leaderboardData));  // Envoyer les données en JSON
                }, 5000);

                ws.on('message', (message) => {
                    console.log('Message reçu du client:', message);
                });

                ws.on('close', () => {
                    console.log('Connexion WebSocket fermée');
                });
            });
            message.reply('La fonctionnalité WebSocket a démarré.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);  // Se connecter avec le token du bot

server.listen(PORT, () => {
    console.log(`Serveur actif sur le port ${PORT}`);
});
