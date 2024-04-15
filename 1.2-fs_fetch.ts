import { readFileSync, writeFileSync } from "fs";
// bun i -D @types/bun (Bun)
// pnpm i -D @types/node (Node.js w/ pnpm)

/*
    1. Reading config file
*/
const config = JSON.parse(readFileSync("2-config.json", "utf8"));

// Sample Promise
console.log("Promise not yet created.");
const textEventually = new Promise<string>((resolve) => {
  setTimeout(() => resolve("Promise done!"), 1000);
});
console.log("Promise created!");
console.log(await textEventually);

/*
    2. Fetching website with GET request
*/
const response = await fetch("https://dummyjson.com/products").then((res) =>
  res.json()
);

/*
    3. Computing results (List reduce, map, filter, sort, flatMap)
*/
const results = {
  totalStock: response.products.reduce(
    (sum, product) => sum + product.stock,
    0
  ),
  products: response.products
    .map((x) => ({
      ...x,
      discountedPrice: (x.price * (100 - x.discountPercentage)) / 100,
    }))
    .filter((x) => x.discountedPrice >= config.minPrice)
    .sort((a, b) => a[config.sort] - b[config.sort]),
  cases: response.products.flatMap((x) => {
    switch (x.category) {
      case "laptops":
        return x.title + " case (Silver)";
      case "smartphones":
        return [
          x.title + " case (White)",
          x.title + " case (Blue)",
          x.title + " case (Purple)",
        ];
      default:
        return [];
    }
  }),
};

/*
    4. Writing results to file
*/
writeFileSync("2-results.json", JSON.stringify(results, null, 4));
