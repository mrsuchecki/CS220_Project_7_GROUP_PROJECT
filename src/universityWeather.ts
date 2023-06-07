import { fetchCurrentTemperature } from "./fetchCurrentTemperature";
import { fetchGeoCoord } from "./fetchGeoCoord";
import { fetchUniversities } from "./fetchUniversities";

interface AverageTemperatureResults {
  totalAverage: number;
  [key: string]: number;
}

export function fetchUniversityWeather(
  universityQuery: string,
  transformName?: (s: string) => string
): Promise<AverageTemperatureResults> {
  // initialize output obj
  const output: AverageTemperatureResults = { totalAverage: 0 };
  // variable to save array of university names for populating output object fields
  let savedUnivNames: string[];
  
  return fetchUniversities(universityQuery)
    // map array of university names to transformed names
    .then(univNames => {
      if (univNames.length > 0) {
        savedUnivNames = univNames;
        return transformName !== undefined ? univNames.map(transformName) : univNames;
      } else {
        // reject if no matching universities
        return Promise.reject(new Error("No results found for query."));
      }
    })
    // map array of transformed names to array of resolved geo coords
    .then(transformedNames => Promise.all(transformedNames.map(fetchGeoCoord)))
    // map array of geo coords to array of resolved temperature readings
    .then(coords => Promise.all(coords.map(fetchCurrentTemperature)))
    // use array of temperature readings to calculate averages and populate fields of the output object
    .then(temps => {
      temps.forEach((elem, index) => {
        const avg = elem.temperature_2m.reduce((accum, elem) => accum + elem, 0) / elem.temperature_2m.length;
        output[savedUnivNames[index]] = avg;
      });
      // totalAverage is average of all average temperatures, -1 in denominator to account for itself in avg calculation
      output.totalAverage =
        Object.values(output).reduce((accum, elem) => accum + elem, 0) / (Object.values(output).length - 1);
    })
    // wrap the output obj in a Promise
    .then(() => Promise.resolve(output));
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
  // regex matching function which replaces " at " with " "
  return fetchUniversityWeather("University of Massachusetts", x => x.replace(/ at /, " "));
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
  return fetchUniversityWeather("University of California");
}
