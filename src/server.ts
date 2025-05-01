import app from "./app";
import fs from "fs";
import path from "path";

// create necesesary directories if they don't exist
const dataDir = path.join(__dirname, "../data");
const articlesDir = path.join(dataDir, "articles");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the blog`);
});
