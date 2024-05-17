$(document).ready(function(){
    console.log('Home page running');
    $(".dropdown-trigger").dropdown();

    const sideNavigation = document.querySelector('.sidenav');
    M.Sidenav.init(sideNavigation, {});

    const slider = document.querySelector(".slider");
    M.Slider.init(slider, {
        indicator: false,
        height: 500,
        transition: 500,
        interval: 6000
    });

    document.getElementById('search-icon').addEventListener('click', function() {
        const query = document.getElementById('autocomplete-input').value;
        if (query) {
            window.location.href = `guide.html?query=${encodeURIComponent(query)}`;
        }
    });

    const assistantIcon = document.getElementById('assistant-icon');
    const chatBox = document.getElementById('chat-box');
    const closeChat = document.getElementById('close-chat');
    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    assistantIcon.addEventListener('click', () => {
        chatBox.classList.toggle('hide');
        if (!chatBox.classList.contains('hide')) {
            chatBox.style.display = 'flex';
        } else {
            chatBox.style.display = 'none';
        }
    });

    closeChat.addEventListener('click', () => {
        chatBox.classList.add('hide');
        chatBox.style.display = 'none';
    });

    sendButton.addEventListener('click', () => {
        const userInput = chatInput.value;
        if (userInput) {
            appendMessage('User', userInput);
            chatInput.value = '';
            fetchResponse(userInput);
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function fetchResponse(userInput) {
        appendMessage('Assistant', 'Thinking...');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer `
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant for a travel planning website called Smart Traveller. You know all the functionalities of the website including Plan, Guide, Journals, and Schedule.' },
                    { role: 'user', content: userInput }
                ]
            })
        });

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        chatMessages.lastChild.innerHTML = `<strong>Assistant:</strong> ${assistantMessage}`;
    }
});


