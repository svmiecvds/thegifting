const fs = require('fs');
const files = ['result.html', 'final.html', 'gift.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove mobile-block.js
  content = content.replace(/<script src=\"\/?mobile-block\.js\"><\/script>\r?\n?/g, '');

  // Remove recording-active CSS
  content = content.replace(/\/\* --- Pulsing red dot for active recording --- \*\/[\s\S]*?@keyframes recordPulse\s*\{[\s\S]*?\}/, '');
  content = content.replace(/\/\* --- Plushie speaking \/ audio wave pulse animation --- \*\/[\s\S]*?@keyframes audioShake\s*\{[\s\S]*?\}/, '');

  // Remove voiceNote parsing
  content = content.replace(/\/\/ Voice Note Playback[\s\S]*?\}\s*\}\s*else if \(item\.type === \"note\"\)/, '} else if (item.type === \"note\")');

  // Remove playlist logic and CTA
  content = content.replace(/let hasAudioNote = false;[\s\S]*?let fallbackTimeoutId = null;/, '');
  content = content.replace(/function playTrack\(index\) \{[\s\S]*?\/\* Create \"Click on your gifts\" CTA button if custom audio is loaded \*\//, '');
  content = content.replace(/if \(hasAudioNote\) \{[\s\S]*?\}\)/, '');

  fs.writeFileSync(file, content);
});
