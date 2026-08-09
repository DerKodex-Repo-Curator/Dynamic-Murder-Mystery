// --- DOM Elements ---
const uiVictim = document.getElementById('ui-victim');
const uiLocation = document.getElementById('ui-location');
const uiWeapon = document.getElementById('ui-weapon');
const uiSuspects = document.getElementById('ui-suspects');
const currentSuspectHeader = document.getElementById('current-suspect');
const chatHistoryDiv = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// --- Settings DOM Elements ---
const apiProvider = document.getElementById('api-provider');
const apiKeyInput = document.getElementById('api-key');
const keyContainer = document.getElementById('key-container');
const apiModelInput = document.getElementById('api-model');
const apiEndpointInput = document.getElementById('api-endpoint');

// --- Settings DOM Elements ---
const apiProvider = document.getElementById('api-provider');
const apiKeyInput = document.getElementById('api-key');
const keyContainer = document.getElementById('key-container');
const apiModelInput = document.getElementById('api-model');
const apiEndpointInput = document.getElementById('api-endpoint');

// --- LocalStorage Settings Logic ---
function saveSettings() {
    localStorage.setItem('apiProvider', apiProvider.value);
    localStorage.setItem('apiKey', apiKeyInput.value);
    localStorage.setItem('apiModel', apiModelInput.value);
    localStorage.setItem('apiEndpoint', apiEndpointInput.value);
}

function loadSettings() {
    if (localStorage.getItem('apiProvider')) apiProvider.value = localStorage.getItem('apiProvider');
    if (localStorage.getItem('apiKey')) apiKeyInput.value = localStorage.getItem('apiKey');
    if (localStorage.getItem('apiModel')) apiModelInput.value = localStorage.getItem('apiModel');
    if (localStorage.getItem('apiEndpoint')) apiEndpointInput.value = localStorage.getItem('apiEndpoint');

    toggleApiFields(false); // Update UI visibility without overwriting loaded text values
}

// --- Global State ---
let gameState = null;
let currentSuspectIndex = null;
let chatHistories = [];

// --- Toggle UI options when provider changes ---
// --- Toggle UI options when provider changes ---
function toggleApiFields(resetDefaults = true) {
    const isOnline = apiProvider.value === 'online';
    keyContainer.style.display = isOnline ? 'block' : 'none';

    // Only overwrite inputs with defaults if the user is actively changing the dropdown
    if (resetDefaults) {
        if (isOnline) {
            // Default to OpenRouter settings
            apiEndpointInput.value = 'https://openrouter.ai/api/v1';
            apiModelInput.value = 'nvidia/nemotron-3-ultra-550b-a55b:free';
        } else {
            // Default to Ollama settings
            apiEndpointInput.value = 'http://localhost:11434';
            apiModelInput.value = 'llama3.1';
        }
    }
    saveSettings();
}
// Attach event listeners to save settings automatically when you type
apiProvider.addEventListener('change', () => toggleApiFields(true));
apiKeyInput.addEventListener('input', saveSettings);
apiModelInput.addEventListener('input', saveSettings);
apiEndpointInput.addEventListener('input', saveSettings);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings(); // Load keys before starting the game
    initGame();     // Then start the game

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});

/**
 * UNIFIED API WRAPPER
 * Handles formatting differences between Ollama and OpenAI-compatible endpoints
 */
async function callAI(messages, isJsonFormat = false) {
    const provider = apiProvider.value;
    const apiKey = apiKeyInput.value.trim();
    const model = apiModelInput.value.trim();
    const endpoint = apiEndpointInput.value.trim().replace(/\/$/, '');

    if (provider === 'online' && !apiKey) {
        throw new Error('Please enter an API key for the Online API option.');
    }

    if (provider === 'local') {
        // Ollama API Payload
        const payload = {
            model: model || 'llama3.1',
            messages: messages,
            stream: false,
            temperature: 0.0
        };
        if (isJsonFormat) payload.format = 'json';

        const res = await fetch(`${endpoint}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`Ollama Error (${res.status}): Ensure Ollama is running.`);
        const data = await res.json();
        return data.message.content;

    } else {
        // Standard OpenAI-compatible Payload (OpenAI, Groq, OpenRouter, etc.)
        const payload = {
            model: model || 'gpt-4o-mini',
            messages: messages,
            stream: false,
            temperature: 0.0
        };
        if (isJsonFormat) {
            payload.response_format = { type: 'json_object' };
        }

        const res = await fetch(`${endpoint}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(`Online API Error (${res.status}): ${errData.error?.message || res.statusText}`);
        }

        const data = await res.json();
        return data.choices[0].message.content;
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});

/**
 * Step 1: Trigger Game Master prompt
 */
async function initGame() {
    uiVictim.textContent = "Generating case...";
    uiLocation.textContent = "Generating case...";
    uiWeapon.textContent = "Generating case...";
    uiSuspects.innerHTML = '<button class="suspect-btn" disabled>Generating...</button>';
    chatHistoryDiv.innerHTML = `<div class="msg system">Contacting AI to build a new murder case...</div>`;

    const systemPrompt = `You are a murder mystery game master. Invent a unique, intriguing murder mystery scenario.
Output strictly valid JSON with no markdown formatting or commentary. 
Ensure the word JSON is respected and format matches this exact structure:
{
  "victim_name": "Full Name",
  "location": "Specific Location",
  "weapon": "Murder Weapon",
  "suspects": [
    {
      "name": "Suspect Name 1",
      "personality": "Brief personality traits",
      "relationship": "Relationship to victim",
      "is_killer": true
    },
    {
      "name": "Suspect Name 2",
      "personality": "Brief personality traits",
      "relationship": "Relationship to victim",
      "is_killer": false
    },
    {
      "name": "Suspect Name 3",
      "personality": "Brief personality traits",
      "relationship": "Relationship to victim",
      "is_killer": false
    }
  ]
}`;

    try {
        const responseContent = await callAI([{ role: 'user', content: systemPrompt }], true);
        gameState = JSON.parse(responseContent);
        setupGameUI();
    } catch (error) {
        console.error('Error generating game:', error);
        chatHistoryDiv.innerHTML = `<div class="msg system" style="color: var(--accent-color)">Failed to start game: ${error.message}</div>`;
    }
}

/**
 * Step 2: Setup Game UI & Suspect Personas
 */
function setupGameUI() {
    uiVictim.textContent = gameState.victim_name;
    uiLocation.textContent = gameState.location;
    uiWeapon.textContent = gameState.weapon;
    uiSuspects.innerHTML = '';

    chatHistories = gameState.suspects.map((suspect) => {
        const systemPersona = suspect.is_killer
            ? `You are playing ${suspect.name} in a murder mystery. Personality: ${suspect.personality}. Relationship to victim (${gameState.victim_name}): ${suspect.relationship}.
YOU ARE THE KILLER. You murdered ${gameState.victim_name} at ${gameState.location} using ${gameState.weapon}.
Do NOT confess immediately. Lie and act innocent, but leave subtle clues if pressed. Keep answers under 3 sentences.`
            : `You are playing ${suspect.name} in a murder mystery. Personality: ${suspect.personality}. Relationship to victim (${gameState.victim_name}): ${suspect.relationship}.
YOU ARE INNOCENT. You did not kill ${gameState.victim_name}. Respond naturally. Keep answers under 3 sentences.`;

        const strictPrompt = `You are playing the role of ${suspect.name}. Personality: ${suspect.personality}. Relationship to victim: ${suspect.relationship}. 
${role}
STRICT ROLEPLAY RULES: 
1. Keep answers under 2 sentences. 
2. Before answering, quietly review this chat history. 
3. NEVER invent new locations or change your story from your previous messages. 
4. If the detective asks you the exact same question again, explicitly say "I already told you," and repeat your previous answer verbatim. Do not add new details.`;

        return [{
            role: 'system', content: strictPrompt
        }];
    });

    gameState.suspects.forEach((s, i) => {
        // Extract initials for the avatar (e.g., "James Parker" -> "JP")
        const nameParts = s.name.split(' ');
        const initials = nameParts.length > 1
            ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
            : nameParts[0][0].toUpperCase();

        // Create the new card layout
        const card = document.createElement('div');
        card.className = 'suspect-card';
        card.onclick = () => selectSuspect(i);

        card.innerHTML = `
          <div class="avatar">${initials}</div>
          <div class="suspect-info">
            <strong>${s.name}</strong>
            <small>${s.relationship}</small>
          </div>
        `;

        uiSuspects.appendChild(card);
    });

    chatHistoryDiv.innerHTML = `<div class="msg system">Case files loaded. Select a suspect from the left to start interrogating.</div>`;
}

function selectSuspect(index) {
    currentSuspectIndex = index;
    const suspect = gameState.suspects[index];

    currentSuspectHeader.textContent = `${suspect.name} (${suspect.relationship})`;
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.placeholder = `Question ${suspect.name}...`;

    const buttons = uiSuspects.querySelectorAll('.suspect-card');
    buttons.forEach((btn, i) => btn.classList.toggle('active', i === index));

    renderChatHistory();
}

function renderChatHistory() {
    chatHistoryDiv.innerHTML = '';
    const history = chatHistories[currentSuspectIndex];
    const displayMessages = history.slice(1); // Hide initial system prompt

    if (displayMessages.length === 0) {
        const suspectName = gameState.suspects[currentSuspectIndex].name;
        chatHistoryDiv.innerHTML = `<div class="msg system">${suspectName} has taken a seat in the interrogation room.</div>`;
        return;
    }

    displayMessages.forEach((msg) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${msg.role === 'user' ? 'user' : 'suspect'}`;
        msgDiv.textContent = msg.content;
        chatHistoryDiv.appendChild(msgDiv);
    });

    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}

/**
 * Step 3: Send Question to Active Suspect
 */
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || currentSuspectIndex === null) return;

    chatHistories[currentSuspectIndex].push({ role: 'user', content: text });
    chatInput.value = '';
    renderChatHistory();

    const typingDiv = document.createElement('div');
    typingDiv.className = 'msg system';
    typingDiv.id = 'typing-indicator';
    typingDiv.textContent = `${gameState.suspects[currentSuspectIndex].name} is thinking...`;
    chatHistoryDiv.appendChild(typingDiv);
    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

    chatInput.disabled = true;
    sendBtn.disabled = true;

    try {
        const suspectReply = await callAI(chatHistories[currentSuspectIndex], false);
        chatHistories[currentSuspectIndex].push({ role: 'assistant', content: suspectReply });
    } catch (error) {
        console.error('Error fetching response:', error);
        chatHistories[currentSuspectIndex].push({
            role: 'assistant',
            content: `[Error: ${error.message}]`
        });
    } finally {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();

        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
        renderChatHistory();
    }
}