// Global toast notification store using Svelte 5 Runes

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
    id: string;
    message: string;
    variant: ToastVariant;
    duration: number;
}

export interface ToastOptions {
    duration?: number;
}

const DEFAULT_DURATION = 4000;

class ToastStore {
    toasts = $state<Toast[]>([]);

    private generateId(): string {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    show(message: string, variant: ToastVariant, options?: ToastOptions): string {
        const id = this.generateId();
        const duration = options?.duration ?? DEFAULT_DURATION;

        const toast: Toast = { id, message, variant, duration };
        this.toasts = [...this.toasts, toast];

        if (duration > 0) {
            setTimeout(() => this.dismiss(id), duration);
        }

        return id;
    }

    dismiss(id: string): void {
        this.toasts = this.toasts.filter((t) => t.id !== id);
    }

    dismissAll(): void {
        this.toasts = [];
    }

    // Convenience methods
    info(message: string, options?: ToastOptions): string {
        return this.show(message, 'info', options);
    }

    success(message: string, options?: ToastOptions): string {
        return this.show(message, 'success', options);
    }

    warning(message: string, options?: ToastOptions): string {
        return this.show(message, 'warning', options);
    }

    error(message: string, options?: ToastOptions): string {
        return this.show(message, 'error', options);
    }
}

export const toastStore = new ToastStore();
