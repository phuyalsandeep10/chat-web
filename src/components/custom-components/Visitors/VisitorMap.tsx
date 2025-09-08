'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useVisitorMapLogic } from './useVisitorMapLogic';
import { Visitor } from './types';
import L from 'leaflet';
import CountrySelect from '@/shared/CountrySelect';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
  country: string;
};

type VisitorMapProps = { visitors: Visitor[] };

function ZoomToFeature({
  name,
  nonce,
  geoData,
}: {
  name: string | null;
  nonce: number; // <- forces re-run even if name is unchanged
  geoData: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (!name || !geoData) return;

    const feature = geoData.features?.find(
      (f: any) => f?.properties?.name === name,
    );
    if (!feature) return;

    const layer = L.geoJSON(feature);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [24, 24] }); // or map.fitBounds(bounds)
    }
  }, [name, nonce, geoData, map]);

  return null;
}

const VisitorMap: React.FC<VisitorMapProps> = ({ visitors }) => {
  const { geoData, countryStyle, onEachCountry } = useVisitorMapLogic(visitors);
  const [country, setCountry] = useState<string | null>(null);
  const [zoomNonce, setZoomNonce] = useState(0);
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      country: '', // or preselect: "Nepal"
    },
  });

  const triggerZoom = (name: string) => {
    setCountry(name);
    setZoomNonce((n) => n + 1); // <- bump this every click
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    triggerZoom(data.country);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-end gap-5 p-4"
      >
        <h3>Select Country</h3>
        <CountrySelect
          name="country"
          control={control}
          placeholder="Select your country"
          onChange={(country) => {
            handleSubmit(onSubmit)();
          }}
        />
      </form>
      <div
        style={{ height: '541px', width: '100%', backgroundColor: '#B8D1FF' }}
      >
        <MapContainer
          preferCanvas
          zoomControl={false}
          keyboard={false}
          center={[20, 0]}
          attributionControl={false}
          zoom={2}
          style={{ height: '100%', width: '100%', backgroundColor: '#B8D1FF' }}
          className="relative"
        >
          {geoData && (
            <GeoJSON
              data={geoData}
              style={(feature: any) => {
                // get the base style from your hook
                const base = countryStyle(feature);

                // if this is the selected country, override color/fill
                if (feature?.properties?.name === country) {
                  return {
                    ...base,
                    fillColor: '#9500FF', // inside fill color
                    weight: 1, // optional: make it stand out
                  };
                }

                return base;
              }}
              onEachFeature={onEachCountry}
              interactive
            />
          )}

          {/* Re-run zoom whenever name or nonce changes */}
          <ZoomToFeature name={country} nonce={zoomNonce} geoData={geoData} />
        </MapContainer>
      </div>
    </>
  );
};

export default VisitorMap;
