import { promisify } from "util";
import path from "path";
import fs from "fs";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const readdirAsync = promisify(fs.readdir);

export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const data = await readFileAsync(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch (error) {
    throw new Error(`Error reading file ${filePath}: ${error}`);
  }
}

export async function writeJsonFile<T>(
  filePath: string,
  data: T
): Promise<void> {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    await writeFileAsync(filePath, jsonData, "utf8");
  } catch (error) {
    throw new Error(`Error writing to file ${filePath}: ${error}`);
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await unlinkAsync(filePath);
  } catch (error) {
    throw new Error(`Error deleting file ${filePath}: ${error}`);
  }
}

export async function listFiles(dirPath: string): Promise<string[]> {
  try {
    return await readdirAsync(dirPath);
  } catch (error) {
    throw new Error(`Error listing files in directory ${dirPath}: ${error}`);
  }
}

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getArticlesDirectory(): string {
  return path.join(process.cwd(), "data", "articles");
}

export function getArticleFilePath(id: string): string {
  return path.join(getArticlesDirectory(), `${id}.json`);
}
