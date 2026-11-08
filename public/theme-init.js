// Dijalankan sebelum React/CSS selesai dimuat agar tema tersimpan tidak berkedip.
;(function () {
  var preference = null
  try { preference = localStorage.getItem('ramzi-portfolio-theme') } catch (_) {}
  var light = false
  try { light = window.matchMedia('(prefers-color-scheme: light)').matches } catch (_) {}
  var theme = preference === 'light' || preference === 'dark' ? preference : light ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  var meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = theme === 'light' ? '#f6f7f1' : '#101312'
})()
