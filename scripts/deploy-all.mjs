import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
            const key = trimmed.substring(0, eqIdx).trim();
            let val = trimmed.substring(eqIdx + 1).trim();
            if (
                (val.startsWith("'") && val.endsWith("'")) ||
                (val.startsWith('"') && val.endsWith('"'))
            ) {
                val = val.slice(1, -1);
            } else {
                const commentMatch = val.match(/\s+#.*$/);
                if (commentMatch) {
                    val = val.substring(0, commentMatch.index).trim();
                }
            }
            process.env[key] = val;
        }
    }
}

const defaultGlobalSettings = {
    general: {
        siteName: 'Twoje Oddłużanie',
        siteSlogan: 'Twój problem, nasze rozwiązanie',
        phone: '+48 796 464 273',
        email: 'kontakt@twojeoddluzanie.pl',
        address: 'Polska (obsługa zdalna na terenie całego kraju)',
        headerCtaText: 'Bezpłatna Konsultacja',
        headerCtaLink: '/kontakt',
        copyrightText: '© 2025 Twoje Oddłużanie. Wszelkie prawa zastrzeżone.',
        navLinks: [
            { id: '1', label: 'O nas', href: '/onas' },
            { id: '2', label: 'Postępowanie Upadłościowe', href: '/postepowanie-upadlosciowe' },
            { id: '3', label: 'Restrukturyzacja', href: '/postepowanie-restrukturyzacyjne' },
            { id: '4', label: 'Kontakt', href: '/kontakt' },
        ],
        footerLinks: [
            { id: '1', label: 'Strona główna', href: '/' },
            { id: '2', label: 'O nas', href: '/onas' },
            { id: '3', label: 'Postępowanie Upadłościowe', href: '/postepowanie-upadlosciowe' },
            { id: '4', label: 'Kontakt', href: '/kontakt' },
            { id: '5', label: 'Polityka Prywatności', href: '/polityka-prywatnosci' },
        ],
        cookieBanner: {
            enabled: true,
            title: 'Szanujemy Twoją prywatność',
            description: 'Strona korzysta z plików cookie w celu zapewnienia prawidłowego funkcjonowania serwisu oraz w celach analitycznych.',
            acceptButtonText: 'Akceptuję wszystkie',
            policyLinkText: 'Polityka prywatności',
            policyLinkHref: '/polityka-prywatnosci',
        },
    },
};

const defaultSections = [
    // HOME
    {
        page: 'home',
        section: 'hero',
        content: {
            title: 'Wyobraź sobie poranek bez długów',
            subtitle: 'To nie musi być tylko wyobrażenie.',
            description: 'Pomagamy osobom zadłużonym naprawdę zacząć od nowa – legalnie, skutecznie, bez wstydu. Zrób pierwszy krok.',
            buttonText: 'Bezpłatna Konsultacja',
            buttonLink: '/kontakt',
            backgroundImage: '/img/tlo.jpg',
        },
    },
    {
        page: 'home',
        section: 'howwehelp',
        content: {
            title: 'Jak Pomagamy?',
            description: 'Oddłużenie to proces – ale nie musisz go przechodzić sam. Prowadzimy Cię krok po kroku, od pierwszej rozmowy aż po ogłoszenie upadłości. Jesteśmy z Tobą na każdym etapie – jasno, empatycznie, profesjonalnie.',
        },
    },
    {
        page: 'home',
        section: 'discretion',
        content: {
            title: 'U nas jesteś osobą, nie kolejną sprawą',
            subtitle: 'Zapewniamy 100% dyskrecji i profesjonalizmu',
            description: 'Rozumiemy, jak trudna i stresująca jest sytuacja związana z zadłużeniem. W naszej kancelarii nie oceniamy – słuchamy, analizujemy i znajdujemy skuteczne, legalne wyjście z trudnej sytuacji.',
            image: '/img/discretion.jpg',
            points: [
                'Pełna poufność powierzonych informacji',
                'Brak ukrytych kosztów i transparentne warunki',
                'Dedykowany radca prawny przypisany do Twojej sprawy',
            ],
            buttonText: 'Skonsultuj swoją sprawę',
            buttonLink: '/kontakt',
        },
    },
    {
        page: 'home',
        section: 'whyus',
        content: {
            title: 'Dlaczego Warto Nam Zaufać?',
            subtitle: 'Specjalizujemy się wyłącznie w postępowaniach upadłościowych i restrukturyzacyjnych',
            items: [
                {
                    id: '1',
                    name: 'Doświadczenie i specjalizacja',
                    description: 'Jesteśmy kancelarią prawną, która specjalizuje się wyłącznie w upadłości konsumenckiej. Mamy na koncie ponad 200 skutecznie przeprowadzonych postępowań i 7 lat doświadczenia.',
                    icon: 'TrophyIcon',
                },
                {
                    id: '2',
                    name: 'Skuteczność i szybkość',
                    description: 'Dzięki znajomości procedur i realiów sądowych, jesteśmy w stanie skutecznie przyspieszyć Twoją sprawę, ogłaszając upadłość nawet w kilka dni.',
                    icon: 'BoltIcon',
                },
                {
                    id: '3',
                    name: 'Kompleksowa obsługa prawna',
                    description: 'Zapewniamy pełne wsparcie: od analizy dokumentów, przez przygotowanie wniosku, aż po reprezentację przed sądem i syndykiem.',
                    icon: 'DocumentMagnifyingGlassIcon',
                },
                {
                    id: '4',
                    name: 'Profesjonalny zespół prawny',
                    description: 'Twoją sprawą zajmują się wyłącznie radcowie prawni i doradcy restrukturyzacyjni, a nie pośrednicy czy anonimowi konsultanci.',
                    icon: 'BriefcaseIcon',
                },
                {
                    id: '5',
                    name: 'Pełna dyskrecja i obsługa online',
                    description: 'Gwarantujemy 100% poufności. Oferujemy możliwość przeprowadzenia całego procesu zdalnie, bez względu na Twoje miejsce zamieszkania.',
                    icon: 'LockClosedIcon',
                },
                {
                    id: '6',
                    name: 'Elastyczne i jasne warunki',
                    description: 'Zapewniamy przejrzyste zasady współpracy z możliwością płatności w ratach. Jesteśmy dostępni, aby odpowiedzieć na wszystkie Twoje pytania.',
                    icon: 'ArrowsRightLeftIcon',
                },
            ],
        },
    },
    {
        page: 'home',
        section: 'benefits',
        content: {
            title: 'Co zyskujesz dzięki współpracy?',
            subtitle: 'Nasze wsparcie to coś więcej niż tylko pomoc prawna. To kompleksowa usługa, która przywraca kontrolę nad finansami i życiem.',
            items: [
                {
                    id: '1',
                    name: 'Poczucie Spokoju i Bezpieczeństwa',
                    description: 'Wytłumaczymy Ci cały proces w prosty sposób. Zadbamy o to, by wszystkie dokumenty i informacje były przygotowane prawidłowo i na czas. Ty skupiasz się na sobie — my na formalnościach.',
                    icon: 'ShieldCheckIcon',
                },
                {
                    id: '2',
                    name: 'Indywidualna Strategia Oddłużeniowa',
                    description: 'Każda sprawa jest inna. Analizujemy Twoją sytuację i dobieramy najlepsze możliwe rozwiązania w ramach przepisów prawa upadłościowego.',
                    icon: 'DocumentTextIcon',
                },
                {
                    id: '3',
                    name: 'Szansa na Prawdziwy Nowy Start',
                    description: 'Naszym celem jest skuteczne ogłoszenie upadłości i możliwie najkorzystniejszy plan spłaty — albo całkowite umorzenie długów. Dajemy Ci realną szansę, by zacząć życie bez finansowego ciężaru.',
                    icon: 'SparklesIcon',
                },
            ],
        },
    },
    {
        page: 'home',
        section: 'process',
        content: {
            title: 'Jak wygląda proces współpracy?',
            subtitle: 'Krok po kroku prowadzimy Cię przez całą procedurę',
            image: '/img/office.jpg',
            steps: [
                {
                    id: '1',
                    name: 'Kontakt z nami',
                    description: 'Wypełniasz formularz lub dzwonisz. Umawiamy się na bezpłatną, niezobowiązującą konsultację.',
                },
                {
                    id: '2',
                    name: 'Analiza sytuacji i plan działania',
                    description: 'Poznajemy Twoją sytuację i proponujemy najlepsze możliwe rozwiązania. Zawsze zgodnie z prawem, zawsze po Twojej stronie.',
                },
                {
                    id: '3',
                    name: 'Działamy w Twoim imieniu',
                    description: 'Sporządzamy wniosek, przygotowujemy dokumenty i wspieramy Cię przez całą procedurę sądową.',
                },
                {
                    id: '4',
                    name: 'Jesteśmy w kontakcie',
                    description: 'Informujemy o postępach, dopasowujemy działania, odpowiadamy na pytania.',
                },
                {
                    id: '5',
                    name: 'Jesteś oddłużony!',
                    description: 'Twoje długi zostają zamknięte, a Ty możesz spokojnie zacząć nowy rozdział życia — bez lęku, bez wstydu, bez zobowiązań.',
                },
            ],
        },
    },
    {
        page: 'home',
        section: 'casestudies',
        content: {
            title: 'Historie naszych klientów',
            subtitle: 'Sprawdź, jak pomogliśmy osobom w podobnej sytuacji do Twojej',
            items: [
                {
                    id: '1',
                    client: 'Pani Gosia, 41 lat, Wrocław',
                    debtAmount: '96 tys.',
                    remissionPercentage: 100,
                    remissionAmount: '96 000 zł',
                    repaymentPlan: 'brak planu spłaty',
                    description: 'Po rozwodzie klientka została z długami zaciągniętymi wspólnie z byłym partnerem. Wychowując dwójkę dzieci bez stałej pracy, nie miała szans na regulowanie zobowiązań. Wniosek został pozytywnie rozpatrzony — sąd ogłosił upadłość i całkowicie umorzył jej długi.',
                },
                {
                    id: '2',
                    client: 'Pan Marian, 68 lat, Warszawa',
                    debtAmount: '142 tys.',
                    remissionPercentage: 91,
                    remissionAmount: '129 220 zł',
                    repaymentPlan: '355 zł / 30 m-cy',
                    description: 'Klient, emeryt z Warszawy, miał zajętą część świadczenia. Zadłużenie rosło latami. Po naszej analizie, sąd ogłosił upadłość i zatwierdził plan spłaty możliwy do wykonania przy jego dochodach. Klient odzyskał kontrolę nad budżetem i życiem.',
                },
                {
                    id: '3',
                    client: 'Pani Ewa, 52 lata, Gdańsk',
                    debtAmount: '67 tys.',
                    remissionPercentage: 100,
                    remissionAmount: '67 000 zł',
                    repaymentPlan: 'brak planu spłaty',
                    description: 'Zadłużenie narastało latami, kiedy klientka leczyła się psychiatrycznie. Wpadła w spiralę chwilówek. Udało się zebrać dokumentację potwierdzającą jej stan. Sąd ogłosił upadłość i umorzył całość długu.',
                },
                {
                    id: '4',
                    client: 'Pan Marcin, 39 lat, Kraków',
                    debtAmount: '290 tys.',
                    remissionPercentage: 90,
                    remissionAmount: '261 200 zł',
                    repaymentPlan: '800 zł / 36 m-cy',
                    description: 'Klient po pandemii musiał zamknąć działalność gospodarczą. Został z niespłaconymi leasingami. Sąd zatwierdził plan spłaty dostosowany do nowych dochodów klienta. Udało się umorzyć ponad 260 tys. zł.',
                },
                {
                    id: '5',
                    client: 'Pan Adam, 29 lat, Poznań',
                    debtAmount: '158 tys.',
                    remissionPercentage: 95,
                    remissionAmount: '150 800 zł',
                    repaymentPlan: '300 zł / 24 m-ce',
                    description: 'Młody przedsiębiorca prowadził sklep internetowy, ale po wzroście kosztów musiał zamknąć firmę. Przez rok bezskutecznie próbował dogadać się z wierzycielami. Sąd przyznał symboliczną ratę i umorzył niemal całość zadłużenia.',
                },
                {
                    id: '6',
                    client: 'Pan Jacek, 55 lat, Katowice',
                    debtAmount: '460 tys.',
                    remissionPercentage: 93,
                    remissionAmount: '427 600 zł',
                    repaymentPlan: '900 zł / 36 m-cy',
                    description: 'Po upadku rodzinnej hurtowni klient pozostał z wysokimi kredytami. Współpraca z nami pozwoliła przejść przez procedurę bez utraty mieszkania i z mocnym oddechem finansowym.',
                },
            ],
        },
    },
    {
        page: 'home',
        section: 'testimonials',
        content: {
            title: 'Opinie Naszych Klientów',
            subtitle: 'Zobacz, co mówią osoby, które odzyskały spokój i wolność finansową',
            items: [
                { id: '1', quote: 'Byłam przekonana, że nie ma już wyjścia. Dzięki tej kancelarii odzyskałam spokój, godność i nadzieję. Polecam każdemu, kto czuje się przytłoczony długami.', author: 'Katarzyna' },
                { id: '2', quote: 'Profesjonalna, szybka pomoc i zero oceniania. Wszystko zostało mi jasno wyjaśnione. Już po pierwszej rozmowie wiedziałem, że trafiłem w dobre ręce.', author: 'Michał' },
                { id: '3', quote: 'Wcześniej nie spałam po nocach. Dziś jestem po ogłoszeniu upadłości i naprawdę mogę zacząć nowe życie. Jestem ogromnie wdzięczna!', author: 'Paulina' },
                { id: '4', quote: 'Zadzwoniłem z ciekawości, zostałem z poczuciem ulgi. Krok po kroku przeprowadzili mnie przez całą procedurę. Warto było zaufać.', author: 'Tomasz' },
                { id: '5', quote: 'Bałem się tego procesu, ale z ich pomocą to naprawdę było do przejścia. Wszystko zrobione rzetelnie, uczciwie i z klasą.', author: 'Adam' },
                { id: '6', quote: 'Najtrudniejsze było poprosić o pomoc. Ale nikt mnie nie ocenił. Wręcz przeciwnie – zostałam potraktowana z pełnym szacunkiem i zrozumieniem.', author: 'Elżbieta' },
            ],
        },
    },

    // ONAS
    {
        page: 'onas',
        section: 'hero',
        content: {
            title: 'O nas',
            description: 'Twoje Oddłużanie to zespół doświadczonych radców prawnych i doradców restrukturyzacyjnych, którzy codziennie pomagają ludziom wyjść z pętli zadłużenia. Wierzymy, że każdy zasługuje na drugą szansę i profesjonalną ochronę prawną.',
            backgroundImage: '/img/fallhero.jpg',
        },
    },
    {
        page: 'onas',
        section: 'values',
        content: {
            title: 'Nasze fundamentalne wartości',
            items: [
                {
                    id: '1',
                    name: 'Empatia i Zrozumienie',
                    description: 'Każda historia jest inna. Słuchamy z szacunkiem i bez uprzedzeń. Oddłużenie to nie tylko prawo — to ludzka sprawa.',
                    icon: 'UserGroupIcon',
                },
                {
                    id: '2',
                    name: 'Profesjonalizm i Etyka',
                    description: 'Działamy zgodnie z przepisami, transparentnie i rzetelnie. Twoją sprawą zajmuje się zawodowy pełnomocnik — radca prawny lub doradca restrukturyzacyjny.',
                    icon: 'ScaleIcon',
                },
                {
                    id: '3',
                    name: 'Pełna Dyskrecja i Poufność',
                    description: 'Twoje dane i sytuacja finansowa są u nas całkowicie bezpieczne. Zapewniamy wsparcie w zaufaniu i dyskrecji — to fundament każdej współpracy.',
                    icon: 'ShieldCheckIcon',
                },
            ],
        },
    },
    {
        page: 'onas',
        section: 'history',
        content: {
            title: 'Nasza historia',
            description1: 'Twoje Oddłużanie powstało z potrzeby, którą sami dostrzegliśmy w codziennej pracy – potrzeby realnej, dostępnej i uczciwej pomocy dla osób zadłużonych. Za naszą firmą stoją doświadczeni specjaliści, którzy na co dzień zajmują się obsługą firm oraz prowadzeniem złożonych procesów gospodarczych i sądowych. Z czasem zobaczyliśmy, że wielu osobom prywatnym brakuje czegoś innego – wsparcia, które nie kosztuje fortuny, ale daje faktyczne rezultaty.',
            description2: 'Stworzyliśmy usługę dostępną, przystępną cenowo i prowadzoną w sposób jasny, etyczny i maksymalnie skuteczny. Pomagamy nie tylko z dokumentami – dzielimy się wiedzą, spokojem i doświadczeniem, które potrafią zmienić życie.',
            image: '/img/office.jpg',
        },
    },
    {
        page: 'onas',
        section: 'cta',
        content: {
            title: 'Gotowy na nowy początek?',
            description: 'Nie pozwól, aby długi decydowały o Twojej przyszłości. Skontaktuj się z nami na bezpłatną konsultację i przekonaj się, jakie masz możliwości.',
            buttonText: 'Umów bezpłatną konsultację',
            buttonLink: '/kontakt',
        },
    },

    // UPADŁOŚĆ
    {
        page: 'postepowanie-upadlosciowe',
        section: 'hero',
        content: {
            title: 'Czym jest upadłość konsumencka?',
            description: 'To formalna procedura sądowa, która pozwala osobom fizycznym (czyli nieprowadzącym już działalności gospodarczej) na legalne i trwałe rozwiązanie problemu niewypłacalności. Jej celem jest umożliwienie Ci wyjścia z długów, których realnie nie jesteś w stanie spłacić — przy jednoczesnej ochronie podstawowych potrzeb życiowych.',
            backgroundImage: '/img/fallhero.jpg',
        },
    },
    {
        page: 'postepowanie-upadlosciowe',
        section: 'whoIsItFor',
        content: {
            title: 'Dla kogo jest upadłość konsumencka?',
            description: 'To rozwiązanie przeznaczone jest dla osób fizycznych, które stały się niewypłacalne. Idealne, jeśli:',
            image: '/img/future.jpg',
            points: [
                'Twoje zadłużenie przerosło Twoje możliwości spłaty.',
                'Straciłeś/aś płynność finansową.',
                'Chcesz zatrzymać egzekucje komornicze, odzyskać spokój i zatrzymać telefony windykacji.',
            ],
        },
    },
    {
        page: 'postepowanie-upadlosciowe',
        section: 'process',
        content: {
            title: 'Jak wygląda proces upadłości konsumenckiej?',
            subtitle: 'Jasny plan działania od pierwszego kontaktu po prawomocne oddłużenie',
            steps: [
                {
                    no: '1',
                    name: 'Bezpłatna analiza sytuacji i przygotowanie wniosku',
                    description: 'Szczegółowo weryfikujemy Twoje zadłużenie, majątek i dochody. Tworzymy kompletny wniosek o upadłość wraz z wymaganym uzasadnieniem prawnym.',
                },
                {
                    no: '2',
                    name: 'Złożenie wniosku do właściwego sądu',
                    description: 'Składamy wniosek elektronicznie przez Krajowy Rejestr Zadłużonych. Dbamy o brak braków formalnych, co przyspiesza wydanie postanowienia.',
                },
                {
                    no: '3',
                    name: 'Ogłoszenie upadłości przez sąd – wstrzymanie windykacji',
                    description: 'Sąd wydaje postanowienie o ogłoszeniu upadłości. Z tą chwilą zatrzymują się wszelkie postępowania komornicze i naliczanie odsetek.',
                },
                {
                    no: '4',
                    name: 'Współpraca z syndykiem i plan spłaty',
                    description: 'Reprezentujemy Cię przed wyznaczonym syndykiem. Walczymy o jak najkorzystniejsze warunki planu spłaty lub całkowite umorzenie bez planu.',
                },
                {
                    no: '5',
                    name: 'Prawomocne umorzenie długów i nowy start',
                    description: 'Po wykonaniu planu spłaty (lub od razu przy braku majątku) sąd wydaje orzeczenie o umorzeniu zobowiązań. Jesteś w 100% wolny od długów!',
                },
            ],
        },
    },
    {
        page: 'postepowanie-upadlosciowe',
        section: 'benefits',
        content: {
            title: 'Korzyści z ogłoszenia upadłości',
            subtitle: 'Zobacz, co zyskujesz, podejmując decyzję o rozpoczęciu procedury',
            items: [
                {
                    id: '1',
                    title: 'Natychmiastowe wstrzymanie egzekucji',
                    description: 'Komornicy muszą zawiesić, a następnie umorzyć prowadzone przeciwko Tobie postępowania egzekucyjne.',
                },
                {
                    id: '2',
                    title: 'Koniec z telefonami windykacji',
                    description: 'Wierzyciele nie mogą nękać Cię telefonami, pismami czy wizytami domowymi. Wszystkie sprawy przejmuje syndyk.',
                },
                {
                    id: '3',
                    title: 'Zatrzymanie narastania odsetek',
                    description: 'Z dniem ogłoszenia upadłości długi przestają rosnąć. Nie są naliczane żadne karne opłaty ani odsetki.',
                },
                {
                    id: '4',
                    title: 'Szansa na 100% umorzenie długów',
                    description: 'Jeśli Twoja sytuacja materialna i zdrowotna na to wskazuje, sąd może umorzyć Twoje długi w całości bez planu spłaty.',
                },
            ],
        },
    },
    {
        page: 'postepowanie-upadlosciowe',
        section: 'faq',
        content: {
            title: 'Najczęściej zadawane pytania',
            subtitle: 'Wszystko, co warto wiedzieć o upadłości konsumenckiej',
            items: [
                {
                    id: '1',
                    q: 'Czy upadłość oznacza, że jestem niewiarygodny?',
                    a: 'Absolutnie nie. To legalna forma wyjścia z długów – wybierają ją osoby, które chcą działać odpowiedzialnie i odbudować swoje życie.',
                },
                {
                    id: '2',
                    q: 'Czy stracę pracę przez ogłoszenie upadłości?',
                    a: 'Nie. Informacja o upadłości nie trafia do pracodawcy i nie wpływa na Twoje zatrudnienie. Możesz nadal pracować, rozwijać się i zarabiać.',
                },
                {
                    id: '3',
                    q: 'Czy mogę prowadzić firmę po upadłości?',
                    a: 'Tak. Jeśli sąd ustali plan spłaty, nie ma przeszkód, byś znów mógł legalnie prowadzić działalność gospodarczą.',
                },
                {
                    id: '4',
                    q: 'Czy muszę spłacić wszystkie długi?',
                    a: 'Nie. Po wykonaniu planu spłaty – lub jeśli sąd zadecyduje o jego pominięciu – pozostałe zobowiązania są prawnie umarzane.',
                },
                {
                    id: '5',
                    q: 'Czy muszę iść do sądu?',
                    a: 'Nie. Cała procedura może odbyć się bez Twojej obecności na sali sądowej - w wyjątkowych przypadkach sąd wzywa na dodatkowe wyjaśnienia.',
                },
                {
                    id: '6',
                    q: 'Czy mogę ogłosić upadłość konsumencką mając komornika?',
                    a: 'Tak. Upadłość konsumencka zatrzymuje postępowania egzekucyjne. Komornik nie może dalej prowadzić działań wobec Ciebie po ogłoszeniu upadłości.',
                },
                {
                    id: '7',
                    q: 'Ile trwa proces upadłości konsumenckiej?',
                    a: 'To zależy od sytuacji – od złożenia wniosku do ogłoszenia upadłości może minąć nawet tylko kilka dni. Cały proces, w zależności od złożości, trwa zwykle od kilku miesięcy do 2 lat.',
                },
                {
                    id: '8',
                    q: 'Czy mogę ogłosić upadłość, jeśli mam pracę?',
                    a: 'Tak. Dochody nie wykluczają możliwości ogłoszenia upadłości. Sąd analizuje Twoje wydatki, sytuację rodzinną i realne możliwości spłaty.',
                },
            ],
        },
    },
    {
        page: 'postepowanie-upadlosciowe',
        section: 'cta',
        content: {
            title: 'Chcesz dowiedzieć się, czy kwalifikujesz się do upadłości?',
            description: 'Przeanalizujemy Twoją sytuację bezpłatnie i bez żadnych zobowiązań. Skontaktuj się z naszym ekspertem.',
            buttonText: 'Zamów bezpłatną analizę',
            buttonLink: '/kontakt',
        },
    },

    // RESTRUKTURYZACJA
    {
        page: 'postepowanie-restrukturyzacyjne',
        section: 'hero',
        content: {
            title: 'Postępowanie restrukturyzacyjne',
            description: 'Szansa na uratowanie przedsiębiorstwa i zachowanie majątku. Restrukturyzacja to legalny proces pozwalający na porozumienie z wierzycielami, zmniejszenie zobowiązań i ochronę firmy przed upadłością oraz komornikami.',
            backgroundImage: '/img/fallhero.jpg',
        },
    },
    {
        page: 'postepowanie-restrukturyzacyjne',
        section: 'whoIsItFor',
        content: {
            title: 'Dla kogo jest restrukturyzacja?',
            description: 'To rozwiązanie stworzone dla przedsiębiorców (jednoosobowych działalności oraz spółek), którzy zmagają się z problemami płynnościowymi:',
            image: '/img/future.jpg',
            points: [
                'Przychody firmy spadły, a koszty stałe i raty kredytów zaczęły przewyższać zyski.',
                'Grozi Ci utrata płynności finansowej lub już masz opóźnienia w płatnościach.',
                'Chcesz uchronić majątek firmy i uniknąć ogłoszenia bankructwa.',
                'Potrzebujesz tarczy ochronnej przed egzekucją komorniczą na czas negocjacji z wierzycielami.',
            ],
        },
    },
    {
        page: 'postepowanie-restrukturyzacyjne',
        section: 'process',
        content: {
            title: 'Przebieg postępowania o zatwierdzenie układu',
            subtitle: 'Szybka i dyskretna ścieżka do stabilizacji finansowej Twojej firmy',
            steps: [
                {
                    no: '1',
                    name: 'Analiza sytuacji i przygotowanie dokumentów – nawet w 24h',
                    description: 'Dokładnie analizujemy Twoją sytuację finansową, strukturę zobowiązań oraz możliwości dalszego prowadzenia działalności. Na tej podstawie przygotowujemy propozycje układowe i niezbędną dokumentację do otwarcia postępowania.',
                },
                {
                    no: '2',
                    name: 'Obwieszczenie o ustaleniu dnia układowego – ochrona przed egzekucją',
                    description: 'Dokonujemy obwieszczenia w Krajowym Rejestrze Zadłużonych. Od tego momentu zyskujesz ochronę przed egzekucją komorniczą, a wierzyciele nie mogą wypowiadać kluczowych umów (np. leasingu czy najmu).',
                },
                {
                    no: '3',
                    name: 'Głosowanie wierzycieli nad układem – bez sali sądowej',
                    description: 'Zbieramy głosy wierzycieli nad zaproponowanym układem. Dbamy o prawidłowy przebieg całej procedury oraz aktywnie komunikujemy się z wierzycielami, zwiększając szanse na przyjęcie układu.',
                },
                {
                    no: '4',
                    name: 'Złożenie wniosku do sądu o zatwierdzenie układu',
                    description: 'Po uzyskaniu wymaganej większości głosów składamy wniosek o zatwierdzenie układu. Sąd weryfikuje poprawność procedury i zgodność układu z przepisami.',
                },
                {
                    no: '5',
                    name: 'Zatwierdzenie układu – stabilizacja i dalsze prowadzenie firmy',
                    description: 'Po zatwierdzeniu układu przez sąd rozpoczynasz realizację nowych, ustalonych warunków spłaty. Twoja firma działa dalej, a zobowiązania są regulowane zgodnie z przyjętym harmonogramem.',
                },
            ],
        },
    },
    {
        page: 'postepowanie-restrukturyzacyjne',
        section: 'benefits',
        content: {
            title: 'Dlaczego warto wybrać restrukturyzację?',
            subtitle: 'Ochrona biznesu, zachowanie miejsc pracy i redukcja zadłużenia',
            items: [
                {
                    id: '1',
                    title: 'Tarcza przed komornikami',
                    description: 'Od momentu obwieszczenia egzekucje komornicze zostają zawieszone, co daje czas na spokojną restrukturyzację.',
                },
                {
                    id: '2',
                    title: 'Umorzenie części długu i nowe raty',
                    description: 'Układ pozwala na redukcję kapitału, umorzenie odsetek i rozłożenie spłaty na dogodne, wieloletnie raty.',
                },
                {
                    id: '3',
                    title: 'Zachowanie majątku i firmy',
                    description: 'Nadal zarządzasz przedsiębiorstwem, a kluczowe maszyny, nieruchomości czy leasingi pozostają w firmie.',
                },
                {
                    id: '4',
                    title: 'Ochrona kluczowych umów',
                    description: 'Wierzyciele nie mogą wypowiedzieć umów najmu lokali, leasingów czy kredytów w trakcie trwania ochrony.',
                },
            ],
        },
    },
    {
        page: 'postepowanie-restrukturyzacyjne',
        section: 'faq',
        content: {
            title: 'Pytania i odpowiedzi: Restrukturyzacja',
            subtitle: 'Poznaj szczegóły prawne i praktyczne',
            items: [
                {
                    id: '1',
                    q: 'Czym różni się restrukturyzacja od upadłości?',
                    a: 'Restrukturyzacja służy uratowaniu firmy i jej dalszemu działaniu, podczas gdy upadłość ma na celu likwidację majątku i zakończenie bytu przedsiębiorstwa.',
                },
                {
                    id: '2',
                    q: 'Kiedy jest najlepszy moment na rozpoczęcie restrukturyzacji?',
                    a: 'Im wcześniej, tym większe szanse powodzenia. Najlepiej podjąć kroki, gdy pojawiają się pierwsze zatory płatnicze, zanim komornik zajmie konta.',
                },
                {
                    id: '3',
                    q: 'Czy wierzyciele muszą zgodzić się na układ?',
                    a: 'Do przyjęcia układu wymagana jest większość głosów wierzycieli (reprezentujących 2/3 sumy wierzytelności). Nie jest potrzebna 100% jednomyślność.',
                },
                {
                    id: '4',
                    q: 'Kto zarządza firmą w trakcie restrukturyzacji?',
                    a: 'W postępowaniu o zatwierdzenie układu zarząd nad majątkiem i firmą pozostaje w całości w Twoich rękach pod nadzorem wyznaczonego doradcy restrukturyzacyjnego.',
                },
            ],
        },
    },
    {
        page: 'postepowanie-restrukturyzacyjne',
        section: 'cta',
        content: {
            title: 'Potrzebujesz ratunku dla swojej firmy?',
            description: 'Nie czekaj na wypowiedzenie umów i komornika. Umów bezpłatną konsultację z licencjonowanym doradcą restrukturyzacyjnym.',
            buttonText: 'Bezpłatna konsultacja biznesowa',
            buttonLink: '/kontakt',
        },
    },

    // KONTAKT
    {
        page: 'kontakt',
        section: 'header',
        content: {
            title: 'Skontaktuj się z nami',
            description: 'Masz pytania lub chcesz umówić się na bezpłatną i poufną konsultację? Wypełnij formularz lub skorzystaj z danych kontaktowych poniżej. Jesteśmy tu, aby Ci pomóc.',
        },
    },
    {
        page: 'kontakt',
        section: 'details',
        content: {
            title: 'Dane Kontaktowe',
            description: 'Czekamy na Twój telefon lub e-mail. Oferujemy również konsultacje online oraz w naszym biurze.',
            phone: '+48 796 464 273',
            email: 'kontakt@twojeoddluzanie.pl',
            address: 'Polska (obsługa zdalna na terenie całego kraju)',
            hours: 'Poniedziałek - Piątek: 8:00 - 18:00',
        },
    },
    {
        page: 'kontakt',
        section: 'form',
        content: {
            title: 'Napisz do nas',
            description: 'Wypełnij krótki formularz – oddzwonimy lub odpiszemy w ciągu maksymalnie 24 godzin.',
            submitEndpoint: 'https://formspree.io/f/xjkovnlg',
            buttonText: 'Wyślij zapytanie',
        },
    },

    // POLITYKA PRYWATNOŚCI
    {
        page: 'polityka-prywatnosci',
        section: 'main',
        content: {
            title: 'Polityka prywatności',
            intro: 'Polityka prywatności opisuje zasady przetwarzania przez nas informacji na Twój temat, w tym danych osobowych oraz ciasteczek, czyli tzw. cookies.',
            sections: [
                {
                    id: '1',
                    title: '1. Informacje ogólne',
                    content: '1. Niniejsza polityka dotyczy Serwisu www, funkcjonującego pod adresem url: twojeoddluzanie.pl\n2. Operatorem serwisu oraz Administratorem danych osobowych jest: Twoje Oddłużanie\n3. Adres kontaktowy poczty elektronicznej operatora: kontakt@twojeoddluzanie.pl\n4. Operator jest Administratorem Twoich danych osobowych w odniesieniu do danych podanych dobrowolnie w Serwisie.\n5. Serwis wykorzystuje dane osobowe w celach: obsługi zapytań przez formularz, przygotowania wstępnej analizy prawnej oraz realizacji zamówionych usług prawnych.',
                },
                {
                    id: '2',
                    title: '2. Wybrane metody ochrony danych stosowane przez Operatora',
                    content: '1. Miejsca logowania i wprowadzania danych osobowych są chronione w warstwie transmisji (certyfikat SSL).\n2. Hasła użytkowników są przechowywane w postaci hashowanej.\n3. Operator okresowo zmienia swoje hasła administracyjne.\n4. W celu ochrony danych Operator regularnie wykonuje kopie bezpieczeństwa.',
                },
                {
                    id: '3',
                    title: '3. Twoje prawa i dodatkowe informacje o sposobie wykorzystania danych',
                    content: '1. W niektórych sytuacjach Administrator ma prawo przekazywać Twoje dane osobowe innym odbiorcom, jeśli będzie to niezbędne do wykonania zawartej z Tobą umowy lub do zrealizowania obowiązków ciążących na Administratorze.\n2. Przysługuje Ci prawo żądania od Administratora: dostępu do danych osobowych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz przenoszenia danych.\n3. Przysługuje Ci prawo do wniesienia sprzeciwu wobec przetwarzania danych.',
                },
                {
                    id: '4',
                    title: '4. Informacje o plikach cookies',
                    content: '1. Serwis korzysta z plików cookies (ciasteczek).\n2. Pliki cookies stanowią dane informatyczne, w szczególności pliki tekstowe, które przechowywane są w urządzeniu końcowym Użytkownika Serwisu.\n3. Pliki cookies wykorzystywane są w celach utrzymania sesji oraz tworzenia statystyk, które pomagają zrozumieć, w jaki sposób Użytkownicy korzystają ze stron internetowych.',
                },
            ],
        },
    },
];

async function deploy() {
    console.log('=== ROZPOCZYNANIE WDROŻENIA BAZY DANYCH NA SEOHOST ===');
    console.log(`Serwer: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
    console.log(`Baza:   ${process.env.DB_NAME}`);
    console.log(`User:   ${process.env.DB_USER}`);

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8mb4',
    });

    const adminOnly = process.argv.includes('--admin-only');

    try {
        if (!adminOnly) {
            console.log('\n[1/4] Tworzenie struktury tabel MySQL...');

            await conn.query(`
                CREATE TABLE IF NOT EXISTS cms_sections (
                    page_slug VARCHAR(64) NOT NULL,
                    section_key VARCHAR(64) NOT NULL,
                    content_json LONGTEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    PRIMARY KEY (page_slug, section_key)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `);

            await conn.query(`
                CREATE TABLE IF NOT EXISTS cms_settings (
                    setting_key VARCHAR(64) NOT NULL PRIMARY KEY,
                    setting_value LONGTEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `);

            await conn.query(`
                CREATE TABLE IF NOT EXISTS cms_users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(64) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(32) DEFAULT 'admin',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `);

            console.log('✓ Tabele utworzone.');

            console.log('\n[2/4] Wprowadzanie sekcji stron do tabeli cms_sections...');
            let sCount = 0;
            for (const item of defaultSections) {
                await conn.query(
                    `INSERT INTO cms_sections (page_slug, section_key, content_json)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = CURRENT_TIMESTAMP`,
                    [item.page, item.section, JSON.stringify(item.content)]
                );
                sCount++;
            }
            console.log(`✓ Wprowadzono ${sCount} sekcji podstron (home, onas, upadłość, restrukturyzacja, kontakt, polityka prywatności).`);

            console.log('\n[3/4] Wprowadzanie ustawień globalnych do cms_settings...');
            let gCount = 0;
            for (const [key, val] of Object.entries(defaultGlobalSettings)) {
                await conn.query(
                    `INSERT INTO cms_settings (setting_key, setting_value)
                     VALUES (?, ?)
                     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP`,
                    [key, JSON.stringify(val)]
                );
                gCount++;
            }
            console.log(`✓ Wprowadzono ${gCount} konfiguracji globalnych (nawigacja, stopka, kontakt, cookies).`);
        }

        console.log('\n[4/4] Konfiguracja konta administratora w tabeli cms_users...');
        const adminUser = process.env.ADMIN_USER;
        const adminPass = process.env.ADMIN_PASSWORD;
        if (!adminUser || !adminPass) {
            throw new Error('Brak zmiennych ADMIN_USER lub ADMIN_PASSWORD w pliku .env!');
        }
        const passHash = await bcrypt.hash(adminPass, 12);

        await conn.query('DELETE FROM cms_users WHERE username != ?', [adminUser]);
        await conn.query(
            `INSERT INTO cms_users (username, password_hash, role)
             VALUES (?, ?, 'admin')
             ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
            [adminUser, passHash]
        );
        console.log(`✓ Użytkownik '${adminUser}' zarejestrowany i zabezpieczony (bcrypt 12 rund) w bazie.`);

        // Final verification
        const [tables] = await conn.query('SHOW TABLES');
        const [secRows] = await conn.query('SELECT COUNT(*) as cnt FROM cms_sections');
        const [setRows] = await conn.query('SELECT COUNT(*) as cnt FROM cms_settings');
        const [usrRows] = await conn.query('SELECT COUNT(*) as cnt FROM cms_users');

        console.log('\n======================================================');
        console.log('WDROŻENIE ZAKOŃCZONE PEŁNYM SUKCESEM!');
        console.log('Tabele na serwerze:', tables.map(r => Object.values(r)[0]));
        console.log(`Liczba wierszy w cms_sections: ${secRows[0].cnt}`);
        console.log(`Liczba wierszy w cms_settings: ${setRows[0].cnt}`);
        console.log(`Liczba wierszy w cms_users:    ${usrRows[0].cnt}`);
        console.log('======================================================');
    } catch (err) {
        console.error('BŁĄD PODCZAS WPROWADZANIA:', err);
        process.exit(1);
    } finally {
        await conn.end();
    }
}

deploy();
