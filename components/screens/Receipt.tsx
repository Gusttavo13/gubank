import Icon from '../Icon';
import { fmt } from '@/lib/format';

interface Props { cents: number; pixKey: string; recipient: string; balance: number; txId: string; time: string; onHome: () => void }

export default function Receipt({ cents, pixKey, recipient, balance, txId, time, onHome }: Props) {
  return (
    <div className="screen scroll" style={{ paddingTop: 72 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div className="success"><Icon name="check" size={40} /></div>
        <h1 style={{ marginTop: 20, fontSize: 26 }}>Pix enviado</h1>
        <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>Identidade verificada · {time}</div>
      </div>
      <div className="card" style={{ marginTop: 28, padding: '4px 16px' }}>
        <div className="row"><span className="k">Valor</span><span className="v big">{fmt(cents)}</span></div>
        <div className="row"><span className="k">Para</span><span className="v">{recipient}</span></div>
        <div className="row"><span className="k">Chave</span><span className="v" style={{ fontWeight: 400 }}>{pixKey}</span></div>
        <div className="row"><span className="k">Verificação</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontWeight: 500 }}><Icon name="verified_user" size={16} />Aprovada</span></div>
        <div className="row"><span className="k">ID da transação</span><span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12 }}>{txId}</span></div>
      </div>
      <div className="muted" style={{ marginTop: 16, textAlign: 'center' }}>Novo saldo: {fmt(balance)}</div>
      <div className="spacer" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-outline"><Icon name="ios_share" size={20} />Compartilhar comprovante</button>
        <button className="btn-primary" onClick={onHome}>Voltar ao início</button>
      </div>
    </div>
  );
}
