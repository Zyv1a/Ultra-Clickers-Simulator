// URL de ton webhook Discord
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1326976373541044354/INnqRHZdL5125vHnrrOlMJ7ilSOa7NbTSlG7K55qy7DSrh2uJqeRKSlXz20UeDOin5Jl";

// Fonction pour envoyer une alerte au webhook Discord
function sendDiscordAlert(message) {
    fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: message // Contenu du message envoyé à Discord
        })
    }).catch(err => console.error("Erreur lors de l'envoi au webhook Discord:", err));
}

// Détection de scripts suspects
window.addEventListener('error', function (e) {
    const errorMessage = `🚨 **Activité suspecte détectée :**
- Message : ${e.message}
- Fichier : ${e.filename}
- Ligne : ${e.lineno}, Colonne : ${e.colno}`;

    console.error(errorMessage);
    alert('Unauthorized scripts are not allowed!');
    sendDiscordAlert(errorMessage);
});

// Limiter les requêtes excessives
let requestCount = 0;
setInterval(() => requestCount = 0, 1000); // Réinitialise toutes les secondes
window.addEventListener('click', () => {
    requestCount++;
    if (requestCount > 10) {
        const alertMessage = "🚨 **Tentative de flood détectée !** Trop de clics en peu de temps.";
        alert(alertMessage);
        sendDiscordAlert(alertMessage);
        window.location.href = '/blocked.html';
    }
});

// Protection contre les requêtes non autorisées via fetch
(function() {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        if (!args[0].startsWith(window.location.origin)) {
            const fetchAlert = `🚨 **Requête suspecte détectée :**
- URL : ${args[0]}
- Méthode : ${args[1]?.method || "GET"}`;

            console.warn(fetchAlert);
            alert('Unauthorized fetch detected! This action is not allowed.');
            sendDiscordAlert(fetchAlert);
            return Promise.reject('Unauthorized fetch');
        }
        return originalFetch.apply(this, args);
    };
})();

// Protection contre les injections de script
document.addEventListener('DOMContentLoaded', function () {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'SCRIPT') {
                        const scriptAlert = `🚨 **Tentative d'injection de script détectée :**
- Contenu : ${node.src || node.innerHTML}`;
                        
                        console.warn(scriptAlert);
                        sendDiscordAlert(scriptAlert);
                        node.parentNode.removeChild(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

// Protection des cookies
Object.defineProperty(document, 'cookie', {
    configurable: false,
    enumerable: true,
    get: function() {
        return '';
    },
    set: function(value) {
        const cookieAlert = `🚨 **Tentative de modification de cookie détectée :**
- Contenu : ${value}`;
        
        console.warn(cookieAlert);
        alert('Cookies cannot be modified!');
        sendDiscordAlert(cookieAlert);
    }
});
