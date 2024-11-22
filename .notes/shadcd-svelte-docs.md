# Shadcn-Svelte Component Library Documentation

## Overview
Shadcn-Svelte is a collection of re-usable, accessible, and customizable components for Svelte, inspired by the popular shadcn/ui library for React. It provides a set of beautifully designed UI components that can be easily integrated into Svelte projects.

## Installation

### Prerequisites
- Svelte project
- Tailwind CSS
- TypeScript (recommended)

### Setup Steps
1. Install dependencies:
```bash
npm install tailwindcss postcss autoprefixer
npx shadcn-svelte@latest init
```

2. Configure `tailwind.config.js`:
```javascript
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  // Other configurations
}
```

## Available Components

### 1. Accordion
- Expandable/collapsible content sections
- Supports single and multiple item expansion
- Keyboard navigation
- Accessible design

#### Usage Example:
```svelte
<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>
      Content for section 1
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### 2. Alert
- Displays important messages or notifications
- Customizable variants (default, destructive)
- Supports icons and descriptions

#### Usage Example:
```svelte
<Alert.Root variant="destructive">
  <Alert.Icon />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>
    Something went wrong
  </Alert.Description>
</Alert.Root>
```

### 3. Alert Dialog
- Modal dialog for critical alerts
- Confirms user actions
- Provides cancel and confirm actions

#### Usage Example:
```svelte
<AlertDialog.Root>
  <AlertDialog.Trigger>Open</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Confirm</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

### 4. Aspect Ratio
- Maintains consistent image/content proportions
- Responsive design

#### Usage Example:
```svelte
<AspectRatio ratio={16/9}>
  <img src="image.jpg" alt="Aspect ratio image" />
</AspectRatio>
```

### 5. Avatar
- Display user profile images
- Fallback text/icons
- Configurable sizes

#### Usage Example:
```svelte
<Avatar.Root>
  <Avatar.Image 
    src="/user-avatar.jpg" 
    alt="User Avatar" 
  />
  <Avatar.Fallback>UN</Avatar.Fallback>
</Avatar.Root>
```

### 6. Badge
- Small status or label indicators
- Multiple variants (default, secondary, destructive)

#### Usage Example:
```svelte
<Badge variant="secondary">
  New
</Badge>
```

### 7. Button
- Interactive clickable elements
- Multiple variants and sizes
- Support for icons and loading states

#### Usage Example:
```svelte
<Button variant="outline" size="sm">
  Click me
</Button>
```

### 8. Calendar
- Date selection component
- Supports range selection
- Keyboard navigation

#### Usage Example:
```svelte
<Calendar 
  bind:value={selectedDate} 
  numberOfMonths={1} 
/>
```

### 9. Card
- Flexible container component
- Supports header, content, and footer sections

#### Usage Example:
```svelte
<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>
      Card description
    </Card.Description>
  </Card.Header>
  <Card.Content>
    Card content
  </Card.Content>
</Card.Root>
```

### 10. Checkbox
- Boolean input for selections
- Supports indeterminate state
- Accessible design

#### Usage Example:
```svelte
<Checkbox 
  bind:checked={isSelected} 
/>
```

## 11. Collapsible
Toggleable content section that can be expanded or collapsed.

### Usage Example:
```svelte
<Collapsible.Root>
  <Collapsible.Trigger>Toggle Content</Collapsible.Trigger>
  <Collapsible.Content>
    Hidden content that expands/collapses
  </Collapsible.Content>
</Collapsible.Root>
```

### Key Features:
- Programmatic open/close control
- Keyboard accessible
- Smooth transitions
- State management

## 12. Command
Advanced search and command palette interface.

### Usage Example:
```svelte
<Command.Root>
  <Command.Input placeholder="Type a command..." />
  <Command.List>
    <Command.Group heading="Suggestions">
      <Command.Item value="profile">
        Profile
      </Command.Item>
      <Command.Item value="settings">
        Settings
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Key Features:
- Fuzzy search
- Keyboard navigation
- Grouping of commands
- Customizable filtering

## 13. Context Menu
Right-click context menu with multiple actions.

### Usage Example:
```svelte
<ContextMenu.Root>
  <ContextMenu.Trigger>
    Right-click me
  </ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>
      Edit
    </ContextMenu.Item>
    <ContextMenu.Item>
      Delete
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
```

### Key Features:
- Contextual action groups
- Nested submenus
- Keyboard accessible
- Customizable styling

## 14. Dialog
Modal window for focused interactions.

### Usage Example:
```svelte
<Dialog.Root>
  <Dialog.Trigger>Open Dialog</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Confirm Action</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to proceed?
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Dialog.Close>Cancel</Dialog.Close>
      <Button>Confirm</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### Key Features:
- Modal focus management
- Escape key handling
- Overlay backdrop
- Customizable content

## 15. Dropdown Menu
Expandable menu with multiple selectable items.

### Usage Example:
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    Open Menu
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        Profile
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        Settings
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      Logout
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Key Features:
- Nested menu support
- Keyboard navigation
- Grouped items
- Separator support

## 16. Form
Comprehensive form management and validation.

### Usage Example:
```svelte
<form.Root>
  <form.Field name="username">
    <form.Label>Username</form.Label>
    <form.Control>
      <Input />
    </form.Control>
    <form.Description>
      Choose a unique username
    </form.Description>
    <form.ValidationState>
      <form.Message />
    </form.ValidationState>
  </form.Field>
  <Button type="submit">Submit</Button>
</form.Root>
```

### Key Features:
- Client-side validation
- Flexible error handling
- Accessibility compliant
- Multi-step form support

## 17. Hover Card
Informational popup on element hover.

### Usage Example:
```svelte
<HoverCard.Root>
  <HoverCard.Trigger>
    Hover over me
  </HoverCard.Trigger>
  <HoverCard.Content>
    Additional information appears here
  </HoverCard.Content>
</HoverCard.Root>
```

### Key Features:
- Delayed show/hide
- Positioning options
- Customizable content
- Accessible design

## 18. Input
Standard form input with variations.

### Usage Example:
```svelte
<Input 
  type="text" 
  placeholder="Enter text" 
  variant="default" 
/>
```

### Key Features:
- Multiple input types
- Variant styling
- Validation support
- Customizable appearance

## 19. Label
Accessible form input labeling.

### Usage Example:
```svelte
<Label for="email">
  Email Address
</Label>
<Input id="email" />
```

### Key Features:
- Screen reader friendly
- Associated input linking
- Styling flexibility

## 20. Menubar
Top-level navigation menu with dropdown submenus.

### Usage Example:
```svelte
<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>
        New Tab
      </Menubar.Item>
      <Menubar.Item>
        New Window
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Key Features:
- Nested menu support
- Keyboard navigation
- Accessible design
- Responsive layout

## 21. Navigation Menu
Horizontal navigation with dropdown capabilities.

### Usage Example:
```svelte
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>
        Products
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link>
          Category 1
        </NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

### Key Features:
- Responsive design
- Dropdown navigation
- Keyboard accessible
- Active state management

## 22. Popover
Floating content container near trigger element.

### Usage Example:
```svelte
<Popover.Root>
  <Popover.Trigger>
    Open Popover
  </Popover.Trigger>
  <Popover.Content>
    Popover content here
  </Popover.Content>
</Popover.Root>
```

### Key Features:
- Positioning options
- Arrow indicator
- Close on outside click
- Keyboard dismissal

## 23. Progress
Visual representation of completion or loading.

### Usage Example:
```svelte
<Progress 
  value={75} 
  max={100} 
/>
```

### Key Features:
- Customizable appearance
- Percentage tracking
- Animated variants
- Accessibility attributes

## 24. Radio Group
Mutually exclusive selection input.

### Usage Example:
```svelte
<RadioGroup.Root>
  <RadioGroup.Item value="option1">
    Option 1
  </RadioGroup.Item>
  <RadioGroup.Item value="option2">
    Option 2
  </RadioGroup.Item>
</RadioGroup.Root>
```

### Key Features:
- Single selection
- Keyboard navigation
- Customizable styling
- Grouped selection

## 25. Scroll Area
Customizable scrollable container.

### Usage Example:
```svelte
<ScrollArea.Root>
  <ScrollArea.Viewport>
    Long content here
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
</ScrollArea.Root>
```

### Key Features:
- Custom scrollbar
- Multiple orientation support
- Performance optimized
- Overflow handling

## 26. Select
Advanced dropdown selection component.

### Usage Example:
```svelte
<Select.Root>
  <Select.Trigger>
    <Select.Value placeholder="Select an option" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="option1">
      Option 1
    </Select.Item>
    <Select.Item value="option2">
      Option 2
    </Select.Item>
  </Select.Content>
</Select.Root>
```

### Key Features:
- Multi-select support
- Searchable options
- Keyboard navigation
- Customizable styling

## 27. Separator
Visual divider between content sections.

### Usage Example:
```svelte
<Separator.Root orientation="horizontal" />
```

### Key Features:
- Horizontal/vertical orientation
- Customizable styling
- Accessibility attributes

## 28. Sheet
Sliding panel from screen edge.

### Usage Example:
```svelte
<Sheet.Root>
  <Sheet.Trigger>Open Sheet</Sheet.Trigger>
  <Sheet.Content side="right">
    Sliding content here
  </Sheet.Content>
</Sheet.Root>
```

### Key Features:
- Multiple slide directions
- Overlay support
- Keyboard dismissal
- Responsive design

## 29. Skeleton
Placeholder for loading states.

### Usage Example:
```svelte
<Skeleton class="w-full h-12" />
```

### Key Features:
- Customizable dimensions
- Animation options
- Loading state representation

## 30. Slider
Continuous value selection input.

### Usage Example:
```svelte
<Slider 
  min={0} 
  max={100} 
  step={1} 
  bind:value={sliderValue} 
/>
```

### Key Features:
- Range selection
- Step configuration
- Keyboard adjustable
- Tooltip support

## 31. Switch
Toggle input for binary choices.

### Usage Example:
```svelte
<Switch 
  checked={isEnabled} 
  on:change={handleToggle} 
/>
```

### Key Features:
- On/Off states
- Customizable appearance
- Accessibility compliant
- Event handling

## 32. Table
Structured data display component.

### Usage Example:
```svelte
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Value</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Item 1</Table.Cell>
      <Table.Cell>100</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### Key Features:
- Responsive design
- Sortable columns
- Pagination support
- Customizable styling

## 33. Tabs
Switchable content sections.

### Usage Example:
```svelte
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger value="tab1">
      Tab 1
    </Tabs.Trigger>
    <Tabs.Trigger value="tab2">
      Tab 2
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">
    Content for Tab 1
  </Tabs.Content>
  <Tabs.Content value="tab2">
    Content for Tab 2
  </Tabs.Content>
</Tabs.Root>
```

### Key Features:
- Keyboard navigation
- Vertical/horizontal layouts
- Active state management
- Programmatic control

## 34. Textarea
Multi-line text input component.

### Usage Example:
```svelte
<Textarea 
  placeholder="Enter your message" 
  rows={4} 
/>
```

### Key Features:
- Flexible sizing
- Auto-resize
- Validation support
- Customizable styling

## 35. Toast
Notification popup for system messages.

### Usage Example:
```svelte
<Toast.Provider>
  <Toast.Root>
    <Toast.Title>
      Notification Title
    </Toast.Title>
    <Toast.Description>
      Detailed message here
    </Toast.Description>
  </Toast.Root>
  <Toast.Viewport />
</Toast.Provider>
```

### Key Features:
- Multiple toast management
- Configurable duration
- Accessibility compliant
- Custom styling

## 36. Toggle
On/Off button for binary states.

### Usage Example:
```svelte
<Toggle 
  pressed={isToggled} 
  variant="outline" 
/>
```

### Key Features:
- Multiple variants
- Icon support
- Accessibility attributes
- State management

## 37. Tooltip
Informational hover text for elements.

### Usage Example:
```svelte
<Tooltip.Root>
  <Tooltip.Trigger>
    Hover me
  </Tooltip.Trigger>
  <Tooltip.Content>
    Tooltip text here
  </Tooltip.Content>
</Tooltip.Root>
```

### Key Features:
- Delayed appearance
- Positioning options
- Keyboard accessible
- Customizable content

## Customization
- Fully customizable via Tailwind CSS
- Dark mode support
- Responsive design principles

## Best Practices
1. Always import necessary components
2. Use Tailwind for styling
3. Follow accessibility guidelines
4. Utilize built-in variants
5. Combine components for complex UIs

## Browser Support
- Modern browsers
- Responsive across devices
- Accessibility compliant

## Performance
- Lightweight
- Minimal runtime overhead
- Tree-shakeable

## Learning Resources
- Official Documentation: https://next.shadcn-svelte.com
- GitHub Repository
- Community Support Channels

## Contributing
- Open-source project
- Welcome community contributions
- Follow contribution guidelines

## License
Typically MIT License - check specific project documentation for exact terms.