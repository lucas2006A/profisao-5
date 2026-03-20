// ============================================
// IA ASSISTENTE INTELIGENTE - AGROCOMPARE
// ============================================

class AgroAssistente {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        if (this.chatMessages && this.chatInput && this.sendBtn) {
            this.init();
        } else {
            console.error('Elementos do chat não encontrados. Verifique os IDs no HTML.');
        }
    }
    
    init() {
        // Limpar mensagens estáticas se houver
        if (this.chatMessages.children.length > 0) {
            this.chatMessages.innerHTML = '';
        }
        
        // Mensagem de boas-vindas
        this.addBotMessage('Olá! 👋 Sou a IA especializada em comparar Mato Grosso e Paraná. Posso falar sobre economia, agropecuária, custo de vida, investimentos e muito mais! Como posso ajudá-lo hoje?');
        
        // Event listeners
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Chips de sugestão
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                if (question) {
                    this.chatInput.value = question;
                    this.sendMessage();
                }
            });
        });
        
        // Auto-foco no input
        this.chatInput.focus();
    }
    
    showTyping() {
        if (this.typingIndicator) {
            this.typingIndicator.classList.add('visible');
            this.scrollToBottom();
        }
    }
    
    hideTyping() {
        if (this.typingIndicator) {
            this.typingIndicator.classList.remove('visible');
        }
    }
    
    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
    
    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const formattedText = this.formatMessage(text);
        contentDiv.innerHTML = formattedText;
        
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotMessage(text) {
        this.addMessage(text, false);
    }
    
    addUserMessage(text) {
        this.addMessage(text, true);
    }
    
    formatMessage(text) {
        let formatted = text.replace(/\n/g, '<br>');
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Converter listas simples
        if (formatted.includes('•')) {
            const lines = formatted.split('<br>');
            let inList = false;
            let newLines = [];
            for (let line of lines) {
                if (line.trim().startsWith('•')) {
                    if (!inList) {
                        newLines.push('<ul class="message-list">');
                        inList = true;
                    }
                    newLines.push(`<li>${line.trim().substring(1).trim()}</li>`);
                } else {
                    if (inList) {
                        newLines.push('</ul>');
                        inList = false;
                    }
                    newLines.push(line);
                }
            }
            if (inList) newLines.push('</ul>');
            formatted = newLines.join('<br>');
        }
        
        // Emojis personalizados
        const emojis = {
            'soja': '🌱',
            'milho': '🌽',
            'trigo': '🌾',
            'gado': '🐄',
            'tecnologia': '🚜',
            'produtividade': '📈',
            'investimento': '💰',
            'desafio': '⚠️',
            'sucesso': '✨'
        };
        
        for (let [key, emoji] of Object.entries(emojis)) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            formatted = formatted.replace(regex, `${emoji} ${key}`);
        }
        
        return formatted;
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        this.addUserMessage(message);
        this.chatInput.value = '';
        this.showTyping();
        
        // Simular tempo de processamento
        setTimeout(() => {
            const response = this.getIntelligentResponse(message);
            this.hideTyping();
            this.addBotMessage(response);
        }, 500 + Math.random() * 500);
        
        // Manter foco
        setTimeout(() => this.chatInput.focus(), 100);
    }
    
    getIntelligentResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        const knowledgeBase = {
            saudacoes: ['oi', 'olá', 'opa', 'boa tarde', 'bom dia', 'boa noite', 'hey', 'e aí', 'fala'],
            produtividade: ['produtividade', 'produção', 'hectare', 'colheita', 'safra'],
            clima: ['clima', 'tempo', 'chuva', 'seca', 'geada', 'temperatura'],
            solo: ['solo', 'terra', 'plantio', 'cultivo'],
            soja: ['soja', 'grão', 'oleaginosa'],
            milho: ['milho', 'safrinha', 'segunda safra'],
            trigo: ['trigo', 'cereal'],
            tecnologia: ['tecnologia', 'digital', 'automação', 'drone', 'software', 'app', 'ia', 'inteligência artificial'],
            inovacao: ['inovação', 'moderno', 'futuro', 'tendência'],
            investimento: ['investir', 'investimento', 'rentabilidade', 'lucro', 'retorno', 'custo'],
            mercado: ['mercado', 'preço', 'cotação', 'venda', 'exportação'],
            desafios: ['desafio', 'dificuldade', 'problema', 'barreira', 'obstáculo'],
            sustentabilidade: ['sustentável', 'meio ambiente', 'ambiental', 'conservação'],
            ajuda: ['ajuda', 'como funciona', 'o que você faz', 'pode fazer', 'ajudar'],
            sobre: ['quem é você', 'o que é', 'sobre você', 'sua função']
        };
        
        let intent = 'geral';
        for (let [key, keywords] of Object.entries(knowledgeBase)) {
            if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
                intent = key;
                break;
            }
        }
        
        const responses = {
            saudacoes: () => {
                const saudações = [
                    "Olá! 👋 Que bom ter você por aqui! Como posso ajudar com informações sobre agronegócio hoje?",
                    "Oi! 😊 Estou aqui para ajudar! Quer saber mais sobre a comparação entre MT e PR?",
                    "Olá! 🌾 Pronto para descobrir dados incríveis sobre o agro brasileiro?"
                ];
                return saudações[Math.floor(Math.random() * saudações.length)];
            },
            produtividade: () => `**📊 Comparativo de Produtividade - MT x PR**\n\n` +
                `**Mato Grosso (MT):**\n• Soja: 58 sacas/ha (média nacional: 55)\n• Milho: 102 sacas/ha (líder nacional)\n• Algodão: 4.800 kg/ha\n\n` +
                `**Paraná (PR):**\n• Soja: 56 sacas/ha\n• Milho: 95 sacas/ha\n• Trigo: 2.800 kg/ha (maior produtor nacional)\n\n` +
                `**Destaque:** MT lidera em produtividade de soja e milho, enquanto PR se destaca no trigo! 🏆`,
            clima: () => `**🌤️ Análise Climática Comparativa**\n\n**Mato Grosso:**\n• Clima tropical com estações bem definidas\n• Chuvas regulares de outubro a abril\n• Período de estiagem de maio a setembro\n• Ideal para safra de verão e safrinha\n\n**Paraná:**\n• Clima subtropical com maior variação\n• Risco de geadas no sul do estado\n• Distribuição mais uniforme de chuvas\n• Favorável para múltiplas culturas\n\n**💡 Insight:** MT tem vantagem para culturas de verão, PR oferece maior diversidade de cultivos!`,
            solo: () => `**🌱 Características do Solo**\n\n**Mato Grosso:**\n• Predomínio de Latossolos (solos profundos e bem drenados)\n• Topografia plana a suave ondulada\n• Ideal para mecanização intensiva\n• Cerrado brasileiro com alta fertilidade após correção\n\n**Paraná:**\n• Diversidade de tipos de solo\n• Terra roxa (alta fertilidade natural)\n• Topografia mais acidentada\n• Maior necessidade de práticas conservacionistas\n\n**🔬 Conclusão:** Ambos têm solos de alta qualidade, mas com características distintas!`,
            soja: () => `**🌱 Soja: Comparativo MT x PR**\n\n**Mato Grosso:**\n• Maior produtor nacional (26% da produção)\n• Safra: setembro/outubro a janeiro/fevereiro\n• Produtividade média: 58 sacas/ha\n• Tecnologia: alta mecanização e precisão\n\n**Paraná:**\n• 2º maior produtor nacional (15% da produção)\n• Safra: outubro a fevereiro/março\n• Produtividade média: 56 sacas/ha\n• Diferencial: grãos de alta qualidade\n\n**📈 Tendência:** MT ampliando área, PR investindo em qualidade e valor agregado!`,
            milho: () => `**🌽 Milho: Comparativo MT x PR**\n\n**Mato Grosso:**\n• Líder nacional em produção\n• Safrinha (segunda safra) é predominante\n• Produtividade: 102 sacas/ha\n• Área plantada: mais de 5 milhões de hectares\n\n**Paraná:**\n• 3º maior produtor nacional\n• Safra de verão e safrinha\n• Produtividade: 95 sacas/ha\n• Grãos de alto valor agregado\n\n**🚜 Destaque:** MT é o "celeiro do milho" brasileiro, mas PR tem qualidade reconhecida!`,
            tecnologia: () => `**🚜 Tecnologias no Agronegócio**\n\n**Principais inovações:**\n• **Agricultura de Precisão:** GPS, drones, sensores\n• **Biotecnologia:** sementes geneticamente melhoradas\n• **IoT:** sensores de solo e clima em tempo real\n• **IA e Machine Learning:** previsão de safras e manejo\n• **Blockchain:** rastreabilidade da produção\n\n**Adoção por estado:**\nMT: Alta adoção em grandes propriedades\nPR: Tecnologia difundida em todas as escalas\n\n**💡 Futuro:** Agricultura 4.0 e sustentabilidade digital!`,
            investimento: () => `**💰 Onde investir no agronegócio?**\n\n**Mato Grosso - Oportunidades:**\n✅ Escala de produção\n✅ Logística ferroviária em expansão\n✅ Baixo custo por hectare\n⚠️ Dependência de commodities\n\n**Paraná - Oportunidades:**\n✅ Diversificação de culturas\n✅ Agroindústria consolidada\n✅ Mercado consumidor próximo\n✅ Infraestrutura de escoamento\n\n**Recomendação:**\nMT para escala e commodities | PR para diversificação e valor agregado\n\nLembre-se: consulte especialistas para análise personalizada! 📊`,
            desafios: () => `**⚠️ Principais Desafios do Produtor Rural**\n\n**Desafios comuns:**\n• **Clima:** secas, geadas, eventos extremos\n• **Logística:** escoamento da produção\n• **Custos:** insumos e financiamentos\n• **Mão de obra:** qualificação técnica\n• **Sustentabilidade:** pressões ambientais\n\n**Como superar:**\n✅ Investir em tecnologia e gestão\n✅ Planejamento financeiro estratégico\n✅ Associativismo e cooperativismo\n✅ Capacitação contínua\n\nO agro brasileiro é resiliente e inovador! 🌟`,
            ajuda: () => `**🤖 Como posso ajudar você?**\n\nPosso falar sobre:\n• 📊 Comparativos entre MT e PR\n• 🌱 Culturas (soja, milho, trigo, algodão)\n• 💰 Investimentos e rentabilidade\n• 🚜 Tecnologias e inovações\n• 🌍 Sustentabilidade e desafios\n• 📈 Mercado e tendências\n\nFique à vontade para perguntar! Digite sua dúvida ou clique nos botões acima. 😊`,
            sobre: () => `**🌾 Sobre o AgroAssistente**\n\nSou uma inteligência artificial especializada em agronegócio brasileiro, com foco na comparação entre Mato Grosso e Paraná.\n\n**Minhas capacidades:**\n✅ Responder perguntas sobre produtividade\n✅ Comparar dados técnicos entre estados\n✅ Dar insights sobre tecnologias e tendências\n✅ Oferecer suporte com informações atualizadas\n\n**Limitação:** Sou um assistente informativo e não substitui consultoria especializada.\n\nComo posso ajudar você hoje? 🚀`,
            geral: () => {
                const respostas = [
                    `**🤔 Informação interessante!**\n\nSabia que Mato Grosso e Paraná juntos respondem por cerca de 35% da produção nacional de grãos?\n\nQuer saber mais sobre produtividade, clima ou investimentos? Pergunte algo específico! 📊`,
                    `**💡 Dica do dia:**\n\nO agronegócio brasileiro é um dos mais tecnológicos do mundo. Em 2024, a adoção de agricultura de precisão cresceu 25% nos dois estados!\n\nGostaria de saber mais sobre alguma cultura específica? 🌱`,
                    `**📈 Tendência:**\n\nA produção de milho safrinha em MT e a diversificação de culturas no PR estão impulsionando o agro brasileiro.\n\nPosso detalhar mais sobre esses temas se você quiser! 🚜`,
                    `**🌍 Sustentabilidade:**\n\nAmbos os estados têm programas de recuperação de pastagens e integração lavoura-pecuária-floresta (ILPF).\n\nQuer saber mais sobre práticas sustentáveis? 🌱`,
                    `**🎯 Vamos conversar!**\n\nPergunte sobre produtividade, clima, tecnologias ou investimentos. Estou aqui para ajudar você a entender melhor o agro brasileiro! 😊`
                ];
                return respostas[Math.floor(Math.random() * respostas.length)];
            }
        };
        
        return responses[intent] ? responses[intent]() : responses.geral();
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new AgroAssistente();
});