const yourOrder = [];

const friendsOrder1 = [
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
    addOns: ["Eggplant", "Red Bell Pepper", "Corn"],
    dietCompatible: [true, true, true, true, true, true, true],
  },
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
    addOns: ["no Almonds", "extra Almonds"],
    dietCompatible: [true, false, false, true, false, true, false],
  },
  {
    id: "23",
    inOrder: 0,
    name: "Tea",
    tab: "Hot Drinks",
    favourite: false,
    imgSrc: "assets/Tea.png",
    price: 2.95,
    description: "",
    ingredients: [],
    addOns: ["Peppermint", "Apple", "Wild Berries", "Camomile", "Earl Grey"],
    dietCompatible: [true, true, true, true, true, true, true],
  },
];

const friendsOrder2 = [
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
    id: "25",
    inOrder: 0,
    name: "Apple Juice",
    tab: "Soft drinks",
    favourite: false,
    imgSrc: "assets/AppleJuice.jpg",
    price: 2.95,
    description: "",
    ingredients: ["Apple"],
    addOns: [],
    dietCompatible: [true, true, true, true, true, true, true],
  },
];

//=======================================================================================
