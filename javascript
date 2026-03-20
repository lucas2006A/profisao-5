<script>
// ============================================
// IA ASSISTENTE INTELIGENTE - AGROCOMPARE
// ============================================

class AgroAssistente {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Adicionar chips de sugestão
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                this.chatInput.value = question;
                this.sendMessage();
            });
        });
        
        // Auto-foco no input
        this.chatInput.focus();
    }
    
    showTyping() {
        this.typingIndicator.classList.add('visible');
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.typingIndicator.classList.remove('visible');
    }
    
    scrollToBottom() {
        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Converter texto com formatação
        const formattedText = this.formatMessage(text);
        contentDiv.innerHTML = formattedText;
        
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(text) {
        // Converter quebras de linha para <br>
        let formatted = text.replace(/\n/g, '<br>');
        
        // Destacar tópicos importantes
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Converter listas
        formatted = formatted.replace(/^• (.*?)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/<li>.*?<\/li>/g, (match) => {
            return `<ul class="message-list">${match}</ul>`;
        });
        
        // Converter emojis
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
            const regex = new RegExp(key, 'gi');
            formatted = formatted.replace(regex, `${emoji} ${key}`);
        }
        
        return formatted;
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Adicionar mensagem do usuário
        this.addMessage(message, true);
        
        // Limpar input
        this.chatInput.value = '';
        
        // Mostrar indicador de digitação
        this.showTyping();
        
        // Processar resposta com delay natural
        setTimeout(() => {
            const response = this.getIntelligentResponse(message);
            this.hideTyping();
            this.addMessage(response);
            this.scrollToBottom();
        }, 500 + Math.random() * 500);
        
        // Manter foco no input
        setTimeout(() => this.chatInput.focus(), 100);
    }
    
    getIntelligentResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        // Base de conhecimento expandida
        const knowledgeBase = {
            // Saudações
            saudacoes: ['oi', 'olá', 'opa', 'boa tarde', 'bom dia', 'boa noite', 'hey', 'e aí', 'fala'],
            
            // Comparações MT vs PR
            produtividade: ['produtividade', 'produção', 'hectare', 'colheita', 'safra'],
            clima: ['clima', 'tempo', 'chuva', 'seca', 'geada', 'temperatura'],
            solo: ['solo', 'terra', 'plantio', 'cultivo'],
            
            // Culturas
            soja: ['soja', 'grão', 'oleaginosa'],
            milho: ['milho', 'safrinha', 'segunda safra'],
            trigo: ['trigo', 'cereal'],
            
            // Tecnologia
            tecnologia: ['tecnologia', 'digital', 'automação', 'drone', 'software', 'app', 'ia', 'inteligência artificial'],
            inovacao: ['inovação', 'moderno', 'futuro', 'tendência'],
            
            // Economia
            investimento: ['investir', 'investimento', 'rentabilidade', 'lucro', 'retorno', 'custo'],
            mercado: ['mercado', 'preço', 'cotação', 'venda', 'exportação'],
            
            // Desafios
            desafios: ['desafio', 'dificuldade', 'problema', 'barreira', 'obstáculo'],
            sustentabilidade: ['sustentável', 'meio ambiente', 'ambiental', 'conservação'],
            
            // Suporte
            ajuda: ['ajuda', 'como funciona', 'o que você faz', 'pode fazer', 'ajudar'],
            sobre: ['quem é você', 'o que é', 'sobre você', 'sua função']
        };
        
        // Detectar intenção
        let intent = 'geral';
        for (let [key, keywords] of Object.entries(knowledgeBase)) {
            if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
                intent = key;
                break;
            }
        }
        
        // Respostas inteligentes baseadas na intenção
        const responses = {
            saudacoes: () => {
                const saudações = [
                    "Olá! 👋 Que bom ter você por aqui! Como posso ajudar com informações sobre agronegócio hoje?",
                    "Oi! 😊 Estou aqui para ajudar! Quer saber mais sobre a comparação entre MT e PR?",
                    "Olá! 🌾 Pronto para descobrir dados incríveis sobre o agro brasileiro?"
                ];
                return saudações[Math.floor(Math.random() * saudações.length)];
            },
            
            produtividade: () => {
                return `**📊 Comparativo de Produtividade - MT x PR**\n\n` +
                       `**Mato Grosso (MT):**\n` +
                       `• Soja: 58 sacas/ha (média nacional: 55)\n` +
                       `• Milho: 102 sacas/ha (líder nacional)\n` +
                       `• Algodão: 4.800 kg/ha\n\n` +
                       `**Paraná (PR):**\n` +
                       `• Soja: 56 sacas/ha\n` +
                       `• Milho: 95 sacas/ha\n` +
                       `• Trigo: 2.800 kg/ha (maior produtor nacional)\n\n` +
                       `**Destaque:** MT lidera em produtividade de soja e milho, enquanto PR se destaca no trigo! 🏆`;
            },
            
            clima: () => {
                return `**🌤️ Análise Climática Comparativa**\n\n` +
                       `**Mato Grosso:**\n` +
                       `• Clima tropical com estações bem definidas\n` +
                       `• Chuvas regulares de outubro a abril\n` +
                       `• Período de estiagem de maio a setembro\n` +
                       `• Ideal para safra de verão e safrinha\n\n` +
                       `**Paraná:**\n` +
                       `• Clima subtropical com maior variação\n` +
                       `• Risco de geadas no sul do estado\n` +
                       `• Distribuição mais uniforme de chuvas\n` +
                       `• Favorável para múltiplas culturas\n\n` +
                       `**💡 Insight:** MT tem vantagem para culturas de verão, PR oferece maior diversidade de cultivos!`;
            },
            
            solo: () => {
                return `**🌱 Características do Solo**\n\n` +
                       `**Mato Grosso:**\n` +
                       `• Predomínio de Latossolos (solos profundos e bem drenados)\n` +
                       `• Topografia plana a suave ondulada\n` +
                       `• Ideal para mecanização intensiva\n` +
                       `• Cerrado brasileiro com alta fertilidade após correção\n\n` +
                       `**Paraná:**\n` +
                       `• Diversidade de tipos de solo\n` +
                       `• Terra roxa (alta fertilidade natural)\n` +
                       `• Topografia mais acidentada\n` +
                       `• Maior necessidade de práticas conservacionistas\n\n` +
                       `**🔬 Conclusão:** Ambos têm solos de alta qualidade, mas com características distintas!`;
            },
            
            soja: () => {
                return `**🌱 Soja: Comparativo MT x PR**\n\n` +
                       `**Mato Grosso:**\n` +
                       `• Maior produtor nacional (26% da produção)\n` +
                       `• Safra: setembro/outubro a janeiro/fevereiro\n` +
                       `• Produtividade média: 58 sacas/ha\n` +
                       `• Tecnologia: alta mecanização e precisão\n\n` +
                       `**Paraná:**\n` +
                       `• 2º maior produtor nacional (15% da produção)\n` +
                       `• Safra: outubro a fevereiro/março\n` +
                       `• Produtividade média: 56 sacas/ha\n` +
                       `• Diferencial: grãos de alta qualidade\n\n` +
                       `**📈 Tendência:** MT ampliando área, PR investindo em qualidade e valor agregado!`;
            },
            
            milho: () => {
                return `**🌽 Milho: Comparativo MT x PR**\n\n` +
                       `**Mato Grosso:**\n` +
                       `• Líder nacional em produção\n` +
                       `• Safrinha (segunda safra) é predominante\n` +
                       `• Produtividade: 102 sacas/ha\n` +
                       `• Área plantada: mais de 5 milhões de hectares\n\n` +
                       `**Paraná:**\n` +
                       `• 3º maior produtor nacional\n` +
                       `• Safra de verão e safrinha\n` +
                       `• Produtividade: 95 sacas/ha\n` +
                       `• Grãos de alto valor agregado\n\n` +
                       `**🚜 Destaque:** MT é o "celeiro do milho" brasileiro, mas PR tem qualidade reconhecida!`;
            },
            
            tecnologia: () => {
                return `**🚜 Tecnologias no Agronegócio**\n\n` +
                       `**Principais inovações:**\n` +
                       `• **Agricultura de Precisão:** GPS, drones, sensores\n` +
                       `• **Biotecnologia:** sementes geneticamente melhoradas\n` +
                       `• **IoT:** sensores de solo e clima em tempo real\n` +
                       `• **IA e Machine Learning:** previsão de safras e manejo\n` +
                       `• **Blockchain:** rastreabilidade da produção\n\n` +
                       `**Adoção por estado:**\n` +
                       `MT: Alta adoção em grandes propriedades\n` +
                       `PR: Tecnologia difundida em todas as escalas\n\n` +
                       `**💡 Futuro:** Agricultura 4.0 e sustentabilidade digital!`;
            },
            
            investimento: () => {
                return `**💰 Onde investir no agronegócio?**\n\n` +
                       `**Mato Grosso - Oportunidades:**\n` +
                       `✅ Escala de produção\n` +
                       `✅ Logística ferroviária em expansão\n` +
                       `✅ Baixo custo por hectare\n` +
                       `⚠️ Dependência de commodities\n\n` +
                       `**Paraná - Oportunidades:**\n` +
                       `✅ Diversificação de culturas\n` +
                       `✅ Agroindústria consolidada\n` +
                       `✅ Mercado consumidor próximo\n` +
                       `✅ Infraestrutura de escoamento\n\n` +
                       `**Recomendação:**\n` +
                       `MT para escala e commodities | PR para diversificação e valor agregado\n\n` +
                       `Lembre-se: consulte especialistas para análise personalizada! 📊`;
            },
            
            desafios: () => {
                return `**⚠️ Principais Desafios do Produtor Rural**\n\n` +
                       `**Desafios comuns:**\n` +
                       `• **Clima:** secas, geadas, eventos extremos\n` +
                       `• **Logística:** escoamento da produção\n` +
                       `• **Custos:** insumos e financiamentos\n` +
                       `• **Mão de obra:** qualificação técnica\n` +
                       `• **Sustentabilidade:** pressões ambientais\n\n` +
                       `**Como superar:**\n` +
                       `✅ Investir em tecnologia e gestão\n` +
                       `✅ Planejamento financeiro estratégico\n` +
                       `✅ Associativismo e cooperativismo\n` +
                       `✅ Capacitação contínua\n\n` +
                       `O agro brasileiro é resiliente e inovador! 🌟`;
            },
            
            ajuda: () => {
                return `**🤖 Como posso ajudar você?**\n\n` +
                       `Posso falar sobre:\n` +
                       `• 📊 Comparativos entre MT e PR\n` +
                       `• 🌱 Culturas (soja, milho, trigo, algodão)\n` +
                       `• 💰 Investimentos e rentabilidade\n` +
                       `• 🚜 Tecnologias e inovações\n` +
                       `• 🌍 Sustentabilidade e desafios\n` +
                       `• 📈 Mercado e tendências\n\n` +
                       `Fique à vontade para perguntar! Digite sua dúvida ou clique nos botões acima. 😊`;
            },
            
            sobre: () => {
                return `**🌾 Sobre o AgroAssistente**\n\n` +
                       `Sou uma inteligência artificial especializada em agronegócio brasileiro, com foco na comparação entre Mato Grosso e Paraná.\n\n` +
                       `**Minhas capacidades:**\n` +
                       `✅ Responder perguntas sobre produtividade\n` +
                       `✅ Comparar dados técnicos entre estados\n` +
                       `✅ Dar insights sobre tecnologias e tendências\n` +
                       `✅ Oferecer suporte com informações atualizadas\n\n` +
                       `**Limitação:** Sou um assistente informativo e não substitui consultoria especializada.\n\n` +
                       `Como posso ajudar você hoje? 🚀`;
            },
            
            geral: () => {
                const respostasGerais = [
                    `**🤔 Informação interessante!**\n\n` +
                    `Sabia que Mato Grosso e Paraná juntos respondem por cerca de 35% da produção nacional de grãos?\n\n` +
                    `Quer saber mais sobre produtividade, clima ou investimentos? Pergunte algo específico! 📊`,
                    
                    `**💡 Dica do dia:**\n\n` +
                    `O agronegócio brasileiro é um dos mais tecnológicos do mundo. Em 2024, a adoção de agricultura de precisão cresceu 25% nos dois estados!\n\n` +
                    `Gostaria de saber mais sobre alguma cultura específica? 🌱`,
                    
                    `**📈 Tendência:**\n\n` +
                    `A produção de milho safrinha em MT e a diversificação de culturas no PR estão impulsionando o agro brasileiro.\n\n` +
                    `Posso detalhar mais sobre esses temas se você quiser! 🚜`,
                    
                    `**🌍 Sustentabilidade:**\n\n` +
                    `Ambos os estados têm programas de recuperação de pastagens e integração lavoura-pecuária-floresta (ILPF).\n\n` +
                    `Quer saber mais sobre práticas sustentáveis? 🌱`,
                    
                    `**🎯 Vamos conversar!**\n\n` +
                    `Pergunte sobre produtividade, clima, tecnologias ou investimentos. Estou aqui para ajudar você a entender melhor o agro brasileiro! 😊`
                ];
                return respostasGerais[Math.floor(Math.random() * respostasGerais.length)];
            }
        };
        
        // Retornar resposta baseada na intenção detectada
        if (responses[intent]) {
            return responses[intent]();
        } else {
            return responses.geral();
        }
    }
}

// Inicializar o assistente quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new AgroAssistente();
});
</script>