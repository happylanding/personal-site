// Script to generate a simple PDF from a text file
const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "../public/books/meditations.txt");
const outputFile = path.join(__dirname, "../public/books/meditations.pdf");
const title = "Meditations";
const author = "Marcus Aurelius";

const text = fs.readFileSync(inputFile, "utf-8");
const lines = text.split("\n").filter(l => l.trim());

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 20;
const maxWidth = pageWidth - margin * 2;
let y = margin;

// Title
doc.setFontSize(20);
doc.setFont(undefined, "bold");
doc.text(title, margin, y, { maxWidth });
y += 12;

// Author
doc.setFontSize(12);
doc.setFont(undefined, "normal");
doc.text(`by ${author}`, margin, y);
y += 8;
doc.setDrawColor(100);
doc.line(margin, y, pageWidth - margin, y);
y += 10;

// Content
doc.setFontSize(10);
let lineCount = 0;
const maxLines = 800; // Limit pages

for (const line of lines) {
  if (lineCount >= maxLines) break;
  
  const wrapped = doc.splitTextToSize(line, maxWidth);
  for (const w of wrapped) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(w, margin, y);
    y += 5;
    lineCount++;
    if (lineCount >= maxLines) break;
  }
  if (lineCount >= maxLines) break;
}

// Footer with source
doc.setFontSize(8);
doc.setTextColor(128);
doc.text("Source: Project Gutenberg (public domain)", margin, pageHeight - 10);

doc.save(outputFile);
console.log(`PDF generated: ${outputFile} (${(fs.statSync(outputFile).size / 1024).toFixed(1)} KB)`);
