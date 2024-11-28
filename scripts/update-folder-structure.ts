import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { execSync } from "child_process";

const DOCS_PATH = ".notes/folderStructure.md";
const START_MARKER = "## Directory Tree";
const END_MARKER = "## Directory Purposes";

const INITIAL_CONTENT = `# Project Structure

## Directory Tree

## Directory Purposes

### Routes (\`/routes\`)
File-based routing structure for the application:
- \`five-up/\`: Five-pane layout implementation
- \`editor/\`: Code editor interface
- \`settings/\`: Application configuration interface
- \`test/\`: Testing environment

### Library (\`/lib\`)
Shared codebase organized by functionality:

#### Components (\`/lib/components\`)
- \`layout/panes/\`: Core pane components for the editor interface
- \`ui/\`: shadcn-svelte component library
- \`buttons/\`: Custom button implementations
- \`common/\`: Shared generic components

#### Core Functionality
- \`stores/\`: Global state management
- \`utils/\`: Utility functions and helpers
- \`services/\`: API and service implementations
- \`constants/\`: Application-wide constants
- \`config/\`: Configuration management
- \`types/\`: TypeScript definitions
- \`assets/\`: Static resources

### Application Core
- \`styles/\`: Global styling
- \`hooks/\`: Svelte hooks and middleware
- \`electron/\`: Electron-specific implementations
- \`app.html\`: Root HTML template
- \`tsconfig.json\`: TypeScript configuration

## Recent Changes
- Reorganized pane components under layout/
- Added services/ and constants/ directories
- Implemented five-up layout structure
- Added electron-specific directory
- Separated UI components by function`;

function generateTree(): string {
  // Use tree command with specific formatting
  const treeOutput = execSync(
    'tree -I "node_modules|.svelte-kit|.git" --dirsfirst -F src/',
    {
      encoding: "utf8",
    }
  );

  // Process the tree output to match our desired format
  const lines = treeOutput
    .split("\n")
    .filter((line) => line.trim()) // Remove empty lines
    .map((line) =>
      line
        .replace(/\\/g, "") // Remove Windows-style backslashes
        .replace(/├──/g, "├─") // Normalize tree characters
        .replace(/└──/g, "└─")
        .replace(/│   /g, "│ ")
    );

  // Format as code block
  return ["```", ...lines, "```"].join("\n");
}

function ensureFileExists(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(filePath)) {
    writeFileSync(filePath, INITIAL_CONTENT);
    console.log(`✅ Created initial documentation file at ${filePath}`);
  }
}

function updateDocumentation(): void {
  try {
    // Ensure the file exists
    ensureFileExists(DOCS_PATH);

    // Read the current documentation
    const currentDoc = readFileSync(DOCS_PATH, "utf8");

    // Find the section to replace
    const startIndex = currentDoc.indexOf(START_MARKER);
    const endIndex = currentDoc.indexOf(END_MARKER);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Could not find section markers in documentation");
    }

    // Generate new tree
    const newTree = generateTree();

    // Combine the parts
    const newDoc = [
      currentDoc.slice(0, startIndex + START_MARKER.length),
      "\n\n",
      newTree,
      "\n\n",
      currentDoc.slice(endIndex),
    ].join("");

    // Write the updated documentation
    writeFileSync(DOCS_PATH, newDoc);
    console.log("✅ Folder structure documentation updated successfully");
  } catch (error) {
    console.error("❌ Error updating folder structure:", error);
    process.exit(1);
  }
}

// Run the update
updateDocumentation();
