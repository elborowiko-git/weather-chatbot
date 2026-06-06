import { fetchCurrentWeather } from './weather.js';
import { generateRecommendation } from './advisor.js';

// Selektory DOM
const chatArea = document.getElementById('chatArea');
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const historyList = document.getElementById('historyList');

// Przyciski akcji i kontrolery struktury
const newChatBtn = document.getElementById('newChatBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const appContainer = document.querySelector('.app-container');

const STORAGE_KEY = 'weather_wear_chat_history';

// Inicjalizacja aplikacji po załadowaniu drzewa DOM
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
});

// ==========================================================================
// 1. OBSŁUGA FORMULARZA (ZAPYTANIE O POGODĘ)
// ==========================================================================
weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    // Dodanie dymka użytkownika i zapis do pamięci
    appendMessage(cityName, 'user');
    saveMessageToStorage(cityName, 'user');
    cityInput.value = '';

    // Pokazanie wskaźnika pisania bota
    const typingIndicator = showTypingIndicator();

    try {
        // Pobranie danych pogodowych z API
        const weatherData = await fetchCurrentWeather(cityName);
        // Wygenerowanie sugestii ubioru
        const botResponse = generateRecommendation(weatherData);

        // Renderowanie odpowiedzi bota i zapis
        typingIndicator.remove();
        appendMessage(botResponse, 'bot');
        saveMessageToStorage(botResponse, 'bot');
        
        // Aktualizacja kafelków miast w panelu bocznym
        renderSidebarHistory();

    } catch (error) {
        typingIndicator.remove();
        appendMessage(error.message, 'bot');
        saveMessageToStorage(error.message, 'bot');
    }
});

// ==========================================================================
// 2. OBSŁUGA PRZYCISKÓW AKCJI SYSTEMOWYCH
// ==========================================================================

// Nowa rozmowa (czyści ekran, zachowuje bazę LocalStorage)
newChatBtn.addEventListener('click', () => {
    chatArea.innerHTML = '';
    showWelcomeMessage();
    appContainer.classList.remove('sidebar-open'); 
});

// Wyczyść pamięć (pełny, bezpowrotny reset aplikacji)
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz bezpowrotnie usunąć całą historię rozmów wraz z pamięcią podręczną?')) {
        localStorage.removeItem(STORAGE_KEY);
        chatArea.innerHTML = '';
        historyList.innerHTML = '';
        showWelcomeMessage();
        appContainer.classList.remove('sidebar-open');
    }
});

// Zarządzanie wysuwaniem paska bocznego na smartfonach (Hamburger / Overlay)
toggleSidebarBtn.addEventListener('click', () => appContainer.classList.add('sidebar-open'));
sidebarOverlay.addEventListener('click', () => appContainer.classList.remove('sidebar-open'));

// ==========================================================================
// 3. FUNKCJE POMOCNICZE I INTERFEJSY API (SPEECH / LOCAL STORAGE)
// ==========================================================================

/**
 * Odczytuje podany tekst na głos za pomocą Web Speech API
 */
function speakText(text) {
    // Zatrzymaj poprzednie odtwarzanie, jeśli trwa
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 1.0;  // Prędkość (0.1 - 2.0)
    utterance.pitch = 1.0; // Ton głosu (0.0 - 2.0)

    window.speechSynthesis.speak(utterance);
}

/**
 * Dynamicznie generuje i wstrzykuje dymek wiadomości do okna czatu
 */
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    // Kontener tekstowy
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    messageDiv.appendChild(textSpan);

    // Przycisk syntezy mowy (głośnik)
    const speakBtn = document.createElement('button');
    speakBtn.classList.add('speak-msg-btn');
    speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    speakBtn.title = 'Przeczytaj na głos';
    
    speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakText(text);
    });

    messageDiv.appendChild(speakBtn);
    chatArea.appendChild(messageDiv);
    
    // Auto-scroll do najnowszej wiadomości
    chatArea.scrollTop = chatArea.scrollHeight;
}

/**
 * Wyświetla trzy pulsujące kropki ładowania odpowiedzi bota
 */
function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('message', 'bot-message', 'typing-indicator');
    indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
    chatArea.appendChild(indicatorDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    return indicatorDiv;
}

function showWelcomeMessage() {
    appendMessage("Cześć! Jestem Twoim inteligentnym doradcą stylizacji. Wpisz nazwę dowolnego miasta, a sprawdzę warunki i dobiorę dla Ciebie idealny ubiór.", 'bot');
}

function saveMessageToStorage(text, sender) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    history.push({ text, sender });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (history.length === 0) {
        showWelcomeMessage();
    } else {
        history.forEach(msg => appendMessage(msg.text, msg.sender));
    }
    renderSidebarHistory();
}

/**
 * Generuje klikalne kafelki unikalnych miast w pasku bocznym na podstawie LocalStorage
 */
function renderSidebarHistory() {
    historyList.innerHTML = '';
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Wyciągamy nazwy wpisywanych miast od użytkownika i usuwamy duplikaty
    const userCities = history
        .filter(msg => msg.sender === 'user')
        .map(msg => msg.text);
    const uniqueCities = [...new Set(userCities)];

    uniqueCities.forEach(city => {
        const btn = document.createElement('button');
        btn.classList.add('sidebar-btn', 'btn-history-item');
        btn.innerHTML = `<i class="fa-solid fa-message"></i> <span>${city}</span>`;
        
        // Kliknięcie w miasto z historii automatycznie uruchamia dla niego formularz
        btn.addEventListener('click', () => {
            cityInput.value = city;
            weatherForm.dispatchEvent(new Event('submit'));
            appContainer.classList.remove('sidebar-open'); // Zamknij panel na RWD
        });

        historyList.appendChild(btn);
    });
}