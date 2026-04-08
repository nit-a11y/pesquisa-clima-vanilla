---
description: Workflow de Deploy - Local → GitHub → VPS
---

# 🚀 Workflow: Atualização do Sistema Pesquisa de Clima

## Visão Geral
```
[LOCAL] → [GIT PUSH] → [GITHUB] → [VPS PULL] → [PM2 RESTART]
   ↑                                                              ↓
Desenvolvimento                                           Produção Online
```

## Passo 1: Commit e Push para GitHub (Local)

```bash
# 1. Verificar status
git status

# 2. Adicionar todas as alterações
git add .

# 3. Criar commit descritivo
git commit -m "feat: trava botão próximo, confete, filtro pilar, tratamento perguntas invertidas"

# 4. Push para GitHub
git push origin main
```

## Passo 2: Deploy na VPS (Servidor)

### Opção A: Comando Completo
```bash
ssh root@147.93.10.11 "cd /var/www/sistemas/pesquisa-clima && git pull && pm2 restart pesquisa-clima"
```

### Opção B: Passo a Passo
```bash
# 1. Conectar na VPS
ssh root@147.93.10.11

# 2. Navegar até o projeto
cd /var/www/sistemas/pesquisa-clima

# 3. Puxar alterações do GitHub
git pull

# 4. Reiniciar com PM2
pm2 restart pesquisa-clima

# 5. Verificar status
pm2 status
pm2 logs pesquisa-clima --lines 20
```

## ⚡ Alias Rápido (VPS)

Criar alias no `~/.bashrc` da VPS:
```bash
echo "alias deploy-pesquisa='cd /var/www/sistemas/pesquisa-clima && git pull && pm2 restart pesquisa-clima'" >> ~/.bashrc
source ~/.bashrc
```

Depois é só usar: `deploy-pesquisa`

## 📋 Checklist de Deploy

- [ ] Código testado localmente
- [ ] Commit criado com mensagem descritiva
- [ ] Push enviado para GitHub
- [ ] Alterações puxadas na VPS (`git pull`)
- [ ] PM2 reiniciado
- [ ] Sistema acessível online
- [ ] Logs verificados (sem erros)

## 🔄 Rollback (Se necessário)

```bash
# Ver histórico
git log --oneline -5

# Voltar para commit anterior
git reset --hard HEAD~1

# Reiniciar
pm2 restart pesquisa-clima
```

## 📍 URLs Importantes

| Ambiente | URL |
|----------|-----|
| **Produção** | https://pesquisadeclima.nordesteloc.cloud |
| **GitHub** | https://github.com/nit-a11y/pesquisa-clima-vanilla |
| **VPS IP** | 147.93.10.11 |

// turbo
1. Verificar alterações pendentes: `git status`
2. Criar commit: `git commit -am "descricao"`
3. Push para GitHub: `git push origin main`
4. Deploy na VPS: `ssh root@147.93.10.11 "cd /var/www/sistemas/pesquisa-clima && git pull && pm2 restart pesquisa-clima"`
