/**
 * @author Pif Paf Pouf Team
 * Discord Rich Presence Integration
 */

const RPC = require('discord-rpc');

class DiscordPresence {
    constructor() {
        this.clientId = '1415396907060301905';
        this.rpc = new RPC.Client({ transport: 'ipc' });
        this.connected = false;
        this.currentActivity = null;
        
        // Messages drôles pour le launcher
        this.launcherMessages = [
            "🎮 Prépare ses armes légendaires",
            "🔥 Chauffe ses doigts de gamer",
            "⚡ Invoque l'esprit du PvP",
            "🎯 Calibre sa précision de sniper",
            "🚀 Se téléporte vers l'aventure",
            "💎 Forge sa légende",
            "🌟 Rassemble sa team de choc",
            "🎪 Rejoint le cirque Pif Paf Pouf",
            "🎭 Met son masque de héros",
            "🎲 Lance les dés du destin"
        ];

        // Messages drôles pour le jeu
        this.gameMessages = [
            "🏰 Domine le royaume Pif Paf Pouf",
            "⚔️ Tranche du mob avec style",
            "🎪 Fait le show dans l'arène",
            "🎯 Vise la gloire éternelle",
            "💪 Flex ses skills de boss",
            "🔥 Met le feu au serveur",
            "🌟 Brille comme une étoile",
            "🎮 Écrase la concurrence",
            "👑 Règne en maître absolu",
            "🚀 Explore des dimensions epic"
        ];

        this.init();
    }

    async init() {
        try {
            await this.rpc.login({ clientId: this.clientId });
            this.connected = true;
            console.log('Discord Rich Presence connecté !');
            this.setLauncherActivity();
        } catch (error) {
            console.log('Discord Rich Presence non disponible:', error.message);
            this.connected = false;
        }
    }

    getRandomMessage(messageArray) {
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }

    setLauncherActivity() {
        if (!this.connected) return;
        
        const activity = {
            details: this.getRandomMessage(this.launcherMessages),
            state: "Dans le launcher",
            largeImageKey: "pif_paf_pouf_logo",
            largeImageText: "Pif Paf Pouf - Launcher Epic",
            smallImageKey: "launcher_icon",
            smallImageText: "Launcher v2.1.4",
            instance: false,
            timestamp: Date.now()
        };

        this.currentActivity = activity;
        this.rpc.setActivity(activity).catch(console.error);
    }

    setGameActivity(playerCount = "?") {
        if (!this.connected) return;
        
        const activity = {
            details: this.getRandomMessage(this.gameMessages),
            state: `🎯 Avec ${playerCount} guerriers`,
            largeImageKey: "pif_paf_pouf_logo", 
            largeImageText: "Pif Paf Pouf Server",
            smallImageKey: "minecraft_icon",
            smallImageText: "Minecraft 1.21.8 + NeoForge",
            instance: false,
            timestamp: Date.now(),
            buttons: [
                {
                    label: "🚀 Rejoindre l'aventure !",
                    url: "https://discord.gg/pifpafpouf"
                }
            ]
        };

        this.currentActivity = activity;
        this.rpc.setActivity(activity).catch(console.error);
    }

    setIdleActivity() {
        if (!this.connected) return;
        
        const activity = {
            details: "💤 Prend une pause bien méritée",
            state: "En attente d'action",
            largeImageKey: "pif_paf_pouf_logo",
            largeImageText: "Pif Paf Pouf",
            smallImageKey: "idle_icon", 
            smallImageText: "AFK mais stylé",
            instance: false
        };

        this.currentActivity = activity;
        this.rpc.setActivity(activity).catch(console.error);
    }

    updateActivity() {
        if (!this.connected) return;
        
        // Change le message toutes les 2 minutes pour éviter l'ennui
        if (this.currentActivity) {
            if (this.currentActivity.state === "Dans le launcher") {
                this.setLauncherActivity();
            } else if (this.currentActivity.details.includes("🎯")) {
                // Extract player count from current state
                const playerMatch = this.currentActivity.state.match(/(\d+)/);
                const playerCount = playerMatch ? playerMatch[1] : "?";
                this.setGameActivity(playerCount);
            }
        }
    }

    disconnect() {
        if (this.connected) {
            this.rpc.destroy();
            this.connected = false;
            console.log('Discord Rich Presence déconnecté');
        }
    }
}

export default new DiscordPresence();