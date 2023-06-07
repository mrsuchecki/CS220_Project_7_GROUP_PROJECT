import assert from "assert";
import { fetchGeoCoord } from "./fetchGeoCoord.js";

describe("fetchGeoCoord", () => {
  it("follows type specification", () => {
    const promise = fetchGeoCoord("University of Massachusetts Amherst");

    return promise.then(result => {
      assert(typeof result === "object"); //  Assert the result is an object
      assert(typeof result.lon === "number"); // Assert that the lon value is a number
      assert(typeof result.lat === "number"); // Assert that the lat value is a number
      assert(Object.keys(result).length === 2); // Assert there are only two keys in the object
    });
  });

  it("correctly rejects to an Error when query is empty string", () => {
    const promise = fetchGeoCoord("");

    return promise.catch(result => {
      assert(result instanceof Error);
      assert(result.message === "No results found for query.");
    });
  });

  it("correctly rejects to an Error when query does not return any results", () => {
    const promise = fetchGeoCoord("@#(%^@#(*%^#");

    return promise.catch(result => {
      assert(result instanceof Error);
      assert(result.message === "No results found for query.");
    });
  });

  it("correctly returns the latitude and longitude for a query with exactly one result", () => {
    const promise = fetchGeoCoord("University of Massachusetts Amherst");

    return promise.then(result => {
      assert(typeof result === "object");
      assert(result.lon === -72.52991477067445);
      assert(result.lat === 42.3869382);
      assert(Object.keys(result).length === 2);
    });
  });

  it("correctly returns the first latitude and longitude for a query with multiple results", () => {
    const promise = fetchGeoCoord("ohio mcdonalds");

    return promise.then(result => {
      assert(typeof result === "object");
      assert(result.lon === -81.3758945488883);
      assert(result.lat === 41.64239815);
      assert(Object.keys(result).length === 2);
    });
  });
});
