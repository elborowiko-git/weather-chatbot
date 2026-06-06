# WSB Weather AI Assistant - Twój Doradca Pogodowy

**WSB Weather AI Assistant - Twój Doradca Pogodowy** to nowoczesna, responsywna aplikacja webowa (zaprojektowana w duchu Mobile-First), która działa jak osobisty asystent stylistyczny. Na podstawie realnych, bieżących danych pogodowych aplikacja podpowiada użytkownikowi, jak powinien się ubrać przed wyjściem z domu.

---

## Główne Funkcje Aplikacji

* **Pobieranie Pogody w Czasie Rzeczywistym:** Integracja z zewnętrznym API **OpenWeatherMap** pozwala na sprawdzenie aktualnych warunków (temperatura, temperatura odczuwalna, opady, wiatr) dla dowolnego miasta na świecie.
* **Inteligentny Algorytm Rekomendacji:** System analizuje temperaturę oraz warunki atmosferyczne (deszcz, śnieg, silny wiatr) i generuje spersonalizowaną, szczegółową poradę dotyczącą ubioru.
* **Pasek Boczny z Historią Wyszukiwań (Sidebar):** Aplikacja automatycznie zapamiętuje wpisywane miasta i tworzy listę szybkich skrótów. Kliknięcie miasta z historii natychmiast odświeża dla niego pogodę.
* **Pełna Pamięć Podręczna (LocalStorage):** Historia czatu oraz lista wyszukanych miast nie znika po odświeżeniu strony. Użytkownik ma też możliwość całkowitego wyczyszczenia pamięci za pomocą jednego przycisku.
* **Voice-Over (Synteza Mowy):** Każdy dymek wiadomości posiada ikonę głośnika. Kliknięcie jej uruchamia funkcję *Text-to-Speech* (Web Speech API), która czyta na głos treść pytania lub odpowiedzi naturalnym, polskim głosem.
* **Animowane Tło i Nowoczesny UI:** Interfejs zaprojektowany w stylu *Glassmorphism* (efekt oszronionego szkła) zawieszony na płynnym, animowanym tle przedstawiającym jasne, słoneczne niebo z płynącymi chmurami.

---

## Struktura Projektu

Projekt został napisany w czystym kodzie (Vanilla JavaScript, HTML5, CSS3) z zachowaniem architektury modułowej (ES Modules):

```text
├── index.html          # Główna struktura interfejsu (HTML5)
├── css/
│   └── style.css       # Style, kompozycja Flexbox, RWD oraz animacje CSS
└── js/
    ├── app.js          # Główny kontroler aplikacji, obsługa DOM i LocalStorage
    ├── weather.js      # Moduł odpowiedzialny wyłącznie za komunikację z OpenWeatherMap API
    └── advisor.js      # Silnik logiczny dopasowujący ubiór do odebranych parametrów