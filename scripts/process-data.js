const fs = require("fs");
const path = require("path");
const d3 = require("d3");

const dataPath = path.join(__dirname, "raw-data.json");
const outFile = path.join(__dirname, "data.json");

const monthsPerBucket = 6;
const dateFormat = "%m-%d-%Y";
const init = async () => {
  try {
    const res = await readFile(dataPath);
    const data = JSON.parse(res).map((d) => ({
      name: d.tagName,
      values: d.values.map((d) => ({
        ...d,
        value: d.percent,
        date: d3.timeFormat(dateFormat)(new Date(d.yearMonth)),
      })),
    }));

    const timestamps = data[0].values
      .map((d) => d.date)
      .filter((d, i) => !(i % 6));
    const buckets = timestamps.map((timestamp) => {
      const values = data
        .map(({ name, values }) => {
          const bucket = values.find(({ date }) => date === timestamp);
          if (!bucket) return null;

          return { name, value: bucket.value };
        })
        .filter((d) => d);
      const rankedValues = getRanks(values);
      return [timestamp, rankedValues];
    });

    let processedKeyframes = [];
    buckets.forEach(([date, values], i) => {
      const intermediateMonths = d3
        .timeMonths(
          d3.timeMonth.offset(new Date(date), 1),
          d3.timeMonth.offset(new Date(date), monthsPerBucket)
        )
        .map(d3.timeFormat(dateFormat));
      processedKeyframes.push([date, values]);
      const nextBucket = buckets[i + 1];
      if (!nextBucket) return;
      intermediateMonths.forEach((date, i) => {
        const progress = (i + 1) / monthsPerBucket;
        const newValues = values
          .map((lastValue) => {
            const name = lastValue.name;
            const nextValue = nextBucket[1].find((d) => d.name === name);
            if (!nextValue) return;
            const diff = nextValue.value - lastValue.value;
            const interpolatedValue = lastValue.value + diff * progress;
            return { name, value: interpolatedValue };
          })
          .filter((d) => d);

        const rankedValues = getRanks(newValues);

        processedKeyframes.push([date, rankedValues]);
      });
    });

    fs.writeFileSync(outFile, JSON.stringify(processedKeyframes));
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

function getRanks(arr) {
  return arr
    .sort((a, b) => b.value - a.value)
    .map((d, i) => ({
      ...d,
      rank: i,
    }));
}
