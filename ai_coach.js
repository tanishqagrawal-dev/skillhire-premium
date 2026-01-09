// Global AI Coach Logic

const aiContexts = {
    'dashboard': "I can help you navigate your career dashboard, track applications, or update your profile.",
    'resume-builder': "I can review your resume content, suggest stronger action verbs, or help you maximize your ATS score.",
    'interview-prep': "I can give you tips on body language, suggest STAR method examples, or help you prepare for specific questions.",
    'dsa-practice': "I'm here to help with algorithms. Stuck? Ask for a hint or a complexity analysis of your approach.",
    'roadmap': "I can explain any topic on your roadmap or suggest learning resources for specific skills.",
    'companies': "I can provide insights on company culture, interview processes, and recent news for your target companies."
};

let isChatOpen = false;

document.addEventListener('DOMContentLoaded', () => {
    // Inject widget if not present (handled by HTML mostly, but good for safety)
    const widget = document.getElementById('ai-coach-widget');
    if (widget) {
        updateContextMessage();
        // Listen for tab changes
        const observer = new MutationObserver(() => {
            updateContextMessage();
        });
        observer.observe(document.querySelector('main'), { attributes: true, subtree: true });
    }
});

function toggleChat() {
    const chatBody = document.getElementById('ai-chat-body');
    isChatOpen = !isChatOpen;

    if (isChatOpen) {
        chatBody.classList.remove('hidden');
        chatBody.classList.add('slide-up');
        updateContextMessage();
    } else {
        chatBody.classList.add('hidden');
        chatBody.classList.remove('slide-up');
    }
}

function updateContextMessage() {
    // Find active section
    let activeId = 'dashboard';
    document.querySelectorAll('.view-section').forEach(sec => {
        if (!sec.classList.contains('hidden')) {
            activeId = sec.id;
        }
    });

    const contextMsg = aiContexts[activeId] || "How can I help you with your career journey today?";

    // Only add if it's the last message is NOT this one
    const msgs = document.getElementById('ai-messages');
    if (!msgs) return;

    const lastMsg = msgs.lastElementChild;
    if (!lastMsg || lastMsg.innerText !== contextMsg) {
        addMessage(contextMsg, 'bot');
    }
}

function sendMessage() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    // Simulate thinking
    const typingId = addTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator(typingId);
        // Mock response
        addMessage(generateMockResponse(text), 'bot');
    }, 1500);
}

function addMessage(text, sender) {
    const container = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function addTypingIndicator() {
    const container = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.id = 'typing-' + Date.now();
    div.className = 'chat-msg bot typing';
    div.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div.id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function generateMockResponse(query) {
    query = query.toLowerCase();
    if (query.includes('hello') || query.includes('hi')) return "Hello! Ready to accelerate your career?";
    if (query.includes('resume')) return "For your resume, focus on quantifiable results. Did you increase efficiency or revenue?";
    if (query.includes('interview')) return "Remember the STAR method: Situation, Task, Action, Result. Crucial for behavioral questions.";
    if (query.includes('python')) return "Python is great for DSA. Remember to master list comprehensions and dictionaries.";
    return "That's a great question. As an AI Coach, I suggest breaking this down into smaller steps. Shall we create a learning task for it?";
}

// Allow Enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('ai-input') === document.activeElement) {
        sendMessage();
    }
});
