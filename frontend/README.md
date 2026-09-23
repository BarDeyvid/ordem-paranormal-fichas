# Ordem Paranormal — Frontend

Interface web para criação e gerenciamento de fichas de personagens de **Ordem Paranormal RPG**. Construída com **React 19**, **TypeScript**, **Vite** e **Tailwind CSS**.

## Funcionalidades

- **Criação de Ficha Passo-a-Passo**: Seleção de Atributos, Origens, Classe e Painel de Ficha completo.
- **Progressão NEX**: Acompanhamento automático de habilidades destravadas a cada 5% de NEX.
- **Rituais e Grimório**: Grimório de rituais com cálculo de PE por turno, aprimoramentos e símbolos.
- **Inventário Interativo**: Equipamento de armas, munições acopladas, proteções, modificações e itens amaldiçoados com drag-and-drop.
- **Regras Automáticas**: Aplicação automática de dezenas de regras e bônus de perícias, defesa e atributos.
- **Conexão com Backend FastAPI**: Comunicação direta com a API local para carregar todo o compêndio de regras de forma rápida e offline.
- **Digital Battlemat**: Suporte integrado para enviar status de PV/SAN/PE e rituais para miniaturas físicas (Unreal Engine).

## Como Executar

### 1. Localmente com Node.js

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Certifique-se de que o backend FastAPI esteja rodando na porta `8000`.

3. Inicie o servidor Vite:
   ```bash
   npm run dev
   ```

4. Acesse: [http://localhost:5173](http://localhost:5173)

### 2. Com Docker

```bash
docker build -t ordem-frontend .
docker run -p 3000:80 ordem-frontend
```

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Compila o TypeScript e gera o build de produção no diretório `dist/` |
| `npm run preview` | Pré-visualiza localmente o build de produção |
| `npm run lint` | Executa o linter ESLint |
