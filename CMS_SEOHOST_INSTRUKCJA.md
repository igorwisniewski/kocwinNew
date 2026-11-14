# System CMS z bazą MySQL na hostingu SEOHOST

Kompletny system CMS dla strony **Twoje Oddłużanie**, umożliwiający edycję **każdego elementu na stronie**, dodawanie i usuwanie elementów dynamicznych (opinie, historie spraw, etapy, pytania FAQ, wartości, cechy) oraz wgrywanie własnych zdjęć i mediów, zintegrowany z bazą danych MySQL hostowaną na **SEOHOST**.

---

## 1. Dostęp do Panelu Administracyjnego

- Adres panelu: `http://localhost:3000/admin` (lub `https://twojadomena.pl/admin`)
- Domyślne dane logowania (z pliku `.env`):
  - **Login:** `admin`
  - **Hasło:** `admin123`
*(Możesz zmienić je w dowolnej chwili w pliku `.env`)*

---

## 2. Podłączenie bazy MySQL na hostingu SEOHOST

Aby strona połączyła się z Twoją bazą danych na SEOHOST, wykonaj 3 proste kroki:

### Krok 1: Utworzenie bazy danych w cPanel / DirectAdmin na SEOHOST
1. Zaloguj się do panelu klienta SEOHOST i wejdź w **cPanel** (lub DirectAdmin).
2. Otwórz **Kreator baz danych MySQL** lub **Bazy danych MySQL**.
3. Utwórz nową bazę (np. `twojlogin_oddluzanie`) oraz użytkownika z silnym hasłem.
4. Przypisz użytkownika do bazy danych, zaznaczając uprawnienie **ALL PRIVILEGES** (Wszystkie uprawnienia).

### Krok 2: Odblokowanie dostępu zdalnego w SEOHOST (Zdalny MySQL)
1. W cPanel na SEOHOST przejdź do sekcji **Bazy danych** &rarr; **Zdalny MySQL** (Remote MySQL).
2. W polu **Host (% jako symbol wieloznaczny)** wpisz:
   - Znak `%` (zezwolenie na połączenie z dowolnego serwera/komputera), **lub**
   - Dokładny adres IP serwera, na którym stoi Twoja aplikacja.
3. Kliknij **Dodaj hosta**.

### Krok 3: Konfiguracja pliku `.env`
Otwórz plik [`.env`](file:///c:/Users/DELL/WebstormProjects/untitled20/.env) w głównym katalogu projektu i wpisz swoje dane:

```env

DB_SSL=false

ADMIN_USER=admin
ADMIN_PASSWORD=twoje_nowe_haslo_admina
JWT_SECRET=dowolny_dlugi_losowy_ciag_znakow
```

---

## 3. Automatyczna Inicjalizacja Tabel i Danych

Nie musisz ręcznie tworzyć żadnych tabel ani wprowadzać danych!
1. Zaloguj się do panelu pod adresem `/admin`.
2. W zakładce **Baza MySQL (SEOHOST)** zobaczysz status połączenia.
3. Kliknij przycisk **"Zainicjalizuj tabele i dane"**.
4. System automatycznie utworzy tabele:
   - `cms_sections` (przechowuje sekcje wszystkich podstron)
   - `cms_settings` (przechowuje dane globalne: nawigację, stopkę, telefon, email, ciasteczka)
   - `cms_users` (użytkownicy panelu)
   oraz załaduje do nich aktualną, kompletną treść całej strony.

*(Alternatywnie: w projekcie znajduje się gotowy plik [`schema.sql`](file:///c:/Users/DELL/WebstormProjects/untitled20/schema.sql), który możesz zaimportować bezpośrednio w phpMyAdmin na SEOHOST).*

---

## 4. Co można edytować w Panelu CMS?

Panel CMS pozwala na podmianę oraz dodawanie/usuwanie dowolnego elementu:

### ⚙️ Konfiguracja Ogólna:
- **Nawigacja górna:** Nazwa firmy / Logo, linki w menu (dodawanie nowych, zmiana etykiet, zmiana adresów URL, usuwanie), tekst i link przycisku CTA (np. *Bezpłatna Konsultacja*).
- **Stopka strony:** Slogan, telefon, e-mail, adres, linki w stopce, prawa autorskie (copyright).
- **Baner cookies (RODO):** Treść komunikatu, etykieta przycisku zgody, link do polityki prywatności.

### 🏠 Strona Główna:
- **Hero:** Nagłówek H1, podtytuł, treść opisu, napis i link przycisku, zdjęcie w tle.
- **Jak Pomagamy:** Tytuł sekcji, treść opisu.
- **Dyskrecja:** Tytuł, opis, zdjęcie, przycisk.
- **Dlaczego My (Why Us):** Tytuł oraz kafelki cech — **możliwość dodawania nowych kafelków**, zmiany tytułów, opisów oraz wyboru ikon ze zintegrowanej biblioteki.
- **Korzyści (Benefits):** Tytuł, podtytuł oraz lista korzyści z możliwością dodawania i usuwania.
- **Etapy Procesu:** Tytuł, podtytuł, zdjęcie oraz lista kroków (dodawanie/usuwanie/edycja).
- **Historie Klientów (Case Studies):** Tytuł, podtytuł oraz karty spraw — klient, kwota zadłużenia, procent umorzenia, kwota umorzona, plan spłaty i pełny opis sprawy (**możliwość dodawania nowych spraw i usuwania**).
- **Opinie Klientów (Testimonials):** Tytuł, podtytuł oraz karuzela opinii — cytat i autor (**możliwość dodawania nowych opinii**).

### ℹ️ Podstrona "O nas":
- Nagłówek i opis,
- Fundamentalne wartości (dodawanie/edycja/usuwanie),
- Historia kancelarii,
- Końcowa sekcja Call To Action.

### ⚖️ Postępowanie Upadłościowe & 🔄 Restrukturyzacja:
- Nagłówek Hero,
- Sekcja "Dla kogo" (edycja punktów kwalifikacyjnych),
- Oś czasu procesu (etapy od zgłoszenia do oddłużenia),
- Korzyści z procedury,
- **Moduł FAQ:** Pełna lista pytań i odpowiedzi z możliwością dodawania nowych pytań oraz usuwania starych,
- Sekcja CTA.

### 📞 Kontakt:
- Nagłówki,
- Telefon, adres e-mail, godziny otwarcia,
- Tytuł formularza oraz endpoint do wysyłki (np. Formspree).

### 📄 Polityka Prywatności:
- Tytuł, wstęp oraz pełna lista sekcji i paragrafów prawnych.

### 🖼️ Biblioteka Mediów & Wgrywanie Zdjęć:
- Narzędzie do przesyłania plików z dysku komputera bezpośrednio na serwer.
- Wgrane pliki trafiają do `/public/uploads/`.
- Jedno kliknięcie kopiuje gotowy adres URL pliku, który można wkleić w dowolne pole grafiki w CMS.

---

## 5. Odporność i Niezawodność (Fail-safe Fallback)

System został zaprojektowany tak, aby publiczna strona **nigdy nie wyświetliła błędu ani pustego ekranu**:
- Jeśli połączenie z MySQL na SEOHOST jest aktywne &rarr; dane ładowane są bezpośrednio z bazy.
- Jeśli baza na SEOHOST jest w trakcie konfiguracji lub wystąpi tymczasowa przerwa w sieci &rarr; aplikacja automatycznie i płynnie korzysta z wbudowanych danych domyślnych (`cms-defaults.ts`).
- W panelu `/admin` w prawym górnym rogu znajduje się wskaźnik informujący na żywo o stanie połączenia z bazą na SEOHOST.
