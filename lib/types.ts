export type Screen = 'document' | 'home' | 'key' | 'amount' | 'confirm' | 'kyc' | 'done';
export type KycStatus = 'idle' | 'loading' | 'rejected';
export type VerificationStatus =
  | 'not_opened'
  | 'started'
  | 'submitted'
  | 'abandoned'
  | 'approved'
  | 'reproved'
  | 'review';
export type VerificationEventType =
  | 'session.started'
  | 'session.stepTransitioned'
  | 'document.capture.started'
  | 'document.capture.completed'
  | 'document.capture.failed'
  | 'selfie.capture.started'
  | 'selfie.capture.completed'
  | 'liveness.completed'
  | 'liveness.failed'
  | 'session.completed'
  | 'session.error'
  | 'session.abandoned'
  | 'decision.notified'
  | 'terms.open'
  | 'redirect.open';

export interface VerificationEvent {
  type: VerificationEventType;
  payload?: Record<string, unknown>;
}

export interface Tx { name: string; meta: string; cents: number; icon: string }
export interface Contact { name: string; key: string; bank: string }

declare global {
  interface Window {
    Legitimuz: {
      mount: (options: {
        sdkUrl: string;
        target: HTMLElement;
        onReady: () => void;
        onComplete: (result: { status: VerificationStatus }) => void;
        onError: (error: { code: string; user_message: string }) => void;
        onEvent: (event: VerificationEvent) => void;
      }) => {
        destroy: () => void;
      };
    };
  }
}
