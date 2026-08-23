# Guia do editor — Renova Energy, Lda

Como alterar os conteúdos do site sem precisar de programador.

---

## ⚠️ Leia isto primeiro

O site é bilingue (português e inglês). Por causa disso, **quase todo o texto
visível está em `js/translations.js`, não no `index.html`**.

O `index.html` tem o texto escrito, sim — mas serve só para o site não aparecer
vazio enquanto carrega. Assim que o site abre, o JavaScript vai buscar o texto ao
`translations.js` e substitui o que estava no HTML.

Repare nesta linha do `index.html`:

```html
<h2 data-i18n="srv_title">O que fazemos, ao detalhe.</h2>
```

O `data-i18n="srv_title"` é uma **etiqueta**. Ela diz: "vai buscar o texto
`srv_title` ao dicionário". Se mudar só o `index.html`, a alteração desaparece
mal a página acabe de carregar.

> **Regra:** se o elemento tem `data-i18n="alguma_coisa"`, edite o
> `js/translations.js`. Se não tem, edite o `index.html`.

---

## 1. Mudar um texto

1. Abrir `index.html` num editor (VS Code, Notepad++).
2. `Ctrl + F` e procurar o texto actual.
3. Ver se a etiqueta à volta tem `data-i18n="..."`. Anotar o nome (ex.: `srv_title`).
4. Abrir `js/translations.js` e procurar esse nome. Vai encontrá-lo **duas vezes**:
   - dentro de `pt: {` → versão portuguesa
   - dentro de `en: {` → versão inglesa
5. Alterar as duas. Manter as aspas e a vírgula no fim da linha.
6. Alterar também no `index.html`, para o texto de arranque ficar igual.

```js
"srv_title": "O que fazemos, ao detalhe.",
                ^                        ^ ^
                |                        | └── a vírgula tem de ficar
                └── só se mexe aqui dentro ──┘
```

**Se o site ficar em branco depois de editar:** foi uma aspa ou uma vírgula. Abra
o site, carregue em `F12` → separador *Console* e leia a linha do erro — ela diz
o número da linha do problema.

---

## 2. Mudar os números das estatísticas

### Instalações concluídas

Este aparece em dois sítios da página (início e *Projetos*), mas **muda-se
num só**. No `js/main.js`, perto do início:

```js
const TOTAL_INSTALACOES = 45;
```

Mudar o `45` e mais nada. Os dois contadores actualizam-se sozinhos.

> Porquê assim: antes o número estava escrito à mão em cada sítio, e o mapa
> ainda somava outro valor por província. O site chegou a dizer 45 no topo
> enquanto o mapa somava 140. Com um valor só, deixa de poder acontecer.

### Os outros números

Ficam no `index.html`, dentro de `<div class="spec">`:

```html
<span class="stat-number" data-target="60">0</span>
```

Mudar o `data-target`. A animação de contagem trata-se sozinha. O rótulo por
baixo tem `data-i18n`, portanto muda-se no `translations.js`.

### O mapa das províncias

No `js/main.js`, em `mapDetails`, cada província tem um rótulo curto (`area`) e
uma descrição (`details`). **Não pôr contagens de projetos aqui** — se um dia
houver números reais por província, é preciso que somem ao `TOTAL_INSTALACOES`,
senão a página volta a contradizer-se.

---

## 3. Mudar o número de WhatsApp

O número `258841151961` aparece em **dois ficheiros**. É preciso mudar nos dois:

- `index.html` — nos links `wa.me/...`, no `tel:` do rodapé e no `telephone` do
  bloco Schema.org (dentro do `<script type="application/ld+json">`)
- `js/main.js` — na função `handleFormSubmit`

Usar sempre `Ctrl + H` (substituir tudo) para não escapar nenhum.

---

## 4. Trocar ou acrescentar fotografias

As fotografias existem em **dois formatos**: `.jpg` e `.webp`. O `.webp` é muito
mais leve e é o que quase todos os visitantes recebem.

Depois de pôr uma foto nova em `imagens/`, é preciso gerar o `.webp`:

- Sem instalar nada: <https://squoosh.app> → arrastar a foto → escolher *WebP*,
  qualidade 76 → *Download*. Guardar com **o mesmo nome**, só a mudar `.jpg`
  para `.webp`.
- A foto não deve passar de **1600 px** no lado maior.

No `index.html`, a galeria fica assim:

```html
<picture>
  <source srcset="imagens/nova-foto.webp" type="image/webp">
  <img src="imagens/nova-foto.jpg" width="1168" height="880"
       alt="Descrição do que se vê na foto" class="g-img" loading="lazy">
</picture>
```

Três coisas a não esquecer:

- **`alt`** — descrever o que se vê. É o que os cegos ouvem e o que o Google lê.
  "Montagem de painéis em telhado de armazém" e não "foto1".
- **`width` e `height`** — as dimensões reais da imagem em píxeis. Evitam que a
  página salte enquanto carrega.
- A legenda que aparece ao passar o rato está no `<div class="g-overlay">` e tem
  `data-i18n`, portanto muda-se no `translations.js`.

---

## 5. Acrescentar uma pergunta às Frequentes

Duas coisas, sempre juntas:

1. No `index.html`, secção `#empresa`, copiar um bloco `<div class="accordion-item">`
   inteiro e colar a seguir ao último. Dar chaves novas: `faq_q6` e `faq_a6`.
2. Acrescentar `faq_q6` e `faq_a6` ao `translations.js`, em `pt` **e** em `en`.
3. Acrescentar também ao bloco `FAQPage` do Schema.org, no `<head>` do
   `index.html` — é o que faz a pergunta poder aparecer directamente no Google.

---

## 6. Depois de guardar

1. **Se mexeu em `css/style.css` ou em `js/*.js`**, abrir as quatro páginas
   (`index.html`, `404.html`, `termos.html`, `privacidade.html`) e trocar
   `?v=2` por `?v=3` (e da próxima vez `?v=4`, etc.).
   Sem isto, quem já visitou o site continua a ver a versão antiga.
2. Publicar (`git push`, ou o método habitual). O Cloudflare Pages actualiza
   sozinho em cerca de um minuto.
3. Abrir o site no telemóvel e confirmar.

---

## 7. Segurança

> **Antes de mexer, guardar uma cópia.** Toda a versão anterior está no histórico
> do Git — se algo correr mal, `git checkout -- nome-do-ficheiro` repõe o
> ficheiro como estava.

Não é preciso mexer em `css/style.css`, `_headers` nem `_redirects` para gerir
conteúdos. Se precisar de mudar cores ou tipos de letra, fale com quem
desenvolveu — está tudo em variáveis no topo do `style.css`.
