import { PrismaClient, Role } from "../src/app/_generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type SeedBook = {
    title: string;
    description: string | null;
    author: string | null;
    publisher: string | null;
    publishedYear: number | null;
    numberOfPages: number | null;
    genre: string | null;
    coverImageUrl: string | null;
};

const books: SeedBook[] = [
    {
        title: "The Pragmatic Programmer",
        description:
            "Praktische gids vol principes, tips en metaforen om als ontwikkelaar duurzaam betere software te bouwen.",
        author: "Andrew Hunt, David Thomas",
        publisher: "Addison-Wesley Professional",
        publishedYear: 1999,
        numberOfPages: 352,
        genre: "Softwareontwikkeling",
    coverImageUrl: "/img/covers/the_pragmatic_programmer.jpg",
    },
    {
        title: "Clean Code",
        description:
            "Toont hoe je leesbare, onderhoudbare code schrijft aan de hand van principes, patronen en refactorings.",
        author: "Robert C. Martin",
        publisher: "Prentice Hall",
        publishedYear: 2008,
        numberOfPages: 464,
        genre: "Softwareontwikkeling",
    coverImageUrl: "/img/covers/clean_code.jpg",
    },
    {
        title: "Clean Architecture",
        description:
            "Beschrijft architecturale richtlijnen om systemen flexibel en testbaar te houden op lange termijn.",
        author: "Robert C. Martin",
        publisher: "Prentice Hall",
        publishedYear: 2017,
        numberOfPages: 432,
        genre: "Softwarearchitectuur",
    coverImageUrl: "/img/covers/clean_architecture.jpg",
    },
    {
        title: "Refactoring: Improving the Design of Existing Code",
        description:
            "Stap-voor-stap techniekbeschrijvingen om bestaande code geleidelijk te verbeteren zonder gedrag te breken.",
        author: "Martin Fowler",
        publisher: "Addison-Wesley Professional",
        publishedYear: 2018,
        numberOfPages: 448,
        genre: "Softwareontwikkeling",
    coverImageUrl: "/img/covers/refactoring_improving_the_design_of_existing_code.jpg",
    },
    {
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        description:
            "Introduceert 23 klassieke ontwerppatronen voor objectgeoriënteerde software en hun toepassingsscenario's.",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        publisher: "Addison-Wesley Professional",
        publishedYear: 1994,
        numberOfPages: 395,
        genre: "Softwarearchitectuur",
    coverImageUrl: "/img/covers/design_patterns_elements_of_reusable_object_oriented_software.jpg",
    },
    {
        title: "You Don't Know JS Yet",
        description:
            "Diepe duik in de kernconcepten van JavaScript om het gedrag van de taal echt te begrijpen.",
        author: "Kyle Simpson",
        publisher: "Independently Published",
        publishedYear: 2020,
        numberOfPages: 278,
        genre: "JavaScript",
    coverImageUrl: "/img/covers/you_dont_know_js_yet.jpg",
    },
    {
        title: "The Mythical Man-Month",
        description:
            "Essays over softwareprojectmanagement met klassiek inzicht dat extra mensen een vertraagd project niet versnellen.",
        author: "Frederick P. Brooks Jr.",
        publisher: "Addison-Wesley Professional",
        publishedYear: 1995,
        numberOfPages: 336,
        genre: "Projectmanagement",
    coverImageUrl: "/img/covers/the_mythical_man_month.jpg",
    },
    {
        title: "Working effectively with legacy code",
        description:
            "Praktische strategieën om legacy code stap voor stap testbaar en veranderbaar te maken.",
        author: "Michael C. Feathers",
        publisher: "Prentice Hall",
        publishedYear: 2004,
        numberOfPages: 456,
        genre: "Softwareonderhoud",
    coverImageUrl: "/img/covers/working_effectively_with_legacy_code.jpg",
    },
    {
        title: "The Clean Coder",
        description:
            "Adviezen over professionele houding, communicatie en vakmanschap voor softwareontwikkelaars.",
        author: "Robert C. Martin",
        publisher: "Prentice Hall",
        publishedYear: 2011,
        numberOfPages: 256,
        genre: "Professionele ontwikkeling",
    coverImageUrl: "/img/covers/the_clean_coder.jpg",
    },
    {
        title: "Deep Work",
        description:
            "Onderzoekt hoe geconcentreerd werken tot uitzonderlijke resultaten leidt in een wereld vol afleiding.",
        author: "Cal Newport",
        publisher: "Grand Central Publishing",
        publishedYear: 2016,
        numberOfPages: 304,
        genre: "Productiviteit",
    coverImageUrl: "/img/covers/deep_work.jpg",
    },
    {
        title: "Sapiens: A Brief History of Humankind",
        description:
            "Een meeslepende geschiedenis van de mensheid van jager-verzamelaar tot moderne samenleving.",
        author: "Yuval Noah Harari",
        publisher: "Harper",
        publishedYear: 2015,
        numberOfPages: 498,
        genre: "Geschiedenis",
    coverImageUrl: "/img/covers/sapiens_a_brief_history_of_humankind.jpg",
    },
    {
        title: "Homo Deus: A Brief History of Tomorrow",
        description:
            "Verkent de toekomst van mens en technologie en welke nieuwe doelen de mensheid nastreeft.",
        author: "Yuval Noah Harari",
        publisher: "Harper",
        publishedYear: 2017,
        numberOfPages: 449,
        genre: "Toekomststudies",
    coverImageUrl: "/img/covers/homo_deus_a_brief_history_of_tomorrow.jpg",
    },
    {
        title: "Educated",
        description:
            "Memoires van een vrouw die opgroeit in een streng mormoons gezin en zichzelf via onderwijs hervindt.",
        author: "Tara Westover",
        publisher: "Random House",
        publishedYear: 2018,
        numberOfPages: 352,
        genre: "Memoires",
    coverImageUrl: "/img/covers/educated.jpg",
    },
    {
        title: "De ontdekking van de hemel",
        description:
            "Epische roman waarin twee vrienden verstrikt raken in een goddelijk plan dat de mensheid moet redden.",
        author: "Harry Mulisch",
        publisher: "De Bezige Bij",
        publishedYear: 1992,
        numberOfPages: 905,
        genre: "Literaire roman",
    coverImageUrl: "/img/covers/de_ontdekking_van_de_hemel.jpg",
    },
    {
        title: "Het Diner",
        description:
            "Psychologische roman waarin een diner twee gezinnen confronteert met de daden van hun zonen.",
        author: "Herman Koch",
        publisher: "Uitgeverij Anthos",
        publishedYear: 2009,
        numberOfPages: 320,
        genre: "Thriller",
    coverImageUrl: "/img/covers/het_diner.jpg",
    },
    {
        title: "Naokos Lächeln",
        description:
            "Duitstalige editie van Murakami's roman over liefde, verlies en volwassen worden in Tokio.",
        author: "Haruki Murakami",
        publisher: "Rowohlt Verlag",
        publishedYear: 2003,
        numberOfPages: 480,
        genre: "Literaire roman",
    coverImageUrl: "/img/covers/naokos_lacheln.jpg",
    },
    {
        title: "The Alchemist",
        description:
            "Een herdersjongen volgt zijn persoonlijke legende in een spirituele zoektocht vol symboliek.",
        author: "Paulo Coelho",
        publisher: "HarperOne",
        publishedYear: 1993,
        numberOfPages: 208,
        genre: "Spirituele roman",
    coverImageUrl: "/img/covers/the_alchemist.jpg",
    },
    {
        title: "The Lean Startup",
        description:
            "Introduceert build-measure-learn en experimenten om startups efficiënter te laten innoveren.",
        author: "Eric Ries",
        publisher: "Crown Business",
        publishedYear: 2011,
        numberOfPages: 320,
        genre: "Ondernemerschap",
    coverImageUrl: "/img/covers/the_lean_startup.jpg",
    },
    {
        title: "Zero to One",
        description:
            "Bespreekt hoe je bedrijven bouwt die nieuwe waarde creëren in plaats van concurrerende kopieën.",
        author: "Peter Thiel, Blake Masters",
        publisher: "Crown Business",
        publishedYear: 2014,
        numberOfPages: 224,
        genre: "Ondernemerschap",
    coverImageUrl: "/img/covers/zero_to_one.jpg",
    },
    {
        title: "Thinking, Fast and Slow",
        description:
            "Onderzoekt hoe ons denken gestuurd wordt door snel intuïtief systeem 1 en langzaam rationeel systeem 2.",
        author: "Daniel Kahneman",
        publisher: "Farrar, Straus and Giroux",
        publishedYear: 2011,
        numberOfPages: 512,
        genre: "Psychologie",
    coverImageUrl: "/img/covers/thinking_fast_and_slow.jpg",
    },
];

async function main() {
    await prisma.loan.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    if (books.length === 0) {
        console.warn("Seed klaar: database is leeggemaakt maar er zijn geen boeken toegevoegd.");
        return;
    }

    const passwordHash = await bcrypt.hash("Welkom123!", 10);

    await prisma.user.createMany({
        data: [
            {
                email: "serdar.karaman@student.arteveldehs.be",
                name: "Serdar Karaman",
                hashedPassword: passwordHash,
                role: Role.USER,
            },
            {
                email: "medewerker@arteveldehs.be",
                name: "Test medewerker",
                hashedPassword: passwordHash,
                role: Role.ADMIN,
            },
        ],
    });

    await prisma.book.createMany({ data: books });
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
