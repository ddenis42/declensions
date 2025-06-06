export const copyToClipboard = async text => {
  navigator.clipboard
    .writeText(text)
    .catch(() => {
      // fallback for unsupported browsers
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy') // NOSONAR
      document.body.removeChild(ta)
    })
};
