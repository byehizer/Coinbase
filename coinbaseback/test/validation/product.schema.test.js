import { describe, it, expect } from "vitest";
import { productSchema } from "../../src/schemas/product.schema";

describe("productSchema", () => {
  const validData = {
    name: "Old Bill",
    description: "A rare old bill from 1800s",
    year: "1800",
    country_origin: "Argentina",
    price: "100.50",
    stock: "10",
  };

  it("should pass with valid data", () => {
    const parsed = productSchema.parse(validData);
    expect(parsed).toEqual({
      name: "Old Bill",
      description: "A rare old bill from 1800s",
      year: 1800,
      country_origin: "Argentina",
      price: 100.5,
      stock: 10,
    });
  });

  it("should fail if name is empty", () => {
    const data = { ...validData, name: "" };
    expect(() => productSchema.parse(data)).toThrow("Name is required");
  });

  it("should fail if description is empty", () => {
    const data = { ...validData, description: "" };
    expect(() => productSchema.parse(data)).toThrow("Description is required");
  });

  it("should fail if year is not a number", () => {
    const data = { ...validData, year: "abc" };
    expect(() => productSchema.parse(data)).toThrow("Year must be a number");
  });

  it("should fail if year is out of range", () => {
    const data = { ...validData, year: "1600" };
    expect(() => productSchema.parse(data)).toThrow("Year must be between");
  });

  it("should fail if country_origin is empty", () => {
    const data = { ...validData, country_origin: "" };
    expect(() => productSchema.parse(data)).toThrow("Country origin is required");
  });

  it("should fail if price is not a number", () => {
    const data = { ...validData, price: "abc" };
    expect(() => productSchema.parse(data)).toThrow("Price must be a number");
  });

  it("should fail if price is zero or negative", () => {
    const data = { ...validData, price: "-5" };
    expect(() => productSchema.parse(data)).toThrow("Price must be greater than 0");
  });

  it("should fail if stock is not a number", () => {
    const data = { ...validData, stock: "abc" };
    expect(() => productSchema.parse(data)).toThrow("Stock must be a number");
  });

  it("should fail if stock is negative", () => {
    const data = { ...validData, stock: "-1" };
    expect(() => productSchema.parse(data)).toThrow("Stock cannot be negative");
  });
});