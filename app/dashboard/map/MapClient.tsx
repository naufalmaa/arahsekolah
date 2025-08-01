// app/dashboard/map/MapClient.tsx
"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom School Icon
const schoolIcon = new L.DivIcon({
  html: `
    <div style="
      width: 32px; 
      height: 32px; 
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%); 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 3px solid white;
    ">
      <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    </div>
  `,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Custom User Location Icon
const userLocationIcon = new L.DivIcon({
  html: `
    <div style="
      width: 24px; 
      height: 24px; 
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
      border: 2px solid white;
      animation: pulse 2s infinite;
    ">
      <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
    </style>
  `,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

type School = { id: string; name: string; lat: number; lng: number; };

// Base map options
const baseMaps = [
  { 
    name: 'Street Map', 
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  { 
    name: 'Satellite', 
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  { 
    name: 'Terrain', 
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }
];

// Calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

export default function MapClient() {
  const [schools, setSchools] = useState<School[]>([]);
  const [viewList, setViewList] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState(0);
  const [showBaseMaps, setShowBaseMaps] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/schools").then((r) => r.json()).then(setSchools);
  }, []);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError("Unable to get your location. Please enable location services.");
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  if (viewList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
        {/* Header with Back Button */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40">
          <div className="px-6 py-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setViewList(false)}
                className="inline-flex items-center px-4 py-2 bg-white/90 hover:bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-slate-700 hover:text-slate-900 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Map
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900">
                  Schools List View
                </h1>
                <p className="text-slate-600 mt-1">
                  {schools.length} schools found in Bandung
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schools List */}
        <div className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-8 py-6 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">School Name</th>
                      <th className="px-8 py-6 text-left text-sm font-semibold text-slate-900 uppercase tracking-wider">Location</th>
                      <th className="px-8 py-6 text-center text-sm font-semibold text-slate-900 uppercase tracking-wider">Distance</th>
                      <th className="px-8 py-6 text-center text-sm font-semibold text-slate-900 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {schools.map((school) => (
                      <tr key={school.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-slate-900">{school.name}</div>
                              <div className="text-sm text-slate-500">ID: {school.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-slate-700">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {school.lat.toFixed(6)}, {school.lng.toFixed(6)}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          {userLocation ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {calculateDistance(userLocation.lat, userLocation.lng, school.lat, school.lng)} km
                            </span>
                          ) : (
                            <span className="text-slate-500 text-sm">Enable location</span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <a 
                            href={`/dashboard/detail/${school.id}`}
                            className="inline-flex items-center px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
                          >
                            View Details
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      {/* Header Controls */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col space-y-4 gap-4">
        <button
          onClick={() => setViewList(true)}
          className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-md hover:bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-slate-700 hover:text-slate-900 font-medium group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          List View
        </button>

        {/* Base Map Selector */}
        <div className="relative">
          <button
            onClick={() => setShowBaseMaps(!showBaseMaps)}
            className="inline-flex items-center px-6 py-3 bg-green-600/90 backdrop-blur-md hover:bg-green-600 border border-green-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white hover:text-white font-medium group w-full"
          >
            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {baseMaps[selectedBaseMap].name}
          </button>
          
          {showBaseMaps && (
            <div className="absolute top-full mt-2 left-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-w-full">
              {baseMaps.map((baseMap, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedBaseMap(index);
                    setShowBaseMaps(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-100 transition-colors duration-200 font-medium ${
                    selectedBaseMap === index ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                  }`}
                >
                  {baseMap.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-4">
          <div className="flex items-center space-x-3 gap-2">
            <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
            <span className="text-sm font-medium text-slate-700">
              {schools.length} Schools Found
            </span>
          </div>
          {userLocation && (
            <div className="flex items-center space-x-3 mt-2 gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700">
                Your Location
              </span>
            </div>
          )}
        </div> */}

        {/* Location Error */}
        {locationError && (
          <div className="bg-red-100/90 backdrop-blur-md rounded-2xl shadow-lg border border-red-200 p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-red-800">
                {locationError}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="absolute top-6 right-6 z-[1000]">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 p-6 max-w-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Bandung Schools Map</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Click on any school marker to view details and distance from your location.
          </p>
          <div className="mt-4 space-y-2 flex flex-col gap-5">
            <div className="flex items-center text-xs text-slate-500">
              <div className="w-4 h-4 bg-slate-800 rounded-full mr-2 flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              {schools.length} School Locations
            </div>
              <div className="flex items-center text-xs text-slate-500">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                Your Location
              </div>

                              {/* Location Button */}
        <button
          onClick={getUserLocation}
          className="inline-flex items-center px-6 py-3 bg-blue-600/90 backdrop-blur-md hover:bg-blue-600 border border-blue-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white hover:text-white font-medium group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Click here to see where you are!
        </button>
          </div>
        </div>


      </div>

      {/* Map Container */}
      <div className="h-full min-h-screen rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        <MapContainer
          center={[-6.914744, 107.60981]}
          zoom={13}
          className="h-full min-h-screen"
          style={{ 
            background: 'linear-gradient(135deg, #f1f5f9 0%, #f8fafc 50%, #dbeafe 100%)'
          }}
        >
          <TileLayer 
            url={baseMaps[selectedBaseMap].url}
            attribution={baseMaps[selectedBaseMap].attribution}
          />
          
          {/* School Markers */}
          {schools.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={schoolIcon}>
              <Popup className="custom-popup">
                <div className="p-2">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-slate-900 font-semibold block">{s.name}</strong>
                      {userLocation && (
                        <span className="text-sm text-blue-600 font-medium">
                          📍 {calculateDistance(userLocation.lat, userLocation.lng, s.lat, s.lng)} km away
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <a 
                      href={`/dashboard/detail/${s.id}`}
                      className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm rounded-xl transition-all duration-300 font-medium"
                    >
                      View Details
                      <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={userLocationIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <strong className="text-slate-900 font-semibold">You Are Here</strong>
                  </div>
                  <p className="text-sm text-slate-600">
                    Current location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}