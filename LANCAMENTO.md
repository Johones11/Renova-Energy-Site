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

> Esta secção é o **arranque**, para fazer uma vez. O acompanhamento contínuo
> — erros do Search Console, palavras-chave reais, PageSpeed — está na
> secção 8.

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

---

## 8. Depois de publicar

### 8.1 Saber que o site caiu antes do cliente saber

O Cloudflare não avisa se a página começar a dar erro — só garante que serve o
que lá está. É preciso um vigia de fora.

**UptimeRobot** (gratuito, chega bem):

1. Conta em <https://uptimerobot.com> → *Add New Monitor*.
2. Tipo **HTTP(s)**, URL `https://renovaenergylda.co.mz`, intervalo **5 min**.
3. Em *Alert Contacts*, pôr **dois**: o e-mail e o telemóvel por app. Se o aviso
   for só para o e-mail e o e-mail estiver no telemóvel que está sem dados, não
   serve de nada.
4. Criar um segundo monitor com **Keyword** para `Renova Energy` na página.
   Só o HTTP 200 não chega: o Cloudflare pode devolver 200 com a página em
   branco se o *build* falhar a meio, e um monitor de estado não dá por isso.

Vale a pena vigiar também o **certificado SSL** — o UptimeRobot avisa 30 dias
antes de expirar. Não devia acontecer (o Cloudflare renova sozinho), mas se o
domínio deixar de apontar para os nameservers dele, a renovação pára em
silêncio e só se descobre quando o browser mostra o aviso vermelho.

### 8.2 Erros de JavaScript em telemóveis que não temos

O site é JavaScript simples, sem framework, mas basta um telemóvel antigo com
um browser que não conhece uma função para a navegação deixar de funcionar — e
o visitante sai sem dizer nada.

**Sentry** tem um plano gratuito com 5 000 erros por mês, que é muito mais do
que este site alguma vez vai gerar:

1. Conta em <https://sentry.io> → projeto **Browser JavaScript**.
2. Copiar o `DSN` e juntar ao `<head>` do `index.html`, **antes** do `main.js`.
3. O `_headers` tem uma CSP restritiva: é preciso acrescentar o domínio do
   Sentry a `script-src` e a `connect-src`, senão o browser bloqueia-o e nunca
   se recebe erro nenhum. **É o engano mais comum.**

Configurar `tracesSampleRate: 0` — só interessam os erros, não o desempenho, e
assim não se gasta a quota.

Se parecer excessivo para este site, a alternativa mínima é ver a coluna de
erros do Cloudflare Web Analytics de vez em quando. Não dá o detalhe, mas
mostra se há um pico.

### 8.3 Search Console

É onde se vê o que o Google percebeu do site. Sem isto anda-se às cegas.

Se ainda não estiver criado, ver a secção 5. Depois de criado:

1. Confirmar que a propriedade é **Prefixo do URL**
   `https://renovaenergylda.co.mz` (não a versão `www`).
2. Verificação: escolher **registo DNS TXT** e criá-lo no Cloudflare. É o método
   que sobrevive a mudanças no site — a verificação por ficheiro HTML perde-se
   se alguém apagar o ficheiro.
3. *Sitemaps* → submeter `sitemap.xml`.
4. *Inspeção de URL* na página inicial → **Pedir indexação**. Sem isto pode
   demorar semanas até à primeira visita do robô.

### 8.4 Os erros que vão aparecer no Search Console

Nas primeiras semanas aparecem quase sempre estes, e a maior parte **não é
problema**:

| O que diz | Significa | Fazer |
|---|---|---|
| *Descoberta — não indexada* | O Google viu mas ainda não visitou | Esperar. É normal num site novo |
| *Rastreada — não indexada* | Visitou e decidiu não indexar | Se for a página inicial, é sinal de conteúdo fraco. Nas legais, é normal |
| *Página alternativa com tag canónica adequada* | Está a fazer o que deve | Nada |
| *Erro de redirecionamento* | **Isto é a sério** | Ver 8.5 |
| *Bloqueada pelo robots.txt* | Só se for uma página que devia ser indexada | Verificar o `robots.txt` |

O site é uma página só com secções por `#hash`. O Google **não indexa hashes
como páginas separadas** — vai indexar `/` e mais nada, além das legais. Isso é
esperado e não é erro. Se um dia interessar ter `/servicos` como página própria
a aparecer na pesquisa, é preciso separar em ficheiros HTML verdadeiros.

### 8.5 Erros de redirecionamento — o que já nos mordeu

Já aconteceu neste site: uma regra no `_redirects` a mandar `/termos` para
`/termos.html` enquanto o Cloudflare mandava `/termos.html` para `/termos`.
Ciclo infinito, páginas inacessíveis, e o Search Console teria reportado
*Erro de redirecionamento*.

Depois de qualquer alteração ao `_redirects`, confirmar:

```bash
curl -s -o /dev/null -w '%{num_redirects} saltos -> %{http_code}\n' -L https://renovaenergylda.co.mz/termos
```

Zero ou um salto e `200`. Se aparecerem 5 ou mais saltos, há um ciclo.

### 8.6 Palavras-chave

O site está escrito para quem procura em português de Moçambique. As
expressões que interessam não são as bonitas, são as que as pessoas escrevem:

| O que se escreve mesmo | Onde já aparece |
|---|---|
| painéis solares Nampula | `<title>`, meta description, texto |
| instalação de painéis solares Moçambique | descrição, serviços |
| energia solar Nampula preço | **não aparece** — ver abaixo |
| eletricista Nampula | serviços, mas fraco |
| material elétrico Nampula | serviço 03 |
| sistema solar off-grid Moçambique | serviço 02, notas técnicas |

Duas coisas a considerar, ambas decisão do negócio:

- **"preço" e "quanto custa"** são das pesquisas mais comuns e o site não lhes
  responde. Nem que seja uma faixa ("um sistema residencial começa em X"), é o
  que mais traz gente qualificada. Se não se quiser publicar valores, uma nota
  do género "o orçamento é gratuito e sai em 24 h" já apanha parte dessas
  pesquisas.
- **Google Business Profile** vale mais do que qualquer palavra-chave para uma
  empresa local. Quem procura "energia solar perto de mim" em Nampula vê o mapa
  antes dos resultados normais. É gratuito, e a verificação demora semanas —
  convém começar cedo.

Passadas 4 a 6 semanas, o Search Console → *Desempenho* mostra as expressões
reais pelas quais as pessoas chegaram. Vale mais do que qualquer suposição
feita agora, esta incluída.

### 8.7 Abrir no 4G — medido, não estimado

Medido em produção a 23/08/2026, já comprimido pelo Cloudflare:

| Recurso | Transferido |
|---|---|
| HTML | 14 KB (brotli) |
| CSS | 13 KB |
| JS (traduções + principal) | 23 KB |
| Logótipo do cabeçalho | 20 KB |
| Logótipo do rodapé | 18 KB |
| Primeira fotografia do hero (WebP) | 58 KB |
| **Total do primeiro ecrã** | **146 KB** |

Tempo só de transferência:

| Ligação | Tempo |
|---|---|
| 4G bom (5 Mbps) | 0,2 s |
| 4G típico (1,5 Mbps) | 0,8 s |
| 4G fraco, rede cheia (500 kbps) | 2,3 s |
| 3G (200 kbps) | 5,8 s |

As fontes (~150 KB) vêm **por cima disto, mas não bloqueiam**: o
`display=swap` faz o texto aparecer logo com a fonte do sistema e trocar
depois. Por isso a página fica legível nos tempos acima, mesmo que as fontes
ainda venham a caminho.

**Duas coisas que sobram, ambas verificadas:**

- Os **dois logótipos carregam sempre** — o claro e o escuro, 38 KB, dos quais
  metade está sempre invisível. São 26 % do primeiro ecrã. O browser transfere
  imagens com `display: none`. Resolve-se, mas exige mexer no formato do
  logótipo (hoje é um SVG a embrulhar um WebP em base64, e é por isso que pesa
  20 KB em vez de 2).
- Tentei **apertar os eixos** do Archivo (`wdth@100..125` em vez de `62..125`)
  para reduzir os 90 KB da fonte. **Não funciona**: o Google Fonts serve o mesmo
  ficheiro binário seja qual for o intervalo pedido — o intervalo só muda o CSS.
  Medido, 90 104 bytes nos dois casos. A única forma real de cortar aqui é
  alojar a fonte e criar um subconjunto, o que traz um passo de compilação que
  este site hoje não tem.

### 8.8 PageSpeed

<https://pagespeed.web.dev> → colar o URL. **Ver sempre o separador *Telemóvel***
— o de computador dá sempre bom e não diz nada sobre quem visita o site.

O que importa nos números:

- **LCP** (aparecer o conteúdo principal): abaixo de 2,5 s. É a primeira
  fotografia do hero, e é por isso que tem `preload` no `<head>`.
- **CLS** (o texto saltar durante o carregamento): abaixo de 0,1. Todas as
  imagens têm `width`/`height` para isto não acontecer.
- **INP** (resposta ao toque): abaixo de 200 ms.

Os dados do PageSpeed são de laboratório, com uma ligação simulada. Os **dados
reais** só aparecem se o site tiver visitas suficientes, e demoram 28 dias a
acumular. Nas primeiras semanas só há laboratório.

Se o resultado descer de repente depois de uma alteração, comparar com a
publicação anterior antes de mexer em mais alguma coisa.

### 8.9 Renovações

Estão na secção 1 deste documento. O que mais custa a apanhar:

- O **domínio** é o único que, se falhar, deita o site inteiro abaixo — e em
  `.mz` a recuperação depois de expirar não é imediata nem barata.
- Pôr o aviso no calendário **30 dias antes**, e num calendário que mais do que
  uma pessoa veja.

### 8.10 Atualizações

O site não tem dependências, `node_modules` nem passo de compilação, portanto
não há nada que fique desatualizado por si. O que precisa de revisão periódica
é o **conteúdo**:

| Quando | O quê |
|---|---|
| Cada instalação nova | `TOTAL_INSTALACOES` no `main.js` (ver EDITOR.md, secção 2) |
| Trimestral | Fotografias da galeria — as de obra recente valem mais que as antigas |
| Trimestral | Search Console → *Desempenho*: que expressões trazem gente |
| Semestral | Preços e prazos no texto, para não prometer o que já não se cumpre |
| Anual | Horário, morada, contactos, e o ano no rodapé |

Antes de cada publicação, a lista da secção 7.

Há dois ficheiros de verificação no repositório:

```bash
python verificar-dns.py
```

Confirma SPF, DKIM, DMARC e MX nulo. Devolve código 1 enquanto faltar algum,
portanto também serve para automatizar.
