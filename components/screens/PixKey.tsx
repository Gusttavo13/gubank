import Icon from '../Icon';
import { CONTACTS } from '@/lib/data';
import { initials } from '@/lib/format';

interface Props { value: string; onChange: (v: string) => void; onPick: (key: string) => void; onBack: () => void; onNext: () => void }

export default function PixKey({ value, onChange, onPick, onBack, onNext }: Props) {
  return (
    <div className="screen">
      <button className="back" onClick={onBack} aria-label="Voltar"><Icon name="arrow_back" /></button>
      <div className="overline">Pix · etapa 1 de 3</div>
      <h1>Para quem você quer transferir?</h1>
      <label className="label" htmlFor="pixkey">Chave Pix</label>
      <input id="pixkey" className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="CPF, e-mail, celular ou aleatória" />
      <div className="help">A gente confere o nome antes de confirmar.</div>
      <div className="muted" style={{ margin: '28px 0 10px' }}>Recentes</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CONTACTS.map((c) => (
          <button className="contact" key={c.key} onClick={() => onPick(c.key)}>
            <div className="avatar">{initials(c.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
              <div className="tx-meta">{c.key}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="spacer" />
      <button className="btn-primary" disabled={!value.trim()} onClick={onNext}>Continuar</button>
    </div>
  );
}
