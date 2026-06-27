const fs = require('fs');
let content = fs.readFileSync('customize.html', 'utf8');

const oldHtml = '        <button id="decreaseSize">-</button>\n    </div>\n\n    <div id="savePanel" class="customPanel-style">\n        <button id="saveCustomization" class="shiny-cta" style="width: 100%; padding: 14px; font-size: 16px;">\n            <span>Save Changes</span>\n        </button>\n    </div>';

const newHtml = '        <button id="decreaseSize">-</button>\n\n        <hr style="margin-top: 24px; margin-bottom: 16px; border: none; border-top: 1.5px solid rgba(255, 182, 217, 0.25);">\n        \n        <button id="saveCustomization" class="shiny-cta" style="width: 100%; padding: 14px; font-size: 16px;">\n            <span>Save Changes</span>\n        </button>\n    </div>';

// Need to handle both \n and \r\n 
const safeOldHtml = oldHtml.replace(/\n/g, '\r\n');

if (content.includes(oldHtml)) {
    content = content.replace(oldHtml, newHtml);
} else if (content.includes(safeOldHtml)) {
    content = content.replace(safeOldHtml, newHtml);
}

// Fix the closest check
content = content.replace(/&& !e\.target\.closest\('#savePanel'\)/g, '');

fs.writeFileSync('customize.html', content);
