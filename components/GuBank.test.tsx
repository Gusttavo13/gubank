import { act } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import GuBank from './GuBank';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('./screens/Home', () => ({
  default: ({ onPix }: { onPix: () => void }) => <button onClick={onPix}>Iniciar Pix</button>,
}));

vi.mock('./screens/PixKey', () => ({
  default: ({ onNext }: { onNext: () => void }) => <button onClick={onNext}>Avançar chave</button>,
}));

vi.mock('./screens/PixAmount', () => ({
  default: ({ onNext }: { onNext: () => void }) => <button onClick={onNext}>Avançar valor</button>,
}));

vi.mock('./screens/PixConfirm', () => ({
  default: ({ onNext }: { onNext: () => void }) => <button onClick={onNext}>Abrir KYC</button>,
}));

vi.mock('./screens/KycStep', () => ({
  default: ({ status, documentNumber, onResult }: { status: string; documentNumber: string; onResult: (status: string) => void }) => (
    <div>
      <span data-testid="kyc-status">{status}</span>
      <span data-testid="kyc-document">{documentNumber}</span>
      <button onClick={() => onResult('review')}>Revisão</button>
      <button onClick={() => onResult('reproved')}>Reprovar</button>
      <button onClick={() => onResult('approved')}>Aprovar</button>
      <button onClick={() => onResult('submitted')}>Enviar</button>
    </div>
  ),
}));

vi.mock('./screens/Receipt', () => ({
  default: () => <div>Comprovante</div>,
}));

function enterBank() {
  const input = screen.getByRole('textbox', { name: 'CPF' });
  fireEvent.change(input, { target: { value: '12345678901' } });
  expect((input as HTMLInputElement).value).toBe('123.456.789-01');
  fireEvent.click(screen.getByRole('button', { name: 'Entrar no GuBank' }));
}

function openKyc() {
  enterBank();
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar Pix' }));
  fireEvent.click(screen.getByRole('button', { name: 'Avançar chave' }));
  fireEvent.click(screen.getByRole('button', { name: 'Avançar valor' }));
  fireEvent.click(screen.getByRole('button', { name: 'Abrir KYC' }));
}

describe('GuBank KYC results', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('requires an eleven-digit CPF before entering the bank', () => {
    render(<GuBank />);
    const input = screen.getByRole('textbox', { name: 'CPF' });
    const button = screen.getByRole('button', { name: 'Entrar no GuBank' }) as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    fireEvent.change(input, { target: { value: '1234567890' } });
    expect(button.disabled).toBe(true);
    fireEvent.change(input, { target: { value: '12345678901' } });
    expect(button.disabled).toBe(false);
  });

  it('waits for non-final statuses and rejects a reproved verification', () => {
    render(<GuBank />);
    openKyc();

    expect(screen.getByTestId('kyc-document').textContent).toBe('12345678901');
    fireEvent.click(screen.getByRole('button', { name: 'Revisão' }));
    expect(screen.getByTestId('kyc-status').textContent).toBe('idle');

    fireEvent.click(screen.getByRole('button', { name: 'Reprovar' }));
    expect(screen.getByTestId('kyc-status').textContent).toBe('rejected');
  });

  it('finishes the Pix after a submitted verification', () => {
    vi.useFakeTimers();
    render(<GuBank approvalDelay={0} />);
    openKyc();

    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    act(() => vi.runAllTimers());

    expect(screen.getByText('Comprovante')).toBeTruthy();
  });
});
