# O Mago das Vocações

Jogo web interativo sobre orientação vocacional do IFPA Campus Bragança.

## Sobre o projeto

O Mago das Vocações é uma experiência de escolha de curso inspirada em um ritual mágico: o jogador arrasta palavras-essência para o caldeirão, combina afinidades e descobre qual curso do campus combina melhor com seu perfil.

## Como executar localmente

```bash
npm install
npm run dev
```

A aplicação fica disponível em:

```text
http://localhost:8080
```

## Ajustar palavras por curso

O painel de edição fica em [https://osnisanches.github.io/magodoif/equipe/](https://osnisanches.github.io/magodoif/equipe/). Ali é possível cadastrar palavras, criar, ocultar, exibir e remover cursos. Os ajustes ficam salvos apenas no navegador atual; use **Exportar** e **Importar** para transferi-los entre navegadores.

O endereço separado evita acesso acidental pelo jogo, mas não é uma barreira de segurança: o GitHub Pages publica arquivos estáticos e não consegue restringir quem edita os dados locais.

## Como fazer deploy no GitHub Pages

```bash
npm run deploy
```

O projeto já está configurado para publicar a build estática em GitHub Pages.

## Tecnologias

- React
- Vite
- TypeScript
- Tailwind CSS
- TanStack Router

## Repositório

- GitHub: https://github.com/osnisanches/magodoif
- GitHub Pages: https://osnisanches.github.io/magodoif/

## Observação

Este projeto foi preparado para ser publicado como site estático. A versão desktop com Tauri também existe no código, mas a distribuição web é a opção principal para GitHub Pages.
