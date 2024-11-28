import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { execSync } from "child_process";

const DOCS_PATH = ".notes/project-guide.md";
const SECTIONS = {
  START: "# Project Structure",
  METADATA: "## Project Metadata",
  CONVENTIONS: "## Conventions",
  SVELTE5: "## Svelte 5 Patterns",
  TREE: "## Directory Tree",
  PURPOSES: "## Directory Purposes",
  CHANGES: "## Recent Changes",
  NOTES: "## Development Notes",
} as const;

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
    writeFileSync(filePath, getInitialContent());
    console.log(`✅ Created initial documentation file at ${filePath}`);
  }
}

function getInitialContent(): string {
  return `# Project Structure

## Project Metadata
- **Framework**: SvelteKit + Electron
- **Package Manager**: npm
- **TypeScript**: Strict mode enabled
- **UI Framework**: Tailwind CSS + shadcn-svelte
- **Key Dependencies**:
  - Electron v33
  - Svelte v5
  - Vite v6
  - TypeScript v5.7+

## Conventions
- File naming: kebab-case (e.g., \`file-name.ts\`)
- Component naming: PascalCase (e.g., \`MyComponent.svelte\`)
- Route files: SvelteKit conventions (\`+page.svelte\`, \`+layout.svelte\`)
- Imports: Use aliases (\`$lib\`, \`$root\`, \`$panes\`)
- Styles: Tailwind classes with shadcn-svelte components

## Svelte 5 Patterns
### Component Creation Guidelines
- Use \`$state()\` for reactive state management
- Use \`$props()\` for component properties
- Use \`onclick\` instead of \`on:click\` for event handling
- Implement modern Svelte 5 reactive patterns
- Avoid Svelte 4 syntax completely

### Example Component Structure
\`\`\`svelte
<script lang="ts">
  // Props using $props()
  const { title = "Default" } = $props<{ title?: string }>();
  
  // State using $state()
  const count = $state(0);
  const items = $state<string[]>([]);
  
  // Derived state
  const doubled = count * 2;
  
  // Event handlers (use 'onclick', not 'on:click')
  function handleClick() {
    count++;
    items = [...items, \`Item \${count}\`];
  }
</script>

<div class="container">
  <h1>{title}</h1>
  <button onclick={handleClick}>
    Count: {count}
  </button>
  <p>Doubled: {doubled}</p>
  
  {#each items as item}
    <div>{item}</div>
  {/each}
</div>
\`\`\`

### Key Differences from Svelte 4
- No more \`export let\` for props
- No more \`$:\` for reactivity
- Event handlers use \`onclick\` syntax
- State management with \`$state()\`
- Props management with \`$props()\`
- TypeScript integration is more straightforward

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
- Separated UI components by function

## Development Notes
- All new components should follow shadcn-svelte patterns
- Electron-specific code goes in \`src/electron/\`
- Shared utilities should be placed in \`src/lib/utils/\`
- New routes should include appropriate layouts
- Component-specific types should be co-located with components
- Global types go in \`src/lib/types/\``;
}

function updateDocumentation(): void {
  try {
    // Ensure the file exists
    ensureFileExists(DOCS_PATH);

    // Read the current documentation
    const currentDoc = readFileSync(DOCS_PATH, "utf8");

    // Find the section to replace
    const startIndex = currentDoc.indexOf(SECTIONS.TREE);
    const endIndex = currentDoc.indexOf(SECTIONS.PURPOSES);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Could not find section markers in documentation");
    }

    // Generate new tree
    const newTree = generateTree();

    // Combine the parts
    const newDoc = [
      currentDoc.slice(0, startIndex + SECTIONS.TREE.length),
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
