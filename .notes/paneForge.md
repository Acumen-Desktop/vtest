# PaneGroup

A container for panes or nested pane groups.

The `PaneGroup` component wraps a collection of panes or nested `PaneGroup`s and is used to initialize and manage the layout of the panes.

## Table of Contents

- [PaneGroup](#panegroup)
  - [Props](#props)
  - [Imperative API](#imperative-api)
  - [Persisted Layouts/Storage](#persisted-layoutsstorage)
  - [Data Attributes](#data-attributes)
- [Components](#components)
  - [Pane](#pane)
    - [Props](#pane-props)
    - [Imperative API](#pane-imperative-api)
    - [Data Attributes](#pane-data-attributes)
  - [PaneResizer](#paneresizer)
    - [Usage](#usage)
    - [Props](#paneresizer-props)

## Props

Here are the props available for the `PaneGroup` component:

```typescript
export type PaneGroupProps = {
    /**
     * The id to save the layout of the panes to in local storage.
     */
    autoSaveId?: string | null;

    /**
     * The direction of the panes.
     * @required
     */
    direction: "horizontal" | "vertical";

    /**
     * The id of the pane group DOM element.
     */
    id?: string | null;

    /**
     * The amount of space to add to the pane group when the keyboard
     * resize event is triggered.
     */
    keyboardResizeBy?: number | null;

    /**
     * A callback called when the layout of the panes within the group changes.
     */
    onLayoutChange?: (layout: number[]) => void | null;

    /**
     * The storage object to use for saving the layout of the panes in the group.
     *
     * Defaults to use `localStorage` if an `autoSaveId` is provided and no storage is provided.
     */
    storage?: PaneGroupStorage;

    /**
     * The style of the pane group. This will be appended to styles applied by
     * the library.
     */
    style?: string;

    /**
     * The underlying DOM element of the pane group. You can `bind` to this
     * prop to get a reference to the element.
     */
    el?: HTMLElement | null;

    /**
     * An imperative API for the pane group. `bind` to this prop to get access
     * to methods for controlling the pane group.
     */
    paneGroup?: PaneGroupAPI;
} & Omit<HTMLAttributes<HTMLDivElement>, "id">;
```

## Imperative API

The `PaneGroup` component provides an imperative API for controlling the pane group which can be accessed by binding a variable to the `api` prop. Here are the methods available on the `PaneGroupAPI`:

```typescript
export type PaneGroupAPI = {
    /** Get the ID of the PaneGroup */
    getId: () => string;
    /** Get the layout of the PaneGroup */
    getLayout: () => number[];
    /** Set the layout of the PaneGroup */
    setLayout: (layout: number[]) => void;
};
```

## Persisted Layouts/Storage

When the `PaneGroup` component is provided with an `autoSaveId` prop, it will automatically save the layout of the panes to local storage. If you want to use a different storage mechanism, you can provide a `storage` prop with a custom storage object that implements the `PaneGroupStorage` interface.

```typescript
export type PaneGroupStorage = {
    /** Retrieves the item from storage */
    getItem(name: string): string | null;
    /** Sets the item to storage */
    setItem(name: string, value: string): void;
};
```

## Data Attributes

The following data attributes are available for the `PaneGroup` component:

```typescript
export type PaneGroupAttributes = {
    /** Applied to every pane group element. */
    "data-pane-group": "";
    /** The direction of the pane group. */
    "data-direction": "horizontal" | "vertical";
    /** The ID of the pane group. */
    "data-pane-group-id": string;
};

## Components

### Pane

An individual pane within a pane group.

The `Pane` component is used to create an individual pane within a `PaneGroup`.

#### Props {#pane-props}

Here are the props available for the `Pane` component:

```typescript
export type PaneProps = {
  collapsedSize?: number;
  collapsible?: boolean;
  defaultSize?: number;
  id?: string | null;
  maxSize?: number;
  minSize?: number;
  order?: number;
  onCollapse?: () => void;
  onExpand?: () => void;
  onResize?: (size: number, prevSize: number | undefined) => void;
  el?: HTMLElement | null;
  pane?: PaneAPI;
} & Omit<HTMLAttributes<HTMLDivElement>, "id">;
```

#### Imperative API {#pane-imperative-api}

The `Pane` component provides an imperative API for controlling the pane which can be accessed by binding a variable to the `api` prop. Here are the methods available on the `PaneAPI`:

```typescript
export type PaneAPI = {
  collapse: () => void;
  expand: () => void;
  getId: () => string;
  getSize: () => number;
  isCollapsed: () => boolean;
  isExpanded: () => boolean;
  resize: (size: number) => void;
};
```

#### Data Attributes {#pane-data-attributes}

The following data attributes are available for the `Pane` component:

```typescript
export type PaneAttributes = {
  "data-pane": "";
  "data-pane-id": string;
  "data-pane-group-id": string;
};
```

### PaneResizer

A draggable handle between two panes that allows the user to resize them.

The `PaneResizer` component is used to create a draggable handle between two panes that allows the user to resize them.

#### Usage {#usage}

```svelte
<script lang="ts">
  import { PaneGroup, Pane, PaneResizer } from "svelte-pane";
</script>

<PaneGroup direction="horizontal">
  <Pane defaultSize={50}>Pane 1</Pane>
  <PaneResizer />
  <Pane defaultSize={50}>Pane 2</Pane>
</PaneGroup>
```

#### Props {#paneresizer-props}

Here are the props available for the `PaneResizer` component:

```ts
export type PaneResizerProps = {
  /** Whether the resize handle is disabled.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;

  /** A callback that is called when the resize handle's dragging state changes. */
  onDraggingChange?: (isDragging: boolean) => void;

  /** The tabIndex of the resize handle. */
  tabIndex?: number;

  /** The underlying DOM element of the resize handle. You can `bind` to this
   * prop to get a reference to the element.
   */
  el?: HTMLElement | null;
} & HTMLAttributes<HTMLDivElement>;
```

#### Data Attributes

The following data attributes are available for the `PaneResizer` component:

```ts
export type PaneResizerAttributes = {
  /** The direction of the pane group the handle belongs to. */
  "data-direction": "horizontal" | "vertical";

  /** The ID of the pane group the handle belongs to. */
  "data-pane-group-id": string;

  /** Whether the resize handle is active or not. */
  "data-active"?: "pointer" | "keyboard";

  /** Whether the resize handle is enabled or not. */
  "data-enabled"?: boolean;

  /** The ID of the resize handle. */
  "data-pane-resizer-id": string;

  /** Present on all resizer elements */
  "data-pane-resizer": "";
};
