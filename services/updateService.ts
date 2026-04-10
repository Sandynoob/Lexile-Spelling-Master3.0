import packageJson from '../package.json';

export interface UpdateInfo {
  version: string;
  downloadUrl: string;
  apkUrl?: string;
  releaseNotes?: string;
}

const CURRENT_VERSION = packageJson.version;

export const checkUpdates = async (): Promise<{ available: boolean; info?: UpdateInfo; error?: string }> => {
  // Hardcoded URLs to ensure it works without any .env or GitHub Secrets
  const REPO_PATH = 'Sandynoob/Lexile-Spelling-Master3.0';
  const JSDELIVR_URL = `https://cdn.jsdelivr.net/gh/${REPO_PATH}@main/version.json`;
  const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${REPO_PATH}/main/version.json`;
  
  // Use hardcoded mirrors directly
  const urlsToTry = [
    GITHUB_RAW_URL,
    JSDELIVR_URL
  ];

  console.log('Update URLs to try:', urlsToTry);

  let lastError = '';

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, { 
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data: UpdateInfo = await response.json();
        if (data && data.version) {
          const isAvailable = compareVersions(data.version, CURRENT_VERSION) > 0;
          console.log(`Comparing server version ${data.version} with local version ${CURRENT_VERSION}. Available: ${isAvailable}`);
          return { 
            available: isAvailable, 
            info: {
              version: data.version,
              downloadUrl: data.downloadUrl,
              apkUrl: data.apkUrl,
              releaseNotes: data.releaseNotes
            } 
          };
        }
      }
      lastError = `Server returned ${response.status}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Connection failed';
      console.warn(`Failed to fetch from ${url}:`, lastError);
      // Continue to next URL
    }
  }
  
  return { 
    available: false, 
    error: `Update check failed. Last error: ${lastError}. Mirror: ${REPO_PATH}` 
  };
};

/**
 * Compares two version strings.
 * Returns 1 if v1 > v2, -1 if v1 < v2, 0 if v1 == v2.
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.trim().split('.').map(Number);
  const parts2 = v2.trim().split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  
  return 0;
}
