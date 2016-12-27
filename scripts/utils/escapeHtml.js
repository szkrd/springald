// escape html, but allow underlines
function escapeHtml(unsafe) {
  return unsafe
    .replace(/<u>/g, 'UNDERLINE_START')
    .replace(/<\/u>/g, 'UNDERLINE_END')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/UNDERLINE_START/g, '<u>')
    .replace(/UNDERLINE_END/g, '</u>');
}

module.exports = escapeHtml;
