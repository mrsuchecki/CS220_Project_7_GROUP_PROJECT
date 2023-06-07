import assert from "assert";
import { fetchUniversityWeather, fetchUCalWeather, fetchUMassWeather } from "./universityWeather.js";

jest.setTimeout(30000); // 30 sec

describe("fetchUniversityWeather", () => {
  it("resolves to an error on query which returns no universities", () => {
    const promise = fetchUniversityWeather("skghslkh");

    return promise.catch(result => {
      assert(result instanceof Error);
      assert(result.message === "No results found for query.");
    });
  });

  it("resolves to an error (propagated from fetchGeoCoord) on valid query with invalid transformation on all universities", () => {
    const promise = fetchUniversityWeather("University of California", x => x + "ksjrtbgw87a");

    return promise.catch(result => {
      assert(result instanceof Error);
      assert(result.message === "No results found for query.");
    })
  });

  it("resolves to an error (propagated from fetchGeoCoord) on valid query with invalid transformation on some universities", () => {
    const promise = fetchUniversityWeather("University of Massachusetts", x => x);

    return promise.catch(result => {
      assert(result instanceof Error);
      assert(result.message === "No results found for query.");
    })
  });
});

const UCalNames = [
  'University of California, Irvine',
  'University of California, Davis',
  'University of California, Merced',
  'University of California, Berkeley',
  'University of California, Los Angeles',
  'University of California, Santa Barbara',
  'University of California, Santa Cruz',
  'University of California, San Diego',
  'University of California, San Francisco',
  'University of California, Riverside',
  'University of California, Office of the President',
];

describe("fetchUCalWeather", () => {
  it("follows type specification", () => {
    const promise = fetchUCalWeather();

    return promise.then(result => {
      console.log(result);
      assert(typeof result === "object");
      assert(Object.keys(result).every(x => typeof x === "string"));
      assert(Object.values(result).every(x => typeof x === "number"));

      // more tests written here to avoid making another fetch
      assert(Object.keys(result).length === 12);
      UCalNames.forEach(university => {
        assert(university in result);
        assert(result[university] >= 30 && result[university] <= 80); // roughly "normal" temperatures
      });
      assert("totalAverage" in result);
      assert(Math.abs(result.totalAverage - (Object.values(result).reduce((accum, elem) => accum + elem, 0) - result.totalAverage) / 11) <= 1); // correct average
    });
  });
});

const UMassNames = [
  'University of Massachusetts Boston',
  'University of Massachusetts at Lowell',
  'University of Massachusetts at Dartmouth',
  'University of Massachusetts at Amherst',
]

describe("fetchUMassWeather", () => {
  it("follows type specification", () => {
    const promise = fetchUMassWeather();

    return promise.then(result => {
      console.log(result);
      assert(typeof result === "object");
      assert(Object.keys(result).every(x => typeof x === "string"));
      assert(Object.values(result).every(x => typeof x === "number"));

      // more tests written here to avoid making another fetch
      assert(Object.keys(result).length === 5);
      UMassNames.forEach(university => {
        assert(university in result);
        assert(result[university] >= 30 && result[university] <= 80); // roughly "normal" temperatures
      });
      assert("totalAverage" in result);
      assert(Math.abs(result.totalAverage - (Object.values(result).reduce((accum, elem) => accum + elem, 0) - result.totalAverage) / 4) <= 1); // correct average
    });
  });
});
