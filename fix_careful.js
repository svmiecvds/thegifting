const fs = require('fs');

const files = ['result.html', 'final.html', 'gift.html'];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove mobile-block.js
    content = content.replace(/<script src="mobile-block\.js"><\/script>\r?\n?/g, '');
    content = content.replace(/<script src="\/mobile-block\.js"><\/script>\r?\n?/g, '');

    // 2. Remove audio state vars
    const audioStateVars = `let hasAudioNote = false;
let activeAudio = null;
const audioPlaylist = [];
let currentPlaylistIndex = -1;
let isPlaylistPlaying = false;
let fallbackTimeoutId = null;`;
    content = content.replace(audioStateVars, '');
    
    // Also Windows line endings version
    const audioStateVarsWin = audioStateVars.replace(/\n/g, '\r\n');
    content = content.replace(audioStateVarsWin, '');

    // 3. Replace voice note parsing block (careful with braces)
    content = content.replace(/\s*\/\/\s*Voice Note Playback[\s\S]*?duration: voiceNoteDuration\r?\n\s*\}\r?\n\s*\}/g, '\n    }');

    // 4. Remove playlist functions and CTA
    const playlistRegex = /\s*\/\/\s*Playlist control functions[\s\S]*?\/\/\s*Add pulsing play action[\s\S]*?\}\);\r?\n\s*\}/g;
    content = content.replace(playlistRegex, '');

    fs.writeFileSync(file, content);
}
console.log('Fixed files');
