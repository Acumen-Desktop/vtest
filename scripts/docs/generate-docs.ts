import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import {
  getMetadataContent,
  getConventionsContent,
  getSvelte5PatternsContent,
  getElectronPatternsContent,
  getTestingContent,
  getDeploymentContent,
  getPerformanceContent,
} from "./sections";

function generateDocumentation(): string {
  const sections = [
    getMetadataContent(),
    getConventionsContent(),
    getSvelte5PatternsContent(),
    getElectronPatternsContent(),
    getTestingContent(),
    getDeploymentContent(),
    getPerformanceContent(),
  ];

  const header = `# Project Documentation
Last updated: ${new Date().toISOString().split("T")[0]}

This documentation provides comprehensive guidelines for development practices, patterns, and standards used in this project.
`;

  const footer = `
## Contributing
- Follow the patterns and conventions outlined in this document
- Submit PRs with appropriate tests and documentation
- Keep this documentation up to date

## Questions and Support
For questions or support, please refer to:
- GitHub Issues
- Team chat channels
- Project wiki

---
Generated automatically using project documentation tools.
`;

  return [header, ...sections, footer].join("\n\n");
}

function ensureDirectoryExists(filePath: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function main() {
  try {
    const docs = generateDocumentation();
    const outputPath = join(process.cwd(), "docs", "PROJECT.md");

    // Ensure the docs directory exists
    ensureDirectoryExists(outputPath);

    // Write the documentation file
    writeFileSync(outputPath, docs, "utf8");
    console.log("Documentation generated successfully at:", outputPath);
  } catch (error) {
    console.error("Error generating documentation:", error);
    process.exit(1);
  }
}

main();
