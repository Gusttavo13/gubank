import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { VerificationStatus } from '@/lib/types';
import KycStep from './KycStep';

vi.mock('../verification/VerificationWidget', () => ({
  VerificationWidget: ({ sdkUrl, onComplete }: { sdkUrl: string; onComplete: (status: VerificationStatus) => void }) => (
    <button data-testid="verification-widget" data-sdk-url={sdkUrl} onClick={() => onComplete('approved')} />
  ),
}));

const baseProps = {
  documentNumber: '12345678901',
  status: 'idle' as const,
  onBack: vi.fn(),
  onResult: vi.fn(),
  onRetry: vi.fn(),
};

describe('KycStep', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('requests a verification and mounts the widget with the entry URL', async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn().mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveRequest = resolve;
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    render(<KycStep {...baseProps} />);

    const loading = screen.getByRole('status', { name: 'Iniciando verificação' });
    expect(screen.queryByText(/Confirme que é você para liberar/)).toBeNull();
    expect(screen.queryByText('Iniciando verificação…')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Voltar' })).toBeNull();
    const loadingScreen = loading.closest('.screen') as HTMLElement;
    expect(loadingScreen.style.position).toBe('fixed');
    expect(loadingScreen.style.width).toBe('100vw');
    expect(loadingScreen.style.height).toBe('100dvh');
    expect(loading.parentElement?.classList.contains('kyc-box--centered')).toBe(true);
    expect(loading.parentElement?.classList.contains('kyc-box--widget')).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith('/api/verifications', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ documentNumber: '12345678901' }),
      signal: expect.any(AbortSignal),
    });

    resolveRequest?.(
      new Response(
        JSON.stringify({ sdkUrl: 'https://verify.legitimuz.com/#v=verification-id' }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    const widget = await screen.findByTestId('verification-widget');
    expect(widget.getAttribute('data-sdk-url')).toBe(
      'https://verify.legitimuz.com/#v=verification-id',
    );
    expect(screen.queryByText(/Confirme que é você para liberar/)).toBeNull();
    expect(screen.queryByText('Simular resultado (POC)')).toBeNull();
    expect(screen.queryByText('Verificação de identidade')).toBeNull();
    expect(screen.queryByText(/Verificado por/)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Voltar' })).toBeNull();
    const fullscreen = widget.closest('.screen') as HTMLElement;
    expect(fullscreen.classList.contains('kyc-screen--widget')).toBe(true);
    expect(fullscreen.style.position).toBe('fixed');
    expect(fullscreen.style.inset).toBe('0px');
    expect(fullscreen.style.width).toBe('100vw');
    expect(fullscreen.style.height).toBe('100dvh');
    expect(widget.parentElement?.classList.contains('kyc-box--widget')).toBe(true);

    fireEvent.click(widget);
    expect(baseProps.onResult).toHaveBeenCalledWith('approved');
  });

  it('allows retrying when verification creation fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 502 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ sdkUrl: 'https://verify.legitimuz.com/#v=retry' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    render(<KycStep {...baseProps} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(await screen.findByTestId('verification-widget')).toBeTruthy();
  });
});
