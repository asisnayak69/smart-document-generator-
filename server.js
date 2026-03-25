const express = require("express");
const multer = require("multer");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 3000;

const upload = multer({ storage: multer.memoryStorage() });

// Serve frontend
app.use(express.static("public"));

// Convert HTML → PDF
app.post("/convert", upload.single("htmlFile"), async (req, res) => {
  try {
    const html = req.file.buffer.toString();

    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=output.pdf");

    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});