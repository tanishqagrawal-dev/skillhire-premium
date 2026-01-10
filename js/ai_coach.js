
const aiChatWindow = document.getElementById('ai-chat-body');
const aiInput = document.getElementById('ai-input');
const aiMessages = document.getElementById('ai-messages');

let isChatOpen = false;
let chatHistory = [];
let recognition;
let synthesis = window.speechSynthesis;
let isListening = false;
let isSpeaking = false;

// Initialize
async function initAICoach() {
    // Inject Voice Controls into Header
    const header = document.querySelector('#ai-chat-body .chat-header');
    if (!header.querySelector('.chat-controls')) {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'chat-controls';

        // Mute/Unmute Toggle (for TTS)
        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'chat-control-btn';
        speakerBtn.id = 'ai-speaker-btn';
        speakerBtn.title = "Toggle Text-to-Speech";
        speakerBtn.onclick = toggleSpeech;
        speakerBtn.innerHTML = '<i data-lucide="volume-2"></i>';

        controlsDiv.appendChild(speakerBtn);

        // Insert before close button
        const closeBtn = header.querySelector('button[onclick="toggleChat()"]');
        header.insertBefore(controlsDiv, closeBtn);
    }

    // Inject Mic Button into Input Area
    const inputArea = document.querySelector('.chat-input-area');
    if (!inputArea.querySelector('#ai-mic-btn')) {
        const micBtn = document.createElement('button');
        micBtn.id = 'ai-mic-btn';
        micBtn.className = 'chat-control-btn';
        micBtn.style.marginRight = "8px";
        micBtn.innerHTML = '<i data-lucide="mic"></i>';
        micBtn.onclick = toggleVoiceInput;

        inputArea.insertBefore(micBtn, aiInput);
    }

    lucide.createIcons();

    // Check availability of APIs
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn("Speech Recognition not supported");
        document.getElementById('ai-mic-btn').style.display = 'none';
    } else {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            document.getElementById('ai-mic-btn').classList.add('listening');
        };

        recognition.onend = () => {
            isListening = false;
            document.getElementById('ai-mic-btn').classList.remove('listening');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            aiInput.value = transcript;
            sendMessage(); // Auto-send on voice end
        };

        recognition.onerror = (event) => {
            console.error("Speech Rec Error", event.error);
            isListening = false;
            document.getElementById('ai-mic-btn').classList.remove('listening');
        };
    }

    // Load History
    if (window.firebaseService) {
        // Wait for auth to be ready (simple check)
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const savedHistory = await window.firebaseService.loadChat(user.uid);
                if (savedHistory && savedHistory.length > 0) {
                    chatHistory = savedHistory;
                    // Re-render
                    aiMessages.innerHTML = '';
                    chatHistory.forEach(msg => {
                        const msgDiv = document.createElement('div');
                        msgDiv.className = `chat-message ${msg.role}`;
                        let formattedText = msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                        formattedText = formattedText.replace(/\n/g, '<br>');
                        msgDiv.innerHTML = formattedText;
                        aiMessages.appendChild(msgDiv);
                    });
                    aiMessages.scrollTop = aiMessages.scrollHeight;
                } else {
                    addMessage('model', "Hello! I'm your AI Career Coach. How can I help you today?");
                }
            } else {
                addMessage('model', "Hello! Please log in to save your chat history.");
            }
        });
    } else {
        if (chatHistory.length === 0) {
            addMessage('model', "Hello! I'm your AI Career Coach. How can I help you today?");
        }
    }
}

function toggleChat() {
    isChatOpen = !isChatOpen;
    const widget = document.getElementById('ai-coach-widget');
    if (isChatOpen) {
        aiChatWindow.classList.remove('hidden');
        widget.classList.add('active'); // Add active class to container if needed
        setTimeout(() => aiInput.focus(), 100);
    } else {
        aiChatWindow.classList.add('hidden');
        widget.classList.remove('active');
        if (synthesis.speaking) synthesis.cancel();
    }
}

function toggleVoiceInput() {
    if (!recognition) return alert("Voice input not supported in this browser.");

    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

let ttsEnabled = true;
function toggleSpeech() {
    ttsEnabled = !ttsEnabled;
    const btn = document.getElementById('ai-speaker-btn');
    if (ttsEnabled) {
        btn.innerHTML = '<i data-lucide="volume-2"></i>';
        btn.classList.remove('active'); // styling choice
    } else {
        if (synthesis.speaking) synthesis.cancel();
        btn.innerHTML = '<i data-lucide="volume-x"></i>';
        btn.classList.add('active'); // indicate muted state visually if desired
    }
    lucide.createIcons();
}

function speak(text) {
    if (!ttsEnabled || !synthesis) return;

    // Clean text (remove markdown mostly)
    const cleanText = text.replace(/\*\*/g, '').replace(/#/g, '').replace(/\[.*\]/g, '');

    if (synthesis.speaking) synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.volume = 1;
    utterance.rate = 1.1; // Slightly faster
    utterance.pitch = 1;

    const voiceBtn = document.getElementById('ai-speaker-btn');
    utterance.onstart = () => voiceBtn.classList.add('speaking');
    utterance.onend = () => voiceBtn.classList.remove('speaking');

    synthesis.speak(utterance);
}

async function sendMessage() {
    const text = aiInput.value.trim();
    if (!text) return;

    if (!window.geminiService.hasApiKey()) {
        const key = prompt("Please enter your Google Gemini API Key to enable the AI Coach:");
        if (key) {
            localStorage.setItem('GEMINI_API_KEY', key.trim());
            window.geminiService.apiKey = key.trim();
            addMessage('model', "API Key saved successfully! I am ready to help.");
        } else {
            addMessage('model', "⚠️ API Key is required to use the AI Coach. Please refresh and try again.");
        }
        return;
    }

    addMessage('user', text);
    aiInput.value = '';

    const typingId = showTypingIndicator();

    try {
        const context = gatherContext();
        const responseText = await window.geminiService.generateResponse(chatHistory, context);

        removeTypingIndicator(typingId);
        addMessage('model', responseText);
        speak(responseText);

    } catch (error) {
        removeTypingIndicator(typingId);
        addMessage('model', `Error: ${error.message}.`);
        console.error(error);
    }
}

function addMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${role}`;

    // Simple Formatting
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    formattedText = formattedText.replace(/\n/g, '<br>');

    msgDiv.innerHTML = formattedText;
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    chatHistory.push({ role, text });

    if (window.firebaseService) {
        const user = firebase.auth().currentUser;
        if (user) {
            window.firebaseService.saveChat(user.uid, chatHistory);
        }
    }
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.id = id;
    msgDiv.className = `chat-message model typing`;
    msgDiv.innerHTML = '<span></span><span></span>'; // CSS handles 2 dots
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function gatherContext() {
    let context = {
        currentPage: 'Dashboard',
        activeData: {}
    };

    const views = document.querySelectorAll('.view-section');
    views.forEach(view => {
        if (!view.classList.contains('hidden')) {
            context.currentPage = view.id;
        }
    });

    if (context.currentPage === 'dsa-practice') {
        const problemTitle = document.querySelector('.problem-header h2')?.innerText;
        const userCode = document.querySelector('.code-editor textarea')?.value || "";
        context.activeData = { problem: problemTitle, currentCode: userCode };
    } else if (context.currentPage === 'resume-builder') {
        const summary = document.getElementById('summary')?.value;
        context.activeData = { resumeSummary: summary };
    }

    return context;
}

document.addEventListener('DOMContentLoaded', initAICoach);
