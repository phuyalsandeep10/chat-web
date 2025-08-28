(function () {
  const script = document.currentScript;
  const orgId = script.getAttribute('data-orgId');
  console.log('Loaded widget for org:', orgId);

  const iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:3000/chat?orgId=' + orgId;
  iframe.style.width = '100%';
  iframe.style.height = '100vh';
  iframe.style.border = '0';
  iframe.style.borderWidth = '0';
  document.body.appendChild(iframe);
})();
