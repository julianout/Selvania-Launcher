#!/bin/bash

# Pif Paf Pouf Launcher - Script de déploiement automatique
# Génère un build Windows et envoie une notification Discord

set -e

echo "🚀 Début du déploiement Pif Paf Pouf Launcher..."

# Variables
WEBHOOK_URL="https://discord.com/api/webhooks/1388112765134307409/gW3jc0uEY0yPJlJVBYc1o5Ne_EjBkWIQ4zdDl4xFswEll1ZjcoZ1Oi_E29Z6PFIvMTJL"
VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Fonctions de notification Discord
send_discord_notification() {
    local title="$1"
    local description="$2"
    local color="$3"
    local status="$4"
    
    cat > /tmp/discord_embed.json << EOF
{
    "embeds": [{
        "title": "$title",
        "description": "$description",
        "color": $color,
        "fields": [
            {
                "name": "Version",
                "value": "$VERSION",
                "inline": true
            },
            {
                "name": "Platform",
                "value": "Windows x64/ia32",
                "inline": true
            },
            {
                "name": "Status",
                "value": "$status",
                "inline": true
            }
        ],
        "timestamp": "$TIMESTAMP",
        "footer": {
            "text": "🤖 Développé avec Claude Code"
        }
    }]
}
EOF

    curl -X POST "$WEBHOOK_URL" \
         -H "Content-Type: application/json" \
         -d @/tmp/discord_embed.json
    
    rm /tmp/discord_embed.json
}

# Notification de début
send_discord_notification "🔄 Build Pif Paf Pouf Launcher" "Démarrage du processus de build..." "3447003" "En cours"

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm ci
fi

# Build pour Windows
echo "🔨 Compilation pour Windows..."
if npm run build; then
    echo "✅ Build réussi!"
    
    # Vérification des fichiers générés
    if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
        BUILD_SIZE=$(du -sh dist | cut -f1)
        send_discord_notification "✅ Build Pif Paf Pouf Launcher Réussi" "Le launcher a été compilé avec succès pour Windows!" "3066993" "Terminé avec succès"
        
        echo "📁 Taille du build: $BUILD_SIZE"
        echo "📋 Fichiers générés dans ./dist/"
        ls -la dist/
    else
        send_discord_notification "❌ Build Pif Paf Pouf Launcher Échoué" "Aucun fichier de sortie généré" "15158332" "Erreur"
        exit 1
    fi
    
else
    echo "❌ Erreur lors du build"
    send_discord_notification "❌ Build Pif Paf Pouf Launcher Échoué" "Erreur durant la compilation Windows" "15158332" "Erreur"
    exit 1
fi

echo "🎉 Déploiement terminé!"