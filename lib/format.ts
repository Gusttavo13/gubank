export const fmt = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('');
