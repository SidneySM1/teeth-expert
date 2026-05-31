# Teeth Expert

Sistema de gestão para clínica odontológica.

> **Status:** frontend em desenvolvimento (mock em `localStorage`). Backend em .NET planejado.

## Estrutura

```
teeth-expert/
├── frontend/   # React + TypeScript + Vite
└── backend/    # .NET (futuro)
```

## Funcionalidades (frontend)

- **Agenda / Calendário** full-screen com visões de Mês, Semana e Dia (responsivo).
- **Agendamento de consultas** com cadastro rápido de paciente e múltiplos procedimentos.
- **Slideout de atendimento**: anamnese, **odontograma interativo** (condição, faces e
  procedimento por dente) e evolução clínica.
- **Cadastro de procedimentos** com categoria, duração, preço e cor.
- Persistência mocada no navegador (`localStorage`) — pronta para integrar com a API.

## Stack

React 18 · TypeScript · Vite · framer-motion · Radix UI · date-fns · lucide-react

## Rodando o frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## Scripts

| Comando             | Descrição                          |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento (HMR)  |
| `npm run build`     | Type-check + build de produção     |
| `npm run preview`   | Pré-visualiza o build              |
| `npm run typecheck` | Apenas a verificação de tipos      |
