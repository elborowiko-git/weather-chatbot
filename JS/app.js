// Selektory DOM
const chatArea = document.getElementById('chatArea');
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Klucz bazy LocalStorage
const STORAGE_KEY = 'weather_wear_chat_history';

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
});

// Nasłuchiwanie wysłania formularza
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    // 1. Dodaj dymek użytkownika
    appendMessage(cityName, 'user');
    saveMessageToStorage(cityName, 'user');
    cityInput.value = '';

    // 2. Pokaż animację pisania bota
    const typingIndicator = showTypingIndicator();

    // 3. Symulacja odpowiedzi AI i API (Opóźnienie dla naturalnego efektu)
    setTimeout(() => {
        typingIndicator.remove(); // usuń animację kropek
        
        const botResponse = generateMockRecommendation(cityName);
        appendMessage(botResponse, 'bot');
        saveMessageToStorage(botResponse, 'bot');
    }, 1200);
});

// Nasłuchiwanie czyszczenia historii
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz usunąć całą historię rozmów?')) {
        localStorage.removeItem(STORAGE_KEY);
        chatArea.innerHTML = '';
        showWelcomeMessage();
    }
});

/**
 * Funkcja dodająca dymek wiadomości do okna czatu
 */
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    
    chatArea.appendChild(messageDiv);
    // Automatyczne przewijanie na dół czatu
    chatArea.scrollTop = chatArea.scrollHeight;
}

/**
 * Wyświetlanie animowanych kropek (bota)
 */
function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('message', 'bot-message', 'typing-indicator');
    indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
    chatArea.appendChild(indicatorDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    return indicatorDiv;
}

/**
 * Obsługa LocalStorage: Zapis
 */
function saveMessageToStorage(text, sender) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    history.push({ text, sender });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Obsługa LocalStorage: Odczyt i render
 */
function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (history.length === 0) {
        showWelcomeMessage();
    } else {
        history.forEach(msg => {
            appendMessage(msg.text, msg.sender);
        });
    }
}

/**
 * Pierwsza wiadomość powitalna
 */
function showWelcomeMessage() {
    const welcomeText = "Cześć! Jestem Twoim inteligentnym doradcą stylizacji. Wpisz nazwę dowolnego miasta, a sprawdzę warunki i dobiorę dla Ciebie idealny ubiór.";
    appendMessage(welcomeText, 'bot');
}

/**
 * Tymczasowy silnik podpowiedzi (Logika regułowa / Mock)
 * W kolejnym kroku zostanie przeniesiony i spięty z OpenWeatherAPI w advisor.js
 */
function generateMockRecommendation(city) {
    // Szybka symulacja losowej pogody dla testów UI
    const options = [
        `W mieście ${city} jest aktualnie 22°C i świeci słońce. Polecam ubrać lekką, bawełnianą koszulkę, krótkie spodenki oraz okulary przeciwsłoneczne. Dobry dzień na spacer!`,
        `W lokalizacji ${city} odnotowano opady deszczu i silny wiatr, temperatura to 11°C. Koniecznie załóż kurtkę przeciwdeszczową z kapturem (windstopper), nieprzemakalne buty i weź ze sobą parasol!`,
        `W mieście ${city} panuje chłodna aura, termometry wskazują zaledwie 3°C. Ubierz się warstwowo ("na cebulkę"): ciepły sweter lub bluza, kurtka przejściowa oraz lekka czapka będą idealnym wyborem.`
    ];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}