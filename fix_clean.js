const fs = require('fs');
const files = ['result.html', 'final.html', 'gift.html', 'plushies.html', 'treats.html', 'flowers.html', 'customize.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove recording-active CSS
  content = content.replace(/\/\* --- Pulsing red dot for active recording --- \*\/[\s\S]*?@keyframes recordPulse\s*\{[\s\S]*?\}/, '');
  content = content.replace(/\/\* --- Plushie speaking \/ audio wave pulse animation --- \*\/[\s\S]*?@keyframes audioShake\s*\{[\s\S]*?\}/, '');

  fs.writeFileSync(file, content);
});
