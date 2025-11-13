<div align="center">
  <img src="public/logo.png" alt="Logo Traugutt.net" width="150">
  <h1 align="center">Traugutt.net</h1>
  <p align="center">
    Oficjalny strona internetowa 2 Liceum Ogólnokształcącego im Romualda Traugutta.
  </p>
</div>

---

## ✨ Funkcjonalności

Strona zawiera szereg narzędzi i funkcji wspierających codzienne życie społeczności szkolnej:

- **Logowanie użytkowników:** Bezpieczne uwierzytelnianie studentów i pracowników z wykorzystaniem LDAP i systemu uprawnień.
- **Panel użytkownika:** Spersonalizowany pulpit z szybkim dostępem do najważniejszych informacji.
- **Ogłoszenia:** Sekcja aktualności szkolnych, dzięki której każdy pozostaje na bieżąco.
- **Kalendarz:** Interaktywny kalendarz szkolny z wydarzeniami, świętami i ważnymi terminami.
- **Artykuły i wpisy:** Miejsce na publikacje dotyczące życia szkoły.
- **Profile nauczycieli:** Katalog nauczycieli z podstawowymi informacjami i danymi kontaktowymi.
- **Numery dnia:** Codzienna, lekka forma interakcji z użytkownikami.
- **Wyszukiwarka:** Rozbudowany system wyszukiwania treści.
- **Powiadomienia:** System informujący o nowych wydarzeniach i aktualizacjach.
- **Treści MDX:** Strony statyczne oparte na MDX, umożliwiające tworzenie dynamicznych materiałów.

## 🛠️ Technologie

Projekt został stworzony w oparciu o nowoczesny i wydajny stos technologiczny:

- **Framework:** [Next.js](https://nextjs.org/)
- **Język:** [TypeScript](https://www.typescriptlang.org/)
- **Stylizacja:** [Tailwind CSS](https://tailwindcss.com/)
- **Baza danych / ORM:** [Prisma](https://www.prisma.io/)
- **Uwierzytelnianie:** [Next-Auth](https://next-auth.js.org/) z integracją LDAP.
- **Treści:** [MDX](https://mdxjs.com/)
- **Wdrożenie:** [Docker](https://www.docker.com/) oraz [Nginx](https://www.nginx.com/)

## 🏁 Uruchomienie projektu lokalnie

Aby uruchomić projekt na własnym komputerze, wykonaj poniższe kroki.

### Wymagania wstępne

- Node.js (wersja 20.x lub nowsza)
- npm lub yarn
- Działająca baza danych PostgreSQL lub inna zgodna
- Dostęp do serwera LDAP do autoryzacji użytkowników

### Instalacja

1. **Sklonuj repozytorium:**

   ```sh
   git clone <adres-repozytorium>
   cd Traugutt.net
   ```

2. **Zainstaluj zależności:**

   ```sh
   npm install
   ```

3. **Skonfiguruj zmienne środowiskowe:**
   Utwórz plik `.env` w katalogu głównym projektu i uzupełnij go danymi. Wzór znajduje się poniżej.

4. **Uruchom migracje bazy danych:**
   ```sh
   npx prisma db push
   ```

### Uruchomienie środowiska deweloperskiego

Po zakończeniu konfiguracji uruchom serwer deweloperski:

```sh
npm run dev
```

Otwórz http://localhost:3000, aby zobaczyć stronę w przeglądarce.

### Przykład pliku `.env`

```env
# Prisma

DATABASE_URL="postgresql://user:password@host:port/database"

# Next-Auth

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sekretna-wartosc"

# LDAP

LDAP_URI="ldap://adres-serwera-ldap.com"
LDAP_BIND_DN="cn=admin,dc=example,dc=com"
LDAP_BIND_PASSWORD="haslo-admina"
LDAP_SEARCH_BASE="ou=users,dc=example,dc=com"

# Inne

NEXT_PUBLIC_URL="http://localhost:3000"
```

## 🚀 Deployment

Aplikacja jest przygotowana do deploymentu z użyciem Dockera.

1.  **Zbuduj obraz Dockera:**

    ```sh
    docker build -t traugutt-net .
    ```

2.  **Uruchom kontener:**
    ```sh
    docker run -p 3000:3000 traugutt-net
    ```

Plik `nginx.conf` jest dołączony i może być użyty do konfiguracji serwera proxy.

## 🤝 Współtworzenie projektu

Każdy Twój wkład jest **bardzo mile widziany**.

Jeśli masz propozycję ulepszenia projektu, możesz wykonać fork repozytorium i utworzyć Pull Request.  
Alternatywnie możesz otworzyć zgłoszenie (issue) oznaczone etykietą „enhancement”.

1.  Utwórz fork repozytorium
2.  Utwórz nową gałąź funkcjonalności (`git checkout -b feature/NazwaFunkcji`)
3.  Zatwierdź zmiany (`git commit -m 'Dodano nową funkcję'`)
4.  Wypchnij gałąź (`git push origin feature/NazwaFunkcji`)
5.  Otwórz Pull Request

---

<div align="center">
  Stworzone przez <b>Franciszka Skuta</b> oraz <b>Bartosza Wiaderka</b>
</div>
