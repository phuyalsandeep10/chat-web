(function () {
  const script = document.currentScript;
  const orgId = script.getAttribute('data-orgId');
  console.log('Loaded widget for org:', orgId);

  const iframe = document.createElement('iframe');
  iframe.src = 'https://portal.chatboq.com/chat?orgId=' + orgId;
  // iframe.src = 'http://localhost:3000/chat?orgId=' + orgId;
  iframe.style.width = '100%';
  iframe.style.height = '100vh';
  iframe.style.background = 'transparent';
  iframe.style.zIndex = 99;
  iframe.style.position = 'fixed';
  iframe.style.bottom = '0px';
  iframe.style.right = '0px';
  iframe.style.border = '0';
  iframe.style.borderWidth = '0';
  iframe.id = 'chatboq-widget';
  document.body.appendChild(iframe);
})();
