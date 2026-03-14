# Relíquias da Bairrada — base estática para GitHub Pages

Esta pasta contém uma base completa para migrar o site atual do Wix para GitHub Pages.

## Estrutura

- `index.html` — página principal
- `portfolio.html` — página de portefólio
- `404.html` — página de erro
- `assets/css/styles.css` — estilos
- `assets/js/site.js` — menu mobile e formulário local
- `assets/img/` — logótipo e imagens placeholder
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `.nojekyll`

## O que precisa de trocar

1. Substituir `contacto@exemplo.pt` em:
   - `index.html`
   - `assets/js/site.js`
2. Trocar `https://example.com` em:
   - `index.html`
   - `robots.txt`
   - `sitemap.xml`
3. Substituir as imagens placeholder em `assets/img/` por fotografias reais.
4. Atualizar os textos do portefólio com datas, locais e clientes reais.
5. Adicionar links finais de Facebook e YouTube, se existirem.

## Como publicar no GitHub Pages

1. Criar um repositório público no GitHub.
2. Fazer upload de todos os ficheiros desta pasta para a raiz do repositório.
3. No GitHub: **Settings > Pages**.
4. Em **Build and deployment**, escolher **Deploy from a branch**.
5. Escolher a branch `main` e a pasta `/root`.
6. Guardar.
7. Confirmar que o site abre no endereço `https://SEU_UTILIZADOR.github.io/NOME_DO_REPO/`.

## Domínio próprio

Depois de o site abrir no URL do GitHub Pages:

1. No GitHub: **Settings > Pages > Custom domain**.
2. Inserir o domínio final, por exemplo `reliquiasdabairrada.pt` ou `www.reliquiasdabairrada.pt`.
3. Criar também um ficheiro `CNAME` na raiz com esse domínio exato.
4. No gestor DNS do domínio, apontar os registos para GitHub Pages.

## DNS típico

### Se o domínio principal for o GitHub Pages

Apex (`@`):
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

`www`:
- CNAME para `SEU_UTILIZADOR.github.io`

## Formulário

O formulário atual abre o cliente de email do utilizador (`mailto:`). Para um formulário mais profissional sem backend próprio, pode trocar por:

- Formspree
- FormSubmit
- Basin

## Segurança básica

- Ativar HTTPS em GitHub Pages.
- Manter o repositório sem segredos e sem ficheiros privados.
- Não colocar emails, tokens API, passwords ou chaves no JavaScript.
- Ativar autenticação de dois fatores na conta GitHub.
- Usar palavras-passe fortes no GitHub e no Wix.
- Rever periodicamente os DNS para evitar registos órfãos.
