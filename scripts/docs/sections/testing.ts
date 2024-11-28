export function getTestingContent(): string {
  return `## Testing Patterns

### Component Testing
\`\`\`typescript
// src/lib/components/common/__tests__/Button.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import Button from '../Button.svelte';

describe('Button', () => {
  it('renders with default props', () => {
    const { getByRole } = render(Button, { props: { label: 'Click me' } });
    expect(getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    const { getByRole } = render(Button, {
      props: { label: 'Click me', onclick: onClick }
    });
    
    await fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
\`\`\`

### Integration Testing
\`\`\`typescript
// src/routes/__tests__/editor.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import Editor from '../editor/+page.svelte';

vi.mock('$lib/services/fileSystem', () => ({
  saveFile: vi.fn(),
  loadFile: vi.fn()
}));

describe('Editor Page', () => {
  it('loads and saves files', async () => {
    const { getByText, getByRole } = render(Editor);
    
    // Test file loading
    await fireEvent.click(getByText('Open File'));
    expect(loadFile).toHaveBeenCalled();
    
    // Test file saving
    await fireEvent.click(getByText('Save'));
    expect(saveFile).toHaveBeenCalled();
  });
});
\`\`\`

### Electron Testing
\`\`\`typescript
// electron/__tests__/ipc.test.ts
import { createWindow } from '../windowManager';
import { ipcMain } from 'electron';

describe('IPC Handlers', () => {
  let window;
  
  beforeEach(() => {
    window = createWindow();
  });
  
  afterEach(() => {
    window.close();
  });
  
  it('handles file save requests', async () => {
    const result = await ipcMain.emit('file:save', {
      path: '/test/file.txt',
      content: 'Hello, World!'
    });
    
    expect(result.success).toBe(true);
  });
});
\`\`\`

### Testing Best Practices
- Write tests alongside components
- Use Testing Library's queries
- Test user interactions
- Mock external dependencies
- Test error states
- Use snapshot testing sparingly
- Focus on behavior, not implementation
- Use proper cleanup in tests

### Test Organization
- Unit tests in \`__tests__\` directories
- Integration tests in route directories
- E2E tests in \`tests/e2e\`
- Shared test utilities in \`tests/utils\`
- Test data in \`tests/fixtures\``;
}
