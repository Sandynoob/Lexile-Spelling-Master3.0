
export interface UpdateInfo {
  version: string;
  url: string;
  releaseNotes?: string;
}

const CURRENT_VERSION = '1.0.3';

export const checkUpdates = async (): Promise<{ available: boolean; info?: UpdateInfo; error?: string }> => {
  const updateUrl = import.meta.env.VITE_UPDATE_URL;

  if (!updateUrl) {
    return { available: false, error: 'Update URL not configured.' };
  }

  try {
    const response = await fetch(updateUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch version info: ${response.statusText}`);
    }

    const data: UpdateInfo = await response.json();
    
    // Simple version comparison (e.g., "1.0.4" > "1.0.3")
    const isAvailable = compareVersions(data.version, CURRENT_VERSION) > 0;

    return { available: isAvailable, info: data };
  } catch (err) {
    console.error('Update check failed:', err);
    return { available: false, error: err instanceof Error ? err.message : 'Unknown error' };
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
