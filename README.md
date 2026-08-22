# Renova Energy, Lda

Site institucional da **Renova Energy, Lda** — engenharia e serviços elétricos em
Nampula, Moçambique. Energia solar, instalação de edifícios e material certificado.

**Produção:** [renovaenergylda.co.mz](https://renovaenergylda.co.mz) · **Alojamento:** Cloudflare Pages

> Antes de publicar, ler o **[LANCAMENTO.md](LANCAMENTO.md)** — faltam os
> registos SPF/DKIM/DMARC, o token de analytics e o Search Console.

---

## Estrutura

```text
/
├── index.html            Página única, cinco secções
├── termos.html           Termos de uso
├── privacidade.html      Política de privacidade
├── 404.html              Página de erro
├── css/style.css         Sistema de design completo
├── js/
│   ├── main.js           Navegação, formulário, mapa, tema, idioma, analytics
│   └── translations.js   Todo o texto visível, em PT e EN
├── imagens/              Fotografias (.jpg + .webp) e logótipos de marcas
├── logotipo/             Logótipos e ícones
├── _headers              Segurança e cache (Cloudflare Pages)
├── _redirects            www → domínio principal, endereços antigos
├── site.webmanifest      Ícone e nome ao guardar no ecrã inicial
├── sitemap.xml           Mapa do site
├── robots.txt            Directivas para motores de busca
├── EDITOR.md             Como a equipa altera conteúdos
└── LANCAMENTO.md         DNS, SPF/DKIM/DMARC, analytics, Search Console
```

---

## Sistema de design

A direcção é **registo de obra**: tipografia industrial, réguas de 1 px em vez de
molduras, papel quente em vez de branco clínico, e fotografia documental. Sem
gradientes decorativos, sem vidro, sem sombras flutuantes.

**Cores** — amostradas do próprio ficheiro do logótipo, não escolhidas à parte:

| Token | Valor | Papel |
|---|---|---|
| `--ink` | `#001b48` | Navy da marca. Texto e blocos escuros. |
| `--sun` | `#faa80b` | Marigold da marca. Único acento. |
| `--on-sun` | `#001b48` | Texto sobre o marigold. **Não inverte** no tema escuro. |
| `--paper` | `#f5f2ea` | Fundo. Off-white quente. |

**Tipos de letra** — três famílias, três funções distintas:

- **Archivo** (variável, eixo de largura) — títulos, alargada a 112 %, como sinalética
- **IBM Plex Sans** — texto corrido
- **IBM Plex Mono** — índices de secção, unidades, rótulos, metadados

**Estados** — o tema escuro e o `prefers-reduced-motion` estão implementados a
sério, não como remendo. Todas as cores passam por variáveis: não há um único
valor hexadecimal escrito directamente num componente.

---

## Secções

| Hash | Secção | Conteúdo |
|---|---|---|
| `#home` | Início | Hero, ficha técnica, índice de serviços, método, marcas, chamada |
| `#servicos` | Serviços | Quatro dossiês expansíveis |
| `#projetos` | Projetos | Galeria, números, mapa de cobertura |
| `#empresa` | Empresa | História, missão/visão/valores, perguntas frequentes, notas técnicas |
| `#agendamento` | Contacto | Formulário, contactos, mapa |

Os endereços da versão anterior (`#sobre`, `#galeria`, `#numeros`, `#areas`,
`#blog`, `#contacto`) continuam a funcionar: o `main.js` traduz-os para as novas
secções, para não partir links já partilhados.

---

## Notas técnicas

- **Sem dependências.** HTML, CSS e JavaScript simples. Sem build, sem npm.
- **Sem JavaScript inline.** Todos os `onclick` foram substituídos por atributos
  `data-*` com delegação de eventos — é o que permite ao CSP proibir script
  inline sem partir o site.
- **Imagens em WebP** servidas por `<picture>` e `image-set()`, com JPEG de
  recurso. 7,89 MB → 1,91 MB.
- **Versionamento de assets:** o CSS e o JS são referidos com `?v=N`. Ao alterar
  qualquer um deles, incrementar o número nas quatro páginas.

### Ver localmente

```bash
python -m http.server 4173
```

Depois abrir <http://localhost:4173>.

---

## Créditos

Desenvolvido por **Silvio Johones**.
