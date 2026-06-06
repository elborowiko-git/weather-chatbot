// Zastąp poniższy ciąg swoim prawdziwym kluczem z panelu OpenWeatherMap
const API_KEY = '31619739433b63da95f821420f90fea2'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Pobiera aktualną pogodę dla wskazanego miasta
 */
export async function fetchCurrentWeather(city) {
    // Zapytanie z parametrami: nazwa miasta, system metryczny (Celsjusz) oraz język polski
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Nie znaleziono takiego miasta. Sprawdź pisownię!');
        }
        throw new Error('Problem z połączeniem z serwerem pogodowym.');
    }

    const data = await response.json();
    
    // Zwracamy tylko te parametry, które interesują naszego bota
    return {
        city: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        id: data.weather[0].id,       // ID grupy pogodowej (np. deszcz, śnieg)
        windSpeed: data.wind.speed    // Prędkość wiatru
    };
}