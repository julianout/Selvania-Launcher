const { app } = require('electron');
const path = require('path');

module.exports = {
    productName: 'Selvania Launcher',
    appId: 'fr.selvania.launcher',
    
    directories: {
        output: 'dist'
    },
    
    files: [
        'src/**/*',
        'node_modules/**/*',
        'package.json'
    ],
    
    extraMetadata: {
        main: 'src/app.js'
    },
    
    win: {
        target: [
            {
                target: 'nsis',
                arch: ['x64', 'ia32']
            }
        ],
        icon: 'src/assets/images/icon.ico',
        publisherName: 'Selvania Network',
        verifyUpdateCodeSignature: false
    },
    
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: 'Selvania Launcher'
    },
    
    mac: {
        target: 'dmg',
        icon: 'src/assets/images/icon.icns',
        category: 'public.app-category.games'
    },
    
    linux: {
        target: 'AppImage',
        icon: 'src/assets/images/icon.png',
        category: 'Game'
    },
    
    publish: {
        provider: 'github',
        owner: 'julianout',
        repo: 'Selvania-Launcher'
    }
};