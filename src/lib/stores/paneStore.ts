// src/lib/stores/paneStore.ts
import { writable, get } from "svelte/store";
import type { PaneState, PaneId, PaneContent } from "$lib/types/pane";
import { isPaneId } from "$lib/types/pane";

const STORAGE_KEY = "paneState";

const initialState: PaneState = {
  topLeft: null,
  topRight: null,
  bottomLeft: null,
  bottomCenter: null,
  bottomRight: null,
  footer: null,
};

function createPaneStore() {
  const { subscribe, set, update } = writable<PaneState>(initialState);

  return {
    subscribe,

    // Add content to a pane
    addContent: (paneId: PaneId, content: PaneContent) => {
      update((state) => ({
        ...state,
        [paneId]: content,
      }));
    },

    // Remove content from a pane
    removeContent: (paneId: PaneId) => {
      update((state) => ({
        ...state,
        [paneId]: null,
      }));
    },

    // Move content between panes
    moveContent: (fromPaneId: PaneId, toPaneId: PaneId) => {
      update((state) => {
        const content = state[fromPaneId];
        return {
          ...state,
          [fromPaneId]: null,
          [toPaneId]: content,
        };
      });
    },

    // Get content from a specific pane
    getContent: (paneId: PaneId): PaneContent | null => {
      return get(paneStore)[paneId];
    },

    // Check if a pane has content
    hasContent: (paneId: PaneId): boolean => {
      return get(paneStore)[paneId] !== null;
    },

    // Reset all panes to initial state
    reset: () => set(initialState),

    // Load state from localStorage
    loadState: () => {
      try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsed = JSON.parse(savedState);
          // Validate the structure before setting
          if (Object.keys(parsed).every(isPaneId)) {
            set(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to load pane state:", error);
      }
    },

    // Save state to localStorage
    saveState: () => {
      try {
        const state = get(paneStore);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save pane state:", error);
      }
    },
  };
}

export const paneStore = createPaneStore();
