import { fileURLToPath } from 'node:url';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get icon name from command line argument
const iconName = process.argv[2];
console.log(`Line 16 - copy-icons.ts - Copying icon: ${iconName}`);

if (!iconName) {
    console.error('Please provide an icon name as an argument');
    console.error('Example: npm run copy-icon bug');
    process.exit(1);
}

const sourceDir = join(__dirname, '../../../node_modules/@vscode/codicons/src/icons');
const targetDir = join(__dirname, '../assets/icons');

// Ensure target directory exists
if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
}

const sourcePath = join(sourceDir, `${iconName}.svg`);
const targetPath = join(targetDir, `${iconName}.svg`);

try {
    if (existsSync(sourcePath)) {
        copyFileSync(sourcePath, targetPath);
        console.log(`✓ Copied ${iconName}.svg`);
    } else {
        console.error(`✗ Icon not found: ${iconName}.svg`);
        process.exit(1);
    }
} catch (error) {
    console.error(`✗ Error copying ${iconName}.svg:`, error instanceof Error ? error.message : String(error));
    process.exit(1);
}
