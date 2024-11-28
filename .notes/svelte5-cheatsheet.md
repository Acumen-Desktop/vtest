# Svelte 5 Migration Cheat Sheet

## Component Props and Bindings

### Props (✨ New Runes Syntax)

```svelte
// Svelte 4
export let propName;

// Svelte 5
const { propName } = $props<{ propName: Type }>();
```

### State Management

```svelte
// Svelte 4
let count = 0;

// Svelte 5
let count = $state(0);
```

### Derived Values

```svelte
// Svelte 4
$: doubled = count * 2;

// Svelte 5
let doubled = $derived(count * 2);
```

### Effects

```svelte
// Svelte 4
$: {
  console.log(count);
}

// Svelte 5
$effect(() => {
  console.log(count);
});
```

## Component Rendering

### Dynamic Components

```svelte
// Svelte 4 and 5 (Still supported in Svelte 5)
<svelte:component this={component} {...props} />

// Alternative Svelte 5 Method (Function call)
{component(props)}

// Svelte 5 - Method 2 (JSX-like syntax)
<{component} {...props} />

// Svelte 5 - Method 3 (Safe with type checking)
{#if component}
  <{component} {...props} />
{/if}
```

### Component Exports

```svelte
// Svelte 4
// No explicit export needed

// Svelte 5
// Add explicit default export at the end of the file
export default ComponentName;
```

### Component Props Spreading

```svelte
// Svelte 4 and 5
<Component {...props} />
<svelte:component this={component} {...props} />

// Svelte 5 - Safe spread with defaults
<Component {...{ ...defaultProps, ...props }} />

// Svelte 5 - Type-safe instantiation
<{Component} {...props satisfies ComponentProps} />
```

### Event Handlers

```svelte
// Svelte 4
<button on:click={handleClick}>

// Svelte 5 (both work, but the second is preferred)
<button on:click={handleClick}>
<button onclick={handleClick}>
```

### Bindings

```svelte
// Svelte 4
export let ref;

// Svelte 5
let ref = $bindable();
```

## Common Gotchas

1. Components must have an explicit default export in Svelte 5
2. Use `$state()` instead of reactive declarations for state
3. Use `$derived()` instead of `$:` for computed values
4. Use `$effect()` instead of `$:` for side effects
5. Props must be explicitly typed with `$props<Type>()`
6. Component instantiation requires proper type checking
7. Always check if dynamic component exists before rendering

## Best Practices

1. Always use TypeScript for better type inference
2. Prefer `$state()` over reactive declarations
3. Use `$derived()` for computed values that depend on state
4. Use `$effect()` for side effects and cleanup
5. Always provide explicit types for props using `$props<Type>()`

## Migration Tips

1. Convert all state to `$state()`
2. Replace all `$:` computed values with `$derived()`
3. Replace all `$:` side effects with `$effect()`
4. Update component props to use `$props<Type>()`
5. Remove `<svelte:component>` and use direct component calls

_This cheat sheet will be updated as we encounter more migration issues._
