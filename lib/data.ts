import type { Contact, Tx } from './types';

export const INITIAL_BALANCE = 78598766500; // R$ 785.987.665,00

export const CONTACTS: Contact[] = [
  { name: 'Ana Beatriz Souza', key: 'ana.souza@email.com', bank: 'Nubank' },
  { name: 'Carlos Menezes', key: '(11) 98765-4321', bank: 'Itaú' },
  { name: 'Marina Lopes', key: '123.456.789-09', bank: 'Banco do Brasil' },
];

export const INITIAL_HISTORY: Tx[] = [
  { name: 'Mercado Central', meta: 'Hoje · Pix', cents: -18740, icon: 'shopping_cart' },
  { name: 'Ana Beatriz Souza', meta: 'Ontem · Pix recebido', cents: 250000, icon: 'arrow_downward' },
  { name: 'Conta de luz', meta: '01 set · Boleto', cents: -32190, icon: 'bolt' },
  { name: 'Salário', meta: '30 ago · TED', cents: 1850000, icon: 'work' },
];

export const QUICK_AMOUNTS = [5000, 10000, 50000, 100000];
