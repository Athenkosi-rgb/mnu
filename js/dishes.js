//create dishes here http://www.da-fausto.de/download/Da%20Fausto_Menu_eng.pdf
const dishes = [
  //Antipasti -----------------------------------------------------------------------
  {
    id: "1",
    inOrder: 0,
    name: "Carpaccio of duck",
    tab: "Antipasti",
    favourite: false,
    imgSrc: "assets/Duck_Carpaccio.png",
    price: 13.8,
    description: "Fresh Carpaccio of duck breast filet with rocket, Parmesan",
    ingredients: ["Duck", "Rocket", "Parmesan"],
    addOns: [
      {
        name: "extra Rocket",
        price: 0.89,
        added: false,
      },
      {
        name: "extra Parmesan",
        price: 0.75,
        added: false,
      },
      {
        name: "Capers",
        price: 0.85,
        added: false,
      },
    ],
    dietCompatible: [false, true, false, true, false, false, false], //Vegetarian, glutenfree, vegan, halal, kosher, prescetarian, lactose
  },
  {
    id: "2",
    inOrder: 0,
    name: "Vitello tonnato",
    tab: "Antipasti",
    favourite: false,
    imgSrc: "assets/vitello_tonnato.jpg",
    price: 12.95,
    description:
      "Thinly sliced veal cooked in a vegetable broth and white wine with tuna sauce and capers",
    ingredients: ["Veal", "Capers", "Wine", "Fish", "Egg", "Sulfites"],
    addOns: [
      {
        name: "no Wine",
        price: 0.89,
        added: false,
      },
      {
        name: "no Capers",
        price: 0.75,
        added: false,
      },
      {
        name: "Parmesan",
        price: 0.85,
        added: false,
      },
    ],

    dietCompatible: [false, true, false, false, false, false, true],
  },
  {
    id: "3",
    inOrder: 0,
    name: "Insalata di mare",
    tab: "Antipasti",
    favourite: false,
    imgSrc: "assets/Insalatadimare.jpg",
    price: 15.5,
    description: "Seafood salad with squid, shrimp, carrots and rocket",
    ingredients: [
      "Squid",
      "Shrimp",
      "Carrot",
      "Rocket",
      "Crustaceans",
      "Soy",
      "Mollusc",
      "Sulfites",
    ],
    addOns: [
      {
        name: "extra Rocket",
        price: 0.89,
        added: false,
      },
      {
        name: "extra Squid",
        price: 0.75,
        added: false,
      },
      {
        name: "extra Shrimp",
        price: 0.85,
        added: false,
      },
    ],
    dietCompatible: [false, true, false, false, false, true, true],
  },
  //Salads --------------------------------------------------------------------
  {
    id: "4",
    inOrder: 0,
    name: "Insalata mista",
    tab: "Salads",
    favourite: false,
    imgSrc: "assets/Insalatamista.jpg",
    price: 7.5,
    description: "Mixed green, carrots, tomatoes and cucumber ",
    ingredients: ["Carrot", "Tomato", "Cucumber"],
    addOns: [
      {
        name: "Eggplant",
        price: 0.89,
        added: false,
      },
      {
        name: "Red Bell Pepper",
        price: 0.75,
        added: false,
      },
      {
        name: "Corn",
        price: 0.85,
        added: false,
      },
    ],
    dietCompatible: [true, true, true, true, true, true, true],
  },
  {
    id: "5",
    inOrder: 0,
    name: "Mozzarella con pomodoro",
    tab: "Salads",
    favourite: false,
    imgSrc: "assets/Mozzarellapomodoro.jpg",
    price: 9.9,
    description: "Mozzarella with fresh tomatoes and basil ",
    ingredients: ["Mozarella", "Tomato", "Basil", "Balsamico"],
    addOns: [
      {
        name: "no Basil",
        price: 0.89,
        added: false,
      },
      {
        name: "no Balsamico",
        price: 0.75,
        added: false,
      },
      {
        name: "Pepper",
        price: 0.85,
        added: false,
      },
    ],
    dietCompatible: [true, true, false, true, true, true, false],
  },
  {
    id: "6",
    inOrder: 0,
    name: "Antipasti di verdura",
    tab: "Salads",
    favourite: false,
    imgSrc: "assets/Grilled_vegetable_antipasti.jpg",
    price: 12.5,
    description: "Grilled antipasti vegetables",
    ingredients: ["Carrot", "Tomato", "Eggplant", "Zucchini", "Olive Oil"],
    addOns: [
      {
        name: "red Bell Pepper",
        price: 0.89,
        added: false,
      },
      {
        name: "Corn",
        price: 0.75,
        added: false,
      },
      {
        name: "Parmesan",
        price: 0.85,
        added: false,
      },
    ],
    dietCompatible: [true, true, true, true, true, true, true],
  },
  //Pizza ---------------------------------------------------------------
  {
    id: "7",
    inOrder: 0,
    name: "Pizza alla Marinara",
    tab: "Pizza",
    favourite: false,
    imgSrc: "assets/PizzaMare.jpg",
    price: 10.8,
    description:
      "Pizza alla Marinara with tomatoes, cheese, calamari, shrimp, mussels, garlic",
    ingredients: [
      "Cheese",
      "Tomato",
      "Calamari",
      "Shrimp",
      "Mussels",
      "Garlic",
      "Crustaceans",
      "Fish",
      "Celery",
      "Mollusc",
      "Sulfites",
    ],
    addOns: [
      {
        name: "Corn",
        price: 0.89,
        added: false,
      },
      {
        name: "no Garlic",
        price: 0.75,
        added: false,
      },
      {
        name: "extra Cheese",
        price: 0.85,
        added: false,
      },
    ],
    dietCompatible: [false, false, false, true, false, true, false],
  },
  {
    id: "8",
    inOrder: 0,
    name: "Pizza Salami",
    tab: "Pizza",
    favourite: false,
    imgSrc: "assets/Salamipizza.jpg",
    price: 8.95,
    description: "Pizza Salami with tomatoes, cheese, salami",
    ingredients: ["Cheese", "Tomato", "Salami"],
    addOns: [{ name: "extra Cheese", price: 0.68, added: false }],
    dietCompatible: [false, false, false, true, true, false, false],
  },
  {
    id: "9",
    inOrder: 0,
    name: "Pizza Regina Vegana",
    tab: "Pizza",
    favourite: false,
    imgSrc: "assets/PizzaRegina.jpg",
    price: 9.8,
    description: "Pizza with artichokes or green chili peppers",
    ingredients: ["Artichokes", "Tomato", "Chili", "Sulfites"],
    addOns: [
      {
        name: "no Artichokes",
        price: 0.89,
        added: false,
      },
      {
        name: "no Chili",
        price: 0.75,
        added: false,
      },
      {
        name: "Cheese",
        price: 0.85,
        added: false,
      },
    ],
    dietCompatible: [true, false, true, true, true, true, true],
  },
  //Pasta --------------------------------------------------------------------------
  {
    id: "10",
    inOrder: 0,
    name: "Tagliatelle with salmon",
    tab: "Pasta",
    favourite: false,
    imgSrc: "assets/TagliatelleLachs.jpg",
    price: 13.9,
    description: "Tagliatelle with salmon and zucchini in lobster-sauce",
    ingredients: ["Salmon", "Zucchini", "Lobster", "Noodles", "Egg"],
    addOns: [{ name: "Parmesan", price: 0.9, added: false }],
    dietCompatible: [false, false, false, true, false, true, true],
  },
  {
    id: "11",
    inOrder: 0,
    name: "Ravioli con spinaci e ricotta",
    tab: "Pasta",
    favourite: false,
    imgSrc: "assets/Ravioli.jpg",
    price: 12.5,
    description: "Homemade Ravioli with spinach and ricotta cheese",
    ingredients: ["Noodles", "Spinach", "Ricotta", "Egg"],
    addOns: [{ name: "Parmesan", price: 0.9, added: false }],
    dietCompatible: [true, false, false, false, true, true, false],
  },
  {
    id: "12",
    inOrder: 0,
    name: "Tagliatelle con anatra",
    tab: "Pasta",
    favourite: false,
    imgSrc: "assets/TagliatelleDuck.jpg",
    price: 13.5,
    description: "Ribbon noodles with duck ragout",
    ingredients: ["Noodles", "Duck", "Celery", "Egg"],
    addOns: [
      { name: "Parmesan", price: 0.9, added: false },
      { name: "Chives", price: 0.9, added: false },
    ],
    dietCompatible: [false, false, false, false, false, false, false],
  },
  //Fish ---------------------------------------------------------------------
  {
    id: "13",
    inOrder: 0,
    name: "Gamberoni all'aglio e peperoncino",
    tab: "Fish",
    favourite: false,
    imgSrc: "assets/Gamberoni.jpg",
    price: 29.9,
    description:
      "King prawns with garlic, red chili pepper with boiled potatoes and vegetables",
    ingredients: [
      "Prawns",
      "Garlic",
      "Chili",
      "Potato",
      "Tomato",
      "Zucchini",
      "Carrot",
      "Crustaceans",
    ],
    addOns: [
      { name: "no Garlic", price: 0.9, added: false },
      { name: "no Chili", price: 0.9, added: false },
    ],
    dietCompatible: [false, true, false, true, false, true, true],
  },
  {
    id: "14",
    inOrder: 0,
    name: "Sogliola alla griglia",
    tab: "Fish",
    favourite: false,
    imgSrc: "assets/GrilledSole.png",
    price: 32,
    description: "Grilled sole with boiled potatoes and vegetables",
    ingredients: ["Sole", "Potato", "Tomato", "Zucchini", "Carrot"],
    addOns: [],
    dietCompatible: [false, true, false, true, false, true, true],
  },
  {
    id: "15",
    inOrder: 0,
    name: "Gilthead",
    tab: "Fish",
    favourite: false,
    imgSrc: "assets/Gilthead.jpg",
    price: 22.5,
    description:
      "Gilthead seabream in mustard-sauce with boiled potatoes and vegetables",
    ingredients: ["Gilthead", "Potato", "Tomato", "Zucchini", "Carrot"],
    addOns: [],
    dietCompatible: [false, true, false, false, false, true, true], //Vegetarian, glutenfree, vegan, halal, kosher, prescetarian, lactosefree
  },
  //Meat -----------------------------------------------------------------
  {
    id: "16",
    inOrder: 0,
    name: "Straccetti alla Romana",
    tab: "Meat",
    favourite: false,
    imgSrc: "assets/Straccetti.png",
    price: 29.5,
    description:
      "Thin stripes of beef with garlic and red chili pepper served with fried potatoes and vegetables",
    ingredients: [
      "Beef",
      "Potato",
      "Tomato",
      "Zucchini",
      "Carrot",
      "Garlic",
      "Chili",
    ],
    addOns: [
      { name: "no Garlic", price: 0.9, added: false },
      { name: "no Chili", price: 0.9, added: false },
    ],
    dietCompatible: [false, true, false, false, false, false, true],
  },
  {
    id: "17",
    inOrder: 0,
    name: "Veal with gorgonzola",
    tab: "Meat",
    favourite: false,
    imgSrc: "assets/VealGorgonzola.jpg",
    price: 23.8,
    description:
      "Medaillon of veal in gorgonzola-sauce served with fried potatoes and vegetables",
    ingredients: [
      "Veal",
      "Potato",
      "Tomato",
      "Zucchini",
      "Carrot",
      "Gorgonzola",
    ],
    addOns: [],
    dietCompatible: [false, true, false, false, false, false, false],
  },
  //Dessert -----------------------------------------------------------
  {
    id: "18",
    inOrder: 0,
    name: "Tiramisu speciale",
    tab: "Dessert",
    favourite: false,
    imgSrc: "assets/Tiramisu.jpg",
    price: 7.2,
    description: "Tiramisu with almond sponge",
    ingredients: ["Almond", "Egg", "Peanut", "Nuts", "Alcohol"],
    addOns: [
      { name: "no Almonds", price: 0.9, added: false },
      { name: "extra Almonds", price: 0.9, added: false },
    ],
    dietCompatible: [true, false, false, true, false, true, false],
  },
  {
    id: "19",
    inOrder: 0,
    name: "Mousse au chocolat",
    tab: "Dessert",
    favourite: false,
    imgSrc: "assets/Mousse.jpg",
    price: 6.8,
    description: "",
    ingredients: ["Egg", "Nuts"],
    addOns: [{ name: "Mint", price: 0.73, added: false }],
    dietCompatible: [true, false, false, true, false, true, false],
  },
  {
    id: "20",
    inOrder: 0,
    name: "Panna cotta",
    tab: "Dessert",
    favourite: false,
    imgSrc: "assets/PannaCotta.jpg",
    price: 6.8,
    description: "",
    ingredients: ["Cream", "Strawberry"],
    addOns: [{ name: "extra Strawberry Sauce", price: 1.0, added: false }],
    dietCompatible: [true, true, false, true, true, true, false],
  },
  //Hot Drinks ------------------------------------------------------------
  {
    id: "21",
    inOrder: 0,
    name: "Espresso",
    tab: "Hot Drinks",
    favourite: false,
    imgSrc: "assets/Espresso.jpg",
    price: 2.65,
    description: "",
    ingredients: [],
    addOns: [],
    dietCompatible: [true, true, true, true, true, true, true],
  },
  {
    id: "22",
    inOrder: 0,
    name: "Cappuccino",
    tab: "Hot Drinks",
    favourite: false,
    imgSrc: "assets/Cappuccino.jpg",
    price: 3.8,
    description: "",
    ingredients: [],
    addOns: [],
    dietCompatible: [true, true, true, true, true, true, false], //Vegetarian, glutenfree, vegan, halal, kosher, prescetarian, lactosefree
  },
  {
    id: "23",
    inOrder: 0,
    name: "Tea",
    tab: "Hot Drinks",
    favourite: false,
    imgSrc: "assets/Tea.png",
    price: 2.95,
    description: "Get a cup of a freshly brewed tea of your choice",
    ingredients: [],
    addOns: [
      { name: "Peppermint", price: 0.56, added: false },
      { name: "Apple", price: 0.79, added: false },
      { name: "Wild Berries", price: 0.68, added: false },
      { name: "Camomile", price: 0.57, added: false },
      { name: "Earl Grey", price: 5.0, added: false },
    ],
    dietCompatible: [true, true, true, true, true, true, true],
  },
  //Soft Drink -------------------------------------------------------
  {
    id: "24",
    inOrder: 0,
    name: "Cola",
    tab: "Soft drinks",
    favourite: false,
    imgSrc: "assets/coca_cola.jpg",
    price: 2.95,
    description: "250 ml Coca Cola",
    ingredients: [],
    addOns: [{ name: "Lemon", price: 0.6, added: false }],
    dietCompatible: [true, true, true, true, true, true, true],
  },
  {
    id: "25",
    inOrder: 0,
    name: "Apple Juice",
    tab: "Soft drinks",
    favourite: false,
    imgSrc: "assets/AppleJuice.jpg",
    price: 2.95,
    description: "250 ml apple juice made from local apples",
    ingredients: ["Apple"],
    addOns: [],
    dietCompatible: [true, true, true, true, true, true, true],
  },
  {
    id: "26",
    inOrder: 0,
    name: "Orange Juice",
    tab: "Soft drinks",
    favourite: false,
    imgSrc: "assets/OrangeJuice.jpg",
    price: 2.95,
    description: "250 ml freshly squeezed orange juice",
    ingredients: ["Orange"],
    addOns: [],
    dietCompatible: [true, true, true, true, true, true, true],
  },
  {
    id: "27",
    inOrder: 0,
    name: "Banana Juice",
    tab: "Soft drinks",
    favourite: false,
    imgSrc: "assets/Banana.jpeg",
    price: 1000.01,
    description: "250 ml banana juice made from not-quite-bananas",
    ingredients: ["not-quite-banana"],
    addOns: [
      { name: "use real banana", price: - 997.06, added: false }
    ],
    dietCompatible: [true, true, true, true, true, true, true],
  },
  //Alcoholic drinks ----------------------------------------------------
  {
    id: "28",
    inOrder: 0,
    name: "Spaten Helles from draft 0,5l",
    tab: "Alcoholic drinks",
    favourite: false,
    imgSrc: "assets/Spaten.jpg",
    price: 4.75,
    description: "Spaten Helles from draft 0,5l",
    ingredients: ["Alcohol"],
    addOns: [],
    dietCompatible: [true, true, true, false, true, true, true],
  },
  {
    id: "29",
    inOrder: 0,
    name: "Lambrusco 0.25l",
    tab: "Alcoholic drinks",
    favourite: false,
    imgSrc: "assets/Lambrusco.jpg",
    price: 6.95,
    description: "Red wine 0.25l",
    ingredients: ["Alcohol"],
    addOns: [],
    dietCompatible: [true, true, true, false, true, true, true],
  },
  {
    id: "30",
    inOrder: 0,
    name: "Chivas regal 4cl",
    tab: "Alcoholic drinks",
    favourite: false,
    imgSrc: "assets/Chivas.png",
    price: 16,
    description: "Whisky 40%Vol 4cl",
    ingredients: ["Alcohol"],
    addOns: [],
    dietCompatible: [true, true, true, false, true, true, true],
  },
];
