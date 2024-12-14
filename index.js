const { Client, GatewayIntentBits } = require('discord.js');
const WebSocket = require('ws');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const token = process.env.DISCORD_TOKEN;
const ws = new WebSocket('ws://localhost:3002');  // Assure-toi que le serveur WebSocket est actif

let botActive = true;
let leaderboardsActive = false;
const logChannelId = '1316848219690369024';  // Remplacez par l'ID du salon où les logs seront envoyés

ws.on('open', () => {
    console.log('Connexion WebSocket établie avec succès.');
});

ws.on('error', (error) => {
    console.error('Erreur WebSocket :', error);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const logChannel = client.channels.cache.get(logChannelId); // Récupère le salon de log

    // Commande pour activer le bot
    if (message.content.toLowerCase() === '!activate') {
        if (!botActive) {
            botActive = true;
            message.channel.send('Le bot est maintenant activé!');
            console.log('Bot activé!');
            if (logChannel) {
                logChannel.send('Commande !activate utilisée. Le bot est maintenant activé!');
            }
        } else {
            message.channel.send('Le bot est déjà activé.');
            console.log('Le bot était déjà actif.');
            if (logChannel) {
                logChannel.send('Commande !activate utilisée. Le bot était déjà actif.');
            }
        }
    }

    // Commande pour désactiver le bot
    if (message.content.toLowerCase() === '!deactivate') {
        if (botActive) {
            botActive = false;
            message.channel.send('Le bot est maintenant désactivé.');
            console.log('Bot désactivé!');
            if (logChannel) {
                logChannel.send('Commande !deactivate utilisée. Le bot est maintenant désactivé!');
            }
        } else {
            message.channel.send('Le bot est déjà désactivé.');
            console.log('Le bot était déjà désactivé.');
            if (logChannel) {
                logChannel.send('Commande !deactivate utilisée. Le bot était déjà désactivé.');
            }
        }
    }

    // Commande pour démarrer les leaderboards
    if (message.content === '!start-leaderboards') {
        if (!leaderboardsActive) {
            leaderboardsActive = true;
            message.reply('Les leaderboards sont maintenant actifs !');
            console.log('Commande !start-leaderboards reçue, démarrage du WebSocket...');
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: 'activate_leaderboards' }));
                console.log('Message envoyé au WebSocket pour activer les leaderboards.');
                if (logChannel) {
                    logChannel.send('Commande !start-leaderboards utilisée. Les leaderboards sont maintenant actifs.');
                }
            } else {
                console.error('WebSocket non ouvert pour envoyer la commande d\'activation des leaderboards.');
            }
        } else {
            message.reply('Les leaderboards sont déjà actifs.');
            console.log('Les leaderboards sont déjà actifs.');
            if (logChannel) {
                logChannel.send('Commande !start-leaderboards utilisée. Les leaderboards sont déjà actifs.');
            }
        }
    }

    // Commande pour arrêter les leaderboards
    if (message.content === '!stop-leaderboards') {
        if (leaderboardsActive) {
            leaderboardsActive = false;
            message.reply('Les leaderboards sont maintenant inactifs.');
            console.log('Commande !stop-leaderboards reçue, désactivation des leaderboards...');
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: 'deactivate_leaderboards' }));
                console.log('Message envoyé au WebSocket pour désactiver les leaderboards.');
                if (logChannel) {
                    logChannel.send('Commande !stop-leaderboards utilisée. Les leaderboards sont maintenant inactifs.');
                }
            } else {
                console.error('WebSocket non ouvert pour envoyer la commande de désactivation des leaderboards.');
            }
        } else {
            message.reply('Les leaderboards sont déjà inactifs.');
            console.log('Les leaderboards sont déjà inactifs.');
            if (logChannel) {
                logChannel.send('Commande !stop-leaderboards utilisée. Les leaderboards sont déjà inactifs.');
            }
        }
    }

    // Exemple si le bot est actif
    if (botActive && message.content.toLowerCase() === '!hello') {
        message.channel.send('Bonjour ! Le bot est activé.');
        console.log('Réponse à la commande !hello.');
        if (logChannel) {
            logChannel.send('Commande !hello utilisée. Le bot a répondu.');
        }
    }
});

async function startBot() {
    await client.login(token);
    console.log('Bot connecté avec succès.');
}

module.exports = { startBot };
