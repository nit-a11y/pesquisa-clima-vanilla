# Configuração GitHub - Pesquisa de Clima Organizacional

## Overview
Configuração completa do repositório GitHub, fluxo de trabalho e automações para o projeto de pesquisa de clima organizacional.

## Repositório

### Informações Básicas
- **Nome**: `pesquisa-declima-nitai`
- **Descrição**: Sistema completo de pesquisa de clima organizacional com IA inteligente
- **Linguagem**: JavaScript (Node.js + Vanilla JS)
- **Licença**: MIT
- **Branch Principal**: `main`
- **Branch de Desenvolvimento**: `develop`

### Estrutura do Repositório
```
pesquisa-declima-nitai/
|-- .github/
|   |-- workflows/
|   |   |-- deploy.yml
|   |   |-- test.yml
|   |-- ISSUE_TEMPLATE/
|   |-- PULL_REQUEST_TEMPLATE.md
|-- .gitignore
|-- README.md
|-- package.json
|-- server.js
|-- ecosystem.config.js
|-- backend/
|-- frontend/
|-- shared/
|-- docs/
```

## Configuração Inicial

### 1. Criar Repositório
```bash
# Inicializar repositório local
git init
git add .
git commit -m "feat: initial commit - sistema de pesquisa de clima"

# Adicionar remote
git remote add origin https://github.com/SEU_USER/pesquisa-declima-nitai.git

# Push inicial
git push -u origin main
```

### 2. Configurar .gitignore
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.db
*.sqlite
*.sqlite3
database/
backups/

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# PM2
.pm2/

# Backup files
*.backup
*.bak
*_backup_*
```

## Fluxo de Trabalho Git

### Branch Strategy
```bash
# Branch principal (produção)
main

# Branch de desenvolvimento
develop

# Branches de feature
feature/nome-da-funcionalidade

# Branches de hotfix
hotfix/correcao-urgente

# Branches de release
release/v1.0.0
```

### Workflow Padrão

#### 1. Nova Funcionalidade
```bash
# Criar branch de feature
git checkout develop
git pull origin develop
git checkout -b feature/chat-ia-inteligente

# Desenvolver e fazer commits
git add .
git commit -m "feat: implementar chat IA com contexto completo"

# Push para branch remoto
git push origin feature/chat-ia-inteligente

# Criar Pull Request
# Via GitHub UI: develop <- feature/chat-ia-inteligente
```

#### 2. Correção de Bug
```bash
# Criar branch de hotfix
git checkout main
git pull origin main
git checkout -b hotfix/corrigir-erro-500

# Corrigir e commitar
git add .
git commit -m "fix: corrigir erro 500 na inicialização do contexto"

# Push e PR
git push origin hotfix/corrigir-erro-500
# PR: main <- hotfix/corrigir-erro-500
```

#### 3. Release
```bash
# Criar branch de release
git checkout develop
git pull origin develop
git checkout -b release/v2.0.0

# Preparar release (version bump, changelog)
git add .
git commit -m "chore: preparar release v2.0.0"

# Merge para main e develop
git checkout main
git merge --no-ff release/v2.0.0
git tag -a v2.0.0 -m "Release version 2.0.0"

git checkout develop
git merge --no-ff release/v2.0.0

# Push
git push origin main --tags
git push origin develop

# Deletar branch
git branch -d release/v2.0.0
git push origin --delete release/v2.0.0
```

## GitHub Actions

### 1. Deploy Automatizado
```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /home/deploy/pesquisadeclima-nitai
          git pull origin main
          npm install --production
          pm2 restart pesquisa-clima
          pm2 status
```

### 2. CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

### 3. Security Scan
```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1' # Segunda-feira às 2h

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run security audit
      run: npm audit --audit-level high
    
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## Templates

### 1. Pull Request Template
```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
## Descrição
Breve descriição das mudanças implementadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testes
- [ ] Unit tests executados
- [ ] Integration tests executados
- [ ] Manual testing realizado

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Self-review realizado
- [ ] Documentação atualizada
- [ ] Tests passam
- [ ] Sem conflitos de merge

## Screenshots (se aplicável)
Adicionar screenshots para mudanças visuais.

## Issues Relacionados
Fixes #(issue_number)
Closes #(issue_number)
```

### 2. Issue Templates
```markdown
<!-- .github/ISSUE_TEMPLATE/bug_report.md -->
---
name: Bug Report
about: Criar um relatório de bug
title: '[BUG] '
labels: bug
assignees: ''
---

## Descrição do Bug
Descrição clara e concisa do bug.

## Passos para Reproduzir
1. Ir para '...'
2. Clicar em '....'
3. Scroll para '....'
4. Ver erro

## Comportamento Esperado
Descrição clara do que esperava acontecer.

## Screenshots
Adicionar screenshots para ajudar a explicar o problema.

## Ambiente
- SO: [ex: Ubuntu 22.04]
- Navegador: [ex: Chrome, Firefox]
- Versão: [ex: v2.0.0]

## Contexto Adicional
Adicionar qualquer contexto adicional sobre o problema.
```

```markdown
<!-- .github/ISSUE_TEMPLATE/feature_request.md -->
---
name: Feature Request
about: Sugerir uma nova funcionalidade
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Descrição da Funcionalidade
Descrição clara e concisa da funcionalidade desejada.

## Problema que Resolve
Qual problema esta funcionalidade resolve?

## Solução Proposta
Descrição detalhada da solução proposta.

## Alternativas Consideradas
Quais alternativas foram consideradas?

## Contexto Adicional
Adicionar qualquer contexto adicional sobre a funcionalidade.
```

## Secrets e Configurações

### 1. GitHub Secrets
```bash
# Configurar secrets no repositório
# Settings > Secrets and variables > Actions > New repository secret

# Secrets necessários:
HOST=IP_DO_SERVIDOR
USERNAME=deploy
SSH_KEY=CHAVE_SSH_PRIVADA
SNYK_TOKEN=TOKEN_SNYK
CODECOV_TOKEN=TOKEN_CODECOV
```

### 2. SSH Key Setup
```bash
# Gerar chave SSH no servidor
ssh-keygen -t rsa -b 4096 -C "deploy@pesquisa-clima"

# Adicionar chave ao GitHub
cat ~/.ssh/id_rsa.pub
# Copiar e colar em: GitHub > Settings > SSH and GPG keys > New SSH key

# Testar conexão
ssh -T git@github.com
```

## Scripts Úteis

### 1. Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Rodar linting
npm run lint

# Rodar tests
npm test

# Verificar se há arquivos grandes
if git ls-files | xargs ls -la | awk '$5 > 10485760 {print $9}'; then
  echo "Arquivos grandes detectados. Por favor, remova ou adicione ao .gitignore"
  exit 1
fi
```

### 2. Script de Release
```bash
#!/bin/bash
# scripts/release.sh

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Uso: ./scripts/release.sh v1.0.0"
  exit 1
fi

# Atualizar versão no package.json
npm version $VERSION --no-git-tag-version

# Fazer commit
git add package.json
git commit -m "chore: bump version to $VERSION"

# Criar tag
git tag -a $VERSION -m "Release $VERSION"

# Push
git push origin main --tags

echo "Release $VERSION criado com sucesso!"
```

### 3. Script de Backup do Repositório
```bash
#!/bin/bash
# scripts/backup-repo.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"

# Clonar repositório completo
git clone --mirror https://github.com/SEU_USER/pesquisa-declima-nitai.git $BACKUP_DIR/repo_$DATE.git

# Compactar
tar -czf $BACKUP_DIR/repo_$DATE.tar.gz $BACKUP_DIR/repo_$DATE.git

# Limpar
rm -rf $BACKUP_DIR/repo_$DATE.git

echo "Backup do repositório concluído: repo_$DATE.tar.gz"
```

## Boas Práticas

### 1. Commits
- Usar [Conventional Commits](https://www.conventionalcommits.org/)
- Mensagens curtas e descritivas
- Commits atômicos (uma mudança por commit)

```bash
# Formato: <tipo>(<escopo>): <descrição>
feat: adicionar chat IA com contexto completo
fix: corrigir erro 500 na inicialização
docs: atualizar README com novas instruções
style: corrigir formatação do CSS
refactor: otimizar função de cálculo de estatísticas
test: adicionar testes para API de clima
chore: atualizar dependências
```

### 2. Branches
- Branches curtos e focados
- Nomes descritivos
- Deletar branches após merge

### 3. Pull Requests
- Descrição clara das mudanças
- Link para issues relacionadas
- Revisão obrigatória antes do merge
- CI/CD deve passar

### 4. Releases
- Semantic Versioning (SemVer)
- Changelog atualizado
- Tags anotadas
- Release notes detalhados

## Troubleshooting

### Erro: "Permission denied (publickey)"
```bash
# Verificar chave SSH
ssh -T git@github.com

# Gerar nova chave
ssh-keygen -t ed25519 -C "seu_email@example.com"

# Adicionar ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Erro: "remote: Invalid username or password"
```bash
# Verificar configuração do remote
git remote -v

# Atualizar remote com token
git remote set-url origin https://SEU_TOKEN@github.com/SEU_USER/repo.git
```

### Erro: "Merge conflict"
```bash
# Verificar conflitos
git status

# Resolver conflitos manualmente
# Editar arquivos marcados com <<<<<<< >>>>>> ======

# Adicionar arquivos resolvidos
git add .

# Continuar merge
git commit
```

## Ferramentas Integradas

### 1. Code Quality
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Husky**: Git hooks
- **lint-staged**: Lint em arquivos staged

### 2. Testing
- **Jest**: Framework de testes
- **Cypress**: E2E tests
- **Codecov**: Coverage reports

### 3. Security
- **Snyk**: Vulnerability scanning
- **Dependabot**: Automated dependency updates
- **CodeQL**: Static analysis

### 4. Documentation
- **GitHub Pages**: Documentação estática
- **MkDocs**: Documentação técnica
- **Swagger**: API documentation

## Monitoramento e Métricas

### 1. GitHub Insights
- Traffic analytics
- Contribution graphs
- Fork and watchers
- Issue and PR metrics

### 2. CI/CD Metrics
- Build time
- Success rate
- Test coverage
- Deployment frequency

### 3. Code Quality Metrics
- Technical debt
- Code complexity
- Test coverage
- Security vulnerabilities

---

## Links Úteis

- [GitHub Docs](https://docs.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://github.com/features/actions)
- [Semantic Versioning](https://semver.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

---

*Última atualização: 20/04/2026*
*Responsável: [Seu Nome]*
