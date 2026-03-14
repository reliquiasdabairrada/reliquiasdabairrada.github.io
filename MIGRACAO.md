# Migração do Wix para GitHub Pages + domínio próprio no Wix

## 1) Antes de mexer no DNS

- Confirmar que o site abre corretamente no URL temporário do GitHub Pages.
- Confirmar que substituiu as imagens placeholder.
- Confirmar que definiu o email correto no formulário ou que trocou por um serviço externo.
- Confirmar que o domínio está ativo e renovado.

## 2) No GitHub

1. Criar repositório público.
2. Fazer upload dos ficheiros.
3. Ir a **Settings > Pages**.
4. Escolher **Deploy from a branch**.
5. Selecionar `main` e `/root`.
6. Depois do site publicar, configurar **Custom domain**.
7. Ativar **Enforce HTTPS** quando a opção ficar disponível.
8. Verificar o domínio a nível de conta/perfil com o TXT fornecido pelo GitHub.

## 3) No Wix (se o domínio estiver registado ou gerido lá)

- Ir a **Domains**.
- Abrir **Domain Actions > Manage DNS Records**.
- Remover registos antigos de A e CNAME que apontem para o Wix, se o domínio deixar de apontar para o site Wix.
- Adicionar os registos do GitHub Pages.

### Registos DNS típicos

Apex / raiz (`@`):
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

`www`:
- CNAME para `SEU_UTILIZADOR.github.io`

## 4) Se tiver email no domínio

- Não apagar MX, SPF, DKIM e outros registos de email.
- Alterar apenas os registos web necessários (`A`, `AAAA`, `CNAME`, eventualmente `TXT` para verificação).

## 5) Segurança recomendada

- Ativar 2FA no GitHub e no Wix.
- Usar acesso de conta apenas para administradores necessários.
- Guardar uma cópia local dos ficheiros do site.
- Não publicar documentos internos no repositório.
- Não expor chaves API, passwords, tokens ou ficheiros `.env`.
- Rever links externos e formulários para evitar spam e abuso.
- Se usar Formspree/FormSubmit, ativar proteção anti-spam e limitação de envios.

## 6) Depois da mudança

- Confirmar que `https://dominio.pt` e `https://www.dominio.pt` abrem corretamente.
- Confirmar redirecionamento entre variante com e sem `www`.
- Testar no telemóvel.
- Testar formulário, WhatsApp e redes sociais.
- Atualizar Google Business Profile e redes sociais com o novo domínio.
