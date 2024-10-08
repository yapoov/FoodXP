const fs = require("fs");
const csv = require("csv-parser");
const Fuse = require("fuse.js");
const axios = require("axios");
let foodData = null;
let foodExpiryData = null;
const loadCSVData = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};

const FindProducts = async (textAnnotations) => {
  const newRows = ExtractTextByLines(textAnnotations);
  if (!foodData) {
    foodData = await loadCSVData("./src/db/coles_data.csv");
  }
  const res = await FuzzySearch(newRows, foodData);
  if (!foodExpiryData) {
    foodExpiryData = await loadCSVData("./src/db/food_expiry.csv");
  }
  return AddExpiryData(res, foodExpiryData);
};

const FuzzySearch = (ocrProducts, csvProducts) => {
  const fuse = new Fuse(csvProducts, {
    keys: ["Product Name"],
    threshold: 0.3,
  });

  const matchedProducts = ocrProducts
    .map((product) => {
      const result = fuse.search(product)[0];
      return result ? result.item : null;
    })
    .filter((product) => product !== null);

  return matchedProducts;
};
const AddExpiryData = (products, data) => {
  const fuse = new Fuse(data, {
    keys: ["name"],
    threshold: 0.7,
  });

  return products.map((product) => {
    const result = fuse.search(product["Product Name"])[0];
    product.expiryData = result ? result.item : null;
    return product;
  });
};
function ExtractTextByLines(textAnnotations) {
  const centerVertices = textAnnotations[0].boundingPoly.vertices;

  // Calculate the "center" of the receipt text
  const centerA = {
    x:
      centerVertices.reduce((carry, item) => carry + item.x, 0) /
      centerVertices.length,
    y:
      centerVertices.reduce((carry, item) => carry + item.y, 0) /
      centerVertices.length,
  };
  const vertices = textAnnotations.slice(1).reduce((carry, item) => {
    return item.description.length > carry.description.length ? item : carry;
  }).boundingPoly.vertices;

  // Calculate the "center" of the longest string
  const centerB = {
    x: vertices.reduce((carry, item) => carry + item.x, 0) / vertices.length,
    y: vertices.reduce((carry, item) => carry + item.y, 0) / vertices.length,
  };

  // Calculate the angle the receipt is running
  const xDiff = vertices[0].x - centerB.x;
  const yDiff = vertices[0].y - centerB.y;
  const angle = (Math.atan2(yDiff, xDiff) * 180) / Math.PI + 180;
  const angleToRotate = -(Math.PI * (angle - 5)) / 180;

  // Sort textAnnotations, skipping the first annotation
  const textAnnotationsSorted = textAnnotations.slice(1).map((row) => {
    const vertices = row.boundingPoly.vertices;
    const newVertices = vertices.map((vertex) => {
      const x = vertex.x - centerB.x;
      const y = vertex.y - centerB.y;
      const newX =
        x * Math.cos(angleToRotate) - y * Math.sin(angleToRotate) + centerB.x;
      const newY =
        x * Math.sin(angleToRotate) + y * Math.cos(angleToRotate) + centerB.y;
      return { x: newX, y: newY };
    });

    // Attach the new vertices and the y-coordinate for sorting
    row.boundingPoly.vertices = newVertices;
    row.lineSort = newVertices[0].y;
    return row;
  });

  // Sort by lineSort
  textAnnotationsSorted.sort((a, b) => a.lineSort - b.lineSort);

  // Setup faux rows
  const newRows = [];
  let index = 0;

  // Setup base Y vertical
  let curY = textAnnotationsSorted[0].boundingPoly.vertices[0].y;

  // Loop through sorted rows to append faux rows
  textAnnotationsSorted.forEach((v) => {
    if (v.boundingPoly.vertices[0].y > curY + 10) {
      index++;
    }
    if (v.boundingPoly.vertices[0].y < curY - 10) {
      index--;
    }
    if (!newRows[index]) newRows[index] = []; // Initialize if undefined
    newRows[index].push(v);
    curY = v.boundingPoly.vertices[0].y;
  });

  // Loop faux rows and sort columns
  newRows.forEach((row, rowIndex) => {
    row.forEach((v) => {
      v.columnSort = v.boundingPoly.vertices[0].x; // Attach x-coordinate for sorting
    });

    // Sort by columnSort
    row.sort((a, b) => a.columnSort - b.columnSort);

    // Join descriptions into a single string
    newRows[rowIndex] = row.map((item) => item.description).join(" ");
  });
  return newRows;
}

module.exports = FindProducts;
