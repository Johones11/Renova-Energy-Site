# 📘 Guia do Editor: Renova Energy Lda

Este guia foi criado para que a equipa da **Renova Energy** tenha total autonomia para gerir os conteúdos do website sem depender de programadores para alterações simples.

---

## 🛠️ Como Editar o Site

O site é uma **SPA (Single Page Application)** composta por três ficheiros principais:
1. `index.html`: Toda a estrutura de texto e imagens.
2. `css/style.css`: O design (cores, fontes, animações).
3. `js/main.js`: A lógica (mapas, formulários, tema escuro).

### 1. Alterar Textos (index.html)
Para alterar qualquer texto (como preços, descrição de serviços ou o "Sobre Nós"):
- Abra o ficheiro `index.html` num editor de texto (Notepad++, VS Code, etc.).
- Use o atalho `Ctrl + F` para procurar o texto que deseja mudar.
- Substitua o texto entre as etiquetas (ex: `<h3>Texto Antigo</h3>` para `<h3>Texto Novo</h3>`).
- Guarde o ficheiro.

### 2. Atualizar Números (Estatísticas)
As estatísticas que contam de 0 até ao valor final (ex: +50 Projetos) são fáceis de mudar:
- Procure por `data-target="50"` no `index.html`.
- Mude o número `"50"` para o novo valor. O site tratará da animação automaticamente.

### 3. Mudar o Número do WhatsApp
Para mudar para onde as mensagens são enviadas:
- Abra o ficheiro `js/main.js`.
- Procure por `wa.me/258841151961`.
- Substitua o número `258841151961` pelo novo número (incluindo o código do país `258`).

### 4. Gestão da Galeria de Imagens
Para adicionar ou mudar fotos na galeria:
- Coloque a nova imagem na pasta `imagens/`.
- No `index.html`, procure a secção `<section id="galeria">`.
- Mude o caminho `src="imagens/foto-antiga.jpg"` para `src="imagens/nova-foto.jpg"`.

---

## 🚀 Recomendações Profissionais

> [!IMPORTANT]
> **Backup Antes de Tudo:** Antes de fazer qualquer alteração manual no código, faça uma cópia de segurança (Backup) dos ficheiros originais. Se algo correr mal, basta restaurar a cópia.

> [!TIP]
> **Otimização de Imagens:** Para manter o site rápido, use imagens no formato `.webp` ou `.jpg` comprimidas (abaixo de 500KB sempre que possível).

---

**Suporte:** Este site foi construído para ser robusto e duradouro. Seguindo estas instruções, a Renova Energy manterá a sua presença digital sempre atualizada e potente! ☀️🔌🏆
