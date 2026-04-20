# Templates e Checklists - Pesquisa de Clima Organizacional

## Overview
Templates e checklists para padronizar processos de desenvolvimento, deploy e manutenção do sistema de pesquisa de clima organizacional.

## Templates de Documentação

### 1. Template de Release Notes
```markdown
# Release v{VERSION} - {DATA}

## Sumário
Breve descrição dos principais destaques desta release.

## Mudanças Principais
### Novas Funcionalidades
- [ ] **{Funcionalidade 1}**: Descrição detalhada
- [ ] **{Funcionalidade 2}**: Descrição detalhada

### Melhorias
- [ ] **{Melhoria 1}**: Descrição detalhada
- [ ] **{Melhoria 2}**: Descrição detalhada

### Correções de Bug
- [ ] **{Bug 1}**: Descrição do problema corrigido
- [ ] **{Bug 2}**: Descrição do problema corrigido

### Atualizações de Segurança
- [ ] **{Security 1}**: Descrição da atualização
- [ ] **{Security 2}**: Descrição da atualização

## Mudanças Técnicas
- **Backend**: {descrição das mudanças}
- **Frontend**: {descrição das mudanças}
- **Banco de Dados**: {descrição das mudanças}
- **Infraestrutura**: {descrição das mudanças}

## Dependências
- **Adicionadas**: {lista de novas dependências}
- **Removidas**: {lista de dependências removidas}
- **Atualizadas**: {lista de dependências atualizadas}

## Compatibilidade
- **Node.js**: {versão mínima requerida}
- **Navegadores**: {lista de navegadores suportados}
- **APIs Externas**: {versões das APIs}

## Performance
- **Melhorias**: {descrição das melhorias de performance}
- **Métricas**: {métricas relevantes}

## Segurança
- **Vulnerabilidades corrigidas**: {lista}
- **Novas medidas de segurança**: {descrição}

## Instalação/Upgrade
### Nova Instalação
```bash
# Passos para nova instalação
git clone https://github.com/SEU_USER/pesquisa-declima-nitai.git
cd pesquisadeclima-nitai
npm install --production
cp .env.example .env
# Configurar variáveis de ambiente
pm2 start ecosystem.config.js
```

### Upgrade
```bash
# Passos para upgrade
git pull origin main
npm install --production
pm2 restart pesquisa-clima
```

## Problemas Conhecidos
- [ ] **{Problema 1}**: Descrição e workaround
- [ ] **{Problema 2}**: Descrição e workaround

## Roadmap
Próximas funcionalidades planejadas para as próximas releases.

## Contribuidores
- **{Nome}**: {contribuições nesta release}

## Links
- [GitHub Release](https://github.com/SEU_USER/pesquisa-declima-nitai/releases/tag/v{VERSION})
- [Documentação](https://docs.nordeste-locacoes.com.br)
- [Changelog](https://github.com/SEU_USER/pesquisa-declima-nitai/blob/main/CHANGELOG.md)

---

*Gerado em: {DATA}*
*Responsável: {Nome}*
```

### 2. Template de Relatório de Incidente
```markdown
# Relatório de Incidente - #{ID}

## Informações Básicas
- **ID do Incidente**: #{ID}
- **Data/Hora Início**: {DATA_HORA}
- **Data/Hora Fim**: {DATA_HORA}
- **Duração**: {DURAÇÃO}
- **Severidade**: {CRÍTICO/ALTO/MÉDIO/BAIXO}
- **Status**: {ABERTO/EM_ANDAMENTO/RESOLVIDO/FECHADO}

## Descrição do Incidente
### Impacto
- **Usuários Afetados**: {número ou descrição}
- **Serviços Afetados**: {lista de serviços}
- **Impacto nos Negócios**: {descrição do impacto}
- **Usuários Visíveis**: {sim/não}

### Sintomas
- **Sintomas Observados**: {lista de sintomas}
- **Mensagens de Erro**: {mensagens específicas}
- **Comportamento Anômalo**: {descrição do comportamento}

## Linha do Tempo
- **{HORA}**: {evento 1}
- **{HORA}**: {evento 2}
- **{HORA}**: {evento 3}
- **{HORA}**: {evento 4}

## Análise de Causa Raiz (RCA)
### Causa Imediata
{Descrição da causa imediata}

### Causa Intermediária
{Descrição da causa intermediária}

### Causa Raiz
{Descrição da causa raiz}

## Ações Tomadas
### Ações Imediatas
- [ ] **{Ação 1}**: {descrição e responsável}
- [ ] **{Ação 2}**: {descrição e responsável}

### Ações de Mitigação
- [ ] **{Ação 1}**: {descrição e responsável}
- [ ] **{Ação 2}**: {descrição e responsável}

### Ações de Recuperação
- [ ] **{Ação 1}**: {descrição e responsável}
- [ ] **{Ação 2}**: {descrição e responsável}

## Ações Preventivas
### Curto Prazo (0-30 dias)
- [ ] **{Ação 1}**: {descrição, responsável, prazo}
- [ ] **{Ação 2}**: {descrição, responsável, prazo}

### Médio Prazo (1-3 meses)
- [ ] **{Ação 1}**: {descrição, responsável, prazo}
- [ ] **{Ação 2}**: {descrição, responsável, prazo}

### Longo Prazo (3+ meses)
- [ ] **{Ação 1}**: {descrição, responsável, prazo}
- [ ] **{Ação 2}**: {descrição, responsável, prazo}

## Lições Aprendidas
### O Que Funcionou Bem
- {lição 1}
- {lição 2}

### O Que Poderia Ser Melhorado
- {melhoria 1}
- {melhoria 2}

### Mudanças Necessárias
- {mudança 1}
- {mudança 2}

## Evidências
### Logs
- **{Serviço}**: {caminho do log}
- **{Serviço}**: {caminho do log}

### Screenshots
- **{Descrição}**: {caminho do screenshot}

### Métricas
- **{Métrica 1}**: {valor}
- **{Métrica 2}**: {valor}

## Comunicação
### Comunicações Internas
- **{Data/Hora}**: {destinatário} - {resumo da comunicação}
- **{Data/Hora}**: {destinatário} - {resumo da comunicação}

### Comunicações Externas
- **{Data/Hora}**: {destinatário} - {resumo da comunicação}
- **{Data/Hora}**: {destinatário} - {resumo da comunicação}

## Pós-Incidente
### Verificação
- [ ] Sistema está funcionando normalmente
- [ ] Todos os serviços estão operacionais
- [ ] Monitoramento está ativo
- [ ] Alertas configurados

### Documentação
- [ ] Relatório atualizado
- [ ] Playbooks atualizados
- [ ] Documentação técnica atualizada
- [ ] Treinamento da equipe realizado

## Aprovações
- **Engenharia**: {nome, data, assinatura}
- **Operações**: {nome, data, assinatura}
- **Gerência**: {nome, data, assinatura}

---

*Relatório criado em: {DATA}*
*Última atualização: {DATA}*
*Responsável: {Nome}*
```

### 3. Template de Plano de Testes
```markdown
# Plano de Testes - {PROJETO/FEATURE}

## Informações Gerais
- **Projeto/Feature**: {nome}
- **Versão**: {versão}
- **Data**: {data}
- **Responsável**: {nome}
- **Ambiente**: {desenvolvimento/homologação/produção}

## Escopo dos Testes
### Incluso no Escopo
- [ ] {funcionalidade 1}
- [ ] {funcionalidade 2}
- [ ] {funcionalidade 3}

### Excluído do Escopo
- [ ] {funcionalidade 1}
- [ ] {funcionalidade 2}

## Tipos de Testes
### Testes Funcionais
- [ ] **Testes de Aceitação do Usuário**
- [ ] **Testes de Regressão**
- [ ] **Testes de Integração**

### Testes Não Funcionais
- [ ] **Testes de Performance**
- [ ] **Testes de Segurança**
- [ ] **Testes de Usabilidade**

### Testes Automatizados
- [ ] **Testes Unitários**
- [ ] **Testes de API**
- [ ] **Testes E2E**

## Casos de Teste

### 1. Teste de Login
**ID**: TC-001
**Descrição**: Verificar funcionamento do login
**Pré-condições**: Usuário cadastrado
**Passos**:
1. Acessar página de login
2. Inserir credenciais válidas
3. Clicar em "Entrar"
**Resultado Esperado**: Usuário autenticado e redirecionado
**Prioridade**: Alta
**Status**: {Passou/Falhou/Bloqueado}

### 2. Teste de Formulário de Pesquisa
**ID**: TC-002
**Descrição**: Verificar preenchimento do formulário
**Pré-condições**: Usuário autenticado
**Passos**:
1. Acessar formulário de pesquisa
2. Preencher todas as 45 perguntas
3. Clicar em "Enviar"
**Resultado Esperado**: Resposta salva com sucesso
**Prioridade**: Alta
**Status**: {Passou/Falhou/Bloqueado}

### 3. Teste de Geração de Relatório
**ID**: TC-003
**Descrição**: Verificar geração de relatório com IA
**Pré-condições**: Dados de pesquisa disponíveis
**Passos**:
1. Acessar dashboard administrativo
2. Clicar em "Gerar Relatório"
3. Aguardar processamento
**Resultado Esperado**: Relatório gerado com sucesso
**Prioridade**: Alta
**Status**: {Passou/Falhou/Bloqueado}

## Ambiente de Teste
### Configuração
- **URL**: {url do ambiente}
- **Banco de Dados**: {configuração}
- **APIs Externas**: {configuração}
- **Dados de Teste**: {descrição dos dados}

### Acesso
- **Usuário**: {usuário de teste}
- **Senha**: {senha de teste}
- **Permissões**: {lista de permissões}

## Critérios de Aceite
### Funcionais
- [ ] Todas as funcionalidades implementadas funcionam
- [ ] Requisitos de negócio atendidos
- [ ] Regras de negócio implementadas

### Não Funcionais
- [ ] Performance dentro dos limites aceitáveis
- [ ] Segurança implementada corretamente
- [ ] Usabilidade adequada

### Qualidade
- [ ] Sem bugs críticos
- [ ] Código bem documentado
- [ ] Testes suficientes

## Ferramentas
- **Testes Manuais**: {ferramenta}
- **Automação**: {ferramenta}
- **Performance**: {ferramenta}
- **Segurança**: {ferramenta}

## Recursos
### Humanos
- **QA Engineer**: {nome}
- **Desenvolvedor**: {nome}
- **Product Owner**: {nome}

### Infraestrutura
- **Servidores**: {configuração}
- **Banco de Dados**: {configuração}
- **Licenças**: {lista}

## Cronograma
- **Início**: {data}
- **Fim**: {data}
- **Duração**: {dias}
- **Milestones**: {lista de marcos}

## Riscos e Mitigações
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| {risco 1} | {alta/média/baixa} | {alto/médio/baixo} | {mitigação} |
| {risco 2} | {alta/média/baixa} | {alto/médio/baixo} | {mitigação} |

## Resultados
### Execução
- **Total de Testes**: {número}
- **Passaram**: {número}
- **Falharam**: {número}
- **Bloqueados**: {número}
- **Taxa de Sucesso**: {porcentagem}%

### Defeitos
| ID | Descrição | Severidade | Status | Responsável |
|----|-----------|------------|--------|-------------|
| {id} | {descrição} | {crítica/alta/média/baixa} | {aberto/em andamento/resolvido} | {nome} |

## Aprovação
- **QA**: {nome, data, assinatura}
- **Desenvolvimento**: {nome, data, assinatura}
- **Product Owner**: {nome, data, assinatura}

---

*Plano criado em: {DATA}*
*Última atualização: {DATA}*
```

## Checklists

### 1. Checklist de Deploy
```markdown
# Checklist de Deploy - {VERSION}

## Pré-Deploy (30 min antes)
### Verificação do Sistema
- [ ] Backup do banco de dados atualizado
- [ ] Backup dos arquivos de configuração
- [ ] Verificar espaço em disco disponível (>10GB)
- [ ] Verificar uso de memória (<80%)
- [ ] Verificar uso de CPU (<80%)

### Verificação do Código
- [ ] Branch correta selecionada (main)
- [ ] Último commit estável
- [ ] Todos os testes passando
- [ ] Code review aprovado
- [ ] Build sem erros

### Verificação de Configuração
- [ ] Variáveis de ambiente configuradas
- [ ] Chaves API atualizadas
- [ ] Certificado SSL válido
- [ ] Configuração Nginx correta
- [ ] Firewall configurado

## Deploy (Execução)
### Backup
- [ ] Criar backup do banco
- [ ] Criar backup dos arquivos
- [ ] Documentar versão atual
- [ ] Salvar hash do commit

### Atualização
- [ ] Pull do código mais recente
- [ ] Instalar dependências (se necessário)
- [ ] Executar migrações (se houver)
- [ ] Reiniciar aplicação

### Verificação
- [ ] Aplicação iniciou com sucesso
- [ ] Health check passando
- [ ] Logs sem erros críticos
- [ ] APIs respondendo corretamente
- [ ] Frontend carregando

## Pós-Deploy (30 min depois)
### Testes Funcionais
- [ ] Login funcionando
- [ ] Formulário de pesquisa funcionando
- [ ] Dashboard exibindo dados
- [ ] Geração de relatórios funcionando
- [ ] Chat IA respondendo

### Testes de Integração
- [ ] API OpenRouter conectada
- [ ] Banco de dados acessível
- [ ] Logs sendo gravados
- [ ] Monitoramento ativo
- [ ] Alertas configurados

### Performance
- [ ] Tempo de carregamento <3s
- [ ] Respostas de API <2s
- [ ] Uso de memória estável
- [ ] Sem picos de CPU
- [ ] Sem erros 500

## Rollback (se necessário)
### Critérios de Rollback
- [ ] Health check falhando
- [ ] Erros 500 persistentes
- [ ] Performance degradada
- [ ] Funcionalidades críticas não funcionando

### Execução de Rollback
- [ ] Identificar causa do problema
- [ ] Decidir por rollback
- [ ] Executar script de rollback
- [ ] Verificar funcionamento
- [ ] Comunicar stakeholders

## Documentação
### Atualização
- [ ] Release notes atualizadas
- [ ] Changelog atualizado
- [ ] Documentação técnica atualizada
- [ ] Playbooks atualizados

### Comunicação
- [ ] Equipe notificada
- [ ] Stakeholders informados
- [ ] Usuários notificados (se necessário)
- [ ] Status page atualizado

## Assinaturas
- **Desenvolvedor**: {nome, data, hora}
- **QA**: {nome, data, hora}
- **DevOps**: {nome, data, hora}
- **Gerente**: {nome, data, hora}

---

*Deploy concluído em: {DATA}*
*Status: {SUCESSO/FALHA/ROLLBACK}*
```

### 2. Checklist de Manutenção Semanal
```markdown
# Checklist de Manutenção Semanal - {SEMANA}

## Segurança
### Backup
- [ ] Backup diário executado com sucesso
- [ ] Backup semanal completo executado
- [ ] Backup externo verificado
- [ ] Integridade dos backups testada

### Atualizações
- [ ] Sistema operacional atualizado
- [ ] Dependências npm verificadas
- [ ] Patches de segurança aplicados
- [ ] Vulnerabilidades verificadas

### Monitoramento
- [ ] Logs de segurança revisados
- [ ] Tentativas de acesso suspeitas verificadas
- [ ] Firewall configurado corretamente
- [ ] SSL/TLS funcionando

## Performance
### Recursos
- [ ] Uso de CPU <80%
- [ ] Uso de memória <80%
- [ ] Espaço em disco >20%
- [ ] Latência de rede <100ms

### Aplicação
- [ ] Tempo de resposta <2s
- [ ] Taxa de erro <1%
- [ ] Uptime >99.9%
- [ ] Concurrent users suportados

### Banco de Dados
- [ ] Queries otimizadas
- [ ] Índices funcionando
- [ ] Backup automático funcionando
- [ ] Sem corrupção de dados

## Funcionalidades
### Sistema
- [ ] Login funcionando
- [ ] Formulário de pesquisa funcionando
- [ ] Dashboard atualizando
- [ ] Relatórios gerando

### APIs
- [ ] API OpenRouter conectada
- [ ] Rate limits dentro do limite
- [ ] Respostas da IA funcionando
- [ ] Sem erros 500

### Monitoramento
- [ ] PM2 status saudável
- [ ] Nginx funcionando
- [ ] Health check passando
- [ ] Alertas configurados

## Logs e Relatórios
### Análise
- [ ] Logs de erro revisados
- [ ] Logs de acesso analisados
- [ ] Métricas de performance coletadas
- [ ] Tendências identificadas

### Relatórios
- [ ] Relatório semanal gerado
- [ ] KPIs calculados
- [ ] Anomalias documentadas
- [ ] Ações recomendadas

## Limpeza
### Arquivos
- [ ] Logs antigos removidos (>7 dias)
- [ ] Cache limpo
- [ ] Arquivos temporários removidos
- [ ] Espaço liberado

### Banco de Dados
- [ ] Logs antigos removidos
- [ ] Tabelas otimizadas
- [ ] Índices reconstruídos
- [ ] Estatísticas atualizadas

## Próxima Semana
### Planejamento
- [ ] Tarefas agendadas
- [ ] Recursos alocados
- [ ] Riscos identificados
- [ ] Comunicados preparados

### Melhorias
- [ ] Sugestões documentadas
- [ ] Prioridades definidas
- [ ] Backlog atualizado
- [ ] Sprint planning preparado

## Incidentes
### Resolução
- [ ] Incidentes da semana resolvidos
- [ ] Causas raiz identificadas
- [ ] Ações preventivas implementadas
- [ ] Documentação atualizada

### Aprendizados
- [ ] Lições aprendidas registradas
- [ ] Processos melhorados
- [ ] Equipe treinada
- [ ] Playbooks atualizados

## Assinaturas
- **Executado por**: {nome, data, hora}
- **Verificado por**: {nome, data, hora}
- **Aprovado por**: {nome, data, hora}

---

*Manutenção concluída em: {DATA}*
*Status: {CONCLUÍDO/PENDENTE/PROBLEMAS}*
```

### 3. Checklist de Incident Response
```markdown
# Checklist de Response a Incidentes - #{ID}

## Fase 1: Detecção (0-5 min)
### Identificação
- [ ] Incidente detectado via {monitoramento/alerta/usuário}
- [ ] Severidade classificada: {CRÍTICA/ALTA/MÉDIA/BAIXA}
- [ ] Impacto inicial avaliado
- [ ] Equipe de response notificada
- [ ] Canal de comunicação estabelecido

### Documentação Inicial
- [ ] ID do incidente criado: #{ID}
- [ ] Hora de início registrada: {HORA}
- [ ] Sintomas iniciais documentados
- [ ] Serviços afetados listados
- [ ] Usuários impactados estimados

## Fase 2: Triagem (5-15 min)
### Avaliação
- [ ] Escopo do impacto detalhado
- [ ] Usuários afetados quantificados
- [ ] Funcionalidades afetadas listadas
- [ ] Dados corrompidos/perdidos identificados
- [ ] Timeline inicial criada

### Comunicação
- [ ] Stakeholders críticos notificados
- [ ] Comunicado inicial enviado
- [ ] Status page atualizado
- [ ] Equipe de suporte informada
- [ ] Canal externo preparado

## Fase 3: Investigação (15-60 min)
### Diagnóstico
- [ ] Logs coletados e analisados
- [ ] Métricas de sistema revisadas
- [ ] Causa provável identificada
- [ ] Hipóteses formuladas
- [ ] Testes de hipóteses executados

### Isolamento
- [ ] Sistema isolado se necessário
- [ ] Tráfego desviado
- [ ] Modo seguro ativado
- [ ] Backup de evidências
- [ ] Preservação de logs

## Fase 4: Resolução (60-180 min)
### Implementação
- [ ] Solução identificada
- [ ] Plano de ação definido
- [ ] Ações implementadas
- [ ] Sistema restaurado
- [ ] Funcionalidades verificadas

### Verificação
- [ ] Health checks passando
- [ ] Funcionalidades críticas operando
- [ ] Performance normalizada
- [ ] Logs sem erros
- [ ] Usuários confirmam funcionamento

## Fase 5: Recuperação (180-240 min)
### Estabilização
- [ ] Monitoramento intensivo
- [ ] Métricas estabilizadas
- [ ] Sem regressões detectadas
- [ ] Sistema em estado normal
- [ ] Alertas normais ativos

### Comunicação Final
- [ ] Stakeholders informados sobre resolução
- [ ] Comunicado final enviado
- [ ] Status page atualizada
- [ ] FAQ preparada
- [ ] Suporte preparado para contatos

## Fase 6: Pós-Incidente (24-72h)
### Análise
- [ ] Timeline completa montada
- [ ] Causa raiz identificada
- [ ] Fatores contribuintes listados
- [ ] Impacto quantificado
- [ ] Lições aprendidas documentadas

### Melhoria
- [ ] Ações preventivas definidas
- [ ] Processos melhorados
- [ ] Monitoramento aprimorado
- [ ] Automação implementada
- [ ] Equipe treinada

### Documentação
- [ ] Relatório de incidente completo
- [ ] Playbooks atualizados
- [ ] Conhecimento base atualizado
- [ ] Treinamentos agendados
- [ ] Follow-up agendado

## Critérios de Encerramento
- [ ] Sistema 100% funcional
- [ ] Todos os usuários operando normalmente
- [ ] Métricas normalizadas
- [ ] Causa raiz identificada
- [ ] Ações preventivas definidas
- [ ] Documentação completa
- [ ] Stakeholders satisfeitos

## Métricas do Incidente
- **Tempo de Detecção**: {minutos}
- **Tempo de Triagem**: {minutos}
- **Tempo de Resolução**: {minutos}
- **Tempo Total**: {minutos}
- **Impacto nos Negócios**: {descrição}
- **Custo Estimado**: {valor}
- **Usuários Afetados**: {número}

## Comunicação
### Interna
- [ ] Equipe técnica: {data/hora}
- [ ] Gerência: {data/hora}
- [ ] Executivos: {data/hora}

### Externa
- [ ] Usuários: {data/hora}
- [ ] Clientes: {data/hora}
- [ ] Mídia: {data/hora} (se necessário)

## Ações Preventivas
### Imediatas (0-7 dias)
- [ ] {ação 1}: {responsável}, {prazo}
- [ ] {ação 2}: {responsável}, {prazo}

### Curto Prazo (1-4 semanas)
- [ ] {ação 1}: {responsável}, {prazo}
- [ ] {ação 2}: {responsável}, {prazo}

### Longo Prazo (1-3 meses)
- [ ] {ação 1}: {responsável}, {prazo}
- [ ] {ação 2}: {responsável}, {prazo}

## Assinaturas
- **Líder do Incidente**: {nome, data, hora}
- **Engenharia**: {nome, data, hora}
- **Operações**: {nome, data, hora}
- **Gerência**: {nome, data, hora}

---

*Incidente #{ID} encerrado em: {DATA}*
*Duração total: {TEMPO}*
*Status: {RESOLVIDO}*
```

## Scripts Automatizados

### 1. Script de Deploy Automatizado
```bash
#!/bin/bash
# scripts/auto-deploy.sh

set -e  # Exit on any error

# Configurações
PROJECT_DIR="/home/deploy/pesquisadeclima-nitai"
BACKUP_DIR="/home/deploy/backups"
LOG_FILE="/home/deploy/logs/deploy.log"
HEALTH_URL="http://localhost:3001/health"
MAX_RETRIES=3
RETRY_DELAY=10

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função de log
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Função de erro
error() {
    echo -e "${RED}ERROR: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

# Função de sucesso
success() {
    echo -e "${GREEN}SUCCESS: $1${NC}" | tee -a $LOG_FILE
}

# Função de aviso
warning() {
    echo -e "${YELLOW}WARNING: $1${NC}" | tee -a $LOG_FILE
}

# Função de verificação
verify() {
    local description=$1
    local command=$2
    
    log "Verificando: $description"
    if eval $command; then
        success "$description - OK"
        return 0
    else
        error "$description - FALHOU"
    fi
}

# Função de retry
retry() {
    local description=$1
    local command=$2
    local retries=$3
    
    for i in $(seq 1 $retries); do
        log "Tentativa $i/$retries: $description"
        if eval $command; then
            success "$description - OK"
            return 0
        else
            warning "$description - Falhou, tentando novamente em $RETRY_DELAY segundos..."
            sleep $RETRY_DELAY
        fi
    done
    
    error "$description - Falhou após $retries tentativas"
}

# Início do deploy
log "=== INÍCIO DO DEPLOY AUTOMATIZADO ==="

# Verificação de pré-requisitos
verify "Diretório do projeto existe" "test -d $PROJECT_DIR"
verify "Permissões corretas" "test -w $PROJECT_DIR"
verify "PM2 instalado" "pm2 --version > /dev/null 2>&1"
verify "Node.js instalado" "node --version > /dev/null 2>&1"

# Backup
log "Criando backup..."
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

if [ -f "$PROJECT_DIR/database.db" ]; then
    cp "$PROJECT_DIR/database.db" "$BACKUP_DIR/$BACKUP_NAME/"
    success "Backup do banco criado"
fi

cp -r "$PROJECT_DIR" "$BACKUP_DIR/$BACKUP_NAME/project"
success "Backup dos arquivos criado"

# Atualização do código
log "Atualizando código..."
cd $PROJECT_DIR

# Verificar se há mudanças
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    warning "Nenhuma mudança encontrada. Deploy não necessário."
    exit 0
fi

# Pull das mudanças
retry "Pull do código" "git pull origin main" $MAX_RETRIES

# Verificar mudanças no package.json
if git diff HEAD~1 HEAD --name-only | grep -q "package.json"; then
    log "Mudanças detectadas em dependências..."
    retry "Instalação de dependências" "npm install --production" $MAX_RETRIES
fi

# Verificar mudanças no .env
if git diff HEAD~1 HEAD --name-only | grep -q ".env"; then
    warning "Mudanças detectadas no .env. Verifique manualmente."
fi

# Reiniciar aplicação
log "Reiniciando aplicação..."
pm2 restart pesquisa-clima

# Aguardar aplicação iniciar
sleep 10

# Verificação pós-deploy
log "Verificando funcionamento..."

# Health check
retry "Health check" "curl -f $HEALTH_URL > /dev/null 2>&1" $MAX_RETRIES

# Verificar APIs
verify "API de estatísticas" "curl -f http://localhost:3001/api/clima/stats > /dev/null 2>&1"
verify "API de pesquisa" "curl -f http://localhost:3001/api/survey/questions > /dev/null 2>&1"
verify "Frontend" "curl -f http://localhost:3001/ > /dev/null 2>&1"

# Verificar PM2 status
if pm2 list | grep pesquisa-clima | grep -q "online"; then
    success "PM2 status OK"
else
    error "PM2 status FAILED"
fi

# Limpeza
log "Limppeza..."
find $PROJECT_DIR/logs -name "*.log" -mtime +7 -delete
npm cache clean --force

# Log final
log "=== DEPLOY CONCLUÍDO COM SUCESSO ==="
success "Deploy finalizado em $(date '+%Y-%m-%d %H:%M:%S')"

# Notificação (opcional)
# curl -X POST "https://hooks.slack.com/..." -d 'payload={"text":"Deploy concluído com sucesso"}'

exit 0
```

### 2. Script de Health Check Automatizado
```bash
#!/bin/bash
# scripts/health-check.sh

set -e

# Configurações
HEALTH_URL="http://localhost:3001/health"
LOG_FILE="/home/deploy/logs/health.log"
ALERT_EMAIL="admin@nordeste-locacoes.com.br"
WEBHOOK_URL="https://hooks.slack.com/..."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função de log
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Função de alerta
send_alert() {
    local message=$1
    local severity=$2
    
    log "ALERT: $message"
    
    # Email (opcional)
    # echo "$message" | mail -s "Alert: $severity" $ALERT_EMAIL
    
    # Slack (opcional)
    # curl -X POST $WEBHOOK_URL -d 'payload={"text":"'"$message"'"}'
    
    # Log de alerta
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ALERT [$severity]: $message" >> /home/deploy/logs/alerts.log
}

# Verificação principal
check_health() {
    log "Iniciando health check..."
    
    # Verificar se a aplicação está respondendo
    if curl -f -s --max-time 10 $HEALTH_URL > /dev/null 2>&1; then
        log "Health check OK"
        return 0
    else
        log "Health check FAILED"
        return 1
    fi
}

# Verificação detalhada
detailed_check() {
    local issues=()
    
    # Verificar PM2
    if ! pm2 list | grep pesquisa-clima | grep -q "online"; then
        issues+=("PM2: Aplicação não está online")
    fi
    
    # Verificar uso de memória
    local mem_usage=$(ps aux | grep node | awk '{sum+=$6} END {print sum/1024}')
    if [ $(echo "$mem_usage > 1024" | bc -l) -eq 1 ]; then
        issues+=("Memory: Uso alto (${mem_usage}MB)")
    fi
    
    # Verificar espaço em disco
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $disk_usage -gt 90 ]; then
        issues+=("Disk: Uso alto (${disk_usage}%)")
    fi
    
    # Verificar logs de erro recentes
    local error_count=$(grep -c "$(date +%Y-%m-%d)" /home/deploy/pesquisadeclima-nitai/logs/err.log 2>/dev/null || echo 0)
    if [ $error_count -gt 10 ]; then
        issues+=("Errors: Muitos erros hoje ($error_count)")
    fi
    
    # Retornar issues
    echo "${issues[@]}"
}

# Ação de recovery
recovery_action() {
    log "Iniciando recovery action..."
    
    # Tentar reiniciar PM2
    pm2 restart pesquisa-clima
    
    # Aguardar
    sleep 10
    
    # Verificar novamente
    if check_health; then
        log "Recovery bem-sucedido"
        send_alert "Aplicação recuperada após reinicialização" "INFO"
        return 0
    else
        log "Recovery falhou"
        send_alert "Recovery falhou - intervenção manual necessária" "CRITICAL"
        return 1
    fi
}

# Execução principal
if check_health; then
    # Saúde OK, verificação detalhada
    issues=$(detailed_check)
    
    if [ ! -z "$issues" ]; then
        log "Health OK, mas issues detectados:"
        for issue in $issues; do
            log "  - $issue"
        done
        send_alert "Health OK mas com warnings: $issues" "WARNING"
    fi
    
    exit 0
else
    # Saúde falhou, tentar recovery
    log "Health falhou, tentando recovery..."
    
    if recovery_action; then
        exit 0
    else
        # Recovery falhou, verificar modo seguro
        log "Recovery falhou, verificando modo seguro..."
        
        # Implementar lógica de modo seguro aqui
        # pm2 stop pesquisa-clima
        # NODE_ENV=production DISABLE_AI=true pm2 start server.js --name "pesquisa-clima-safe"
        
        send_alert "Sistema em modo seguro - funcionalidades limitadas" "CRITICAL"
        exit 1
    fi
fi
```

## Templates de Código

### 1. Template de Controller
```javascript
// backend/templates/controller.template.js
/**
 * Controller: {Nome} Controller
 * Descrição: {descrição do controller}
 */

const { {ServiceName} } = require('../services/{serviceName}.service.js');

/**
 * {Descrição da função}
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function {functionName}(req, res) {
  try {
    const result = await {ServiceName}.{serviceMethod}(req.body);
    
    res.json({
      success: true,
      data: result,
      message: '{mensagem de sucesso}'
    });
    
  } catch (error) {
    console.error('Erro em {functionName}:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * {Descrição da função}
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
async function {functionName2}(req, res) {
  try {
    const { id } = req.params;
    const result = await {ServiceName}.{serviceMethod2}(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Recurso não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Erro em {functionName2}:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

module.exports = {
  {functionName},
  {functionName2}
};
```

### 2. Template de Service
```javascript
// backend/templates/service.template.js
/**
 * Service: {Nome} Service
 * Descrição: {descrição do service}
 */

class {ServiceName} {
  constructor() {
    this.{property} = {valor};
  }

  /**
   * {Descrição do método}
   * @param {Object} data - Dados de entrada
   * @returns {Promise<Object>} Resultado da operação
   */
  async {methodName}(data) {
    try {
      // Validação
      if (!data) {
        throw new Error('Dados não fornecidos');
      }

      // Lógica principal
      const result = await this.processData(data);

      // Retorno
      return result;

    } catch (error) {
      console.error('Erro em {methodName}:', error);
      throw error;
    }
  }

  /**
   * {Descrição do método}
   * @param {string} id - ID do recurso
   * @returns {Promise<Object|null>} Recurso encontrado
   */
  async {methodName2}(id) {
    try {
      // Buscar recurso
      const result = await this.findById(id);

      if (!result) {
        return null;
      }

      // Processar resultado
      return this.formatResult(result);

    } catch (error) {
      console.error('Erro em {methodName2}:', error);
      throw error;
    }
  }

  /**
   * Método auxiliar para processar dados
   * @private
   */
  async processData(data) {
    // Implementação
    return data;
  }

  /**
   * Método auxiliar para buscar por ID
   * @private
   */
  async findById(id) {
    // Implementação
    return null;
  }

  /**
   * Método auxiliar para formatar resultado
   * @private
   */
  formatResult(data) {
    // Implementação
    return data;
  }
}

module.exports = new {ServiceName}();
```

### 3. Template de Teste
```javascript
// tests/templates/test.template.js
/**
 * Tests: {Nome} Tests
 * Descrição: {descrição dos testes}
 */

const request = require('supertest');
const app = require('../../server');
const { {ServiceName} } = require('../../backend/services/{serviceName}.service.js');

describe('{Nome} Tests', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  afterEach(() => {
    // Cleanup após cada teste
  });

  describe('{functionName}', () => {
    test('deve retornar sucesso com dados válidos', async () => {
      const validData = {
        // dados válidos
      };

      const response = await request(app)
        .post('/api/{endpoint}')
        .send(validData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    test('deve retornar erro com dados inválidos', async () => {
      const invalidData = {
        // dados inválidos
      };

      const response = await request(app)
        .post('/api/{endpoint}')
        .send(invalidData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    test('deve tratar dados ausentes', async () => {
      const response = await request(app)
        .post('/api/{endpoint}')
        .send({})
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('{functionName2}', () => {
    test('deve retornar recurso existente', async () => {
      const existingId = '123';

      const response = await request(app)
        .get(`/api/{endpoint}/${existingId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    test('deve retornar 404 para recurso inexistente', async () => {
      const nonExistentId = '999';

      const response = await request(app)
        .get(`/api/{endpoint}/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Recurso não encontrado');
    });
  });
});
```

---

## Como Usar

### 1. Templates
- Copiar o template relevante
- Preencher as variáveis entre { }
- Adaptar conforme necessário
- Salvar no local apropriado

### 2. Checklists
- Imprimir ou usar digitalmente
- Marcar itens conforme executados
- Documentar desvios
- Assinar ao finalizar

### 3. Scripts
- Tornar executáveis: `chmod +x script.sh`
- Testar em ambiente de desenvolvimento
- Adaptar variáveis de ambiente
- Implementar no ambiente de produção

---

*Última atualização: 20/04/2026*
*Responsável: [Seu Nome]*
