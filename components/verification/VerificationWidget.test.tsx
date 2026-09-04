import { act } from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { VerificationWidget } from './VerificationWidget';

describe('VerificationWidget', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('prioritizes session.completed and forwards its status only once', () => {
    vi.useFakeTimers();
    const destroy = vi.fn();
    const mount = vi.fn().mockReturnValue({ destroy });
    const onComplete = vi.fn();
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    window.Legitimuz = { mount };

    const { unmount } = render(
      <VerificationWidget sdkUrl="https://verify.test/#v=id" onComplete={onComplete} />,
    );
    const options = mount.mock.calls[0][0];

    expect(options.sdkUrl).toBe('https://verify.test/#v=id');
    expect(options.target).toBeInstanceOf(HTMLDivElement);

    act(() => options.onReady());
    act(() => options.onComplete({ status: 'approved' }));
    expect(onComplete).not.toHaveBeenCalled();

    act(() => options.onEvent({
      type: 'session.completed',
      payload: { status: 'submitted' },
    }));
    vi.advanceTimersByTime(2000);
    act(() => options.onError({ code: 'sdk_error', user_message: 'Falha no SDK' }));

    expect(info).toHaveBeenCalledWith('widget pronto');
    expect(destroy).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith('submitted');
    expect(destroy.mock.invocationCallOrder[0]).toBeLessThan(
      onComplete.mock.invocationCallOrder[0],
    );
    expect(error).toHaveBeenCalledWith('sdk_error', 'Falha no SDK');

    unmount();
    expect(destroy).toHaveBeenCalledOnce();
  });

  it('uses onComplete as fallback after two seconds', () => {
    vi.useFakeTimers();
    const destroy = vi.fn();
    const mount = vi.fn().mockReturnValue({ destroy });
    const onComplete = vi.fn();
    window.Legitimuz = { mount };

    render(<VerificationWidget sdkUrl="https://verify.test/#v=id" onComplete={onComplete} />);
    const options = mount.mock.calls[0][0];

    act(() => options.onComplete({ status: 'reproved' }));
    vi.advanceTimersByTime(1999);
    expect(onComplete).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onComplete).toHaveBeenCalledWith('reproved');
    expect(destroy).not.toHaveBeenCalled();
  });

  it('fills all available space in its container', () => {
    window.Legitimuz = { mount: vi.fn().mockReturnValue({ destroy: vi.fn() }) };

    const { container } = render(
      <VerificationWidget sdkUrl="https://verify.test/#v=id" onComplete={vi.fn()} />,
    );
    const widget = container.firstElementChild as HTMLElement;

    expect(widget.style.width).toBe('100%');
    expect(widget.style.height).toBe('100%');
  });
});
