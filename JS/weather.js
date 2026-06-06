// Klucz API z OpenWeatherMap - wklej tutaj swój wygenerowany token
const API_KEY = '6e323aa8fac636bd5b9235822376f1ee'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Pobiera aktualną pogodę dla wskazanego miasta
 * @param {string} city - Nazwa miasta wpisana przez użytkownika
 * @returns {Promise<Object>} Dane pogodowe lub błąd
 */
export async function fetchCurrentWeather(city) {
    // Zapytanie z parametrami: nazwa miasta, metryczny system miar (Celsjusz) oraz język polski
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Nie znaleziono takiego miasta. Sprawdź pisownię!');
            }
            throw new Error('Problem z pobraniem danych pogodowych.');
        }

        const data = await response.json();
        return {
            city: data.name,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            id: data.weather[0].id, // ID pogody (przydatne do wykrywania deszczu/burzy)
            windSpeed: data.wind.speed // Prędkość wiatru w m/s
        };
    } catch (error) {
        console.error('Weather API Error:', error);
        throw error;
    }
}