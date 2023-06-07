import { fetchJSON } from "../include/fetchJSON.js";
import { FluentURL } from "./utility.js";

export interface GeoCoord {
  lat: number;
  lon: number;
}

interface Coords {
  lat: string,
  lon: string,
}

export function fetchGeoCoord(query: string): Promise<GeoCoord> {
  const searchURL = new FluentURL("https://geocode.maps.co/search").addParam("q", query).toString();
  return fetchJSON<Coords[]>(searchURL).then(json =>
    Array.isArray(json) && json.length > 0
      ? Promise.resolve({ lat: Number.parseFloat(json[0].lat), lon: Number.parseFloat(json[0].lon) })
      : Promise.reject(new Error("No results found for query."))
  );
}
