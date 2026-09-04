import { useEffect, useState } from 'react';
import Icon from '../Icon';
import { VerificationWidget } from '../verification/VerificationWidget';
import type { KycStatus, VerificationStatus } from '@/lib/types';

interface Props {
  documentNumber: string;
  status: KycStatus;
  onBack: () => void; onResult: (status: VerificationStatus) => void; onRetry: () => void;
}

export default function KycStep({ documentNumber, status, onBack, onResult, onRetry }: Props) {
  const [requestId, setRequestId] = useState(0);
  const [sdkUrl, setSdkUrl] = useState('');
  const [requestStatus, setRequestStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();

    setRequestStatus('loading');
    setSdkUrl('');

    fetch('/api/verifications', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ documentNumber }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Falha ao criar verificação');
        }

        const data = await response.json();

        if (typeof data?.sdkUrl !== 'string' || !data.sdkUrl) {
          throw new Error('URL de verificação inválida');
        }

        setSdkUrl(data.sdkUrl);
        setRequestStatus('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setRequestStatus('error');
        }
      });

    return () => controller.abort();
  }, [documentNumber, requestId]);

  const retryVerification = () => {
    onRetry();
    setRequestId((current) => current + 1);
  };

  const isWidgetVisible = status === 'idle' && requestStatus === 'ready';

  return (
    <div
      className="screen kyc-screen--widget"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 1000,
        background: 'var(--bg)',
      }}
    >
      {status === 'idle' && requestStatus === 'error' && (
        <button className="back" onClick={onBack} aria-label="Voltar"><Icon name="arrow_back" /></button>
      )}

      <div id="legitimuz-kyc" className={`kyc-box ${isWidgetVisible ? 'kyc-box--widget' : 'kyc-box--centered'}`}>
        {status === 'idle' && requestStatus === 'loading' && (<>
          <div className="spinner" role="status" aria-label="Iniciando verificação" />
        </>)}
        {status === 'idle' && requestStatus === 'error' && (<>
          <Icon name="gpp_bad" size={56} color="var(--danger)" />
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--danger)' }}>Não foi possível iniciar a verificação</div>
          <button className="pill" style={{ marginTop: 6 }} onClick={retryVerification}>Tentar novamente</button>
        </>)}
        {status === 'idle' && requestStatus === 'ready' && <VerificationWidget sdkUrl={sdkUrl} onComplete={onResult} />}
        {status === 'loading' && (<>
          <div className="spinner" />
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--orange-900)' }}>Analisando sua verificação…</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>Isso leva só alguns segundos.</div>
        </>)}
        {status === 'rejected' && (<>
          <Icon name="gpp_bad" size={56} color="var(--danger)" />
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--danger)' }}>Não conseguimos confirmar sua identidade</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>A transferência não foi realizada.</div>
          <button className="pill" style={{ marginTop: 6 }} onClick={retryVerification}>Tentar novamente</button>
        </>)}
      </div>
    </div>
  );
}
