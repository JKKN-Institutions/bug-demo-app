import html2canvas from 'html2canvas';

function isMobileDevice(): boolean {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    (window.innerWidth <= 768 && 'ontouchstart' in window)
  );
}

export async function captureScreenshot(): Promise<string> {
  console.log('[BugReporter SDK] Starting screenshot capture...');

  const isMobile = isMobileDevice();
  const originalScrollX = window.scrollX;
  const originalScrollY = window.scrollY;

  try {
    void document.body.offsetHeight;

    const options = {
      scale: Math.max(window.devicePixelRatio || 1, 2),
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: false,
      removeContainer: true,
      logging: false,
      imageTimeout: isMobile ? 15000 : 30000,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: originalScrollX,
      scrollY: originalScrollY,
      foreignObjectRendering: true,
      ignoreElements: (element: Element) => {
        if (element.classList.contains('bug-reporter-widget')) return true;
        if (element.classList.contains('bug-reporter-sdk')) return true;

        const className = element.className || '';
        if (typeof className === 'string') {
          const overlayClasses = [
            'radix-portal',
            'toast',
            'modal',
            'overlay',
            'popup',
            'dropdown',
            'tooltip',
            'popover',
            'dialog',
            'notification'
          ];
          if (overlayClasses.some((cls) => className.includes(cls))) {
            return true;
          }
        }

        const role = element.getAttribute('role');
        if (role && ['dialog', 'alertdialog', 'tooltip', 'menu'].includes(role)) {
          return true;
        }

        if (
          element.hasAttribute('data-radix-portal') ||
          element.hasAttribute('data-sonner-toaster') ||
          element.hasAttribute('data-html2canvas-ignore')
        ) {
          return true;
        }

        const computedStyle = window.getComputedStyle(element);
        if (
          computedStyle.display === 'none' ||
          computedStyle.visibility === 'hidden' ||
          computedStyle.opacity === '0'
        ) {
          return true;
        }

        return false;
      },
    };

    await new Promise((resolve) => setTimeout(resolve, 800));

    const targetElement = document.querySelector('body') as HTMLElement;
    if (!targetElement) {
      throw new Error('Could not find body element');
    }

    const canvas = await html2canvas(targetElement, options as any);

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas creation failed');
    }

    const dataUrl = canvas.toDataURL('image/png', 1.0);

    console.log('[BugReporter SDK] Screenshot captured successfully');

    return dataUrl;
  } catch (error) {
    console.error('[BugReporter SDK] Screenshot capture failed:', error);
    throw error;
  }
}
