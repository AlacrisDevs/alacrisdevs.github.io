import { designTokens, type DesignTokens } from './designTokens.svelte';

const MAX_HISTORY = 50;

class HistoryStore {
    private undoStack = $state<string[]>([]);
    private redoStack = $state<string[]>([]);
    private isUndoRedo = false;

    constructor() {
        // Save initial state
        if (typeof window !== 'undefined') {
            this.undoStack = [JSON.stringify(designTokens.tokens)];
        }
    }

    // Call this after any change to design tokens
    pushState() {
        if (this.isUndoRedo) return;

        const currentState = JSON.stringify(designTokens.tokens);
        const lastState = this.undoStack[this.undoStack.length - 1];

        // Don't push if state hasn't changed
        if (currentState === lastState) return;

        this.undoStack = [...this.undoStack, currentState].slice(-MAX_HISTORY);
        this.redoStack = []; // Clear redo stack on new change
    }

    undo() {
        if (this.undoStack.length <= 1) return false;

        this.isUndoRedo = true;

        // Pop current state and push to redo
        const currentState = this.undoStack[this.undoStack.length - 1];
        this.redoStack = [...this.redoStack, currentState];
        this.undoStack = this.undoStack.slice(0, -1);

        // Apply previous state
        const previousState = this.undoStack[this.undoStack.length - 1];
        designTokens.importFromJSON(previousState);

        this.isUndoRedo = false;
        return true;
    }

    redo() {
        if (this.redoStack.length === 0) return false;

        this.isUndoRedo = true;

        // Pop from redo and push to undo
        const nextState = this.redoStack[this.redoStack.length - 1];
        this.redoStack = this.redoStack.slice(0, -1);
        this.undoStack = [...this.undoStack, nextState];

        // Apply next state
        designTokens.importFromJSON(nextState);

        this.isUndoRedo = false;
        return true;
    }

    get canUndo(): boolean {
        return this.undoStack.length > 1;
    }

    get canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    // Reset history (e.g., when loading a preset)
    reset() {
        this.undoStack = [JSON.stringify(designTokens.tokens)];
        this.redoStack = [];
    }
}

export const historyStore = new HistoryStore();
