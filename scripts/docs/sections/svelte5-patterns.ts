export function getSvelte5PatternsContent(): string {
  return `## Svelte 5 Patterns

### Component Creation Guidelines
- Use \`$state()\` for reactive state management
- Use \`$props()\` for component properties
- Use \`onclick\` instead of \`on:click\` for event handling
- Implement modern Svelte 5 reactive patterns
- Avoid Svelte 4 syntax completely

### State Management Patterns
\`\`\`svelte
<script lang="ts">
  // Basic state
  const count = $state(0);
  
  // Complex state
  const form = $state({
    username: "",
    email: "",
    preferences: {
      theme: "dark",
      notifications: true
    }
  });
  
  // Derived values (replaces $: syntax)
  const isValid = form.email.includes("@");
  const fullName = \`\${form.firstName} \${form.lastName}\`;
  
  // State updates
  function updateTheme(theme: string) {
    form.preferences.theme = theme;  // Direct mutation is fine
  }
</script>
\`\`\`

### Props and Events
\`\`\`svelte
<script lang="ts">
  // Props with TypeScript
  const { 
    title = "Default",
    onSave = () => {},
    items = []
  } = $props<{
    title?: string;
    onSave?: (data: unknown) => void;
    items?: string[];
  }>();

  // Event handling
  function handleClick(event: MouseEvent) {
    onSave(form);
  }
</script>

<button onclick={handleClick}>Save</button>
\`\`\`

### Advanced Patterns
\`\`\`svelte
<script lang="ts">
  // Reactive Collections
  const todos = $state<Todo[]>([]);
  
  // Methods that modify state
  function addTodo(text: string) {
    todos = [...todos, { id: Date.now(), text, done: false }];
  }
  
  // Computed values with functions
  function getCompletedCount() {
    return todos.filter(todo => todo.done).length;
  }
  
  // Event delegation
  function handleTodoClick(id: number) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
  }
</script>

<div class="todos">
  {#each todos as todo}
    <div onclick={() => handleTodoClick(todo.id)}>
      {todo.text} - {todo.done ? "✓" : ""}
    </div>
  {/each}
  
  <div>Completed: {getCompletedCount()}</div>
</div>
\`\`\`

### Key Differences from Svelte 4
- No more \`export let\` for props
- No more \`$:\` for reactivity
- Event handlers use \`onclick\` syntax
- State management with \`$state()\`
- Props management with \`$props()\`
- TypeScript integration is more straightforward
- Direct mutation of state is allowed
- Computed values are just functions or expressions

### Best Practices
- Keep state close to where it's used
- Use TypeScript for better type safety
- Prefer function calls over computed properties for complex calculations
- Use event delegation for lists
- Maintain immutable patterns for arrays and objects
- Co-locate related state and functions`;
}
