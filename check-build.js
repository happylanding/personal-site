const fs = require("fs");
const h = fs.readFileSync("dist/index.html", "utf8");

console.log("=== ID Counts ===");
console.log("search-trigger:", (h.match(/id="search-trigger"/g) || []).length);
console.log("theme-toggle:", (h.match(/id="theme-toggle"/g) || []).length);
console.log("search-overlay:", (h.match(/id="search-overlay"/g) || []).length);
console.log("hamburger-btn:", (h.match(/id="hamburger-btn"/g) || []).length);

console.log("\n=== Delegate Buttons ===");
console.log("search delegate onclick:", h.includes("getElementById('search-trigger')"));
console.log("theme delegate onclick:", h.includes("getElementById('theme-toggle')"));

console.log("\n=== CSS :global ===");
const globalCount = (h.match(/:global/g) || []).length;
console.log(":global count:", globalCount);
console.log(":global(.mobile-overlay-open):", h.includes(":global(.mobile-overlay-open)"));
console.log(":global(.search-overlay-open):", h.includes(":global(.search-overlay-open)"));
