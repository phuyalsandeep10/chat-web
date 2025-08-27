(() => {
  const script = document.currentScript;
  const orgId = script.getAttribute('data-orgId');

  const loadWidget = () => {
    const widget = document.createElement('div');
    widget.style.boxSizing = 'border-box';
    widget.style.width = '400px';
    widget.style.height = '600px';
    widget.style.position = 'fixed';
    widget.style.bottom = '100px';
    widget.style.right = '24px';
    widget.style.display = 'none';
    widget.style.zIndex = '99999';
    widget.style.borderRadius = '16px';
    widget.style.overflow = 'hidden';
    widget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.src = `https://portal.chatboq.com/chat?orgId=${orgId}`;
    widget.appendChild(iframe);

    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '🤖';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '24px';
    toggleBtn.style.right = '24px';
    toggleBtn.style.zIndex = '100000';
    toggleBtn.style.width = '56px';
    toggleBtn.style.height = '56px';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.border = 'none';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.display = 'flex';
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';
    toggleBtn.style.fontSize = '24px';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.background = 'linear-gradient(to right, #2563eb, #9333ea)';
    toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
    toggleBtn.style.transition = 'all 0.3s ease';

    toggleBtn.addEventListener('mouseenter', () => {
      toggleBtn.style.transform = 'scale(1.05)';
      toggleBtn.style.boxShadow = '0 8px 20px rgba(0,0,0,0.35)';
    });
    toggleBtn.addEventListener('mouseleave', () => {
      toggleBtn.style.transform = 'scale(1)';
      toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
    });

    let isOpen = false;
    toggleBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      widget.style.display = isOpen ? 'block' : 'none';
    });

    document.body.appendChild(widget);
    document.body.appendChild(toggleBtn);
  };

  if (document.readyState === 'complete') {
    loadWidget();
  } else {
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'complete') {
        loadWidget();
      }
    });
  }
})();
