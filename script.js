// ==================== KNOWLEDGE BASE ====================
const KNOWLEDGE_BASE = `
Lemonade Stand Menu and Information:

CLASSIC LEMONADES:
- Original Lemonade: Fresh squeezed lemons, cane sugar, water. $3.50/$4.50/$5.50 (S/M/L)
- Strawberry Lemonade: Original lemonade blended with fresh strawberries. $4.50/$5.50/$6.50
- Mint Lemonade: Original lemonade with fresh mint leaves. $4.00/$5.00/$6.00
- Raspberry Lemonade: Original lemonade with raspberry puree. $4.50/$5.50/$6.50

SPECIALTY DRINKS:
- Pink Paradise: Strawberry lemonade with a splash of cranberry. $5.00/$6.00/$7.00
- Honey Citrus: Lemonade sweetened with honey and fresh orange juice. $4.50/$5.50/$6.50
- Lavender Dream: Lavender-infused lemonade with honey. $5.00/$6.00/$7.00
- Ginger Zing: Lemonade with fresh ginger and mint. $4.50/$5.50/$6.50

SUGAR-FREE OPTIONS:
- Sugar-Free Original: Made with stevia instead of cane sugar. $4.00/$5.00/$6.00
- Sugar-Free Strawberry: Sugar-free lemonade with fresh strawberries. $5.00/$6.00/$7.00

PARTY PACKS:
- Mini Cups (12 pack): 4oz cups, perfect for parties. $18.00
- Regular Cups (12 pack): 8oz cups. $24.00
- Large Pitcher (64oz): Serves 8-10 people. $22.00
- Party Tower (128oz): Serves 16-20 people. $38.00

HOURS & LOCATION:
- Hours: Monday-Friday 10am-8pm, Saturday-Sunday 11am-9pm
- Location: 123 Main Street, Downtown
- Phone: (555) 123-4567

SHIPPING & DELIVERY:
- Local delivery: Free on orders over $15 (within 3 miles)
- Standard shipping: 3-5 business days, $5.99
- Express shipping: 1-2 business days, $12.99
- Party packs ship free!

NUTRITIONAL INFO (per 8oz serving):
- Original Lemonade: 90 calories, 22g sugar
- Strawberry Lemonade: 110 calories, 26g sugar
- Sugar-Free Original: 15 calories, 0g sugar
- Mint Lemonade: 95 calories, 22g sugar

INGREDIENTS:
- All lemonades start with fresh lemons, filtered water
- Sweeteners: cane sugar, honey, stevia (sugar-free)
- Natural flavors: real fruit purees, fresh herbs
- No artificial preservatives or colors

SEASONAL SPECIALS:
- Summer: Watermelon Mint Lemonade (June-August)
- Fall: Apple Cider Lemonade (September-November)
- Winter: Pomegranate Lemonade (December-February)
- Spring: Lavender Honey Lemonade (March-May)

LOYALTY PROGRAM:
- Buy 10 drinks, get 1 free!
- Birthday reward: Free drink during your birthday month
- Student discount: 10% off with valid ID

FAQ:
- Can I customize my drink? Yes! Add flavors for $0.50 each
- Do you have vegan options? All drinks are vegan
- Are your lemons organic? Yes, we use organic lemons
- Do you cater events? Yes! Contact us for catering
`;

// ==================== ENHANCED CHATBOT ENGINE ====================

class EnhancedChatbot {
    constructor(knowledgeBase) {
        // Parse knowledge base into structured sentences with metadata
        this.sentences = this.parseKnowledgeBase(knowledgeBase);
        
        // Preprocess sentences for matching (create word vectors with stemming)
        this.sentenceVectors = this.sentences.map(s => this.textToVector(s.text));
        
        // Synonym dictionary for better matching
        this.synonyms = {
            'price': ['cost', 'how much', 'pricing', '$', 'dollar', 'expensive', 'cheap'],
            'size': ['small', 'medium', 'large', 's', 'm', 'l', 'cup', 'glass'],
            'flavor': ['flavour', 'type', 'kind', 'variety'],
            'lemonade': ['drink', 'beverage', 'refreshment'],
            'hours': ['open', 'close', 'time', 'when'],
            'location': ['where', 'address', 'store', 'stand'],
            'delivery': ['shipping', 'ship', 'deliver', 'mail', 'courier'],
            'ingredients': ['what in', 'contains', 'made of', 'recipe'],
            'calories': ['nutrition', 'calorie', 'healthy', 'fat', 'sugar content'],
            'party': ['cater', 'event', 'bulk', 'large order'],
            'sugar-free': ['no sugar', 'diabetic', 'stevia', 'sugar free'],
            'seasonal': ['special', 'limited', 'holiday', 'summer', 'winter', 'fall', 'spring'],
            'loyalty': ['reward', 'discount', 'deal', 'promotion', 'offer', 'free'],
            'contact': ['phone', 'call', 'email', 'reach']
        };
        
        // Dialogue context
        this.context = {
            lastUserMessage: '',
            lastBotResponse: '',
            lastEntities: {},  // e.g., { drink: 'Strawberry Lemonade', size: 'large', category: 'pricing' }
            conversationHistory: []  // store last few exchanges
        };
        
        // Common conversational intents (no KB retrieval needed)
        this.intentPatterns = [
            { pattern: /\b(hi|hello|hey|howdy)\b/i, response: "Hello! 👋 How can I help you with our lemonades today?" },
            { pattern: /\b(thanks|thank you|appreciate it)\b/i, response: "You're welcome! 😊 Let me know if you need anything else." },
            { pattern: /\b(bye|goodbye|see ya|talk to you later)\b/i, response: "Goodbye! 🍋 Come back anytime!" },
            { pattern: /\b(help|what can you do)\b/i, response: "I can answer questions about our menu, prices, hours, ingredients, shipping, loyalty program, and more! Just ask." }
        ];
    }

    // Parse knowledge base into sentences with categories
    parseKnowledgeBase(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const sentences = [];
        let currentCategory = 'general';
        
        for (let line of lines) {
            if (line.includes('CLASSIC LEMONADES')) currentCategory = 'classic';
            else if (line.includes('SPECIALTY DRINKS')) currentCategory = 'specialty';
            else if (line.includes('SUGAR-FREE OPTIONS')) currentCategory = 'sugar-free';
            else if (line.includes('PARTY PACKS')) currentCategory = 'party';
            else if (line.includes('HOURS & LOCATION')) currentCategory = 'hours-location';
            else if (line.includes('SHIPPING & DELIVERY')) currentCategory = 'shipping';
            else if (line.includes('NUTRITIONAL INFO')) currentCategory = 'nutrition';
            else if (line.includes('INGREDIENTS')) currentCategory = 'ingredients';
            else if (line.includes('SEASONAL SPECIALS')) currentCategory = 'seasonal';
            else if (line.includes('LOYALTY PROGRAM')) currentCategory = 'loyalty';
            else if (line.includes('FAQ')) currentCategory = 'faq';
            else if (line.startsWith('-') || line.includes(':')) {
                sentences.push({
                    text: line,
                    category: currentCategory,
                    // Extract entities like prices, sizes, drink names
                    entities: this.extractEntities(line)
                });
            }
        }
        return sentences;
    }

    // Extract basic entities from a sentence (prices, sizes, drink names)
    extractEntities(text) {
        const entities = {};
        // Price pattern: $XX.XX or $XX
        const priceMatch = text.match(/\$\d+(\.\d{2})?/g);
        if (priceMatch) entities.prices = priceMatch;
        
        // Size indicators: S/M/L, small, medium, large, oz
        if (/(small|medium|large|s\/m\/l|\d+oz)/i.test(text)) {
            entities.hasSize = true;
        }
        
        // Drink names: look for common keywords (simplified)
        const drinkKeywords = ['lemonade', 'original', 'strawberry', 'mint', 'raspberry', 'pink paradise', 'honey citrus', 'lavender dream', 'ginger zing'];
        for (let kw of drinkKeywords) {
            if (text.toLowerCase().includes(kw)) {
                entities.drink = kw;
                break;
            }
        }
        
        return entities;
    }

    // Enhanced text preprocessing with stemming and synonym expansion
    preprocess(text) {
        let processed = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')  // remove punctuation
            .replace(/\s+/g, ' ')
            .trim();
        
        // Simple stemming: remove common endings (very basic)
        const words = processed.split(' ');
        const stemmed = words.map(w => {
            if (w.endsWith('ing')) return w.slice(0, -3);
            if (w.endsWith('s') && w.length > 3) return w.slice(0, -1);
            if (w.endsWith('ed')) return w.slice(0, -2);
            return w;
        });
        
        // Expand synonyms: for each word, add synonyms if available
        let expanded = [];
        for (let word of stemmed) {
            expanded.push(word);
            // Check if word is a key in synonyms, then add all synonym values
            for (let [key, synList] of Object.entries(this.synonyms)) {
                if (key === word || synList.includes(word)) {
                    expanded.push(...synList);
                    break;
                }
            }
        }
        
        return expanded.join(' ');
    }

    // Convert text to word frequency vector (with stemming and synonyms)
    textToVector(text) {
        const processed = this.preprocess(text);
        const words = processed.split(/\s+/).filter(w => w.length > 1);
        const vector = {};
        words.forEach(w => vector[w] = (vector[w] || 0) + 1);
        return vector;
    }

    // Cosine similarity between two vectors
    cosineSimilarity(vecA, vecB) {
        let dot = 0, magA = 0, magB = 0;
        const allWords = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
        for (let w of allWords) {
            const a = vecA[w] || 0;
            const b = vecB[w] || 0;
            dot += a * b;
            magA += a * a;
            magB += b * b;
        }
        if (magA === 0 || magB === 0) return 0;
        return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    }

    // Detect conversational intent (greetings, thanks, etc.)
    detectIntent(query) {
        for (let intent of this.intentPatterns) {
            if (intent.pattern.test(query)) {
                return { type: 'conversational', response: intent.response };
            }
        }
        return { type: 'knowledge' };
    }

    // Handle follow-up queries using context
    resolveFollowUp(query) {
        // If query is very short and likely a follow-up
        const words = query.split(/\s+/).filter(w => w.length > 2);
        if (words.length === 0) {
            // e.g., "and large?" or "what about medium?" or "price?"
            // Try to infer missing info from context
            if (query.match(/\b(large|medium|small|s|m|l)\b/i)) {
                const size = query.match(/\b(large|medium|small|s|m|l)\b/i)[0];
                // If last context had a drink, combine
                if (this.context.lastEntities.drink) {
                    return `${size} ${this.context.lastEntities.drink}`;
                }
            }
            if (query.match(/\b(price|cost|how much)\b/i)) {
                // If last context had a drink, ask about that drink's price
                if (this.context.lastEntities.drink) {
                    return `price of ${this.context.lastEntities.drink}`;
                }
            }
        }
        return query; // return as is if no context resolution
    }

    // Main response generation
    getResponse(userInput) {
        const query = userInput.trim();
        if (!query) return "Please ask me something!";
        
        // Check for conversational intent first
        const intent = this.detectIntent(query);
        if (intent.type === 'conversational') {
            this.updateContext(query, intent.response);
            return intent.response;
        }
        
        // Resolve follow-up using context
        const resolvedQuery = this.resolveFollowUp(query);
        
        // Get vector for resolved query
        const queryVec = this.textToVector(resolvedQuery);
        
        // Calculate similarity with all sentences
        const scored = this.sentences.map((s, idx) => ({
            sentence: s.text,
            entities: s.entities,
            category: s.category,
            score: this.cosineSimilarity(queryVec, this.sentenceVectors[idx])
        }));
        
        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);
        
        // Filter low scores
        const topMatches = scored.filter(m => m.score > 0.1);
        
        if (topMatches.length === 0) {
            const fallback = "I'm not sure I understood. Could you rephrase? You can ask about our menu, prices, hours, or ingredients.";
            this.updateContext(query, fallback);
            return fallback;
        }
        
        // Combine top matches if they are related and have good scores
        let response;
        if (topMatches.length >= 2 && topMatches[0].score > 0.25 && topMatches[1].score > 0.2) {
            // Check if they belong to same category or share entities
            if (topMatches[0].category === topMatches[1].category ||
                (topMatches[0].entities.drink && topMatches[1].entities.drink && topMatches[0].entities.drink === topMatches[1].entities.drink)) {
                response = `${topMatches[0].sentence} ${topMatches[1].sentence}`;
            } else {
                response = topMatches[0].sentence;
            }
        } else {
            response = topMatches[0].sentence;
        }
        
        // Update context with extracted entities from the query and response
        this.updateContext(query, response, topMatches[0].entities);
        
        return response;
    }

    // Update dialogue context
    updateContext(userMsg, botMsg, entities = {}) {
        this.context.lastUserMessage = userMsg;
        this.context.lastBotResponse = botMsg;
        // Merge new entities with existing, but don't overwrite if new is empty
        if (Object.keys(entities).length > 0) {
            this.context.lastEntities = { ...this.context.lastEntities, ...entities };
        }
        // Keep conversation history limited to last 3 exchanges
        this.context.conversationHistory.push({ user: userMsg, bot: botMsg });
        if (this.context.conversationHistory.length > 6) {
            this.context.conversationHistory.shift();
        }
    }

    // Reset context (optional, for clear chat)
    resetContext() {
        this.context = {
            lastUserMessage: '',
            lastBotResponse: '',
            lastEntities: {},
            conversationHistory: []
        };
    }
}

// ==================== INITIALIZATION ====================
const chatbot = new EnhancedChatbot(KNOWLEDGE_BASE);

// ==================== UI CODE (unchanged, but add context reset on clear) ====================
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const clearChatBtn = document.getElementById('clear-chat');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message bot-message typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `<div class="message-content"><p>...</p></div>`;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function handleUserInput() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
    
    addMessage(userMessage, true);
    chatInput.value = '';
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const botResponse = chatbot.getResponse(userMessage);
        addMessage(botResponse);
    }, 700);
}

sendButton.addEventListener('click', handleUserInput);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

clearChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = `
        <div class="message bot-message">
            <div class="message-content">
                <p>Hi there! 👋 I'm Sunny, your lemonade expert. How can I help you ?</p>
                <span class="message-time">Just now</span>
            </div>
        </div>
    `;
    chatbot.resetContext();  // Reset dialogue context
});

suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        chatInput.value = btn.textContent;
        handleUserInput();
    });
});

// Typing indicator style
const style = document.createElement('style');
style.textContent = `
    .typing-indicator .message-content p {
        animation: typing 1.5s infinite;
        font-size: 1.5rem;
        line-height: 1;
    }
    @keyframes typing {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(style);