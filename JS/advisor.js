/**
 * Generuje rekomendację ubioru na podstawie parametrów pogodowych
 * @param {Object} weatherData - Obiekt zwrócony z modułu weather.js
 * @returns {string} Gotowy tekst dla bota
 */
export function generateRecommendation(weatherData) {
    const { city, temp, description, id, windSpeed } = weatherData;
    
    let outfit = '';
    let extra = '';

    // 1. Sprawdzanie opadów na podstawie ID kodu pogodowego OpenWeatherMap
    // Kody zaczynające się od 2xx (burza), 3xx (mżawka), 5xx (deszcz), 6xx (śnieg)
    const isRaining = id >= 200 && id < 600;
    const isSnowing = id >= 600 && id < 700;

    // 2. Logika temperaturowa
    if (temp < 0) {
        outfit = 'bieliznę termiczną, gruby zimowy płaszcz lub puchową kurtkę, ciepłe trapery oraz wełniany sweter.';
        extra = ' Nie zapomnij o czapce, szaliku i rękawiczkach – na zewnątrz jest prawdziwy mróz!';
    } else if (temp >= 0 && temp <= 10) {
        outfit = 'ciepłą kurtkę przejściową, bluzę lub lekki sweter oraz długie spodnie.';
        if (windSpeed > 5) extra = ' Mocno wieje, więc najlepiej sprawdzi się kurtka typu windstopper z kapturem.';
    } else if (temp > 10 && temp <= 20) {
        outfit = 'długie spodnie (np. jeansy) oraz klasyczny t-shirt połączony z rozpinaną bluzą lub lekką kurtką/ramoneską (ubiór na cebulkę).';
        extra = ' W razie potrzeby łatwo dostosujesz się do temperatury.';
    } else {
        outfit = 'krótkie spodenki, przewiewną koszulkę (lnianą lub bawełnianą) oraz lekkie buty lub sandały.';
        extra = ' Słońce grzeje! Pamiętaj o okularach przeciwsłonecznych i filtrze UV.';
    }

    // 3. Nadpisywanie lub dodawanie uwag o opadach
    if (isRaining) {
        extra += ' 🌧️ Aktualnie pada deszcz, więc koniecznie weź parasol lub załóż nieprzemakalną kurtkę!';
    } else if (isSnowing) {
        extra += ' ❄️ Sypie śnieg, zabezpiecz buty przed przemoczeniem!';
    }

    // Budowanie finalnej wypowiedzi
    return `W mieście ${city} jest aktualnie ${temp}°C (${description}). Sugeruję ubrać: ${outfit}${extra}`;
}