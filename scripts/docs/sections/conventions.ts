export function getConventionsContent(): string {
  return `## Conventions
- File naming: kebab-case (e.g., \`file-name.ts\`)
- Component naming: PascalCase (e.g., \`MyComponent.svelte\`)
- Route files: SvelteKit conventions (\`+page.svelte\`, \`+layout.svelte\`)
- Imports: Use aliases (\`$lib\`, \`$root\`, \`$panes\`)
- Styles: Tailwind classes with shadcn-svelte components
- Type definitions: Co-locate with components when specific, use \`types/\` for shared
- Testing: Component tests in \`__tests__\` directories alongside components`;
}
