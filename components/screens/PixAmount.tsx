import Icon from '../Icon';
import { QUICK_AMOUNTS } from '@/lib/data';
import { fmt } from '@/lib/format';

interface Props { cents: number; balance: number; recipient: string; onChange: (c: number) => void; onBack: () => void; onNext: () => void }

export default function PixAmount({ cents, balance, recipient, onChange, onBack, onNext }: Props) {
  const valid = cents > 0 && cents <= balance;
  return (
    <div className="screen">
      <button className="back" onClick={onBack} aria-label="Voltar"><Icon name="arrow_back" /></button>
      <div className="overline">Pix · etapa 2 de 3</div>
      <h1>Qual o valor?</h1>
      <div className="muted" style={{ fontSize: 14, marginTop: 8 }}>Para <span style={{ color: 'var(--ink-900)', fontWeight: 500 }}>{recipient}</span></div>
      <div className="amount-wrap">
        <span style={{ fontSize: 22, color: 'var(--ink-500)', fontWeight: 500 }}>R$</span>
        <input className="amount-in" inputMode="numeric" placeholder="0,00"
          value={cents ? (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''}
          onChange={(e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 13); onChange(d ? parseInt(d, 10) : 0); }} />
      </div>
      <div className="muted" style={{ marginTop: 10 }}>Saldo disponível: {fmt(balance)}</div>
      <div className="chips">
        {QUICK_AMOUNTS.map((v) => <button className="chip" key={v} onClick={() => onChange(v)}>{fmt(v).replace(',00', '')}</button>)}
      </div>
      <div className="notice">
        <Icon name="verified_user" size={20} color="var(--orange-500)" style={{ flex: 'none' }} />
        <span>Por segurança, esta transferência passa por uma verificação de identidade antes de ser aprovada.</span>
      </div>
      <div className="spacer" />
      <button className="btn-primary" disabled={!valid} onClick={onNext}>Continuar</button>
    </div>
  );
}
