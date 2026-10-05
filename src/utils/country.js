const countryNames = new Intl.DisplayNames(['es'], { type: 'region' });
export const countryName = code => countryNames.of(code) || code;

export async function detectCountry(signal) {
  // No GPS request or persisted IP. Only the returned country code is retained.
  const response = await fetch('https://ipwho.is/?fields=success,country_code', { signal, referrerPolicy: 'no-referrer' });
  if (!response.ok) throw new Error('Country lookup unavailable');
  const data = await response.json();
  if (!data.success || !/^[A-Z]{2}$/.test(data.country_code)) throw new Error('Country lookup unavailable');
  return data.country_code;
}
