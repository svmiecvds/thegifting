/* -------------------- */
/* THEME TOGGLE         */
/* -------------------- */

// Apply saved theme immediately to <html> to prevent flash
(function () {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();

// Wire up the checkbox once DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('themeCheckbox');
    if (!checkbox) return;

    const saved = localStorage.getItem('theme');
    checkbox.checked = saved === 'dark';

    checkbox.addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});
