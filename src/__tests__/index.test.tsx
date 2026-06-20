/**
 * Smoke test: import every public entry point to verify the module graph
 * still wires up after the StrictMode-counter fixes and the React 18 types
 * upgrade. This catches export mistakes and circular-import regressions
 * without requiring any test renderer.
 */

import * as publicApi from '../index';

describe('public API', () => {
  it('exports all expected components', () => {
    expect(typeof publicApi.withCollapsibleContext).toBe('function');
    expect(typeof publicApi.useCollapsibleContext).toBe('function');
    expect(typeof publicApi.CollapsibleContainer).toBe('function');
    expect(typeof publicApi.CollapsibleFlatList).toBe('function');
    expect(typeof publicApi.CollapsibleScrollView).toBe('function');
    expect(typeof publicApi.CollapsibleSectionList).toBe('function');
    expect(typeof publicApi.CollapsibleHeaderContainer).toBe('function');
    expect(typeof publicApi.StickyView).toBe('function');
    expect(typeof publicApi.CollapsibleView).toBe('function');
    expect(typeof publicApi.CollapsibleHeaderText).toBe('function');
  });
});
