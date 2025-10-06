// Client for external city search (GeoDB Cities via RapidAPI) and admin cities merge
// Requires env vars:
// NEXT_PUBLIC_GEODB_HOST (default geodb-free-service.p.rapidapi.com)
// NEXT_PUBLIC_GEODB_KEY

export type CitySuggestion = {
  id?: string; // internal id if from admin DB
  name: string;
  region?: string;
  country: string;
  countryCode: string;
  lat?: number;
  lon?: number;
  source: 'admin' | 'geodb' | 'nominatim';
  externalId?: string; // geodb id
  slug?: string;
};

const GEODB_HOST = process.env.NEXT_PUBLIC_GEODB_HOST || 'wft-geo-db.p.rapidapi.com';
const GEODB_KEY = process.env.NEXT_PUBLIC_GEODB_KEY || '';
const RAPID_COUNTRY_HOST = process.env.NEXT_PUBLIC_RAPID_COUNTRY_HOST || '';
const RAPID_COUNTRY_KEY = process.env.NEXT_PUBLIC_RAPID_COUNTRY_KEY || '';
const DEFAULT_COUNTRY = (process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || 'ES').toUpperCase();
// Simple in-memory caches (per session)
const rapidCountryCache = new Map<string, CitySuggestion[]>(); // key: countryCode

function normalize(str: string) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

// RapidAPI: country-state-city-search-rest-api (free sample provided by user)
export async function searchRapidCountryStateCity(query: string, { countryCode, limit = 10 }: { countryCode?: string; limit?: number } = {}): Promise<CitySuggestion[]> {
  if (!query || query.trim().length < 2) return [];
  if (!RAPID_COUNTRY_HOST || !RAPID_COUNTRY_KEY) return [];
  const cc = (countryCode || DEFAULT_COUNTRY).toUpperCase();
  const cached = rapidCountryCache.get(cc);
  if (cached && cached.length) {
    const q = normalize(query);
    return cached.filter((m) => normalize(`${m.name} ${m.region || ''} ${m.country}`).includes(q)).slice(0, limit);
  }
  const url = `https://${RAPID_COUNTRY_HOST}/cities-by-countrycode?countrycode=${encodeURIComponent(cc.toLowerCase())}`;
  try {
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-key': RAPID_COUNTRY_KEY,
        'x-rapidapi-host': RAPID_COUNTRY_HOST,
      },
    });
    if (!res.ok) return [];
    const raw: unknown = await res.json();
    const data: Array<Record<string, unknown>> = Array.isArray(raw) ? raw as Array<Record<string, unknown>> : [];
    const q = normalize(query);
    const mapped = data.map((c: Record<string, unknown>) => {
      const rawCode = (c?.countryCode as string | undefined) ?? (c?.country_code as string | undefined) ?? cc;
      const code = String(rawCode).toUpperCase();
      const name = String((c?.name as string | undefined) ?? (c?.city as string | undefined) ?? '');
      const region = (c?.state as string | undefined) || (c?.stateCode as string | undefined) || (c?.region as string | undefined) || undefined;
      const country = String((c?.country as string | undefined) ?? code); // fallback to code if name not provided
      const lat = typeof c?.latitude === 'number' || typeof c?.latitude === 'string' ? Number(c.latitude) : undefined;
      const lon = typeof c?.longitude === 'number' || typeof c?.longitude === 'string' ? Number(c.longitude) : undefined;
      return {
        name,
        region,
        country,
        countryCode: code,
        lat,
        lon,
        externalId: c?.id ? String(c.id as string | number) : undefined,
        source: 'geodb' as const,
        slug: normalize(`${name}-${code}`),
      } as CitySuggestion;
    });
    rapidCountryCache.set(cc, mapped);
    const filtered = mapped.filter((m) => normalize(`${m.name} ${m.region || ''} ${m.country}`).includes(q));
    return filtered.slice(0, limit);
  } catch {
    return [];
  }
}

// Free fallback: OpenStreetMap Nominatim (no API key). Respect usage: lightweight, debounced on client already.
export async function searchNominatimCities(query: string, { countryCodes, limit = 10 }: { countryCodes?: string[]; limit?: number } = {}): Promise<CitySuggestion[]> {
  if (!query || query.trim().length < 2) return [];
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    addressdetails: '1',
    limit: String(limit),
  });
  if (countryCodes && countryCodes.length) {
    params.set('countrycodes', countryCodes.map((c) => c.toLowerCase()).join(','));
  }
  params.set('extratags', '1');
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return [];
    const raw: unknown = await res.json();
    const data: Array<Record<string, unknown>> = Array.isArray(raw) ? raw as Array<Record<string, unknown>> : [];
    const out: CitySuggestion[] = [];
    const allowedTypes = new Set(['city','town','village','hamlet','municipality','locality']);
    const bannedTypes = new Set(['state','province','county','region','administrative']);
    for (const it of data) {
      const cls = it.class as string | undefined;
      const typ = it.type as string | undefined;
      if (cls && cls !== 'place') continue;
      if (typ && (bannedTypes.has(String(typ)) || !allowedTypes.has(String(typ)))) continue;
      const addr = (it.address as Record<string, unknown>) || {};
      const displayName = typeof it.display_name === 'string' ? it.display_name : '';
      const name: string = (addr.city as string) || (addr.town as string) || (addr.village as string) || displayName.split(',')[0] || '';
      const region: string | undefined = (addr.state as string) || (addr.county as string) || undefined;
      const country: string = (addr.country as string) || '';
      const ccRaw = addr.country_code as string | undefined;
      const cc: string = (ccRaw || '').toUpperCase();
      if (!name || !country) continue;
      // Apply optional EU filter at mapping time
      if (countryCodes && countryCodes.length && cc && !countryCodes.includes(cc)) continue;
      out.push({
        name,
        region,
        country,
        countryCode: cc,
        lat: typeof it.lat === 'number' || typeof it.lat === 'string' ? Number(it.lat) : undefined,
        lon: typeof it.lon === 'number' || typeof it.lon === 'string' ? Number(it.lon) : undefined,
        externalId: it.place_id ? String(it.place_id as string | number) : undefined,
        source: 'nominatim',
        slug: normalize(`${name}-${cc || country}`),
      });
    }
    return out;
  } catch {
    return [];
  }
}

import { getActiveCitiesPublic } from "@/lib/api/admin/cities";
import type { CityResponse } from "@/lib/api/admin/cities/cities.type";

export async function searchAdminCities(query: string, countryCode?: string, limit = 10): Promise<CitySuggestion[]> {
  try {
    const cities: CityResponse[] = await getActiveCitiesPublic();
    const q = normalize(query || "");
    const filtered = cities.filter((c) => {
      const slug = normalize(`${c.name} ${c.state ?? ''} ${c.country}`);
      const cc = (c as Partial<CityResponse> & { countryCode?: string }).countryCode;
      const countryOk = countryCode ? ((cc || '').toUpperCase() === countryCode.toUpperCase()) : true;
      return countryOk && (!q || slug.includes(q));
    }).slice(0, limit);
    return filtered.map((c) => ({
      id: c.id,
      name: c.name,
      region: c.state,
      country: c.country,
      countryCode: ((c as Partial<CityResponse> & { countryCode?: string }).countryCode) || "",
      lat: undefined,
      lon: undefined,
      source: 'admin' as const,
      slug: normalize(`${c.name}-${((c as Partial<CityResponse> & { countryCode?: string }).countryCode) || c.country}`),
    }));
  } catch {
    return [];
  }
}

export async function searchGeoDbCities(query: string, { countryCode, limit = 10 }: { countryCode?: string; limit?: number } = {}): Promise<CitySuggestion[]> {
  if (!query) return [];
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Host': GEODB_HOST,
    'X-RapidAPI-Key': GEODB_KEY,
  };
  // Restrict to Europe via region code (Europe=150 ISO UN M49) is not directly supported by GeoDB free
  // Instead restrict by a whitelist of country codes if provided. Otherwise return global.
  const params = new URLSearchParams({ namePrefix: query, limit: String(limit) });
  if (countryCode) params.set('countryIds', countryCode);
  const url = `https://${GEODB_HOST}/v1/geo/cities?${params.toString()}`;
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    const json: unknown = await res.json();
    const data = (json && typeof json === 'object' && Array.isArray((json as Record<string, unknown>).data))
      ? (json as Record<string, unknown>).data as Array<Record<string, unknown>>
      : [];
    return data.map((c: Record<string, unknown>) => ({
      name: String(c.city ?? ''),
      region: (c.region as string) || (c.regionCode as string),
      country: String(c.country ?? ''),
      countryCode: String(c.countryCode ?? ''),
      lat: typeof c.latitude === 'number' || typeof c.latitude === 'string' ? Number(c.latitude) : undefined,
      lon: typeof c.longitude === 'number' || typeof c.longitude === 'string' ? Number(c.longitude) : undefined,
      externalId: String((c.id as string | number | undefined) ?? (c.wikiDataId as string | number | undefined) ?? `${c.city}-${c.countryCode}`),
      source: 'geodb' as const,
      slug: normalize(`${String(c.city ?? '')}-${String(c.countryCode ?? '')}`),
    }));
  } catch {
    return [];
  }
}

export async function mergedCitySearch(query: string, opts: { countryCode?: string; limit?: number } = {}): Promise<CitySuggestion[]> {
  const { countryCode, limit = 10 } = opts;
  const hasGeoDb = Boolean(GEODB_KEY);
  const hasRapidCountry = Boolean(RAPID_COUNTRY_HOST && RAPID_COUNTRY_KEY);
  const adminPromise = searchAdminCities(query, countryCode, Math.min(5, limit));
  // Priority: Rapid Country-State-City (if configured) > GeoDB (if key) > Nominatim
  let primaryGeoPromise: Promise<CitySuggestion[]>;
  if (hasRapidCountry) {
    primaryGeoPromise = searchRapidCountryStateCity(query, { countryCode, limit });
  } else if (hasGeoDb) {
    primaryGeoPromise = searchGeoDbCities(query, { countryCode, limit });
  } else {
    primaryGeoPromise = searchNominatimCities(query, { countryCodes: countryCode ? [countryCode.toUpperCase()] : EU_COUNTRY_CODES, limit });
  }

  const [admin, primaryGeo] = await Promise.all([adminPromise, primaryGeoPromise]);

  // Fallback: if GeoDB is configured but returns empty (not subscribed / rate limit), try Nominatim
  let geo = primaryGeo;
  if ((hasGeoDb || hasRapidCountry) && geo.length === 0) {
    geo = await searchNominatimCities(query, { countryCodes: countryCode ? [countryCode.toUpperCase()] : EU_COUNTRY_CODES, limit });
  }
  const seen = new Set<string>();
  const out: CitySuggestion[] = [];
  for (const item of [...admin, ...geo]) {
    const key = `${item.slug || normalize(`${item.name}-${item.countryCode}`)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out.slice(0, limit);
}

export const EU_COUNTRY_CODES = [
  'AT','BE','BG','HR','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HU','IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK'
];
