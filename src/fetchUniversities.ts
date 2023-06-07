import { fetchJSON } from "../include/fetchJSON.js";
import { FluentURL } from "./utility.js";

interface University {
  name: string;
}

export function fetchUniversities(query: string): Promise<string[]> {
  const urlOfSearch = new FluentURL("http://universities.hipolabs.com/search")
    .addParam("name", query)
    .toString();

  return fetchJSON<University[]>(urlOfSearch).then(json => {
    if (Array.isArray(json) && json.length > 0) {
      return Promise.resolve(json.map(university => university.name));
    } else {
      return Promise.resolve([]);
    }
  });
}