// src/lib/utils/performance.ts
// Performance monitoring utilities for token operations

interface PerformanceMetrics {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 100;

  start(operation: string, metadata?: Record<string, any>): string {
    const id = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetrics = {
      operation,
      startTime: performance.now(),
      metadata
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    return id;
  }

  end(id: string): void {
    const metric = this.metrics.find(m => `${m.operation}_${m.startTime}` === id.split('_').slice(0, -2).join('_'));
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageDuration(operation: string): number {
    const operationMetrics = this.metrics.filter(m => m.operation === operation && m.duration);
    if (operationMetrics.length === 0) return 0;

    const total = operationMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    return total / operationMetrics.length;
  }

  clear(): void {
    this.metrics = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Performance monitoring decorator for token operations
export function withPerformanceMonitoring<T extends any[], R>(
  operation: string,
  fn: (...args: T) => R
): (...args: T) => R {
  return (...args: T): R => {
    const id = performanceMonitor.start(operation, { argsCount: args.length });
    try {
      const result = fn(...args);
      performanceMonitor.end(id);
      return result;
    } catch (error) {
      performanceMonitor.end(id);
      throw error;
    }
  };
}

// Hook for monitoring token operations
export function usePerformanceMonitoring() {
  const getMetrics = () => performanceMonitor.getMetrics();
  const getAverageDuration = (operation: string) => performanceMonitor.getAverageDuration(operation);
  const clearMetrics = () => performanceMonitor.clear();

  return {
    getMetrics,
    getAverageDuration,
    clearMetrics
  };
}