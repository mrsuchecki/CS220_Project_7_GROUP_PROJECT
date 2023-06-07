import { fetchJSON } from "../include/fetchJSON.js";
import { GeoCoord } from "./fetchGeoCoord.js";
import { FluentURL } from "./utility.js";

interface TemperatureReading {
  time: string[];
  temperature_2m: number[];
}
interface Forecast {
  hourly: {time: string[], temperature_2m: number[]}
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
  const searchURL = new FluentURL("https://api.open-meteo.com/v1/forecast")
  searchURL.addParam("latitude", coords.lat.toString()).addParam("longitude", coords.lon.toString()).addParam("hourly", "temperature_2m").addParam("temperature_unit", "fahrenheit");
  return fetchJSON<Forecast>(searchURL.toString()).then((json) =>
    Promise.resolve({ time: (json.hourly.time), temperature_2m: json.hourly.temperature_2m })
  );
}
