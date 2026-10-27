# Citi Bike Visualization

Fetch live Citi Bike station locations and availability from the GBFS API:

```js
import { fetchStations } from './src/citibike.js';

const stations = await fetchStations();
console.log(stations[0]);
```

Each returned station combines its location and name with its latest availability status. Pass an `AbortSignal` to cancel the requests:

```js
const controller = new AbortController();
const stations = await fetchStations({ signal: controller.signal });
```