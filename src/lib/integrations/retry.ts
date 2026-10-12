// Exponential Backoff Retry Utility for External APIs (Telegram, Discord, Resend)
export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: any) => void;
}

export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelayMs = 400,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let attempt = 1;
  let delay = initialDelayMs;

  while (true) {
    try {
      return await operation(attempt);
    } catch (error: any) {
      if (attempt >= maxAttempts) {
        console.error(`[RETRY_EXHAUSTED] Failed after ${attempt} attempts:`, error?.message || error);
        throw error;
      }

      if (onRetry) {
        onRetry(attempt, error);
      } else {
        console.warn(`[RETRY_ATTEMPT_${attempt}] Error: ${error?.message || error}. Retrying in ${delay}ms...`);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= backoffMultiplier;
      attempt++;
    }
  }
}
