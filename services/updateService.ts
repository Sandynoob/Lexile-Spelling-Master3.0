import packageJson from '../package.json';

export interface UpdateInfo {
  version: string;
  url: string;
  releaseNotes?: string;
}

const CURRENT_VERSION = packageJson.version;

export const checkUpdates = async (): Promise<{ available: boolean; info?: UpdateInfo; error?: string }> => {
  // Use jsDelivr CDN with cache busting for better reliability on mobile
  const JSDELIVR_URL = 'https://cdn.jsdelivr.net/gh/Sandynoob/Lexile-Spelling-Master2.0@main/version.json';
  
  // Add cache busting query param
  const baseUrl = import.meta.env.VITE_UPDATE_URL || JSDELIVR_URL;
  const updateUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;

  console.log('Checking for updates at:', updateUrl);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased to 15s

    const response = await fetch(updateUrl, { 
      signal: controller.signal,
      cache: 'no-store', // Disable browser cache
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} (${response.statusText})`);
    }

    const text = await response.text();
    let data: UpdateInfo;
    
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error('JSON Parse Error. Content received:', text.substring(0, 100));
      throw new Error('Received invalid data format from server');
    }
    
    if (!data || !data.version) {
      throw new Error('Version information is missing in the server response');
    }

    // Log versions for debugging
    console.log(`Server Version: ${data.version}, Local Version: ${CURRENT_VERSION}`);

    const isAvailable = compareVersions(data.version, CURRENT_VERSION) > 0;
    return { available: isAvailable, info: data };
  } catch (err) {
    console.error('Update check failed:', err);
    let errorMessage = 'Network error';
    
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        errorMessage = 'Connection timeout. Please check your internet.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network blocked or CORS issue. Try a different network.';
      } else {
        errorMessage = err.message;
      }
    }
    
    return { available: false, error: errorMessage };
  }
};

/**
 * Compares two version strings.
 * Returns 1 if v1 > v2, -1 if v1 < v2, 0 if v1 == v2.
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  
  return 0;
}
