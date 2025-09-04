'use client';

import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useVisitorMapLogic } from './useVisitorMapLogic';
import { Visitor } from './types';

type VisitorMapProps = {
  visitors: Visitor[];
};

const VisitorMap: React.FC<VisitorMapProps> = ({ visitors }) => {
  const { geoData, countryStyle, onEachCountry } = useVisitorMapLogic(visitors);

  return (
    <div
      style={{
        height: '541px',
        width: '100%',
        backgroundColor: '#B8D1FF',
      }}
    >
      <MapContainer
        preferCanvas={true}
        zoomControl={false}
        keyboard={false}
        center={[20, 0]}
        attributionControl={false}
        zoom={2}
        style={{ height: '100%', width: '100%', backgroundColor: '#B8D1FF' }}
      >
        {geoData && (
          <GeoJSON
            data={geoData}
            style={countryStyle}
            onEachFeature={onEachCountry}
            interactive={true}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default VisitorMap;
