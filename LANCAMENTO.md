# Lançamento — Renova Energy, Lda

Tudo o que falta fazer **fora do código** para o site ficar publicado, indexado e
protegido. O que está dentro do código já está feito e assinalado com ✅.

---

## Estado do DNS em 22/08/2026

O domínio é **`renovaenergylda.co.mz`** e está a funcionar. Verificado com:

```bash
nslookup renovaenergylda.co.mz 1.1.1.1
nslookup -type=NS renovaenergylda.co.mz 1.1.1.1
```

| O que | Estado |
|---|---|
| Registo A / AAAA | ✅ responde (`104.21.81.3`, `172.67.155.167` — IPs do Cloudflare) |
| Nameservers | ✅ `carlos.ns.cloudflare.com`, `treasure.ns.cloudflare.com` |
| Alojamento | ✅ já delegado para o Cloudflare |
| Registo MX | ❌ não existe |
| Registo SPF (TXT) | ❌ não existe |
| Registo DMARC | ❌ não existe |

Ou seja: **o site está pronto do lado do DNS, o e-mail não.** Sem SPF nem
DMARC, qualquer pessoa pode enviar mensagens que dizem vir de
`@renovaenergylda.co.mz` e passam nos filtros. É o ponto 3.2 deste documento.

> O código usava `renovaenergy.co.mz` (sem o `lda`) desde a versão anterior —
> no `canonical`, no `sitemap.xml` e no Schema.org. Já foi corrigido nos
> 9 ficheiros onde aparecia.

---

## 1. Vencimentos a vigiar

Anotar as datas num calendário partilhado, com aviso **30 dias antes**:

| Item | Onde se renova | Periodicidade | Data |
|---|---|---|---|
| Domínio `renovaenergylda.co.mz` | registro.mz ou revendedor | anual | `a preencher` |
| Certificado SSL | Cloudflare (automático) | 90 dias, renova sozinho | — |
| Conta Cloudflare Pages | gratuita no plano atual | — | — |
| Google Business Profile | verificação por carta/telefone | pontual | `a preencher` |

O SSL do Cloudflare renova-se sozinho **desde que o domínio continue delegado
para os nameservers do Cloudflare**. Se o domínio expirar, o certificado cai
com ele.

---

## 2. Publicar no Cloudflare Pages

1. Cloudflare → **Workers & Pages** → *Create* → *Pages* → *Connect to Git*.
2. Escolher o repositório. Configuração de build:
   - Framework preset: **None**
   - Build command: *(vazio — o site é estático)*
   - Build output directory: `/`
3. *Custom domains* → confirmar que `renovaenergylda.co.mz` está lá e
   acrescentar `www.renovaenergylda.co.mz`. O `_redirects` já manda o `www`
   para o domínio sem `www` com 301.
4. Confirmar depois do primeiro deploy:
   - `https://renovaenergylda.co.mz/_headers` → deve dar **404** (é consumido pelo
     Pages, não servido). Se aparecer o conteúdo do ficheiro, a configuração
     não foi aplicada.
   - Nos *DevTools → Network → Headers* da página inicial devem aparecer o
     `content-security-policy` e o `strict-transport-security`.

---

## 3. DNS

### 3.1 Site

Criado automaticamente pelo Cloudflare Pages ao adicionar o domínio. Não mexer.

### 3.2 E-mail — SPF, DKIM e DMARC

O contacto publicado no site é **`renovaenergylda@gmail.com`**, um endereço
Gmail comum. Isso muda o que é preciso fazer, por isso escolha o cenário:

#### Cenário A — não se envia e-mail a partir de `@renovaenergylda.co.mz`

**É o cenário atual e é o que está por fazer.** A consulta ao DNS confirmou que
não há MX, SPF nem DMARC. Mesmo sem enviar e-mail a partir do domínio, ele deve
ser **fechado**, para ninguém o poder usar em mensagens fraudulentas em nome da
empresa:

Painel do Cloudflare → o domínio → **DNS** → *Add record*. São quatro, e a
ordem não importa. Deixar o TTL em *Auto* e o *Proxy status* em **DNS only**
(a nuvem cinzenta — estes registos não são tráfego web):

| Tipo | Nome | Conteúdo | Prioridade |
|---|---|---|---|
| TXT | `@` | `v=spf1 -all` | — |
| TXT | `*._domainkey` | `v=DKIM1; p=` | — |
| TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s` | — |
| MX | `@` | `.` | `0` |

O que cada um faz:

- **SPF `v=spf1 -all`** — nenhum servidor no mundo está autorizado a enviar
  e-mail com este domínio no remetente. É a declaração mais forte possível, e é
  verdadeira: a empresa usa Gmail, não o domínio.
- **DKIM `*._domainkey` com `p=` vazio** — o curinga responde por qualquer
  selector que um burlão invente, e a chave vazia significa "esta chave foi
  revogada". Sem isto, um selector inexistente devolve *nada*, que é mais fraco
  do que devolver *revogada*.
- **DMARC `p=reject`** — diz ao servidor que recebe para **rejeitar**, não só
  marcar como spam. O `sp=reject` estende a regra a subdomínios (é por aí que
  as burlas costumam entrar: `facturas.renovaenergylda.co.mz`). O `adkim=s` e o
  `aspf=s` exigem correspondência exacta do domínio, não bastando um subdomínio.
- **MX `.` com prioridade 0** — o "null MX" da RFC 7505. Declara que o domínio
  não recebe e-mail, e faz com que quem tente enviar receba um erro imediato em
  vez de ficar dias a tentar.

> **Sem `rua=`, e é de propósito.** A versão anterior deste documento mandava pôr
> `rua=mailto:renovaenergylda@gmail.com` para receber os relatórios. Estava
> errado: pela RFC 7489 §7.1, mandar relatórios para um domínio diferente exige
> que *esse* domínio autorize, publicando
> `renovaenergylda.co.mz._report._dmarc.gmail.com`. O Google não publica isso
> para domínios de terceiros — confirmado, não existe nem há curinga. O `rua`
> seria ignorado e nunca chegaria relatório nenhum.
>
> Como o domínio não envia e-mail, os relatórios só mostrariam tentativas de
> burla. Se um dia isso interessar, usa-se um serviço gratuito (dmarcian,
> Postmark, URIports) que fornece um endereço já autorizado.

#### Cenário B — passa a haver `geral@renovaenergylda.co.mz` no Google Workspace

| Tipo | Nome | Valor | TTL |
|---|---|---|---|
| MX | `@` | `1 smtp.google.com` | 3600 |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | 3600 |
| TXT | `google._domainkey` | a chave que o Admin console gera (**2048 bits**) | 3600 |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@renovaenergylda.co.mz; pct=100` | 3600 |

Ordem de trabalhos no cenário B:

1. Publicar MX e SPF, e confirmar que o e-mail entra e sai.
2. Admin console → *Apps → Google Workspace → Gmail → Authenticate email* →
   gerar a chave DKIM a 2048 bits, publicar o TXT, **e só depois** carregar em
   *Start authentication*.
3. Deixar o DMARC em `p=none` durante **duas a quatro semanas** e ler os
   relatórios `rua`.
4. Só quando os relatórios mostrarem 100 % de alinhamento é que se passa a
   `p=quarantine` e, mais tarde, a `p=reject`.

> Nunca saltar directamente para `p=reject` no cenário B: se o SPF ou o DKIM
> ainda não estiverem certos, o e-mail legítimo da empresa deixa de ser entregue.

> No cenário B o `rua` já pode ser `dmarc@renovaenergylda.co.mz`, porque o
> endereço é do próprio domínio e dispensa autorização externa. Basta que essa
> caixa exista.

**Como verificar** (só funciona depois de o domínio resolver):

```bash
nslookup -type=TXT renovaenergylda.co.mz
nslookup -type=TXT _dmarc.renovaenergylda.co.mz
nslookup -type=MX renovaenergylda.co.mz
```

Ou, com interface: <https://mxtoolbox.com/SuperTool.aspx>.

---

## 4. Analytics

Está preparado no código mas **desligado**, para não sair um único pedido a
terceiros sem decisão vossa. Ficheiro `js/main.js`, logo no topo:

```js
const ANALYTICS = {
    cloudflareToken: '',
    ga4Id: ''
};
```

### Opção recomendada — Cloudflare Web Analytics

Não usa cookies, não precisa de banner de consentimento, é gratuita e já está no
mesmo painel do alojamento.

1. Cloudflare → *Analytics & Logs* → *Web Analytics* → *Add a site*.
2. Copiar o **token** do snippet.
3. Colar em `cloudflareToken`.

### Opção alternativa — Google Analytics 4

Usa cookies. O código só a carrega **depois de o visitante aceitar o aviso de
cookies** — está ligado ao botão "Entendido".

1. <https://analytics.google.com> → criar propriedade → obter o `G-XXXXXXXXXX`.
2. Colar em `ga4Id`.
3. Se activar o GA4, acrescentar uma linha sobre isso na política de
   privacidade (`js/translations.js`, chave `priv_p6`).

Já existe um evento de conversão: `gerar_lead`, disparado quando o formulário é
submetido, com os parâmetros `method` (`whatsapp` ou `email`) e `servico`. No
GA4, marcar `gerar_lead` como conversão em *Admin → Events*.

---

## 5. Ser encontrado

| Passo | Onde | Notas |
|---|---|---|
| Google Search Console | <https://search.google.com/search-console> | Verificar por registo TXT no DNS. Submeter `https://renovaenergylda.co.mz/sitemap.xml`. |
| Bing Webmaster Tools | <https://www.bing.com/webmasters> | Importa a verificação directamente do Search Console. |
| **Google Business Profile** | <https://business.google.com> | **É o que mais tráfego local traz.** Morada em Nampula, horário, telefone, e as fotografias de obra da pasta `imagens/`. |
| Teste de dados estruturados | <https://search.google.com/test/rich-results> | Deve reconhecer `ElectricalContractor` e `FAQPage`. |
| PageSpeed Insights | <https://pagespeed.web.dev> | Correr para telemóvel, que é como quase toda a gente vai abrir o site. |

Coerência **NAP** (nome, morada, telefone): o Business Profile, o Facebook, o
Instagram e o site têm de ter exactamente a mesma escrita da morada e do
telefone. O Google cruza isto para ranking local.

---

## 6. O que já está feito no código ✅

**Encontrabilidade**

- `<title>` e `meta description` próprios em cada uma das quatro páginas
- `canonical` em todas as páginas indexáveis
- Open Graph e Twitter Card com imagem 1200×630
- Schema.org `ElectricalContractor` + `FAQPage` + `OfferCatalog` (JSON-LD)
- `sitemap.xml` e `robots.txt` com directiva `Sitemap:`
- `lang` do documento actualizado quando se troca de idioma
- 404 personalizada com atalhos, e `noindex, follow`
- `_redirects` com `www` → domínio principal e endereços antigos
- Aliases das secções antigas no `main.js` (`#sobre`, `#galeria`, `#numeros`,
  `#areas`, `#blog`) — links partilhados antes da reorganização continuam a abrir

**Desempenho**

- Fotografias recomprimidas e limitadas a 1600 px
- WebP gerado ao lado de cada JPEG, servido por `<picture>` e `image-set()`
- 7,89 MB → **1,91 MB** pelo caminho WebP (JPEG de recurso: 3,50 MB, inclui a nova imagem de partilha)
- `width`/`height` em todas as imagens (evita o salto de layout, conta para CLS)
- `preload` com `fetchpriority="high"` na primeira imagem do hero
- Mapa do Google só é pedido quando o visitante abre a secção Contacto
- Imagem de partilha própria em 1200×630 (`imagens/og-cover.jpg`)
- `loading="lazy"` no resto
- FontAwesome removido — eram ~100 KB de CDN para 4 ícones, agora são SVG inline
- CSS de 5538 → 1704 linhas
- `Cache-Control` por tipo de ficheiro no `_headers`

**Segurança**

- CSP sem `'unsafe-inline'` em `script-src` (todos os `onclick` foram
  substituídos por delegação de eventos)
- HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `Cross-Origin-Opener-Policy`
- `rel="noopener noreferrer"` em todos os links externos

**Telemóvel e acessibilidade**

- Sem *overflow* horizontal a 375 px (verificado)
- Menu em ecrã inteiro, CTA fixa em baixo nas secções interiores
- Alvos de toque ≥ 38 px
- `prefers-reduced-motion` respeitado
- `prefers-color-scheme` respeitado à primeira visita
- `:focus-visible` visível em tudo o que é focável
- Mapa das províncias navegável por teclado
- `aria-expanded`, `aria-label` e `role="dialog"` nos componentes interactivos

---

## 7. Antes de cada publicação

1. Se mexeu em `css/style.css` ou em `js/*.js`, **incrementar o `?v=`** nas
   quatro páginas (`?v=2` → `?v=3`). Sem isso, quem já visitou o site continua a
   ver a versão antiga.
2. Abrir em telemóvel real, não só no simulador do navegador.
3. Testar o formulário nos dois botões (WhatsApp e e-mail).
4. Confirmar que o WhatsApp abre com o número certo.
5. Correr o PageSpeed Insights em modo telemóvel.
