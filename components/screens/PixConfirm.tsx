import Icon from '../Icon';
import { fmt } from '@/lib/format';

interface Props { cents: number; pixKey: string; recipient: string; bank: string; onBack: () => void; onNext: () => void }

export default function PixConfirm({ cents, pixKey, recipient, bank, onBack, onNext }: Props) {
  return (
    <div className="screen">
      <button className="back" onClick={onBack} aria-label="Voltar"><Icon name="arrow_back" /></button>
      <div className="overline">Pix · etapa 3 de 3</div>
      <h1>Confira os dados</h1>
      <div className="card" style={{ marginTop: 28, padding: '4px 16px' }}>
        <div className="row"><span className="k">Valor</span><span className="v big">{fmt(cents)}</span></div>
        <div className="row"><span className="k">Para</span><span className="v">{recipient}</span></div>
        <div className="row"><span className="k">Chave</span><span className="v" style={{ fontWeight: 400 }}>{pixKey}</span></div>
        <div className="row"><span className="k">Instituição</span><span>{bank}</span></div>
        <div className="row"><span className="k">Quando</span><span>Agora</span></div>
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'var(--ink-700)' }}>
        <Icon name="fingerprint" size={20} color="var(--orange-500)" />
        <span>Ao continuar, você inicia a verificação de identidade.</span>
      </div>
      <div className="spacer" />
      <button className="btn-primary" onClick={onNext}>Pagar</button>
    </div>
  );
}
