# GuBank POC (Next.js)

```bash
npm install
npm run dev
```

## Integração do SDK Legitimuz

O componente `components/GuBank.tsx` expõe `window.GuBank`:

- `GuBank.getContainer()` → o elemento `#legitimuz-kyc` onde o SDK deve ser montado.
- `GuBank.getAmount()` / `GuBank.getPixKey()` → dados da transação atual.
- `GuBank.onKycResult('approved' | 'rejected')` → chame no callback do SDK.

Ponto de montagem: `components/KycStep.tsx` — o `useEffect` está marcado com `// TODO: montar SDK Legitimuz aqui`.

Para esconder os botões de simulação (Aprovar/Recusar), use `<GuBank showDevTools={false} />` em `app/page.tsx`.
