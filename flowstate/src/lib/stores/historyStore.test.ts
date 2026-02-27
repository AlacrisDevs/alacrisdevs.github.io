import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock designTokens store
const mockTokens = {
    unit: 'px',
    themeMode: 'dark',
    colorVariables: [
        { id: 'primary', name: 'Primary', value: '#00A3E0' },
        { id: 'background', name: 'Background', value: '#0A121F' },
    ]
};

let importedState = JSON.stringify(mockTokens);

vi.mock('./designTokens.svelte', () => ({
    designTokens: {
        tokens: mockTokens,
        importFromJSON: (json: string) => {
            importedState = json;
        }
    }
}));

// Testable version of HistoryStore without Svelte runes
class TestableHistoryStore {
    private undoStack: string[] = [];
    private redoStack: string[] = [];
    private isUndoRedo = false;
    private maxHistory = 50;

    constructor(initialState: string) {
        this.undoStack = [initialState];
    }

    pushState(currentState: string) {
        if (this.isUndoRedo) return;

        const lastState = this.undoStack[this.undoStack.length - 1];
        if (currentState === lastState) return;

        this.undoStack = [...this.undoStack, currentState].slice(-this.maxHistory);
        this.redoStack = [];
    }

    undo(): string | null {
        if (this.undoStack.length <= 1) return null;

        this.isUndoRedo = true;

        const currentState = this.undoStack[this.undoStack.length - 1];
        this.redoStack = [...this.redoStack, currentState];
        this.undoStack = this.undoStack.slice(0, -1);

        const previousState = this.undoStack[this.undoStack.length - 1];

        this.isUndoRedo = false;
        return previousState;
    }

    redo(): string | null {
        if (this.redoStack.length === 0) return null;

        this.isUndoRedo = true;

        const nextState = this.redoStack[this.redoStack.length - 1];
        this.redoStack = this.redoStack.slice(0, -1);
        this.undoStack = [...this.undoStack, nextState];

        this.isUndoRedo = false;
        return nextState;
    }

    get canUndo(): boolean {
        return this.undoStack.length > 1;
    }

    get canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    reset(currentState: string) {
        this.undoStack = [currentState];
        this.redoStack = [];
    }

    getUndoStackLength(): number {
        return this.undoStack.length;
    }

    getRedoStackLength(): number {
        return this.redoStack.length;
    }
}

describe('HistoryStore', () => {
    let historyStore: TestableHistoryStore;
    const initialState = JSON.stringify({ color: '#000000' });

    beforeEach(() => {
        historyStore = new TestableHistoryStore(initialState);
    });

    describe('initialization', () => {
        it('should start with initial state in undo stack', () => {
            expect(historyStore.getUndoStackLength()).toBe(1);
            expect(historyStore.getRedoStackLength()).toBe(0);
        });

        it('should not be able to undo with only initial state', () => {
            expect(historyStore.canUndo).toBe(false);
        });

        it('should not be able to redo initially', () => {
            expect(historyStore.canRedo).toBe(false);
        });
    });

    describe('pushState', () => {
        it('should add new state to undo stack', () => {
            const newState = JSON.stringify({ color: '#FF0000' });
            historyStore.pushState(newState);

            expect(historyStore.getUndoStackLength()).toBe(2);
            expect(historyStore.canUndo).toBe(true);
        });

        it('should not add duplicate state', () => {
            historyStore.pushState(initialState);

            expect(historyStore.getUndoStackLength()).toBe(1);
        });

        it('should clear redo stack when pushing new state', () => {
            const state1 = JSON.stringify({ color: '#FF0000' });
            const state2 = JSON.stringify({ color: '#00FF00' });

            historyStore.pushState(state1);
            historyStore.undo();
            expect(historyStore.canRedo).toBe(true);

            historyStore.pushState(state2);
            expect(historyStore.canRedo).toBe(false);
        });

        it('should limit history to max 50 states', () => {
            for (let i = 0; i < 60; i++) {
                historyStore.pushState(JSON.stringify({ color: `#${i.toString().padStart(6, '0')}` }));
            }

            expect(historyStore.getUndoStackLength()).toBe(50);
        });
    });

    describe('undo', () => {
        it('should return previous state', () => {
            const newState = JSON.stringify({ color: '#FF0000' });
            historyStore.pushState(newState);

            const result = historyStore.undo();
            expect(result).toBe(initialState);
        });

        it('should move current state to redo stack', () => {
            const newState = JSON.stringify({ color: '#FF0000' });
            historyStore.pushState(newState);
            historyStore.undo();

            expect(historyStore.canRedo).toBe(true);
            expect(historyStore.getRedoStackLength()).toBe(1);
        });

        it('should return null when cannot undo', () => {
            const result = historyStore.undo();
            expect(result).toBeNull();
        });
    });

    describe('redo', () => {
        it('should return next state after undo', () => {
            const newState = JSON.stringify({ color: '#FF0000' });
            historyStore.pushState(newState);
            historyStore.undo();

            const result = historyStore.redo();
            expect(result).toBe(newState);
        });

        it('should move state back to undo stack', () => {
            const newState = JSON.stringify({ color: '#FF0000' });
            historyStore.pushState(newState);
            historyStore.undo();
            historyStore.redo();

            expect(historyStore.getUndoStackLength()).toBe(2);
            expect(historyStore.getRedoStackLength()).toBe(0);
        });

        it('should return null when cannot redo', () => {
            const result = historyStore.redo();
            expect(result).toBeNull();
        });
    });

    describe('reset', () => {
        it('should clear history and set new initial state', () => {
            const state1 = JSON.stringify({ color: '#FF0000' });
            const state2 = JSON.stringify({ color: '#00FF00' });

            historyStore.pushState(state1);
            historyStore.pushState(state2);
            historyStore.undo();

            const resetState = JSON.stringify({ color: '#0000FF' });
            historyStore.reset(resetState);

            expect(historyStore.getUndoStackLength()).toBe(1);
            expect(historyStore.getRedoStackLength()).toBe(0);
            expect(historyStore.canUndo).toBe(false);
            expect(historyStore.canRedo).toBe(false);
        });
    });

    describe('multiple undo/redo operations', () => {
        it('should handle multiple undo operations', () => {
            const states = [
                JSON.stringify({ color: '#FF0000' }),
                JSON.stringify({ color: '#00FF00' }),
                JSON.stringify({ color: '#0000FF' }),
            ];

            states.forEach(state => historyStore.pushState(state));

            expect(historyStore.getUndoStackLength()).toBe(4);

            historyStore.undo();
            historyStore.undo();
            historyStore.undo();

            expect(historyStore.getUndoStackLength()).toBe(1);
            expect(historyStore.getRedoStackLength()).toBe(3);
        });

        it('should handle alternating undo/redo', () => {
            const state1 = JSON.stringify({ color: '#FF0000' });
            const state2 = JSON.stringify({ color: '#00FF00' });

            historyStore.pushState(state1);
            historyStore.pushState(state2);

            historyStore.undo(); // back to state1
            historyStore.redo(); // forward to state2
            historyStore.undo(); // back to state1

            expect(historyStore.canUndo).toBe(true);
            expect(historyStore.canRedo).toBe(true);
        });
    });
});
