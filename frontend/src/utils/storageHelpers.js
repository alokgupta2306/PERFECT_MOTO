/**
 * Compiles and drops values cleanly into browser persistent local files.
 */
export const writeStorageItem = (key, dataPayload) => {
  try {
    const rawString = typeof dataPayload === "object" ? JSON.stringify(dataPayload) : dataPayload;
    localStorage.setItem(key, rawString);
    return true;
  } catch (error) {
    console.error(`Storage allocation error on index key [${key}]:`, error);
    return false;
  }
};

/**
 * Recovers data elements from browser cache strings, parsing JSON structures safely.
 */
export const fetchStorageItem = (key) => {
  try {
    const rawData = localStorage.getItem(key);
    if (!rawData) return null;
    
    // Attempt automatic conversion of JSON object arrays
    if (rawData.startsWith("{") || rawData.startsWith("[")) {
      return JSON.parse(rawData);
    }
    return rawData;
  } catch (error) {
    console.error(`Storage read error on index key [${key}]:`, error);
    return null;
  }
};

/**
 * Clears explicit variable strings out of client-side cache stores.
 */
export const destroyStorageItem = (key) => {
  localStorage.removeItem(key);
};