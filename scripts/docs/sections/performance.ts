export function getPerformanceContent(): string {
  return `## Performance Patterns

### Optimization Guidelines
- Use dynamic imports for large components
- Implement proper memory management
- Optimize IPC communication
- Use efficient state management
- Implement proper garbage collection

### Memory Management
\`\`\`typescript
// src/electron/utils/memoryManager.ts
export class MemoryManager {
  private static readonly MEMORY_THRESHOLD = 0.8; // 80% of available RAM
  
  static monitorMemory() {
    const used = process.memoryUsage();
    if (used.heapUsed / used.heapTotal > this.MEMORY_THRESHOLD) {
      this.cleanupResources();
    }
  }
  
  static cleanupResources() {
    // Clear caches
    global.gc?.();
    // Close unused windows
    // Clear temporary files
  }
}
\`\`\`

### IPC Optimization
\`\`\`typescript
// Batch operations
export async function batchDataTransfer(items: unknown[]) {
  const BATCH_SIZE = 1000;
  const batches = [];
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }
  
  for (const batch of batches) {
    await window.electron.invoke('data:process', batch);
  }
}
\`\`\`

### Resource Loading
\`\`\`typescript
// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));

// Preload critical resources
export function preloadResources() {
  const criticalAssets = ['/icons/main.png', '/data/initial.json'];
  return Promise.all(
    criticalAssets.map(asset => fetch(asset).then(res => res.blob()))
  );
}
\`\`\`

### Performance Monitoring
\`\`\`typescript
// src/electron/utils/performance.ts
export class PerformanceMonitor {
  static startTracking(operation: string) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.logMetric(operation, duration);
    };
  }
  
  static logMetric(operation: string, duration: number) {
    console.log(\`Operation: \${operation}, Duration: \${duration}ms\`);
    // Send to monitoring service
  }
}
\`\`\`

### Best Practices
- Profile regularly with Chrome DevTools
- Monitor memory usage
- Use performance marks and measures
- Implement proper error boundaries
- Cache expensive computations
- Use web workers for heavy tasks
- Optimize asset loading
- Implement proper cleanup`;
}
