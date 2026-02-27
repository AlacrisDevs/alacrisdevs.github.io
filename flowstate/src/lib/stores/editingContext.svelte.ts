// Tracks what the user is currently editing in the sidebar
// Used to highlight the corresponding element in the main preview

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'large' | 'medium' | 'small';

interface EditingContext {
    section: 'colors' | 'typography' | 'buttons' | 'toasts' | null;
    buttonVariant: ButtonVariant;
    buttonSize: ButtonSize;
}

class EditingContextStore {
    section = $state<EditingContext['section']>(null);
    buttonVariant = $state<ButtonVariant>('primary');
    buttonSize = $state<ButtonSize>('large');

    setSection(section: EditingContext['section']) {
        this.section = section;
    }

    setButtonContext(variant: ButtonVariant, size: ButtonSize) {
        this.buttonVariant = variant;
        this.buttonSize = size;
        this.section = 'buttons';
    }

    clearSection() {
        this.section = null;
    }

    isEditingButton(variant: ButtonVariant, size: ButtonSize): boolean {
        return this.section === 'buttons' && this.buttonVariant === variant && this.buttonSize === size;
    }
}

export const editingContext = new EditingContextStore();
