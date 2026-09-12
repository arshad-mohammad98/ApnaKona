// ─────────────────────────────────────────────
// Google Maps API Configuration & Loader
// ─────────────────────────────────────────────

export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let googleMapsPromise: Promise<any> | null = null;

/**
 * Loads the Google Maps JavaScript API with places library exactly once.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadGoogleMapsScript(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cannot load Google Maps in SSR"));
  }

  // If already loaded on window
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).google?.maps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve((window as any).google);
  }

  // Return existing pending promise if already loading
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script tag already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    ) as HTMLScriptElement;

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const g = (window as any).google;
        if (g?.maps) {
          resolve(g);
        } else {
          reject(new Error("Google Maps loaded without maps object"));
        }
      });
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    // Define unique callback name
    const callbackName = `initGoogleMapsCallback_${Date.now()}`;
    (window as unknown as Record<string, () => void>)[callbackName] = () => {
      delete (window as unknown as Record<string, () => void>)[callbackName];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = (window as any).google;
      if (g?.maps) {
        resolve(g);
      } else {
        reject(new Error("Google Maps loaded without maps namespace"));
      }
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * Get fallback embed URL with API key
 */
export function getGoogleMapsEmbedUrl(query: string, zoom = 14): string {
  // If query is coordinates "lat,lng" or text query
  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
    query
  )}&zoom=${zoom}`;
}
