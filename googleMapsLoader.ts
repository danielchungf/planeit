import * as gmapsLoader from '@googlemaps/js-api-loader';
const { Loader } = gmapsLoader;

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places", "geocoding"]
});

export default loader;
