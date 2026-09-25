import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = fileURLToPath(new URL("../.tauri-dist/", import.meta.url));
const teamDir = join(outputDir, "equipe");

mkdirSync(teamDir, { recursive: true });
copyFileSync(join(outputDir, "index.html"), join(teamDir, "index.html"));