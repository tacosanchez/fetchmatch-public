const AU_POSTCODES: Record<string, { lat: number; lng: number; suburb: string }> = {
  "2168": { lat: -33.919, lng: 150.899, suburb: "Sadleir" },
  "2199": { lat: -33.907, lng: 151.032, suburb: "Yagoona West" },
  "2207": { lat: -33.949, lng: 151.121, suburb: "Bexley" },
  "2229": { lat: -34.013, lng: 151.119, suburb: "Taren Point" },
  "2259": { lat: -33.172, lng: 151.578, suburb: "Lake Munmorah" },
  "2260": { lat: -33.446, lng: 151.444, suburb: "Terrigal" },
  "2264": { lat: -33.127, lng: 151.589, suburb: "Mirrabooka" },
  "2280": { lat: -32.969, lng: 151.694, suburb: "Jewells" },
  "2283": { lat: -33.053, lng: 151.614, suburb: "Coal Point" },
  "2285": { lat: -32.935, lng: 151.65, suburb: "Cameron Park" },
  "2287": { lat: -32.909, lng: 151.669, suburb: "Wallsend" },
  "2291": { lat: -32.935, lng: 151.767, suburb: "The Junction" },
  "2295": { lat: -32.861, lng: 151.81, suburb: "Fern Bay" },
  "2296": { lat: -32.921, lng: 151.756, suburb: "Islington" },
  "2300": { lat: -32.9283, lng: 151.7817, suburb: "Newcastle" },
  "2304": { lat: -32.897, lng: 151.736, suburb: "Mayfield" },
  "2305": { lat: -32.929, lng: 151.711, suburb: "New Lambton" },
  "2315": { lat: -32.718, lng: 152.09, suburb: "Corlette" },
  "2326": { lat: -32.751, lng: 151.569, suburb: "Sawyers Gully" },
  "2428": { lat: -32.181, lng: 152.482, suburb: "Forster" },
  "2627": { lat: -36.4275, lng: 148.3494, suburb: "Snowy Mountains" },
  "2650": { lat: -35.12, lng: 147.37, suburb: "Wagga Wagga South" },
  "2680": { lat: -34.287, lng: 146.05, suburb: "Griffith" },
  "2761": { lat: -33.744, lng: 150.835, suburb: "Glendenning" },
  "2850": { lat: -33.375, lng: 149.899, suburb: "Running Stream" },
  "3000": { lat: -37.8136, lng: 144.9631, suburb: "Melbourne" },
  "3073": { lat: -37.74, lng: 145.02, suburb: "Rosanna" },
  "3083": { lat: -37.716, lng: 145.06, suburb: "Bundoora" },
  "3122": { lat: -37.8227, lng: 145.0341, suburb: "Hawthorn" },
  "3138": { lat: -37.786, lng: 145.312, suburb: "Mooroolbark" },
  "3152": { lat: -37.849, lng: 145.222, suburb: "Wantirna" },
  "3198": { lat: -38.101, lng: 145.131, suburb: "Seaford" },
  "3220": { lat: -38.1499, lng: 144.3615, suburb: "Geelong" },
  "3228": { lat: -38.33, lng: 144.328, suburb: "Torquay" },
  "3260": { lat: -38.235, lng: 143.146, suburb: "Camperdown" },
  "3350": { lat: -37.5622, lng: 143.8503, suburb: "Ballarat" },
  "3550": { lat: -36.757, lng: 144.2794, suburb: "Bendigo" },
  "3824": { lat: -38.206, lng: 145.985, suburb: "Trafalgar" },
  "3977": { lat: -38.092, lng: 145.264, suburb: "Cranbourne West" },
  "4207": { lat: -27.712, lng: 153.164, suburb: "Yarrabilba" },
  "4216": { lat: -27.924, lng: 153.393, suburb: "Coombabah" },
  "4350": { lat: -27.56, lng: 151.953, suburb: "Toowoomba" },
  "4560": { lat: -26.621, lng: 152.953, suburb: "Rosemount" },
  "4870": { lat: -16.909, lng: 145.75, suburb: "Edge Hill" },
  "6084": { lat: -31.669, lng: 116.041, suburb: "Bullsbrook" },
  "6090": { lat: -31.855, lng: 115.888, suburb: "Malaga" },
  "6725": { lat: -17.9614, lng: 122.2359, suburb: "Broome" },
};

// First-digit → state capital fallback so any AU postcode resolves
const STATE_CAPITAL_FALLBACK: Record<string, { lat: number; lng: number }> = {
  "2": { lat: -33.8688, lng: 151.2093 }, // Sydney (NSW)
  "3": { lat: -37.8136, lng: 144.9631 }, // Melbourne (VIC)
  "4": { lat: -27.4698, lng: 153.0251 }, // Brisbane (QLD)
  "5": { lat: -34.9285, lng: 138.6007 }, // Adelaide (SA)
  "6": { lat: -31.9505, lng: 115.8605 }, // Perth (WA)
  "7": { lat: -42.8821, lng: 147.3272 }, // Hobart (TAS)
  "0": { lat: -12.4634, lng: 130.8456 }, // Darwin (NT)
};

export function getPostcodeCoords(postcode: string): { lat: number; lng: number } | null {
  if (AU_POSTCODES[postcode]) return AU_POSTCODES[postcode];
  return STATE_CAPITAL_FALLBACK[postcode[0]] ?? null;
}

export function distanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
