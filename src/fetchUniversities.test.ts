import assert from "assert";
import { fetchUniversities } from "./fetchUniversities.js";

describe("fetchUniversities", () => {
  it("follows type specification", () => {
    const promise = fetchUniversities("University of Massachusetts Amherst");
    assert(typeof promise === "object" && typeof promise.then === "function");

    return promise.then((result) => {
      assert(Array.isArray(result)); // Assert the result in an array
      assert(result.every((x) => typeof x === "string")); // Assert each element in the array is a string
    });
  });

  it("returns a non-empty array with valid strings", () => {
    const promise = fetchUniversities("University of California, Los Angeles");

    return promise.then((result) => {
      assert(Array.isArray(result));
      assert(result.length === 1);
      assert(result[0] === "University of California, Los Angeles");
    });
  });

  it("returns empty array with invalid input", () => {
    const promise = fetchUniversities("asfadfsdgsadsadfafd");
  
    return promise.then((result) => {
      assert(Array.isArray(result));
      assert(result.length === 0);
    });
  });
});
