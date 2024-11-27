Version 5 comes with an overhauled syntax and reactivity system. While it may look different at first, you’ll soon notice many similarities. This guide goes over the changes in detail and shows you how to upgrade. Along with it, we also provide information on _why_ we did these changes.

You don’t have to migrate to the new syntax right away - Svelte 5 still supports the old Svelte 4 syntax, and you can mix and match components using the new syntax with components using the old and vice versa. We expect many people to be able to upgrade with only a few lines of code changed initially. There’s also a migration script that helps you with many of these steps automatically.

## Reactivity syntax changes

At the heart of Svelte 5 is the new runes API. Runes are basically compiler instructions that inform Svelte about reactivity. Syntactically, runes are functions starting with a dollar-sign.

### let -> $state

In Svelte 4, a `let` declaration at the top level of a component was implicitly reactive. In Svelte 5, things are more explicit: a variable is reactive when created using the `$state` rune. Let’s migrate the counter to runes mode by wrapping the counter in `$state`:
    
    
    <script>
    	let count = $state(0);
    </script>

Nothing else changes. `count` is still the number itself, and you read and write directly to it, without a wrapper like `.value` or `getCount()`.

> Why we did this
> 
> `let` being implicitly reactive at the top level worked great, but it meant that reactivity was constrained - a `let` declaration anywhere else was not reactive. This forced you to resort to using stores when refactoring code out of the top level of components for reuse. This meant you had to learn an entirely separate reactivity model, and the result often wasn’t as nice to work with. Because reactivity is more explicit in Svelte 5, you can keep using the same API outside the top level of components. Head to [the tutorial](/tutorial) to learn more.

### $: -> $derived/$effect

In Svelte 4, a `$:` statement at the top level of a component could be used to declare a derivation, i.e. state that is entirely defined through a computation of other state. In Svelte 5, this is achieved using the `$derived` rune:
    
    
    <script>
    	let count = $state(0);
    	$: const double = $derived(count * 2);
    </script>

As with `$state`, nothing else changes. `double` is still the number itself, and you read it directly, without a wrapper like `.value` or `getDouble()`.

A `$:` statement could also be used to create side effects. In Svelte 5, this is achieved using the `$effect` rune:
    
    
    <script>
    	let count = $state(0);
    	$:$effect(() => {
    		if (count > 5) {
    			alert('Count is too high!');
    		}
    	});
    </script>

> Why we did this
> 
> `$:` was a great shorthand and easy to get started with: you could slap a `$:` in front of most code and it would somehow work. This intuitiveness was also its drawback the more complicated your code became, because it wasn’t as easy to reason about. Was the intent of the code to create a derivation, or a side effect? With `$derived` and `$effect`, you have a bit more up-front decision making to do (spoiler alert: 90% of the time you want `$derived`), but future-you and other developers on your team will have an easier time.
> 
> There were also gotchas that were hard to spot:
> 
>   * `$:` only updated directly before rendering, which meant you could read stale values in-between rerenders
>   * `$:` only ran once per tick, which meant that statements may run less often than you think
>   * `$:` dependencies were determined through static analysis of the dependencies. This worked in most cases, but could break in subtle ways during a refactoring where dependencies would be for example moved into a function and no longer be visible as a result
>   * `$:` statements were also ordered by using static analysis of the dependencies. In some cases there could be ties and the ordering would be wrong as a result, needing manual interventions. Ordering could also break while refactoring code and some dependencies no longer being visible as a result.
> 

> 
> Lastly, it wasn’t TypeScript-friendly (our editor tooling had to jump through some hoops to make it valid for TypeScript), which was a blocker for making Svelte’s reactivity model truly universal.
> 
> `$derived` and `$effect` fix all of these by
> 
>   * always returning the latest value
>   * running as often as needed to be stable
>   * determining the dependencies at runtime, and therefore being immune to refactorings
>   * executing dependencies as needed and therefore being immune to ordering problems
>   * being TypeScript-friendly
> 


### export let -> $props

In Svelte 4, properties of a component were declared using `export let`. Each property was one declaration. In Svelte 5, all properties are declared through the `$props` rune, through destructuring:
    
    
    <script>
    	export let optional = 'unset';
    	export let required;
    	let { optional = 'unset', required } = $props();
    </script>

There are multiple cases where declaring properties becomes less straightforward than having a few `export let` declarations:

  * you want to rename the property, for example because the name is a reserved identifier (e.g. `class`)
  * you don’t know which other properties to expect in advance
  * you want to forward every property to another component



All these cases need special syntax in Svelte 4:

  * renaming: `export { klass as class}`
  * other properties: `$$restProps`
  * all properties `$$props`



In Svelte 5, the `$props` rune makes this straightforward without any additional Svelte-specific syntax:

  * renaming: use property renaming `let { class: klass } = $props();`
  * other properties: use spreading `let { foo, bar, ...rest } = $props();`
  * all properties: don’t destructure `let props = $props();`


    
    
    <script>
    	let klass = '';
    	export { klass as class};
    	let { class: klass, ...rest } = $props();
    </script>
    <button class={klass} {...$$restPropsrest}>click me</button>

> Why we did this
> 
> `export let` was one of the more controversial API decisions, and there was a lot of debate about whether you should think about a property being `export`ed or `import`ed. `$props` doesn’t have this trait. It’s also in line with the other runes, and the general thinking reduces to “everything special to reactivity in Svelte is a rune”.
> 
> There were also a lot of limitations around `export let`, which required additional API, as shown above. `$props` unite this in one syntactical concept that leans heavily on regular JavaScript destructuring syntax.

## Event changes

Event handlers have been given a facelift in Svelte 5. Whereas in Svelte 4 we use the `on:` directive to attach an event listener to an element, in Svelte 5 they are properties like any other (in other words - remove the colon):
    
    
    <script>
    	let count = $state(0);
    </script>
    
    <button on:click={() => count++}>
    	clicks: {count}
    </button>

Since they’re just properties, you can use the normal shorthand syntax...
    
    
    <script>
    	let count = $state(0);
    
    	function onclick() {
    		count++;
    	}
    </script>
    
    <button {onclick}>
    	clicks: {count}
    </button>

...though when using a named event handler function it’s usually better to use a more descriptive name.

### Component events

In Svelte 4, components could emit events by creating a dispatcher with `createEventDispatcher`.

This function is deprecated in Svelte 5. Instead, components should accept _callback props_ \- which means you then pass functions as properties to these components:

App
    
    
    <script>
    	import Pump from './Pump.svelte';
    
    	let size = $state(15);
    	let burst = $state(false);
    
    	function reset() {
    		size = 15;
    		burst = false;
    	}
    </script>
    
    <Pump
    	on:inflate={(power) => {
    		size += power.details;
    		if (size > 75) burst = true;
    	}}
    	on:deflate={(power) => {
    		if (size > 0) size -= power.details;
    	}}
    />
    
    {#if burst}
    	<button onclick={reset}>new balloon</button>
    	<span class="boom">💥</span>
    {:else}
    	<span class="balloon" style="scale: {0.01 * size}">
    		🎈
    	</span>
    {/if}

Pump
    
    
    <script>
    	import { createEventDispatcher } from 'svelte';
    	const dispatch = createEventDispatcher();
    	
    	let { inflate, deflate } = $props();
    	let power = $state(5);
    </script>
    
    <button onclick={() => dispatch('inflate', power)inflate(power)}>
    	inflate
    </button>
    <button onclick={() => dispatch('deflate', power)deflate(power)}>
    	deflate
    </button>
    <button onclick={() => power--}>-</button>
    Pump power: {power}
    <button onclick={() => power++}>+</button>

### Bubbling events

Instead of doing `<button on:click>` to ‘forward’ the event from the element to the component, the component should accept an `onclick` callback prop:
    
    
    <script>
    	let { onclick } = $props();
    </script>
    
    <button on:click {onclick}>
    	click me
    </button>

Note that this also means you can ‘spread’ event handlers onto the element along with other props instead of tediously forwarding each event separately:
    
    
    <script>
    	let props = $props();
    </script>
    
    <button {...$$props} on:click on:keydown on:all_the_other_stuff {...props}>
    	click me
    </button>

### Event modifiers

In Svelte 4, you can add event modifiers to handlers:
    
    
    <button on:click|once|preventDefault={handler}>...</button>

Modifiers are specific to `on:` and as such do not work with modern event handlers. Adding things like `event.preventDefault()` inside the handler itself is preferable, since all the logic lives in one place rather than being split between handler and modifiers.

Since event handlers are just functions, you can create your own wrappers as necessary:
    
    
    <script>
    	function once(fn) {
    		return function (event) {
    			if (fn) fn.call(this, event);
    			fn = null;
    		};
    	}
    
    	function preventDefault(fn) {
    		return function (event) {
    			event.preventDefault();
    			fn.call(this, event);
    		};
    	}
    </script>
    
    <button onclick={once(preventDefault(handler))}>...</button>

There are three modifiers — `capture`, `passive` and `nonpassive` — that can’t be expressed as wrapper functions, since they need to be applied when the event handler is bound rather than when it runs.

For `capture`, we add the modifier to the event name:
    
    
    <button onclickcapture={...}>...</button>

Changing the [`passive`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners) option of an event handler, meanwhile, is not something to be done lightly. If you have a use case for it — and you probably don’t! — then you will need to use an action to apply the event handler yourself.

### Multiple event handlers

In Svelte 4, this is possible:
    
    
    <button on:click={one} on:click={two}>...</button>

Duplicate attributes/properties on elements — which now includes event handlers — are not allowed. Instead, do this:
    
    
    <button
    	onclick={(e) => {
    		one(e);
    		two(e);
    	}}
    >
    	...
    </button>

When spreading props, local event handlers must go _after_ the spread, or they risk being overwritten:
    
    
    <button
    	{...props}
    	onclick={(e) => {
    		doStuff(e);
    		props.onclick?.(e);
    	}}
    >
    	...
    </button>

> Why we did this
> 
> `createEventDispatcher` was always a bit boilerplate-y:
> 
>   * import the function
>   * call the function to get a dispatch function
>   * call said dispatch function with a string and possibly a payload
>   * retrieve said payload on the other end through a `.details` property, because the event itself was always a `CustomEvent`
> 

> 
> It was always possible to use component callback props, but because you had to listen to DOM events using `on:`, it made sense to use `createEventDispatcher` for component events due to syntactical consistency. Now that we have event attributes (`onclick`), it’s the other way around: Callback props are now the more sensible thing to do.
> 
> The removal of event modifiers is arguably one of the changes that seems like a step back for those who’ve liked the shorthand syntax of event modifiers. Given that they are not used that frequently, we traded a smaller surface area for more explicitness. Modifiers also were inconsistent, because most of them were only useable on DOM elements.
> 
> Multiple listeners for the same event are also no longer possible, but it was something of an anti-pattern anyway, since it impedes readability: if there are many attributes, it becomes harder to spot that there are two handlers unless they are right next to each other. It also implies that the two handlers are independent, when in fact something like `event.stopImmediatePropagation()` inside `one` would prevent `two` from being called.
> 
> By deprecating `createEventDispatcher` and the `on:` directive in favour of callback props and normal element properties, we:
> 
>   * reduce Svelte’s learning curve
>   * remove boilerplate, particularly around `createEventDispatcher`
>   * remove the overhead of creating `CustomEvent` objects for events that may not even have listeners
>   * add the ability to spread event handlers
>   * add the ability to know which event handlers were provided to a component
>   * add the ability to express whether a given event handler is required or optional
>   * increase type safety (previously, it was effectively impossible for Svelte to guarantee that a component didn’t emit a particular event)
> 


## Snippets instead of slots

In Svelte 4, content can be passed to components using slots. Svelte 5 replaces them with snippets which are more powerful and flexible, and as such slots are deprecated in Svelte 5.

They continue to work, however, and you can mix and match snippets and slots in your components.

When using custom elements, you should still use `<slot />` like before. In a future version, when Svelte removes its internal version of slots, it will leave those slots as-is, i.e. output a regular DOM tag instead of transforming it.

### Default content

In Svelte 4, the easiest way to pass a piece of UI to the child was using a `<slot />`. In Svelte 5, this is done using the `children` prop instead, which is then shown with `{@render children()}`:
    
    
    <script>
    	let { children } = $props();
    </script>
    
    <slot />
    {@render children?.()}

### Multiple content placeholders

If you wanted multiple UI placeholders, you had to use named slots. In Svelte 5, use props instead, name them however you like and `{@render ...}` them:
    
    
    <script>
    	let { header, main, footer } = $props();
    </script>
    
    <header>
    	<slot name="header" />
    	{@render header()}
    </header>
    
    <main>
    	<slot name="main" />
    	{@render main()}
    </main>
    
    <footer>
    	<slot name="footer" />
    	{@render footer()}
    </footer>

### Passing data back up

In Svelte 4, you would pass data to a `<slot />` and then retrieve it with `let:` in the parent component. In Svelte 5, snippets take on that responsibility:

App
    
    
    <script>
    	import List from './List.svelte';
    </script>
    
    <List items={['one', 'two', 'three']} let:item>
    	{#snippet item(text)}
    		<span>{text}</span>
    	{/snippet}
    	<span slot="empty">No items yet</span>
    	{#snippet empty()}
    		<span>No items yet</span>
    	{/snippet}
    </List>

List
    
    
    <script>
    	let { items, item, empty } = $props();
    </script>
    
    {#if items.length}
    	<ul>
    		{#each items as entry}
    			<li>
    				<slot item={entry} />
    				{@render item(entry)}
    			</li>
    		{/each}
    	</ul>
    {:else}
    	<slot name="empty" />
    	{@render empty?.()}
    {/if}

> Why we did this
> 
> Slots were easy to get started with, but the more advanced the use case became, the more involved and confusing the syntax became:
> 
>   * the `let:` syntax was confusing to many people as it _creates_ a variable whereas all other `:` directives _receive_ a variable
>   * the scope of a variable declared with `let:` wasn’t clear. In the example above, it may look like you can use the `item` slot prop in the `empty` slot, but that’s not true
>   * named slots had to be applied to an element using the `slot` attribute. Sometimes you didn’t want to create an element, so we had to add the `<svelte:fragment>` API
>   * named slots could also be applied to a component, which changed the semantics of where `let:` directives are available (even today us maintainers often don’t know which way around it works)
> 

> 
> Snippets solve all of these problems by being much more readable and clear. At the same time they’re more powerful as they allow you to define sections of UI that you can render _anywhere_ , not just passing them as props to a component.

## Migration script

By now you should have a pretty good understanding of the before/after and how the old syntax relates to the new syntax. It probably also became clear that a lot of these migrations are rather technical and repetitive - something you don’t want to do by hand.

We thought the same, which is why we provide a migration script to do most of the migration automatically. You can upgrade your project by using `npx sv migrate svelte-5`. This will do the following things:

  * bump core dependencies in your `package.json`
  * migrate to runes (`let` -> `$state` etc)
  * migrate to event attributes for DOM elements (`on:click` -> `onclick`)
  * migrate slot creations to render tags (`<slot />` -> `{@render children()}`)
  * migrate slot usages to snippets (`<div slot="x">...</div>` -> `{#snippet x()}<div>...</div>{/snippet}`)
  * migrate obvious component creations (`new Component(...)` -> `mount(Component, ...)`)



You can also migrate a single component in VS Code through the `Migrate Component to Svelte 5 Syntax` command, or in our Playground through the `Migrate` button.

Not everything can be migrated automatically, and some migrations need manual cleanup afterwards. The following sections describe these in more detail.

### run

You may see that the migration script converts some of your `$:` statements to a `run` function which is imported from `svelte/legacy`. This happens if the migration script couldn’t reliably migrate the statement to a `$derived` and concluded this is a side effect instead. In some cases this may be wrong and it’s best to change this to use a `$derived` instead. In other cases it may be right, but since `$:` statements also ran on the server but `$effect` does not, it isn’t safe to transform it as such. Instead, `run` is used as a stopgap solution. `run` mimics most of the characteristics of `$:`, in that it runs on the server once, and runs as `$effect.pre` on the client (`$effect.pre` runs _before_ changes are applied to the DOM; most likely you want to use `$effect` instead).
    
    
    <script>
    	import { run } from 'svelte/legacy';
    	run(() => {
    	$effect(() => {
    		// some side effect code
    	})
    </script>

### Event modifiers

Event modifiers are not applicable to event attributes (e.g. you can’t do `onclick|preventDefault={...}`). Therefore, when migrating event directives to event attributes, we need a function-replacement for these modifiers. These are imported from `svelte/legacy`, and should be migrated away from in favor of e.g. just using `event.preventDefault()`.
    
    
    <script>
    	import { preventDefault } from 'svelte/legacy';
    </script>
    
    <button
    	onclick={preventDefault((event) => {
    		event.preventDefault();
    		// ...
    	})}
    >
    	click me
    </button>

### Things that are not automigrated

The migration script does not convert `createEventDispatcher`. You need to adjust those parts manually. It doesn’t do it because it’s too risky because it could result in breakage for users of the component, which the migration script cannot find out.

The migration script does not convert `beforeUpdate/afterUpdate`. It doesn’t do it because it’s impossible to determine the actual intent of the code. As a rule of thumb you can often go with a combination of `$effect.pre` (runs at the same time as `beforeUpdate` did) and `tick` (imported from `svelte`, allows you to wait until changes are applied to the DOM and then do some work).

## Components are no longer classes

In Svelte 3 and 4, components are classes. In Svelte 5 they are functions and should be instantiated differently. If you need to manually instantiate components, you should use `mount` or `hydrate` (imported from `svelte`) instead. If you see this error using SvelteKit, try updating to the latest version of SvelteKit first, which adds support for Svelte 5. If you’re using Svelte without SvelteKit, you’ll likely have a `main.js` file (or similar) which you need to adjust:
    
    
    import { function mount<Props extends Record<string, any>, Exports extends Record<string, any>>(component: ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>, options: MountOptions<Props>): Exports
    
    Mounts a component to the given target and returns the exports and potentially the props (if compiled with accessors: true) of the component.
    
    
    Transitions will play during the initial render unless the intro option is set to false.
    

mount } from 'svelte'; import `
    
    
    type App = SvelteComponent<Record<string, any>, any, any>
    const App: ComponentType

`App from './App.svelte' const app = new App({ target: document.getElementById("app") }); const `
    
    
    const app: {

` $on?(type: string, callback: (e: any) => void): () => void; $set?(props: Partial<Record<string, any>>): void; } & Record<string, any>app = `
    
    
    mount<Record<string, any>, {

` $on?(type: string, callback: (e: any) => void): () => void; $set?(props: Partial<Record<string, any>>): void; } & Record<...>>(component: ComponentType<...> | Component<...>, options: MountOptions<...>): { ...; } & Record<...>

Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.

Transitions will play during the initial render unless the `intro` option is set to `false`.

mount(`const App: ComponentType`App, { `target: Document | Element | ShadowRoot`

Target element where the component will be mounted.