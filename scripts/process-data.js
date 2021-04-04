const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "raw-data.json");
const outFile = path.join(__dirname, "data.json");

const init = async () => {
  try {
    const res = await readFile(dataPath);
    const data = JSON.parse(res);

    const timestamps = data[0].values.map((d) => d.yearMonth);
    const buckets = timestamps.map((timestamp) => {
      const values = data
        .map((d) => {
          const language = d.tagName;
          const bucket = d.values.find((d) => d.yearMonth === timestamp);
          if (!bucket) return null;
          const value = bucket.percent;

          return { name: language, value };
        })
        .filter((d) => d);
      const rankedValues = values
        .sort((a, b) => b.value - a.value)
        .map((d, i) => ({
          ...d,
          rank: i,
        }));
      return [timestamp, rankedValues];
    });

    fs.writeFileSync(outFile, JSON.stringify(buckets));
  } catch (e) {
    console.log("e", e);
  }
};
init();

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", function (error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
}
