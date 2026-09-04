interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export default function CpfEntry({ value, onChange, onSubmit }: Props) {
  const digits = value.replace(/\D/g, '');

  return (
    <form className="screen" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
      <div className="overline">Acesso ao GuBank</div>
      <h1>Informe seu CPF para entrar</h1>
      <label className="label" htmlFor="document-number">CPF</label>
      <input
        id="document-number"
        className="input"
        inputMode="numeric"
        autoComplete="off"
        maxLength={14}
        placeholder="000.000.000-00"
        value={value}
        onChange={(event) => onChange(formatCpf(event.target.value))}
      />
      <div className="spacer" />
      <button className="btn-primary" type="submit" disabled={digits.length !== 11}>
        Entrar no GuBank
      </button>
    </form>
  );
}
