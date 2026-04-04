// Client for address search using OpenStreetMap Nominatim

export type AddressSuggestion = {
  displayName: string;
  street: string;
  number: string;
  city: string;
  province: string;
  postalCode: string;
  lat?: number;
  lon?: number;
};

function extractAddressParts(addr: Record<string, unknown>): { street: string; number: string; city: string; province: string; postalCode: string } {
  const road = addr.road as string | undefined;
  const hamlet = addr.hamlet as string | undefined;
  const village = addr.village as string | undefined;
  const town = addr.town as string | undefined;
  const city = addr.city as string | undefined;
  const municipality = addr.municipality as string | undefined;
  const state = addr.state as string | undefined;
  const postcode = addr.postcode as string | undefined;

  const street = road || hamlet || village || town || city || municipality || "";
  const number = (addr.house_number as string) || "";
  const cityStr = city || town || municipality || village || hamlet || "";
  const provinceStr = state || "";
  const postalCodeStr = postcode || "";

  return {
    street,
    number,
    city: cityStr,
    province: provinceStr,
    postalCode: postalCodeStr,
  };
}

export async function searchAddresses(query: string, { limit = 8 }: { limit?: number } = {}): Promise<AddressSuggestion[]> {
  if (!query || query.trim().length < 3) return [];

  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    addressdetails: '1',
    limit: String(limit),
    countrycodes: 'es',
    featuretype: 'building',
  });

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ViajeSeguro/1.0',
      },
    });

    if (!res.ok) return [];

    const raw: unknown = await res.json();
    const data: Array<Record<string, unknown>> = Array.isArray(raw) ? raw as Array<Record<string, unknown>> : [];

    const out: AddressSuggestion[] = [];

    for (const it of data) {
      const addr = (it.address as Record<string, unknown>) || {};
      const parts = extractAddressParts(addr);
      const displayName = typeof it.display_name === 'string' ? it.display_name : '';

      if (!parts.street && !parts.city) continue;

      out.push({
        displayName,
        street: parts.street,
        number: parts.number,
        city: parts.city,
        province: parts.province,
        postalCode: parts.postalCode,
        lat: typeof it.lat === 'number' || typeof it.lat === 'string' ? Number(it.lat) : undefined,
        lon: typeof it.lon === 'number' || typeof it.lon === 'string' ? Number(it.lon) : undefined,
      });
    }

    return out;
  } catch {
    return [];
  }
}
