const GBFS_INDEX_URL = 'https://gbfs.citibikenyc.com/gbfs/2.3/gbfs.json';

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Citi Bike request failed (${response.status}): ${url}`);
  }

  return response.json();
}

export async function fetchStations({ signal } = {}) {
  const index = await fetchJson(GBFS_INDEX_URL, signal);
  const feeds = index.data?.en?.feeds ?? [];
  const feedUrls = Object.fromEntries(feeds.map(({ name, url }) => [name, url]));

  if (!feedUrls.station_information || !feedUrls.station_status) {
    throw new Error('Citi Bike GBFS index is missing station feeds.');
  }

  const [information, status] = await Promise.all([
    fetchJson(feedUrls.station_information, signal),
    fetchJson(feedUrls.station_status, signal),
  ]);
  const statusById = new Map(
    (status.data?.stations ?? []).map((station) => [station.station_id, station]),
  );

  return (information.data?.stations ?? []).map((station) => ({
    ...station,
    ...statusById.get(station.station_id),
  }));
}