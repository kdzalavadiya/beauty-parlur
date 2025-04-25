/**
 * AI Makeup Consultant Chatbot
 * Provides personalized makeup advice using DeepInfra API and includes Voice Input
 */
document.addEventListener('DOMContentLoaded', function() {
    // Constants and configuration
    const DEEPINFRA_API_KEY = 'yrdj66QamqR48HPuUaiE2AyyKkjov0M9'; // DeepInfra API key
    const DEEPINFRA_API_URL = 'https://api.deepinfra.com/v1/inference/meta-llama/Llama-2-70b-chat-hf';
    
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
        
        // Make sure the header avatar has the correct image
        const headerAvatar = document.querySelector('.ai-header-avatar');
        if (headerAvatar) {
            // Check if img already exists, if not create it
            if (!headerAvatar.querySelector('img')) {
                headerAvatar.innerHTML = '<img src="img/bella-avatar.png" alt="Bella AI" width="40" height="40">';
            }
        }
        
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
                <img src="img/bella-avatar.png" alt="Bella AI" width="40" height="40" loading="lazy">
            </div>
            <div class="ai-message-bubble">
                <div class="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div class="ai-message-time">${getCurrentTime()}</div>
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
        consultantContainer.classList.remove('thinking');
    }
    
    // Get current time for message timestamp
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes} ${ampm}`;
    }
    
    // Format message with links and styling
    function formatMessage(message) {
        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        message = message.replace(urlRegex, function(url) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
        
        // Convert markdown-like bold text
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert markdown-like italic text
        message = message.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle line breaks
        message = message.replace(/\n/g, '<br>');
        
        return message;
    }
    
    // Start listening for voice input
    function startListening() {
        if (!recognition) return;
        
        try {
            recognition.start();
            isListening = true;
            
            // Update UI to show listening state
            voiceInputBtn.classList.add('listening');
            voiceInputBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>'; // Change icon
            
            // Add system message
            addMessageToChat('system', '🎤 Listening... Say something.');
        } catch (error) {
            console.error('Error starting voice recognition:', error);
        }
    }
    
    // Stop listening for voice input
    function stopListening() {
        if (!recognition) return;
        
        try {
            recognition.stop();
            isListening = false;
            
            // Update UI to show not listening state
            voiceInputBtn.classList.remove('listening');
            voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>'; // Change icon back
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    }
    
    // Suggestion chips click handler
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const suggestion = this.textContent.trim();
            chatInput.value = suggestion;
            chatForm.dispatchEvent(new Event('submit'));
        });
    });
    
    // Get response from DeepInfra API
    async function getAIResponse(userMessage) {
        try {
            // Update chat history with user message
            chatHistory.push({ role: "user", content: userMessage });
            
            // Create system message for bridal studio context
            const systemMessage = {
                role: "system", 
                content: "You are Bella, an AI makeup consultant for a bridal studio. You specialize in giving makeup, hairstyling, and beauty advice for weddings and special occasions. Be friendly, professional, and knowledgeable about bridal makeup trends, products, and techniques. Your responses should be helpful for someone planning their bridal look or seeking beauty advice for special events."
            };
            
            // Prepare the complete message history for context
            const messages = [systemMessage, ...chatHistory];
            
            // Prepare the request for DeepInfra API
            const response = await fetch(DEEPINFRA_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPINFRA_API_KEY}`
                },
                body: JSON.stringify({
                    input: {
                        messages: messages
                    },
                    max_tokens: 1024,
                    temperature: 0.7,
                    top_p: 0.9
                })
            });
            
            // Check if the request was successful
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error fetching AI response');
            }
            
            // Parse the response
            const data = await response.json();
            
            // Get the assistant's response
            const aiResponse = data.output?.choices?.[0]?.message?.content || 
                               data.output?.content ||
                               data.results?.[0]?.text ||
                               "I'm sorry, I'm having trouble processing your request right now.";
            
            // Add the AI's response to chat history
            chatHistory.push({ role: "assistant", content: aiResponse });
            
            // Remove the typing indicator and add message to chat
            removeTypingIndicator();
            addMessageToChat('assistant', aiResponse);
            
        } catch (error) {
            console.error('Error fetching AI response:', error);
            
            // Remove the typing indicator
            removeTypingIndicator();
            
            // Display error message
            addMessageToChat('system', "⚠️ I'm having trouble connecting right now. Please try again later.");
            
            // Fallback to mock response for demo purposes
            // mockAIResponse(userMessage);
        }
    }
    
    // Fallback function for testing without API
    async function mockAIResponse(userMessage) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let response = "I'm sorry, I'm currently offline. Please try again later when my connection is restored.";
        
        if (userMessage.toLowerCase().includes('makeup')) {
            response = "For bridal makeup, I recommend starting with a good primer to ensure your makeup lasts all day. Waterproof formulas are essential for emotional moments! Would you like specific product recommendations based on your skin type?";
        }
        
        removeTypingIndicator();
        addMessageToChat('assistant', response);
    }
    
    // Add message to chat
    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `ai-message ${sender}-message`;
        
        // Different HTML structure based on message type
        if (sender === 'system') {
            // System message (simpler design)
            messageElement.innerHTML = `
                <div class="ai-system-message">${message}</div>
            `;
        } else {
            // User or assistant message
            const avatarSrc = sender === 'user' ? 'img/user-avatar.png' : 'img/bella-avatar.png';
            const avatarAlt = sender === 'user' ? 'You' : 'Bella AI';
            
            messageElement.innerHTML = `
                <div class="ai-message-avatar">
                    <img src="${avatarSrc}" alt="${avatarAlt}" width="40" height="40" loading="lazy">
                </div>
                <div class="ai-message-bubble">${formatMessage(message)}</div>
                <div class="ai-message-time">${getCurrentTime()}</div>
            `;
        }
        
        // Apply entrance animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        
        // Add to chat
        chatMessages.appendChild(messageElement);
        
        // Trigger animation
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Initialize event listeners for suggestion chips if they exist
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const suggestion = this.textContent;
            chatInput.value = suggestion;
            chatForm.dispatchEvent(new Event('submit'));
        });
    });
}); 