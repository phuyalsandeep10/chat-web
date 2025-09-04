import { useEffect, useState } from 'react';
import countriesData from '@/data/countries.json';
import { pointInPolygon } from 'geometric';
import L from 'leaflet';
import { Visitor } from './types';

export function useVisitorMapLogic(visitors: Visitor[]) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    setGeoData(countriesData);
  }, []);

  const getCountryCodeFromCoords = (
    lat: number,
    lng: number,
  ): string | null => {
    if (!geoData) return null;

    for (const feature of geoData.features) {
      const geometry = feature.geometry;
      const isoCode = feature.properties?.['ISO3166-1-Alpha-3'];
      const coordinates =
        geometry.type === 'MultiPolygon'
          ? geometry.coordinates
          : [geometry.coordinates];

      for (const polygon of coordinates) {
        for (const ring of polygon) {
          const polygonPoints = ring.map(([lng, lat]: [number, number]) => [
            lng,
            lat,
          ]);
          if (pointInPolygon([lng, lat], polygonPoints)) {
            return isoCode;
          }
        }
      }
    }

    return null;
  };

  const normalizedVisitors = visitors.reduce(
    (acc, { lat, lng, count }) => {
      const isoCode = getCountryCodeFromCoords(lat, lng);
      if (isoCode) {
        acc[isoCode] = (acc[isoCode] || 0) + count;
      }
      return acc;
    },
    {} as { [key: string]: number },
  );

  const countryStyle = (feature: any): L.PathOptions => {
    const isoCode = feature?.properties?.['ISO3166-1-Alpha-3'];
    const isVisited = isoCode && normalizedVisitors[isoCode] !== undefined;

    return {
      fillColor: isVisited ? '#9500FF' : '#ffffff',
      fillOpacity: 0.8,
      weight: 1,
      color: '#D4D4D4',
    };
  };

  const userFillSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="#71717A" viewBox="0 0 24 24" class="inline-block">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  `;

  const onEachCountry = (feature: any, layer: L.Layer) => {
    const isoAlpha3 = feature.properties?.['ISO3166-1-Alpha-3'];
    const isoAlpha2 = feature.properties?.['ISO3166-1-Alpha-2'];
    const countryName = feature.properties?.name || 'Unknown';
    const count =
      isoAlpha3 && normalizedVisitors[isoAlpha3]
        ? normalizedVisitors[isoAlpha3]
        : 0;

    const flagUrl = isoAlpha2
      ? `https://flagcdn.com/w40/${isoAlpha2.toLowerCase()}.png`
      : null;

    layer.on('click', (e) => {
      e.originalEvent.stopPropagation();
    });

    const tooltipContent = `
      <div class="flex gap-[10px] items-center" style="min-width: 150px; max-width: max-content;">
        ${
          flagUrl
            ? `<div class="border border-grey-light p-0.5 rounded-[6px] flex items-center justify-center w-10 h-10 shrink-0">
                <Image src="${flagUrl}" alt="${countryName} flag" class="w-5 h-[22px] block" />
              </div>`
            : ''
        }
        <div class="flex flex-col justify-center">
          <div class="font-semibold leading-7 text-lg whitespace-nowrap">
            ${countryName}
          </div>
          <div class="font-bold flex items-center gap-1 whitespace-nowrap">
            ${userFillSvg}
            <span class="leading-7 font-medium text-lg text-theme-text-primary">${count}</span>
          </div>
        </div>
      </div>
    `;

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      direction: 'auto',
      opacity: 0.9,
      permanent: false,
    });
  };

  return {
    geoData,
    countryStyle,
    onEachCountry,
  };
}
