export const APP_CONFIG = {
  basePath: import.meta.env.VITE_APP_BASE_PATH || '',
  getRedirectUrl: (path: string = '') => {
    const basePath = import.meta.env.VITE_APP_BASE_PATH || '';
    const redirectUrl = `${window.location.origin}${basePath}/#${path}`
    console.log(`redirectUrl: ${redirectUrl}`);
    return redirectUrl;
  }
};