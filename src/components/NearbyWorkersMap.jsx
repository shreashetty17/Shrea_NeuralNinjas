import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MUMBAI_CENTER } from '../data/mockData';

// Distance between two [lat, lng] points in km
export const distanceKm = (a, b) => {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

// Customer's pin. Fixed in Bandra for now (no address lookup yet).
export const CUSTOMER_LOCATION = [19.0596, 72.8295];

const customerIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:34px;height:34px">
      <div style="position:absolute;inset:0;border-radius:9999px;background:rgba(20,155,139,.25);animation:ks-ping 1.6s ease-out infinite"></div>
      <div style="position:absolute;left:7px;top:7px;width:20px;height:20px;border-radius:9999px;background:#149B8B;border:4px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>
    </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

const workerIcon = (w, highlighted) =>
  L.divIcon({
    className: '',
    html: `<div style="width:${highlighted ? 44 : 36}px;height:${highlighted ? 44 : 36}px;border-radius:9999px;overflow:hidden;border:3px solid ${highlighted ? '#149B8B' : '#0A2540'};box-shadow:0 3px 8px rgba(0,0,0,.35);background:#fff">
        <img src="${w.photo}" style="width:100%;height:100%;object-fit:cover" />
      </div>`,
    iconSize: highlighted ? [44, 44] : [36, 36],
    iconAnchor: highlighted ? [22, 22] : [18, 18]
  });

// Live map of nearby workers, shown while a request is broadcasting and bids arrive.
// `workers` = nearby workers to show; `highlightIds` = workers who have sent a bid.
export const NearbyWorkersMap = ({ workers = [], highlightIds = [], height = 260, label, live = true }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const positionsRef = useRef({});

  // Create the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(CUSTOMER_LOCATION || MUMBAI_CENTER, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.marker(CUSTOMER_LOCATION, { icon: customerIcon, zIndexOffset: 1000 }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    // the modal animates in, so re-measure once it has its final size
    setTimeout(() => map.invalidateSize(), 150);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw workers; move them a little toward the customer every 2 seconds
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    workers.forEach((w) => {
      if (!positionsRef.current[w.id]) positionsRef.current[w.id] = [w.lat, w.lng];
    });

    const draw = () => {
      const layer = layerRef.current;
      if (!layer) return;
      layer.clearLayers();
      workers.forEach((w) => {
        const pos = positionsRef.current[w.id];
        const hot = highlightIds.includes(w.id);
        if (hot) {
          L.polyline([pos, CUSTOMER_LOCATION], { color: '#149B8B', weight: 4, opacity: 0.8, dashArray: '6 8' }).addTo(layer);
        }
        L.marker(pos, { icon: workerIcon(w, hot), zIndexOffset: hot ? 500 : 0 })
          .bindTooltip(`${w.name.split(' ')[0]} • ${distanceKm(pos, CUSTOMER_LOCATION).toFixed(1)} km`, { direction: 'top', offset: [0, -18] })
          .addTo(layer);
      });
    };

    // fit everyone in view the first time workers appear
    if (workers.length) {
      const bounds = L.latLngBounds([CUSTOMER_LOCATION, ...workers.map((w) => positionsRef.current[w.id])]);
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    }
    draw();

    if (!live) return;
    const timer = setInterval(() => {
      workers.forEach((w) => {
        const [lat, lng] = positionsRef.current[w.id];
        const step = highlightIds.includes(w.id) ? 0.06 : 0.015;
        positionsRef.current[w.id] = [
          lat + (CUSTOMER_LOCATION[0] - lat) * step + (Math.random() - 0.5) * 0.0006,
          lng + (CUSTOMER_LOCATION[1] - lng) * step + (Math.random() - 0.5) * 0.0006
        ];
      });
      draw();
    }, 2000);
    return () => clearInterval(timer);
  }, [workers, highlightIds.join(',')]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <style>{'@keyframes ks-ping{0%{transform:scale(.6);opacity:1}100%{transform:scale(2.2);opacity:0}}'}</style>
      <div ref={containerRef} style={{ height }} className="w-full z-0" />
      <div className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-full bg-white/95 shadow text-[11px] font-bold text-[#0A2540] flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{label || `${workers.length} workers nearby • Live`}</span>
      </div>
    </div>
  );
};

export default NearbyWorkersMap;
