// ==================== KNOWLEDGE BASE ====================
const KNOWLEDGE_BASE = {
  menu: {
    classic: [
      { name: "Original Lemonade", desc: "Fresh squeezed lemons, cane sugar, water", prices: { S: 3.50, M: 4.50, L: 5.50 }, calories: 90, sugar: 22 },
      { name: "Strawberry Lemonade", desc: "Original lemonade blended with fresh strawberries", prices: { S: 4.50, M: 5.50, L: 6.50 }, calories: 110, sugar: 26 },
      { name: "Mint Lemonade", desc: "Original lemonade with fresh mint leaves", prices: { S: 4.00, M: 5.00, L: 6.00 }, calories: 95, sugar: 22 },
      { name: "Raspberry Lemonade", desc: "Original lemonade with raspberry puree", prices: { S: 4.50, M: 5.50, L: 6.50 } }
    ],
    specialty: [
      { name: "Pink Paradise", desc: "Strawberry lemonade with a splash of cranberry", prices: { S: 5.00, M: 6.00, L: 7.00 } },
      { name: "Honey Citrus", desc: "Lemonade sweetened with honey and fresh orange juice", prices: { S: 4.50, M: 5.50, L: 6.50 } },
      { name: "Lavender Dream", desc: "Lavender-infused lemonade with honey", prices: { S: 5.00, M: 6.00, L: 7.00 } },
      { name: "Ginger Zing", desc: "Lemonade with fresh ginger and mint", prices: { S: 4.50, M: 5.50, L: 6.50 } }
    ],
    sugarFree: [
      { name: "Sugar-Free Original", desc: "Made with stevia instead of cane sugar", prices: { S: 4.00, M: 5.00, L: 6.00 }, calories: 15, sugar: 0 },
      { name: "Sugar-Free Strawberry", desc: "Sugar-free lemonade with fresh strawberries", prices: { S: 5.00, M: 6.00, L: 7.00 } }
    ],
    partyPacks: [
      { name: "Mini Cups (12 pack)", desc: "4oz cups, perfect for parties", price: 18.00 },
      { name: "Regular Cups (12 pack)", desc: "8oz cups", price: 24.00 },
      { name: "Large Pitcher (64oz)", desc: "Serves 8-10 people", price: 22.00 },
      { name: "Party Tower (128oz)", desc: "Serves 16-20 people", price: 38.00 }
    ]
  },
  info: {
    hours: "Monday-Friday 10am-8pm, Saturday-Sunday 11am-9pm",
    location: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    delivery: {
      local: "Free on orders over $15 (within 3 miles)",
      standard: "3-5 business days, $5.99",
      express: "1-2 business days, $12.99",
      partyPacks: "Party packs ship free!"
    },
    ingredients: "All lemonades start with fresh lemons, filtered water. Sweeteners: cane sugar, honey, stevia. Natural flavors: real fruit purees, fresh herbs. No artificial preservatives or colors.",
    loyalty: "Buy 10 drinks, get 1 free! Birthday reward: Free drink during your birthday month. Student discount: 10% off with valid ID.",
    faq: {
      customize: "Yes! Add flavors for $0.50 each",
      vegan: "All drinks are vegan",
      organic: "Yes, we use organic lemons",
      catering: "Yes! Contact us for catering"
    }
  },
  seasonal: {
    summer: "Watermelon Mint Lemonade (June-August)",
    fall: "Apple Cider Lemonade (September-November)",
    winter: "Pomegranate Lemonade (December-February)",
    spring: "Lavender Honey Lemonade (March-May)"
  }
};

// ==================== INTENT CLASSIFIER ====================
class IntentClassifier {
  constructor() {
    // Regex patterns for each intent - more robust than keyword matching
    this.intentPatterns = {
      greeting: [/^(hi|hello|hey|howdy|greetings)\b/i],
      goodbye: [/^(bye|goodbye|see ya|later|cya)\b/i],
      thanks: [/^(thanks?|thank you|thx|appreciate)\b/i],
      ask_pricing: [/\b(price|cost|how much|dollar|bucks|charge|expensive|cheap)\b/i],
      ask_hours: [/\b(hour|open|close|time|when|today|schedule)\b/i],
      ask_location: [/\b(where|address|locate|store|shop|location|find you)\b/i],
      ask_menu: [/\b(menu|have|sell|offer|list|choices|options|flavors?)\b/i],
      ask_drink: [/\b(lemonade|strawberry|mint|raspberry|pink|honey|lavender|ginger|sugar.?free)\b/i],
      ask_sugarfree: [/\b(sugar.?free|no sugar|diabetic|stevia|zero sugar)\b/i],
      ask_party: [/\b(party|cater|bulk|large order|event|group|wedding)\b/i],
      ask_shipping: [/\b(delivery|shipping|ship|deliver|mail|send)\b/i],
      ask_ingredients: [/\b(ingredient|made with|contains|allergen|what'?s in)\b/i],
      ask_nutrition: [/\b(calorie|nutrition|healthy|fat|sugar content|macros)\b/i],
      ask_seasonal: [/\b(seasonal|limited|special|holiday|summer|fall|winter|spring)\b/i],
      ask_loyalty: [/\b(loyalty|reward|discount|deal|promotion|offer|free|points)\b/i],
      ask_contact: [/\b(phone|call|contact|email|reach|help|support)\b/i],
      ask_customize: [/\b(customize|add|extra|hold|without|change|modify)\b/i],
      order_intent: [/\b(order|buy|get|purchase|want|I'?d like|can I have)\b/i],
      clarify_reference: [/\b(that|it|this|those|the (one|drink))\b/i],
      general_question: [/.*/] // Catch-all for open-ended questions
    };
  }

  classify(query) {
    const lowerQuery = query.toLowerCase().trim();
    
    // Check each intent pattern in priority order
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerQuery)) {
          return { intent, confidence: this._calculateConfidence(intent, lowerQuery) };
        }
      }
    }
    return { intent: 'general_question', confidence: 0.5 };
  }

  _calculateConfidence(intent, query) {
    // Simple confidence scoring based on keyword density
    const intentKeywords = {
      ask_pricing: ['price', 'cost', 'much', 'dollar'],
      ask_hours: ['hour', 'open', 'close', 'time'],
      ask_location: ['where', 'address', 'location'],
      // ... add more as needed
    };
    
    const keywords = intentKeywords[intent] || [];
    const matches = keywords.filter(kw => query.includes(kw)).length;
    return Math.min(0.9, 0.5 + (matches * 0.1));
  }
}

// ==================== INFORMATION EXTRACTOR ====================
class InformationExtractor {
  constructor(knowledgeBase) {
    this.kb = knowledgeBase;
    // Build entity dictionaries from knowledge base
    this.entities = {
      drinks: this._extractDrinkNames(),
      sizes: ['small', 'medium', 'large', 's', 'm', 'l', 'mini', 'regular', 'pitcher', 'tower'],
      customizations: ['mint', 'strawberry', 'raspberry', 'honey', 'ginger', 'lavender', 'cranberry', 'orange', 'extra', 'hold', 'without'],
      quantities: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'dozen', 'pack', 'pitcher']
    };
  }

  _extractDrinkNames() {
    const names = [];
    for (const category of Object.values(this.kb.menu)) {
      if (Array.isArray(category)) {
        category.forEach(item => {
          names.push(item.name.toLowerCase());
          // Also add simplified versions for matching
          names.push(item.name.toLowerCase().replace(' lemonade', ''));
        });
      }
    }
    return [...new Set(names)]; // Remove duplicates
  }

  extract(query, context = {}) {
    const lowerQuery = query.toLowerCase();
    const entities = {};

    // Extract drink name
    for (const drink of this.entities.drinks) {
      if (lowerQuery.includes(drink)) {
        // Find the full drink name from KB
        const fullMatch = this._findFullDrinkName(drink);
        if (fullMatch) {
          entities.drink = fullMatch;
          break;
        }
      }
    }

    // Extract size
    for (const size of this.entities.sizes) {
      if (new RegExp(`\\b${size}\\b`, 'i').test(lowerQuery)) {
        entities.size = this._normalizeSize(size);
        break;
      }
    }

    // Extract customizations
    const foundCustomizations = this.entities.customizations.filter(cust => 
      new RegExp(`\\b${cust}\\b`, 'i').test(lowerQuery)
    );
    if (foundCustomizations.length > 0) {
      entities.customizations = foundCustomizations;
    }

    // Extract quantity hints
    if (/\b(12|dozen)\b/i.test(lowerQuery)) entities.quantity = 12;
    if (/\bparty pack\b/i.test(lowerQuery)) entities.isPartyPack = true;

    // Handle pronoun references using context
    if (/\b(that|it|this|the (one|drink))\b/i.test(lowerQuery) && context.lastDrink) {
      entities.drink = context.lastDrink;
      if (context.lastSize) entities.size = context.lastSize;
    }

    return entities;
  }

  _findFullDrinkName(partialName) {
    for (const category of Object.values(this.kb.menu)) {
      if (Array.isArray(category)) {
        const match = category.find(item => 
          item.name.toLowerCase().includes(partialName) || 
          partialName.includes(item.name.toLowerCase().replace(' lemonade', ''))
        );
        if (match) return match.name;
      }
    }
    return null;
  }

  _normalizeSize(size) {
    const sizeMap = {
      's': 'S', 'small': 'S', 'mini': 'S',
      'm': 'M', 'medium': 'M', 'regular': 'M',
      'l': 'L', 'large': 'L', 'pitcher': 'L', 'tower': 'L'
    };
    return sizeMap[size.toLowerCase()] || size.toUpperCase();
  }
}

// ==================== DIALOGUE MANAGER (STATEFUL) ====================
class DialogueManager {
  constructor(knowledgeBase) {
    this.kb = knowledgeBase;
    this.state = {
      lastDrink: null,
      lastSize: null,
      lastCustomizations: [],
      orderInProgress: false,
      orderItems: [],
      userPreferences: {}
    };
  }

  process(intent, entities, query) {
    // Update state with extracted entities
    this._updateState(entities);

    // Route based on intent
    switch (intent) {
      case 'greeting':
        return this._handleGreeting();
      case 'goodbye':
        return this._handleGoodbye();
      case 'thanks':
        return "You're welcome! 😊 Let me know if you need anything else!";
      case 'ask_pricing':
        return this._handlePricing(entities);
      case 'ask_hours':
        return `We're open: ${this.kb.info.hours}`;
      case 'ask_location':
        return `📍 ${this.kb.info.location}\n📞 ${this.kb.info.phone}`;
      case 'ask_menu':
        return this._handleMenuRequest(entities);
      case 'ask_drink':
      case 'order_intent':
        return this._handleDrinkRequest(entities, query);
      case 'ask_sugarfree':
        return this._handleSugarFreeQuery();
      case 'ask_party':
        return this._handlePartyQuery(entities);
      case 'ask_shipping':
        return `🚚 ${this.kb.info.delivery.local}\n📦 Standard: ${this.kb.info.delivery.standard}\n⚡ Express: ${this.kb.info.delivery.express}\n🎉 ${this.kb.info.delivery.partyPacks}`;
      case 'ask_ingredients':
        return `🍋 ${this.kb.info.ingredients}`;
      case 'ask_nutrition':
        return this._handleNutritionQuery(entities);
      case 'ask_seasonal':
        return this._handleSeasonalQuery();
      case 'ask_loyalty':
        return `⭐ ${this.kb.info.loyalty}`;
      case 'ask_contact':
        return `📞 ${this.kb.info.phone}\n📍 ${this.kb.info.location}`;
      case 'ask_customize':
        return this._handleCustomizationQuery(entities);
      case 'clarify_reference':
        return this._handleReference(entities, query);
      case 'general_question':
      default:
        return this._handleOpenEnded(query);
    }
  }

  _updateState(entities) {
    if (entities.drink) this.state.lastDrink = entities.drink;
    if (entities.size) this.state.lastSize = entities.size;
    if (entities.customizations) {
      this.state.lastCustomizations = [...new Set([...this.state.lastCustomizations, ...entities.customizations])];
    }
  }

  _handleGreeting() {
    return "Hello! 👋 I'm Sunny, your lemonade expert. What can I help you with today? You can ask about our menu, prices, hours, or even place an order!";
  }

  _handleGoodbye() {
    this.state = { lastDrink: null, lastSize: null, lastCustomizations: [], orderInProgress: false, orderItems: [], userPreferences: {} };
    return "Goodbye! 🍋 Come back anytime if you have more questions!";
  }

  _handlePricing(entities) {
    if (entities.drink) {
      const drink = this._findDrink(entities.drink);
      if (drink && drink.prices) {
        const prices = Object.entries(drink.prices).map(([size, price]) => `${size}: $${price.toFixed(2)}`).join(', ');
        return `💰 ${entities.drink}: ${prices}`;
      }
    }
    // General pricing info
    return "Our lemonades start at $3.50 for a small. Specialty drinks range from $4.50-$7.00. Would you like pricing for a specific drink?";
  }

  _handleMenuRequest(entities) {
    let response = "🍹 **Our Menu**\n\n";
    
    if (!entities.category || entities.category === 'classic') {
      response += "**Classic Lemonades**:\n";
      this.kb.menu.classic.forEach(d => response += `• ${d.name} - ${d.desc}\n`);
      response += "\n";
    }
    
    if (!entities.category || entities.category === 'specialty') {
      response += "**Specialty Drinks**:\n";
      this.kb.menu.specialty.forEach(d => response += `• ${d.name} - ${d.desc}\n`);
      response += "\n";
    }
    
    if (entities.sugarfree || !entities.category) {
      response += "**Sugar-Free Options**:\n";
      this.kb.menu.sugarFree.forEach(d => response += `• ${d.name} - ${d.desc}\n`);
    }
    
    return response + "\n💡 Tip: Ask about any drink for pricing or nutrition info!";
  }

  _handleDrinkRequest(entities, query) {
    // Check if this is a clarification or new request
    if (!entities.drink && this.state.lastDrink) {
      // User is referring to previous drink - handle customization
      return this._handleCustomizationForLastDrink(entities, query);
    }
    
    if (!entities.drink) {
      return "Which lemonade would you like? We have Original, Strawberry, Mint, Raspberry, and more!";
    }
    
    const drink = this._findDrink(entities.drink);
    if (!drink) {
      return `I couldn't find "${entities.drink}" in our menu. Try: Original, Strawberry, Mint, or Raspberry Lemonade!`;
    }
    
    // Build response with available info
    let response = `✨ **${drink.name}**\n${drink.desc}`;
    
    if (drink.prices) {
      const size = entities.size || this.state.lastSize || 'M';
      const price = drink.prices[size] || drink.prices['M'];
      response += `\n💰 Price (${size}): $${price.toFixed(2)}`;
    }
    
    if (drink.calories !== undefined) {
      response += `\n🥗 ${drink.calories} cal, ${drink.sugar}g sugar (per 8oz)`;
    }
    
    response += `\n\n🔄 Want to customize? Add mint, honey, or other flavors for $0.50!`;
    
    // Save to state for follow-ups
    this.state.lastDrink = drink.name;
    if (entities.size) this.state.lastSize = entities.size;
    
    return response;
  }

  _handleCustomizationForLastDrink(entities, query) {
    const drink = this._findDrink(this.state.lastDrink);
    if (!drink) return "Let's start over - which drink would you like?";
    
    let changes = [];
    if (entities.customizations) {
      // Check for "hold" or "without" requests
      if (query.toLowerCase().includes('hold') || query.toLowerCase().includes('without')) {
        const toRemove = entities.customizations.filter(c => 
          new RegExp(`\\b(hold|without|no)\\s+${c}\\b`, 'i').test(query)
        );
        if (toRemove.length > 0) {
          changes.push(`removing ${toRemove.join(', ')}`);
        }
      } else {
        changes.push(`adding ${entities.customizations.join(', ')}`);
      }
    }
    
    if (changes.length === 0) {
      return `Sure! What customization would you like for your ${this.state.lastDrink}? Add mint, honey, ginger, or other flavors for $0.50 each.`;
    }
    
    const basePrice = drink.prices?.[this.state.lastSize || 'M'] || 4.50;
    const extraCost = entities.customizations?.length * 0.50 || 0;
    const total = basePrice + extraCost;
    
    return `✅ Updated your ${this.state.lastDrink} (${this.state.lastSize || 'M'}): ${changes.join(', ')}\n💰 New total: $${total.toFixed(2)}\n\nReady to order or add more?`;
  }

  _handleSugarFreeQuery() {
    const options = this.kb.menu.sugarFree.map(d => `• ${d.name} - ${d.desc}`).join('\n');
    return `🌿 **Sugar-Free Options**:\n${options}\n\nMade with stevia! All have 0g added sugar. Want pricing or nutrition details?`;
  }

  _handlePartyQuery(entities) {
    if (entities.isPartyPack || entities.quantity) {
      const packs = this.kb.menu.partyPacks.map(p => `• ${p.name}: $${p.price.toFixed(2)} - ${p.desc}`).join('\n');
      return `🎉 **Party Packs**:\n${packs}\n\n🚚 Party packs ship FREE! Need help choosing?`;
    }
    return "We offer catering and party packs! Options include 12-packs of mini/regular cups, or large pitchers (64oz/128oz). What size event are you planning?";
  }

  _handleNutritionQuery(entities) {
    if (entities.drink) {
      const drink = this._findDrink(entities.drink);
      if (drink && drink.calories !== undefined) {
        return `🥗 **${drink.name}** (per 8oz):\n• Calories: ${drink.calories}\n• Sugar: ${drink.sugar}g\n\nAll drinks use fresh ingredients with no artificial preservatives!`;
      }
    }
    return "Nutrition info varies by drink. Original Lemonade: 90 cal, 22g sugar. Strawberry: 110 cal, 26g sugar. Sugar-Free options: ~15 cal, 0g sugar. Ask about a specific drink for details!";
  }

  _handleSeasonalQuery() {
    const currentMonth = new Date().getMonth();
    let season, special;
    
    if ([5,6,7].includes(currentMonth)) { season = 'Summer'; special = this.kb.seasonal.summer; }
    else if ([8,9,10].includes(currentMonth)) { season = 'Fall'; special = this.kb.seasonal.fall; }
    else if ([11,0,1].includes(currentMonth)) { season = 'Winter'; special = this.kb.seasonal.winter; }
    else { season = 'Spring'; special = this.kb.seasonal.spring; }
    
    return `🌸 **Current Seasonal Special** (${season}):\n${special}\n\nLimited time only! Want to try it?`;
  }

  _handleCustomizationQuery(entities) {
    return "✨ **Customize Your Drink**:\n• Add fresh mint, strawberry, raspberry: +$0.50\n• Swap sweetener to honey or stevia: +$0.50\n• Add ginger, lavender, or citrus: +$0.50\n• Hold any ingredient: Free!\n\nJust tell me what you'd like to add or remove!";
  }

  _handleReference(entities, query) {
    if (this.state.lastDrink) {
      return `You're asking about "${this.state.lastDrink}", right? ${query.toLowerCase().includes('price') ? 'It starts at $' + (this._findDrink(this.state.lastDrink)?.prices?.M || '4.50') : 'What specifically would you like to know about it?'}`;
    }
    return "I want to help! Could you clarify which drink you're referring to?";
  }

  _handleOpenEnded(query) {
    // Try to extract intent from open-ended question
    const lower = query.toLowerCase();
    
    if (lower.includes('vegan') || lower.includes('plant based')) {
      return "🌱 Yes! All our drinks are 100% vegan - no animal products or byproducts. Even our honey-sweetened options use plant-based honey alternatives upon request!";
    }
    
    if (lower.includes('organic')) {
      return "🌿 Yes! We use 100% organic lemons in all our lemonades. Our herbs and fruits are sourced from local organic farms when possible.";
    }
    
    if (lower.includes('allergen') || lower.includes('allergy') || lower.includes('nut')) {
      return "⚠️ **Allergen Info**: Our kitchen handles nuts, dairy, and gluten. While our lemonades don't contain these, cross-contamination is possible. Please inform staff of severe allergies.";
    }
    
    if (lower.includes('recommend') || lower.includes('best') || lower.includes('popular')) {
      return "🌟 **Customer Favorites**:\n1. Strawberry Lemonade - sweet & refreshing\n2. Mint Lemonade - cooling & crisp\n3. Honey Citrus - naturally sweetened\n\nWhat flavors do you usually enjoy? I can help you pick!";
    }
    
    if (lower.includes('healthy') || lower.includes('good for you')) {
      return "💚 **Healthy Choices**:\n• Sugar-Free options: 15 cal, 0g sugar\n• All drinks: Fresh squeezed lemons (vitamin C!)\n• No artificial colors/preservatives\n• Add mint or ginger for extra antioxidants\n\nWant nutrition details for a specific drink?";
    }
    
    // Fallback with helpful suggestions
    return `I'd love to help! Here are some things I can assist with:\n🍹 Menu & pricing\n⏰ Hours & location\n🌿 Ingredients & nutrition\n🎉 Party orders & catering\n💳 Loyalty rewards\n\nWhat would you like to know?`;
  }

  _findDrink(name) {
    for (const category of Object.values(this.kb.menu)) {
      if (Array.isArray(category)) {
        const match = category.find(item => 
          item.name.toLowerCase() === name.toLowerCase() ||
          item.name.toLowerCase().includes(name.toLowerCase())
        );
        if (match) return match;
      }
    }
    return null;
  }

  getState() {
    return { ...this.state };
  }

  resetState() {
    this.state = {
      lastDrink: null,
      lastSize: null,
      lastCustomizations: [],
      orderInProgress: false,
      orderItems: [],
      userPreferences: {}
    };
  }
}

// ==================== MAIN CHATBOT CLASS ====================
class Chatbot {
  constructor(knowledgeBase) {
    this.kb = knowledgeBase;
    this.intentClassifier = new IntentClassifier();
    this.extractor = new InformationExtractor(knowledgeBase);
    this.dialogueManager = new DialogueManager(knowledgeBase);
  }

  preprocess(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  getResponse(userInput) {
    const query = this.preprocess(userInput);
    
    // Handle simple greetings/thanks/goodbyes first
    if (/^(hi|hello|hey|howdy)/i.test(query)) {
      return this.dialogueManager.process('greeting', {}, query);
    }
    if (/^(thanks?|thank you|thx)/i.test(query)) {
      return this.dialogueManager.process('thanks', {}, query);
    }
    if (/^(bye|goodbye|see ya)/i.test(query)) {
      return this.dialogueManager.process('goodbye', {}, query);
    }

    // Classify intent
    const { intent, confidence } = this.intentClassifier.classify(query);
    
    // Extract entities with current context
    const context = this.dialogueManager.getState();
    const entities = this.extractor.extract(query, context);
    
    // Process through dialogue manager
    return this.dialogueManager.process(intent, entities, query);
  }

  // For debugging/testing
  getState() {
    return this.dialogueManager.getState();
  }

  reset() {
    this.dialogueManager.resetState();
  }
}

// ==================== DOM INTEGRATION (Same as original) ====================
// Initialize chatbot
const chatbot = new Chatbot(KNOWLEDGE_BASE);

// DOM Elements (ensure these exist in your HTML)
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const clearChatBtn = document.getElementById('clear-chat');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');

// Add message to chat
function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Convert markdown-like formatting to HTML
  const formattedMessage = message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  
  messageDiv.innerHTML = `
    <div class="message-content">
      <p>${formattedMessage}</p>
      <span class="message-time">${time}</span>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'message bot-message typing-indicator';
  indicator.id = 'typing-indicator';
  indicator.innerHTML = `<div class="message-content"><p>...</p></div>`;
  chatMessages.appendChild(indicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

// Handle user input
async function handleUserInput() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  
  addMessage(userMessage, true);
  chatInput.value = '';
  showTypingIndicator();
  
  setTimeout(() => {
    removeTypingIndicator();
    const botResponse = chatbot.getResponse(userMessage);
    addMessage(botResponse);
  }, 600 + Math.random() * 400);
}

// Event Listeners
sendButton?.addEventListener('click', handleUserInput);
chatInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleUserInput();
});
clearChatBtn?.addEventListener('click', () => {
  chatbot.reset();
  chatMessages.innerHTML = `<div class="message bot-message"><div class="message-content"><p>Hi there! 👋 I'm Sunny, your lemonade expert. How can I help you today?</p><span class="message-time">Just now</span></div></div>`;
});
suggestionBtns?.forEach(btn => {
  btn.addEventListener('click', () => {
    chatInput.value = btn.textContent;
    handleUserInput();
  });
});

// Add CSS for typing indicator
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
  .message-content p { margin: 0; white-space: pre-wrap; }
  .message-content strong { font-weight: 600; }
`;
document.head?.appendChild(style);

const input = document.getElementById("chat-input");

input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
});

