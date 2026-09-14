"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript, GOOGLE_MAPS_API_KEY } from "@/lib/maps";
import { MapPin, ExternalLink, Layers, ZoomIn, ZoomOut, Compass } from "lucide-react";

export interface MapMarker {
  id?: string;
  lat: number;
  lng: number;
  title: string;
  price?: number;
  locality?: string;
}

export interface RouteInfo {
  origin: string;
  destination: string;
  originCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
}

export interface RouteCalculationResult {
  distanceText: string;
  durationText: string;
  distanceKm: number;
  durationMinutes: number;
  originAddress?: string;
  destinationAddress?: string;
}

interface GoogleMapViewProps {
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
  markers?: MapMarker[];
  className?: string;
  route?: RouteInfo | null;
  onRouteCalculated?: (result: RouteCalculationResult) => void;
  onRouteError?: (error: string) => void;
  onClearRoute?: () => void;
}

export default function GoogleMapView({
  lat,
  lng,
  zoom = 14,
  title = "Location Map",
  markers = [],
  className = "w-full h-full",
  route = null,
  onRouteCalculated,
  onRouteError,
  onClearRoute,
}: GoogleMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const directionsRendererRef = useRef<any>(null);

  const [viewMode, setViewMode] = useState<"roadmap" | "satellite">("roadmap");
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [isJsApiAvailable, setIsJsApiAvailable] = useState<boolean | null>(null);

  // Sync zoom on prop change
  useEffect(() => {
    setCurrentZoom(zoom);
  }, [zoom]);

  // Global listener for Google Maps auth errors (invalid key, unbilled, or unactivated API)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prevAuthFailure = (window as any).gm_authFailure;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gm_authFailure = () => {
        console.warn("Google Maps JS API key authorization failed. Using Google Maps Embed.");
        setIsJsApiAvailable(false);
        if (typeof prevAuthFailure === "function") prevAuthFailure();
      };
    }
  }, []);

  // Attempt Google Maps JS API
  useEffect(() => {
    let isCancelled = false;

    loadGoogleMapsScript()
      .then((googleObj) => {
        if (isCancelled || !containerRef.current) return;

        try {
          const centerLatLng = { lat, lng };

          if (!mapInstanceRef.current) {
            const map = new googleObj.maps.Map(containerRef.current, {
              center: centerLatLng,
              zoom: currentZoom,
              mapTypeId: viewMode === "satellite" ? googleObj.maps.MapTypeId.HYBRID : googleObj.maps.MapTypeId.ROADMAP,
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
              zoomControl: false,
            });

            mapInstanceRef.current = map;

            // Check if tiles load or if error overlay is rendered by Google
            const timer = setTimeout(() => {
              if (!isCancelled && containerRef.current) {
                const hasError = containerRef.current.querySelector(".gm-err-container, .gm-err-message");
                if (hasError) {
                  setIsJsApiAvailable(false);
                } else {
                  setIsJsApiAvailable(true);
                }
              }
            }, 1500);

            return () => clearTimeout(timer);
          } else {
            mapInstanceRef.current.panTo(centerLatLng);
            mapInstanceRef.current.setZoom(currentZoom);
            mapInstanceRef.current.setMapTypeId(
              viewMode === "satellite" ? googleObj.maps.MapTypeId.HYBRID : googleObj.maps.MapTypeId.ROADMAP
            );
          }

          // Clear markers & re-add
          markersRef.current.forEach((m) => m.setMap(null));
          markersRef.current = [];

          // Main center marker
          const mainMarker = new googleObj.maps.Marker({
            position: centerLatLng,
            map: mapInstanceRef.current,
            title,
            animation: googleObj.maps.Animation.DROP,
            icon: {
              path: googleObj.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: "#FF6B35",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
            },
          });
          markersRef.current.push(mainMarker);

          markers.forEach((m) => {
            if (m.lat === lat && m.lng === lng) return;
            const marker = new googleObj.maps.Marker({
              position: { lat: m.lat, lng: m.lng },
              map: mapInstanceRef.current,
              title: m.title,
            });
            markersRef.current.push(marker);
          });
        } catch {
          setIsJsApiAvailable(false);
        }
      })
      .catch(() => {
        setIsJsApiAvailable(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [lat, lng, currentZoom, viewMode, title, markers]);

  // Handle Route Directions if route is provided and JS API is available
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleObj = (window as any).google;
    if (!googleObj?.maps) return;

    if (route && route.origin && route.destination) {
      try {
        if (!directionsRendererRef.current) {
          directionsRendererRef.current = new googleObj.maps.DirectionsRenderer({
            map: mapInstanceRef.current,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: "#F09A57",
              strokeWeight: 6,
              strokeOpacity: 0.95,
            },
          });
        } else {
          directionsRendererRef.current.setMap(mapInstanceRef.current);
        }

        const directionsService = new googleObj.maps.DirectionsService();
        const originParam = route.originCoords
          ? new googleObj.maps.LatLng(route.originCoords.lat, route.originCoords.lng)
          : route.origin;
        const destParam = route.destinationCoords
          ? new googleObj.maps.LatLng(route.destinationCoords.lat, route.destinationCoords.lng)
          : route.destination;

        directionsService.route(
          {
            origin: originParam,
            destination: destParam,
            travelMode: googleObj.maps.TravelMode.DRIVING,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result: any, status: any) => {
            if (status === googleObj.maps.DirectionsStatus.OK && result) {
              directionsRendererRef.current?.setDirections(result);
              const leg = result.routes?.[0]?.legs?.[0];
              if (leg) {
                const distanceKm = Number(((leg.distance?.value || 0) / 1000).toFixed(1));
                const durationMinutes = Math.round((leg.duration?.value || 0) / 60);
                onRouteCalculated?.({
                  distanceText: leg.distance?.text || `${distanceKm} km`,
                  durationText: leg.duration?.text || `${durationMinutes} mins`,
                  distanceKm,
                  durationMinutes,
                  originAddress: leg.start_address,
                  destinationAddress: leg.end_address,
                });
              }
            } else {
              console.warn("Google DirectionsService status:", status);
              onRouteError?.(status);
            }
          }
        );
      } catch (err) {
        console.warn("Directions error:", err);
      }
    } else {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
    }
  }, [route, onRouteCalculated, onRouteError]);

  // Google Maps Embed URL - Direct Route mode with precise coordinates or Location pin mode
  const embedTypeParam = viewMode === "satellite" ? "&t=k" : "";
  const originParam =
    route?.originCoords
      ? `${route.originCoords.lat},${route.originCoords.lng}`
      : encodeURIComponent(route?.origin || "");
  const destParam =
    route?.destinationCoords
      ? `${route.destinationCoords.lat},${route.destinationCoords.lng}`
      : encodeURIComponent(route?.destination || "");

  const embedUrl =
    route && route.origin && route.destination
      ? `https://maps.google.com/maps?saddr=${originParam}&daddr=${destParam}&hl=en${embedTypeParam}&output=embed`
      : `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${currentZoom}${embedTypeParam}&output=embed`;

  return (
    <div className={`relative w-full h-full min-h-[380px] flex flex-col ${className}`}>
      {/* Top Floating Map Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none gap-2">
        {/* Left: View Mode Pills (Roadmap vs Satellite) */}
        <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-gray-200/80 dark:border-slate-700 pointer-events-auto">
          <button
            type="button"
            onClick={() => setViewMode("roadmap")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === "roadmap"
                ? "bg-[#0F4C81] text-white shadow-xs"
                : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Map</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("satellite")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === "satellite"
                ? "bg-[#0F4C81] text-white shadow-xs"
                : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
          >
            <span>Satellite</span>
          </button>
        </div>

        {/* Right: Quick In-Page Map Actions (Zoom & On-Page Route Status - No External Links) */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-slate-700 p-0.5">
            <button
              type="button"
              onClick={() => setCurrentZoom((z) => Math.min(z + 1, 19))}
              aria-label="Zoom in"
              title="Zoom In"
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-700 dark:text-slate-200 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentZoom((z) => Math.max(z - 1, 9))}
              aria-label="Zoom out"
              title="Zoom Out"
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-700 dark:text-slate-200 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* On-Page Route Mode Indicator (No external site links) */}
          {route ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F09A57] text-white rounded-xl shadow-md text-xs font-bold animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Direct Route Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-slate-300">
              <Compass className="w-3.5 h-3.5 text-[#F09A57]" />
              <span>On-Page View</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Active Route Banner (when route is allotted) */}
      {route && route.origin && route.destination && (
        <div className="absolute top-14 left-3 right-3 z-10 pointer-events-auto">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-lg border border-[#F09A57]/50 flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F09A57] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F09A57]"></span>
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  Direct Route: <span className="text-[#F09A57]">{route.origin}</span> ➔ <span className="text-[#0F4C81] dark:text-sky-400">{route.destination}</span>
                </p>
                <p className="text-[10px] text-gray-500 dark:text-slate-400">
                  Live turn-by-turn route path allotted on map
                </p>
              </div>
            </div>
            {onClearRoute && (
              <button
                type="button"
                onClick={onClearRoute}
                title="Clear route and return to map view"
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Map Display Container: Guaranteed 100% height with absolute fill */}
      <div className="relative flex-1 w-full h-full min-h-[360px] bg-slate-100 dark:bg-slate-950">
        {isJsApiAvailable ? (
          <div ref={containerRef} className="absolute inset-0 w-full h-full" />
        ) : (
          <iframe
            key={
              route && route.origin && route.destination
                ? `route-${route.origin}-${route.destination}-${viewMode}`
                : `place-${lat}-${lng}-${currentZoom}-${viewMode}`
            }
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            loading="eager"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>

      {/* Bottom Info Pill */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-lg text-[11px] font-semibold text-gray-800 dark:text-slate-200 shadow-sm border border-gray-200/80 dark:border-slate-700">
          <Compass className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>{route && route.origin ? `${route.origin} ➔ ${route.destination}` : title}</span>
          {!route && (
            <span className="text-[10px] text-gray-400 hidden sm:inline">
              ({lat.toFixed(4)}, {lng.toFixed(4)})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
