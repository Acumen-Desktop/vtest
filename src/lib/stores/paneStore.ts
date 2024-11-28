// src/lib/stores/paneStore.ts
import { writable, get } from "svelte/store";
import type { PaneState, PaneId, PaneContent } from "../types/pane";
import { isPaneId } from "../types/pane";

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
      return get({ subscribe })[paneId];
    },

    // Reset store to initial state
    reset: () => {
      set(initialState);
    },

    // Load state from storage
    loadFromStorage: () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const state = JSON.parse(stored);
          set(state);
        } catch (e) {
          console.error("Failed to load pane state from storage:", e);
        }
      }
    },

    // Save state to storage
    saveToStorage: () => {
      const state = get({ subscribe });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
  };
}

export const paneStore = createPaneStore();
