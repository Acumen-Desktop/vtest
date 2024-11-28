# Project Structure

## Directory Tree

```
src/
├── routes/
│ ├── +layout.svelte
│ ├── +layout.ts
│ ├── +page.svelte
│ ├── five-up/
│ │ ├── +page.svelte
│ │ └── +layout.svelte
│ ├── editor/
│ │ └── +page.svelte
│ ├── settings/
│ │ └── +page.svelte
│ └── test/
│     └── +page.svelte
│
├── lib/
│ ├── components/
│ │ ├── layout/
│ │ │ └── panes/
│ │ │     ├── CodeEditor.svelte
│ │ │     ├── FileExplorer.svelte
│ │ │     ├── FileNode.svelte
│ │ │     ├── PaneContent.svelte
│ │ │     ├── Terminal.svelte
│ │ │     ├── Welcome.svelte
│ │ │     └── markdownEditor/
│ │ │         ├── MarkdownEditor.svelte
│ │ │         └── MarkdownToolbar.svelte
│ │ ├── ui/
│ │ │ ├── Button.svelte
│ │ │ └── ...
│ │ ├── buttons/
│ │ └── common/
│ ├── stores/
│ ├── utils/
│ ├── services/
│ ├── constants/
│ ├── config/
│ ├── types/
│ └── assets/
│
├── styles/
├── hooks/
├── electron/
├── app.html
└── tsconfig.json
```

## Directory Purposes

### Routes (`/routes`)

File-based routing structure for the application:

- `five-up/`: Five-pane layout implementation
- `editor/`: Code editor interface
- `settings/`: Application configuration interface
- `test/`: Testing environment

### Library (`/lib`)

Shared codebase organized by functionality:

#### Components (`/lib/components`)

- `layout/panes/`: Core pane components for the editor interface
- `ui/`: shadcn-svelte component library
- `buttons/`: Custom button implementations
- `common/`: Shared generic components

#### Core Functionality

- `stores/`: Global state management
- `utils/`: Utility functions and helpers
- `services/`: API and service implementations
- `constants/`: Application-wide constants
- `config/`: Configuration management
- `types/`: TypeScript definitions
- `assets/`: Static resources

### Application Core

- `styles/`: Global styling
- `hooks/`: Svelte hooks and middleware
- `electron/`: Electron-specific implementations
- `app.html`: Root HTML template
- `tsconfig.json`: TypeScript configuration

## Recent Changes

- Reorganized pane components under layout/
- Added services/ and constants/ directories
- Implemented five-up layout structure
- Added electron-specific directory
- Separated UI components by function
