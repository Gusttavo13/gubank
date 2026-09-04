import { useState } from 'react';
import Icon from '../Icon';
import { fmt } from '@/lib/format';
import type { Tx } from '@/lib/types';

export default function Home({ balance, history, onPix }: { balance: number; history: Tx[]; onPix: () => void }) {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="screen scroll" style={{ padding: 0 }}>
      <div className="hero">
        <div className="hero-top">
          <div className="brand"><div className="brand-mark">G</div>GuBank</div>
          <button className="eye" onClick={() => setHidden(!hidden)} aria-label="Mostrar/ocultar saldo"><Icon name={hidden ? 'visibility' : 'visibility_off'} size={22} /></button>
        </div>
        <div className="cap" style={{ marginTop: 36 }}>Saldo disponível</div>
        <div className="balance">{hidden ? 'R$ ••••••' : fmt(balance)}</div>
        <div className="cap" style={{ marginTop: 6 }}>Olá, Gustavo</div>
      </div>
      <div className="actions">
        <button className="action on" onClick={onPix}><Icon name="currency_exchange" />Pix</button>
        <div className="action"><Icon name="receipt_long" />Pagar</div>
        <div className="action"><Icon name="credit_card" />Cartão</div>
        <div className="action"><Icon name="savings" />Investir</div>
      </div>
      <div className="history">
        <div className="history-head">
          <span style={{ fontSize: 17, fontWeight: 500 }}>Histórico</span>
          <span className="muted" style={{ whiteSpace: 'nowrap' }}>{history.length} transações</span>
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          {history.map((t, i) => (
            <div className="tx" key={i}>
              <div className="tx-ic"><Icon name={t.icon} size={20} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tx-name">{t.name}</div>
                <div className="tx-meta">{t.meta}</div>
              </div>
              <div className="tx-amt" style={{ color: t.cents > 0 ? 'var(--success)' : 'var(--ink-900)' }}>{(t.cents > 0 ? '+ ' : '- ') + fmt(Math.abs(t.cents))}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
