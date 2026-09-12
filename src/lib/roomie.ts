/**
 * Helper to trigger Roomie AI assistant anywhere in the app
 */
export function openRoomie(prompt?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-roomie", {
        detail: { prompt },
      })
    );
  }
}
