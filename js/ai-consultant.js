/**
 * AI Makeup Consultant Chatbot
 * Provides personalized makeup advice using Gemini API and includes Voice Input
 */
document.addEventListener('DOMContentLoaded', function() {
    // Constants and configuration
    const GEMINI_API_KEY = 'AIzaSyA4DNKhkje915jiOuRUTBuND2PaXzLetfI'; // User's Gemini API key
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    // Initialize the chat history
    let chatHistory = [];
    
    // Chat elements
    const consultantWidget = document.getElementById('ai-consultant-widget');
    const consultantContainer = document.getElementById('ai-consultant-container');
    const chatMessages = document.getElementById('ai-chat-messages');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const chatClose = document.getElementById('ai-chat-close');
    const suggestionChips = document.querySelectorAll('.ai-suggestion-chip');
    // Add voice input button element
    const voiceInputBtn = document.getElementById('ai-voice-input-btn');
    
    // Nav links that should open the AI consultant
    const navAiConsultantLink = document.querySelector('.nav-ai-consultant');
    const sidebarAiConsultantLink = document.querySelector('.sidebar-ai-consultant');
    
    // Back to top button for coordination
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Web Speech API setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false; // Process single utterances
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            stopListening(); // Stop after getting a result
            // Optionally, automatically submit the form
            // chatForm.requestSubmit(); 
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            let errorMessage = 'Voice recognition error.';
            if (event.error === 'no-speech') {
                errorMessage = 'No speech detected. Please try again.';
            } else if (event.error === 'audio-capture') {
                errorMessage = 'Microphone unavailable. Please check permissions.';
            } else if (event.error === 'not-allowed') {
                errorMessage = 'Microphone access denied. Please allow access in browser settings.';
            }
            addMessageToChat('system', `⚠️ ${errorMessage}`); // Add error as system message
            stopListening();
        };

        recognition.onend = () => {
            // Ensure UI is reset even if stopped unexpectedly
            if (isListening) {
                stopListening();
            }
        };

    } else {
        console.warn('Web Speech API not supported in this browser.');
        if (voiceInputBtn) {
            voiceInputBtn.style.display = 'none'; // Hide button if API not supported
        }
    }
    
    // Check if elements exist to avoid errors
    if (!consultantWidget || !consultantContainer) {
        console.error('AI Consultant elements not found');
        return;
    }
    
    // Add welcome animation on first page load
    if (!localStorage.getItem('ai_consultant_seen')) {
        consultantWidget.classList.add('ai-welcome-effect');
        // Remove animation after 5 seconds
        setTimeout(() => {
            consultantWidget.classList.remove('ai-welcome-effect');
            localStorage.setItem('ai_consultant_seen', 'true');
        }, 5000);
    }
    
    // Toggle the chat window from the floating widget
    consultantWidget.addEventListener('click', function() {
        toggleChatWindow();
    });
    
    // Open chat window from navbar link
    if (navAiConsultantLink) {
        navAiConsultantLink.addEventListener('click', function(e) {
            e.preventDefault();
            openChatWindow();
        });
    }
    
    // Open chat window from sidebar link 
    if (sidebarAiConsultantLink) {
        sidebarAiConsultantLink.addEventListener('click', function(e) {
            e.preventDefault();
            openChatWindow();
            
            // If there's a mobile sidebar, close it
            const mobileSidebar = document.querySelector('.mobile-sidebar');
            const sidebarOverlay = document.querySelector('.sidebar-overlay');
            
            if (mobileSidebar && mobileSidebar.classList.contains('active')) {
                mobileSidebar.classList.remove('active');
                
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('active');
                }
                
                // If there's a menu toggle button, update its state
                const menuToggle = document.querySelector('.menu-toggle');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }
    
    // Close chat window
    chatClose.addEventListener('click', function() {
        closeChatWindow();
    });
    
    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        
        if (userMessage) {
            // Add user message to UI
            addMessageToChat('user', userMessage);
            
            // Clear input
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Add thinking state visually
            consultantContainer.classList.add('thinking'); 
            
            // Get AI response
            getAIResponse(userMessage);
        }
    });
    
    // Handle voice input button click
    if (voiceInputBtn && SpeechRecognition) {
        voiceInputBtn.addEventListener('click', function() {
            if (isListening) {
                stopListening();
            } else {
                startListening();
            }
        });
    }
    
    // Initial welcome message when opened for the first time
    function showWelcomeMessage() {
        // Check if welcome message has been shown before
        if (!sessionStorage.getItem('ai_consultant_welcomed')) {
            sessionStorage.setItem('ai_consultant_welcomed', 'true');
            
            setTimeout(() => {
                addMessageToChat('assistant', "Hi there! 👋 I'm your AI Makeup Consultant. How can I help you today? I can give personalized makeup advice based on your skin type, occasion, or answer any beauty-related questions!");
            }, 500);
        }
    }
    
    // Toggle chat window visibility
    function toggleChatWindow() {
        if (consultantContainer.classList.contains('active')) {
            closeChatWindow();
        } else {
            openChatWindow();
        }
    }
    
    // Open chat window
    function openChatWindow() {
        consultantContainer.classList.remove('minimized'); // Ensure not minimized when opening
        consultantContainer.classList.add('active');
        consultantWidget.classList.add('hidden');
        
        // Move back-to-top button down if it's visible to avoid overlapping
        if (backToTopBtn && backToTopBtn.classList.contains('visible')) {
            backToTopBtn.classList.add('with-chat-open');
        }
        
        // Add welcome message if chat is empty
        if (chatMessages.children.length === 0) {
            const welcomeMessage = "Hi there! I'm Bella, your personal makeup AI consultant. How can I help you today?";
            addMessageToChat('assistant', welcomeMessage);
        }
        
        // Focus on input
        setTimeout(() => {
            chatInput.focus();
        }, 300);
    }
    
    // Close chat window
    function closeChatWindow() {
        consultantContainer.classList.remove('active');
        consultantContainer.classList.remove('minimized'); // Also remove minimized class on close
        consultantWidget.classList.remove('hidden');
        
        // Restore back-to-top button position
        if (backToTopBtn) {
            backToTopBtn.classList.remove('with-chat-open');
        }
        // Stop listening if chat is closed while recording
        if (isListening) {
            stopListening();
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'ai-typing-indicator';
        typingElement.innerHTML = `
            <div class="ai-message-avatar">
                <img src="img/bella-avatar.png" alt="Bella AI">
            </div>
            <div class="ai-typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.ai-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Get current time for messages
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return `${hours}:${minutes} ${ampm}`;
    }
    
    // Format message with markdown-like syntax
    function formatMessage(message) {
        // Replace URLs with clickable links
        message = message.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        // Bold text
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text
        message = message.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Replace line breaks with <br>
        message = message.replace(/\n/g, '<br>');
        
        return message;
    }
    
    // Function to start listening
    function startListening() {
        if (!recognition || isListening) return;
        try {
            recognition.start();
            isListening = true;
            voiceInputBtn.classList.add('active');
            voiceInputBtn.setAttribute('aria-label', 'Stop recording');
            // Optional: Add visual cue like pulsing
            chatInput.placeholder = 'Listening...'; 
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            addMessageToChat('system', '⚠️ Could not start voice recognition.');
        }
    }

    // Function to stop listening
    function stopListening() {
        if (!recognition || !isListening) return;
        try {
            recognition.stop();
            isListening = false;
            voiceInputBtn.classList.remove('active');
            voiceInputBtn.setAttribute('aria-label', 'Voice input');
            chatInput.placeholder = 'Ask anything...';
        } catch (error) {
            // Handle potential errors if recognition already stopped
            console.warn('Error stopping speech recognition:', error);
            isListening = false; // Ensure state is reset
             voiceInputBtn.classList.remove('active');
            voiceInputBtn.setAttribute('aria-label', 'Voice input');
             chatInput.placeholder = 'Ask anything...';
        }
    }
    
    // Function to get AI response
    async function getAIResponse(userMessage) {
        // Remove typing indicator before sending request
        removeTypingIndicator();
        
        const requestBody = {
            contents: chatHistory, // Send conversation history
            // Add safety settings or generation config if needed
            // safetySettings: [...],
            // generationConfig: { ... }
        };
        
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            // Remove thinking state
            consultantContainer.classList.remove('thinking'); 
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Error:', errorData);
                throw new Error(`API Error: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Extract text response - adjust based on actual Gemini API response structure
            let aiResponse = "I'm sorry, I couldn't understand the response."; 
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                aiResponse = data.candidates[0].content.parts[0].text;
            } else {
                 console.warn("Unexpected API response structure:", data);
            }

            addMessageToChat('assistant', aiResponse);
            
        } catch (error) {
            console.error('Error fetching AI response:', error);
            consultantContainer.classList.remove('thinking'); // Ensure thinking state removed on error
            // Display a more specific error message
            addMessageToChat('system', "⚠️ I'm having trouble connecting right now. Please try again later.");
        }
    }
    
    // Function for mock AI responses during development
    async function mockAIResponse(userMessage) {
        removeTypingIndicator();
        consultantContainer.classList.remove('thinking');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        let response = "This is a mock response. Voice input received: " + userMessage;
        if (userMessage.toLowerCase().includes('price')) {
            response = "Our standard bridal package starts at $500. Would you like more details?";
        } else if (userMessage.toLowerCase().includes('services')) {
            response = "We offer makeup, hairstyling, saree draping, and more. Check our services section!";
        }
        addMessageToChat('assistant', response);
    }
    
    // Add message to chat (Update to handle 'system' messages and timestamp placement)
    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `ai-chat-message ${sender}-message`; // Use sender class
        
        let timestampHtml = '';
        if (sender !== 'system') { // Only add time for user/assistant
             timestampHtml = `<span class="ai-message-time">${getCurrentTime()}</span>`;
        }

        // Place timestamp inside the content div
        messageElement.innerHTML = `
            <div class="ai-message-content">
                <p>${formatMessage(message)}</p>
                ${timestampHtml} 
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Update chat history
        chatHistory.push({
            role: sender,
            content: message
        });
        
        // Only add user/assistant messages to actual chat history for API
        if (sender === 'user' || sender === 'assistant') {
             chatHistory.push({
                 role: sender === 'user' ? 'user' : 'model', // Gemini uses 'model' role
                 parts: [{ text: message }]
             });
             // Limit history length to avoid overly large payloads (e.g., last 10 exchanges)
             const maxHistoryLength = 20; // 10 user + 10 model
             if (chatHistory.length > maxHistoryLength) {
                 chatHistory = chatHistory.slice(chatHistory.length - maxHistoryLength);
             }
        }
    }
}); 