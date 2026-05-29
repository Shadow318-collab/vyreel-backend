const fs = require("fs");
const path = require("path");

function loadNiche(niche) {
  const filePath = path.join(__dirname, "../niches", `${niche}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Niche "${niche}" not found`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = loadNiche;
