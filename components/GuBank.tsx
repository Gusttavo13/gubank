'use client';
import { useCallback, useRef, useState } from 'react';
import { CONTACTS, INITIAL_BALANCE, INITIAL_HISTORY } from '@/lib/data';
import type { KycStatus, Screen, Tx, VerificationStatus } from '@/lib/types';
import CpfEntry from './screens/CpfEntry';
import Home from './screens/Home';
import PixKey from './screens/PixKey';
import PixAmount from './screens/PixAmount';
import PixConfirm from './screens/PixConfirm';
import KycStep from './screens/KycStep';
import Receipt from './screens/Receipt';

interface Props { approvalDelay?: number }

export default function GuBank({ approvalDelay = 1.6 }: Props) {
  const [screen, setScreen] = useState<Screen>('document');
  const [documentNumber, setDocumentNumber] = useState('');
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [history, setHistory] = useState<Tx[]>(INITIAL_HISTORY);
  const [pixKey, setPixKey] = useState('');
  const [cents, setCents] = useState(0);
  const [kyc, setKyc] = useState<KycStatus>('idle');
  const [txId, setTxId] = useState('');
  const [doneTime, setDoneTime] = useState('');
  const latest = useRef({ cents, pixKey });
  latest.current = { cents, pixKey };

  const contact = CONTACTS.find((c) => c.key === pixKey);

  const onKycResult = useCallback((result: VerificationStatus) => {
    if (result === 'reproved') { setKyc('rejected'); return; }
    if (result !== 'approved' && result !== 'submitted') return;
    setKyc('loading');
    setTimeout(() => {
      const { cents, pixKey } = latest.current;
      const c = CONTACTS.find((x) => x.key === pixKey);
      setBalance((b) => b - cents);
      setTxId('E' + Math.random().toString(36).slice(2, 10).toUpperCase());
      setDoneTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      setHistory((h) => [{ name: c ? c.name : pixKey, meta: 'Agora · Pix enviado', cents: -cents, icon: 'arrow_upward' }, ...h]);
      setKyc('idle');
      setScreen('done');
    }, approvalDelay * 1000);
  }, [approvalDelay]);

  const startPix = () => { setPixKey(''); setCents(0); setKyc('idle'); setScreen('key'); };

  return (
    <div className="phone">
      {screen === 'document' && <CpfEntry value={documentNumber} onChange={setDocumentNumber} onSubmit={() => setScreen('home')} />}
      {screen === 'home' && <Home balance={balance} history={history} onPix={startPix} />}
      {screen === 'key' && <PixKey value={pixKey} onChange={setPixKey} onBack={() => setScreen('home')} onPick={(k) => { setPixKey(k); setScreen('amount'); }} onNext={() => setScreen('amount')} />}
      {screen === 'amount' && <PixAmount cents={cents} balance={balance} recipient={contact?.name ?? pixKey} onChange={setCents} onBack={() => setScreen('key')} onNext={() => setScreen('confirm')} />}
      {screen === 'confirm' && <PixConfirm cents={cents} pixKey={pixKey} recipient={contact?.name ?? pixKey} bank={contact?.bank ?? 'Outra instituição'} onBack={() => setScreen('amount')} onNext={() => { setKyc('idle'); setScreen('kyc'); }} />}
      {screen === 'kyc' && <KycStep documentNumber={documentNumber.replace(/\D/g, '')} status={kyc} onBack={() => setScreen('confirm')} onResult={onKycResult} onRetry={() => setKyc('idle')} />}
      {screen === 'done' && <Receipt cents={cents} pixKey={pixKey} recipient={contact?.name ?? pixKey} balance={balance} txId={txId} time={doneTime} onHome={() => setScreen('home')} />}
    </div>
  );
}
