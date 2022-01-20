var $ = Dom7;

var device = Framework7.getDevice();
var app = new Framework7({
  name: "Code Menu App", // App name
  theme: "auto", // Automatic theme detection
  el: "#app", // App root element

  id: "io.framework7.myapp", // App bundle ID
  // App store
  store: store,
  // App routes
  routes: routes,

  // Input settings
  input: {
    scrollIntoViewOnFocus: device.cordova && !device.electron,
    scrollIntoViewCentered: device.cordova && !device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
  },

  theme: "md",
});

//===========================================================================================================================================================================================================================
/* Your app custom javascript below */
//===========================================================================================================================================================================================================================
//========================================================QUALITATIVE EVALUATION STUFF=======================================================================================================================================

//record number of clicks for qualitative assessment
let totalClicks = 0;

$("body").click(function () {
  //record number of clicks
  totalClicks++;
  console.log(`Total number of clicks: `, totalClicks);
});

//========================================================GLOBAL STUFF=======================================================================================================================================
let selectedDish;

//initialize app
userOnboarding();
function init() {
  showAllergies();
  showDiets();
  displayOrders();

  // swipeout preview when app used for the first time
  document
    .getElementById("order-toolbar")
    .setAttribute("onclick", "initSwipeout()");

  // Event listener: Call favouriteDish() if user clicks on favourite button
  document
    .querySelector(".favourite-button")
    .addEventListener("click", favouriteDish);

  //default
  selectedDish = dishes[0];

  console.log(`selectedDish = ${dishes[0]}`);
  first = firstTime = firstGroupOrder = true;
}

function displayToolbar(a) {
  if (a == 1) {
    //show bottom toolbar
    document.getElementById("common-toolbar").style.display = "block";
  } else if (a == 0) {
    //hide bottom toolbar
    document.getElementById("common-toolbar").style.display = "none";
  }
}

//expand past-orders accordian
function expand() {
  expanded =
    document.getElementById("accordian-icon").innerHTML == "expand_less";
  if (expanded) {
    document.getElementById("accordian-icon").innerHTML = "expand_more";
  } else {
    document.getElementById("accordian-icon").innerHTML = "expand_less";
  }
}

let filter = true;

function userOnboarding() {
  let userOnboarding = localStorage.getItem("displayOnboarding");
  userOnboarding = JSON.parse(userOnboarding);
  if (userOnboarding != null && userOnboarding == false) {
    document.getElementById("view-home").innerHTML = ` `;
    document.getElementById(
      "view-home"
    ).innerHTML = `<div class="page" data-name="preorder">
    <div class="block-title block-title-medium text-align-center">Welcome!</div>
  
    <div class="page-content">
      <!--buttons for preordering and scanning qr code-->
      <div class="button-container">
        <a
          href=""
          class="button button-raised button-fill buttons-preorder tab-link qr-code"
          onclick="init();displayMenuTabs();displayToolbar(1);app.dialog.alert('You are checked in at table 4','Successfully checked in'); showCheckIn(); app.tab.show('#view-homescreen');"
          style="background-image: url(assets/qr-code.png)"
        ></a>
  
        <a href="" class="button button-raised button-fill buttons-preorder"
          >Preorder</a
        >
      </div>
    </div>
  </div>`;
  } else {
    localStorage.setItem("displayOnboarding", false);
  }
}

//========================================================DISH-MENU STUFF=======================================================================================================================================

let currentTab;
let currentLink;

//show tab menu in dish overview
function displayMenuTabs() {
  document.getElementById("menu-chips").innerHTML = ` `;
  menuTabs.forEach((menuTabs) => {
    document.getElementById(
      "menu-chips"
    ).innerHTML += `<a href="#${menuTabs.link}" id="${menuTabs.name}" class="chip tab-link tab-link-active chip-margin" name="menu-chips" onclick="showDishes('${menuTabs.name}','${menuTabs.link}'); activateChips('${menuTabs.name}');">
         <div class="chip-label">${menuTabs.name}</div>
      </a>`;
  });
  //show antipasti tab at beginning
  showDishes("Antipasti", "antipasti");
  activateChips("Antipasti");
}

function activateChips(selectedChip) {
  var allChips = document.getElementsByName("menu-chips");
  for (var i = 0; i < allChips.length; i++) {
    allChips[i].classList.remove("chips-activated");
  }
  document.getElementById(selectedChip).classList.add("chips-activated");
}

function showDishesFilter() {
  showDishes(currentTab, currentLink);
}

//show dishes in tabs
function showDishes(tabName, tabLink) {
  currentTab = tabName;
  currentLink = tabLink;

  isFirstTime();
  addButtonSheetOpen(false);

  //loads id's of different tabs
  dishes.forEach((dishes) => {
    if (dishes.tab === tabName) {
      document.getElementById(
        "tab-dishes"
      ).innerHTML = `<div id="${tabLink}" class="page-content tab">
      <div class="buton-filter-container">
      <button class="button button-small button-raised button-fill sheet-open"
      href="#"
      data-sheet=".my-sheet-swipe-to-close"
      id="grouporder-button"
    >
    <i class="icon material-icons if-md group_add">group_add</i>
    Group Order</button>
    <span id="filter-button" class="button button-raised">
    <i class="icon material-icons" id="filter-icon-on">${filterIconString}</i>
    </span>
    </div>
      <div id="innertab" class="block full-width" style="margin: 0;"></div></div>`;
      document.getElementById(tabLink).style.display = "block";
    }
  });

  //update contents of each tab to the according dishes, depending on if the filter is on or off
  if (filter) {
    dishes.forEach((dishes) => {
      //filter on, only compatible food is displayed
      if (
        dishes.tab === tabName &&
        dishes.ingredients.filter((element) => allergyArray.includes(element))
          .length == 0 &&
        compatibleDiet(dishes)
      ) {
        printDishCard(dishes, 0);
      }
    });

    document.getElementById(
      "innertab"
    ).innerHTML += `<div class="block"><a class="button button-large button-fill sheet-open" href="#" data-sheet=".my-sheet-swipe-to-step" id="view-grouporder-button3">View Group Order</a></div>`;
  }

  //filter off, non-allergic food gets marked
  else {
    dishes.forEach((dishes) => {
      if (dishes.tab === tabName) {
        printDishCard(dishes, 1);
      }
    });

    document.getElementById(
      "innertab"
    ).innerHTML += `<div class="block"><a class="button button-large button-fill sheet-open" href="#" data-sheet=".my-sheet-swipe-to-step" id="view-grouporder-button3">View Group Order</a></div>`;
  }
  document
    .getElementById("filter-button")
    .setAttribute(
      "onclick",
      "toggleFilter();showDishesFilter();showFilterPopup();"
    );

  addButtonSheetOpen(true);
  allergyBadgeOverview();
  veganBanner();
}

function addButtonSheetOpen(a) {
  if (a) {
    if (isGroupOrderActive()) {
      dishes.forEach((dishes) => {
        if (!!document.querySelector(`.d${dishes.id}`)) {
          //addboxSheetOpen =
          document.querySelector(`.d${dishes.id}`).classList.add("sheet-open");
          //addboxSwipeToStep =
          document
            .querySelector(`.d${dishes.id}`)
            .setAttribute("data-sheet", ".my-sheet-swipe-to-step");
        }
      });
      groupOrder();
    }
  } else if (!a) {
    dishes.forEach((dishes) => {
      if (!!document.querySelector(`.d${dishes.id}`)) {
        //addboxSheetOpen =
        document.querySelector(`.d${dishes.id}`).classList.remove("sheet-open");
        //addboxSwipeToStep =
        document
          .querySelector(`.d${dishes.id}`)
          .removeAttribute("data-sheet", ".my-sheet-swipe-to-step");
      }
    });
  }
}

function printDishCard(dishes, warning) {
  //Allergy warning badge
  allergyWarner =
    dishes.ingredients.filter((element) => allergyArray.includes(element))
      .length != 0
      ? " allergy-warning"
      : "";
  //Vegan warning badge
  veganBan = dishes.dietCompatible[2] ? " vegan-banner" : "";

  if (warning == 0) {
    bannerString = `${veganBan}`;
  } else if (warning == 1) {
    //Add allergy-warning class to indicate that allergy warning badge should be appended here
    bannerString = `${allergyWarner} ${veganBan}`;
  }
  document.getElementById(
    "innertab"
  ).innerHTML += `<div class="card demo-card-header-pic">            

      <div id="${dishes.id}" href="#view-detailed-view" onclick="switchDish(${
    dishes.id
  });loadDetailedView('dishoverview')" style="background-image: url(${
    dishes.imgSrc
  });" class="card-header tab-link full-width align-items-flex-end ${bannerString}"> 
      </div>        
      <div class="card-content card-content-padding">
        <p>${dishes.name}<span class="material-icons add_btns button d${
    dishes.id
  }" style="float: right;" onclick="addDish(dishes[${
    dishes.id - 1
  }],'dishoverview');">add_box</span></p>
        <p class="date">${dishes.price.toFixed(2)} €</p>                
      </div>    
    </div>
   `;
}

//toggle Filter for dishes
function toggleFilter() {
  filter = filter ? false : true;
  document.getElementById("filter-icon-on").innerHTML = filter
    ? "filter_list"
    : "filter_list_off";
}

//filter explanation alert that appears the first time you click on "menu", if you have filters activated
document.getElementById("dishesmenu").addEventListener(
  "click",
  function (event) {
    if (allergyArray.length != 0) {
      app.dialog.alert(
        "Only dishes that comply with you dietary needs are shown. To turn this off press the filter icon at the top of the screen"
      );
    }
  },
  { once: true }
);

function showFilterPopup() {
  if (allergyArray.length == 0) {
    app.dialog.alert(
      "You did not select any special dietary needs. All dishes are shown to you. To change your needs, navigate to the settings"
    );
  }
}

//========================================================DIET & ALLERGY STUFF=======================================================================================================================================

//load allergy items into app
function showAllergies() {
  document.getElementById("allergy-cards").innerHTML = ` `;
  document.getElementById("allergy-cards-settings").innerHTML = ` `;

  allergies.forEach((allergies) => {
    document.getElementById(
      "allergy-cards"
    ).innerHTML += `<div class="allergy-align">
    <img class="allergy-image" src="${allergies.src}" alt="image" width="103" id="${allergies.name}" onclick="switchAllergy('${allergies.name}','${allergies.name}settings','${allergies.src}')" />
    <p class="diet-description">${allergies.name}</p>
    </div>`;
  });
  allergies.forEach((allergies) => {
    document.getElementById(
      "allergy-cards-settings"
    ).innerHTML += `<div class="allergy-align">
    <img class="allergy-image" src="${allergies.src}" alt="image" width="103" id="${allergies.name}settings" onclick="switchAllergy('${allergies.name}','${allergies.name}settings','${allergies.src}')" />
    <p class="diet-description">${allergies.name}</p>
    </div>`;
  });
}

//load diet cards into app
function showDiets() {
  document.getElementById("diet-cards").innerHTML = ``;
  document.getElementById("diet-cards-settings").innerHTML = ``;
  diet.forEach((diet) => {
    document.getElementById("diet-cards").innerHTML += `<div class="diet-align">
    <img class="diet-image" src="${diet.src}" alt="image" width="103" id="${diet.name}" onclick="switchDiet('${diet.name}','${diet.name}settings','${diet.src}' )" />
          <p class="diet-description">${diet.name}</p>
      </div>`;
  });
  diet.forEach((diet) => {
    document.getElementById(
      "diet-cards-settings"
    ).innerHTML += `<div class="diet-align">
    <img class="diet-image" src="${diet.src}" alt="image" width="103" id="${diet.name}settings" onclick="switchDiet('${diet.name}','${diet.name}settings', '${diet.src}' )" />
          <p class="diet-description">${diet.name}</p>
      </div>`;
  });
}

//allergyArray is for comparing the selected allergies with the allergies the dishes are compatible with
var allergyArray = [];
//dietArray is for comparing the selected diets with the diets the dishes are compatible with
var dietArray = [false, false, false, false, false, false, false];
//switch Allergy status and picture in onboarding and settings
function switchAllergy(allergy, allergysettings, imageSrc) {
  var img = document.getElementById(allergy).src;
  var imgSettings = document.getElementById(allergysettings).src;
  //switch for onboarding
  if (img.indexOf("assets/Selected") != -1) {
    document.getElementById(allergy).src = `${imageSrc}`;
    allergyArray.forEach((element) => {
      if (element == allergy) {
        allergyArray = allergyArray.filter((element) => element !== allergy);
      }
    });
  } else {
    document.getElementById(allergy).src = "assets/Selected.png";
    allergyArray.push(allergy);
  }
  //switch for settings
  if (imgSettings.indexOf("assets/Selected") != -1) {
    document.getElementById(allergysettings).src = `${imageSrc}`;
    allergyArray.forEach((element) => {
      if (element == allergy) {
        allergyArray = allergyArray.filter((element) => element !== allergy);
      }
    });
  } else {
    document.getElementById(allergysettings).src = "assets/Selected.png";
    allergyArray.push(allergy);
  }
}

//switch Diet status and picture in onboarding and settings
function switchDiet(dietN, dietNsettings, imageSrc) {
  //track Selected Diets in dietArray
  var dietIndex = diet.findIndex((item) => item.name == dietN);
  dietArray[dietIndex] = !dietArray[dietIndex];

  var imgDiet = document.getElementById(dietN).src;
  var imgDietSettings = document.getElementById(dietNsettings).src;

  //switch for onboarding
  if (imgDiet.indexOf("assets/Selected") != -1) {
    document.getElementById(dietN).src = `${imageSrc}`;
  } else {
    document.getElementById(dietN).src = "assets/Selected.png";
  }
  //switch for settings
  if (imgDietSettings.indexOf("assets/Selected") != -1) {
    document.getElementById(dietNsettings).src = `${imageSrc}`;
  } else {
    document.getElementById(dietNsettings).src = "assets/Selected.png";
  }
}

//compare Diet Status to Food Rating
function compatibleDiet(ingredientDiet) {
  noDietCollision = true;

  for (let i = 0; i < dietArray.length; i++) {
    if (noDietCollision && dietArray[i] && !ingredientDiet.dietCompatible[i]) {
      noDietCollision = false;
      break;
    }
  }

  return noDietCollision;
}

//Add Allergy Warning to each dish overview with detected allergies
function allergyBadgeOverview() {
  var cardImage = document.getElementsByClassName("allergy-warning");
  for (var i = 0; i < cardImage.length; i++) {
    cardImage[i].innerHTML += `<i class="material-icons allergy-badge-overview">
      priority_high
      </i>`;
  }

  app.tooltip.create({
    targetEl: ".allergy-badge-overview",
    text: "This dish contains <br>one of your allergies",
  });
}

//Vegan Banner
function veganBanner() {
  var cardImage = document.getElementsByClassName("vegan-banner");
  for (var i = 0; i < cardImage.length; i++) {
    cardImage[
      i
    ].innerHTML += `<i class="material-icons vegan-badge-overview">grass</i>`;
  }

  app.tooltip.create({
    targetEl: ".vegan-badge-overview",
    text: "This dish is vegan",
  });
}

//========================================================ORDERING STUFF=======================================================================================================================================

//load order contents into order-list
function displayOrders() {
  let orderList = document.getElementById("order-list");
  let orderButton = document.getElementById("order-button");
  let orderItems = localStorage.getItem("dishesInOrder");
  let pastOrdersItems = localStorage.getItem("pastOrders");
  let orderNumber = 0;

  orderItems = JSON.parse(orderItems);
  pastOrdersItems = JSON.parse(pastOrdersItems);

  orderButton.removeAttribute("onclick", "displayOverview('pastOrders');");
  orderButton.removeAttribute("onclick", "displayPayment('pastOrders');");

  if (updateOrderCount() > 0 && orderItems != null) {
    //putting relevant stuff on orderList
    orderList.innerHTML = "";
    Object.values(orderItems).map((item) => {
      orderList.innerHTML +=
        '<li class="swipeout swiper"><div class="item-content swipeout-content"><div class="item-media serving-counter"><!-- serving - counter --><i class="icon f7-icons if-not-md"><span class="badge color-blue serving-count1">' +
        item.inOrder +
        '</span></i><i class="icon material-icons md-only"><span class="badge color-blue serving-count1">' +
        item.inOrder +
        '</span></i></div><div class="item-inner"><div class="item-title-row"><div class="item-title">' +
        item.name +
        '</div><div class="item-after order-price">' +
        (item.inOrder * item.price + addOnsPrice(item)).toFixed(2) +
        '€</div></div><div class="item-subtitle">' +
        item.tab +
        '</div></div><div class="swipeout-actions-right"><a href="#view-detailed-view" onclick="switchDish(' +
        item.id +
        ");showLoading(0.8);loadDetailedView(" +
        "'orderscreen'" +
        ");app.tab.show(" +
        "'#view-detailed-view'" +
        ');" id="' +
        item.id +
        '" @click=${more}">Edit</a><a href="#" class="swipeout-delete" onclick="deleteDish(dishes[' +
        (item.id - 1) +
        ']);displayOrders();">Delete</a></div></div></li><li>';
    });

    orderList.innerHTML += `<li>
    <div class="item-content">
      <div class="item-inner">
        <div class="item-title-row">
          <div class="item-title" id="sub-total">Subtotal</div>
          <div class="item-after" id="sub-price">${updateOrderTotal().toFixed(
            2
          )} €</div>
        </div>
      </div>
    </div>
  </li>
  <li>
    <div class="item-content">
      <div class="item-inner">
        <div class="item-title-row">
          <div class="item-title" id="total">Total</div>
          <div class="item-after" id="price">${(
            updateOrderTotal() + updatePastOrderTotal()
          ).toFixed(2)} €</div>
        </div>
        <div class="item-subtitle">Subtotal + Past Orders</div>
      </div>
    </div>
  </li>`;
    orderButton.classList.add("tab-link");
    orderButton.href = "#view-order-empty";
    orderButton.setAttribute("onclick", "displayOverview('pastOrders');");
    orderButton.innerHTML = "Order";
    orderButton.setAttribute(
      "style",
      "background-color: var(--f7-theme-color);"
    );
  } else if (orderNumber == 0 && pastOrdersItems != null) {
    orderList.innerHTML = ``;
    orderList.innerHTML += "Your current order is empty!";
    orderButton.classList.add("tab-link");
    orderButton.href = "#view-payment";
    orderButton.setAttribute("onclick", "displayPayment('pastOrders');");
    orderButton.innerHTML = "Pay";
    orderButton.setAttribute(
      "style",
      "background-color: var(--f7-theme-color);"
    );
  } else {
    orderButton.classList.remove("tab-link");
    orderList.innerHTML = ``;
    orderList.innerHTML += "Your current order is empty!";
    orderButton.innerHTML = "Order";
    orderButton.setAttribute(
      "style",
      "background-color: var(--f7-theme-color); opacity: 0.45"
    );
  }

  updateOrderCount();
  loadTo("pastOrders");
}

//ORDER OVERVIEW: load display overview page contents
function displayOverview() {
  let overviewPage = document.getElementById("overview");
  let orderItems = localStorage.getItem("dishesInOrder");

  orderItems = JSON.parse(orderItems);

  if (updateOrderCount() == null) {
    //to prevent "null" error when order button is pressed
    //and there are no dishes on the list
  } else if (updateOrderCount() > 0) {
    //to prevent "Your dishes are being prepared..." from showing up when order button is pressed
    //and there are no dishes on the list
    document.getElementById(
      "prep"
    ).innerHTML = `<div class="block block-strong">
  <p>Your dishes are being prepared</p>
  <p>
    <span class="progressbar-infinite"></span>
  </p>
</div>`;
  }

  overviewPage.innerHTML = ``;
  overviewPage.innerHTML += `<div class="block">
    <div class="block block-strong">
      <p>Your dishes are being prepared</p>
      <p>
        <span class="progressbar-infinite"></span>
      </p>
    </div>
  </div>
  <div class="block">
    <div class="block-title">
      Subtotal
      <span style="float: right">${(
        updateOrderTotal() + updatePastOrderTotal()
      ).toFixed(2)} €</span>
    </div>
  </div>

  <div class="block">
    <a
      href="#view-payment"
      class="col button button-large button-fill button-raised tab-link"
      id="pay-button"
      onclick="showLoading(0.6);displayPayment('order');"
      >Pay Now</a
    >
  </div>
  <div class="block">
    <a
      href="#view-homescreen"
      class="col button button-large button-fill button-raised tab-link"
      id="paylater-button"
      onclick="showLoading(0.6);setItems('doesntMatter', 'overviewScreen');
      deleteDish('All');loadTo('pastOrders');displayOrders()"
      >Pay Later</a
    >
  </div>`;
}

//set/add dish to local storage
function setItems(dish, from) {
  let orderItems = localStorage.getItem("dishesInOrder");
  let orderHistoryItems = localStorage.getItem("orderHistory");
  let pastOrdersItems = localStorage.getItem("pastOrders");

  orderItems = JSON.parse(orderItems);
  orderHistoryItems = JSON.parse(orderHistoryItems);
  pastOrdersItems = JSON.parse(pastOrdersItems);

  stpValueInt = app.stepper.getValue("#steppy");

  if (from == "dishoverview") {
    if (orderItems != null) {
      if (orderItems[dish.id] == undefined) {
        orderItems = { ...orderItems, [dish.id]: dish };
      }
      orderItems[dish.id].inOrder += 1;
    } else {
      dish.inOrder = 1;
      orderItems = {
        [dish.id]: dish,
      };
    }

    localStorage.setItem("dishesInOrder", JSON.stringify(orderItems));
  } else if (from == "detailedView") {
    if (orderItems != null) {
      if (orderItems[dish.id] == undefined) {
        // //first time: therefore make sure .inOrder still zero
        dish.inOrder = 0;
        orderItems = { ...orderItems, [dish.id]: dish };
      }
      orderItems[dish.id].inOrder += stpValueInt;
    } else {
      dish.inOrder = 1;
      orderItems = {
        [dish.id]: dish,
      };
      orderItems[dish.id].inOrder += stpValueInt - 1;
    }

    localStorage.setItem("dishesInOrder", JSON.stringify(orderItems));
  } else if (from == "orderscreen") {
    if (orderItems != null) {
      orderItems[dish.id].inOrder = stpValueInt;
    }
    localStorage.setItem("dishesInOrder", JSON.stringify(orderItems));
  } else if (from == "paymentScreen") {
    if (orderHistoryItems != undefined) {
      if (pastOrdersItems != undefined) {
        orderHistoryItems = {
          ...orderHistoryItems,
          [Object.keys(orderHistoryItems).length + 1]:
            orderItems + pastOrdersItems,
          [Object.keys(orderHistoryItems).length + 2]:
            updateOrderTotal() + updatePastOrderTotal(),
        };
      } else {
        orderHistoryItems = {
          ...orderHistoryItems,
          [Object.keys(orderHistoryItems).length + 1]: orderItems,
          [Object.keys(orderHistoryItems).length + 2]: updateOrderTotal(),
        };
      }
    } else {
      if (pastOrdersItems != undefined) {
        orderHistoryItems = {
          [1]: orderItems + pastOrdersItems,
          [2]: updateOrderTotal() + updatePastOrderTotal(),
        };
      } else {
        orderHistoryItems = {
          [1]: orderItems,
          [2]: updateOrderTotal(),
        };
      }
    }

    localStorage.setItem("orderHistory", JSON.stringify(orderHistoryItems));
  } else if (from == "pastOrders") {
    if (pastOrdersItems == null) {
      return;
    }
    if (orderHistoryItems != undefined) {
      orderHistoryItems = {
        ...orderHistoryItems,
        [Object.keys(orderHistoryItems).length + 1]: pastOrdersItems,
        [Object.keys(orderHistoryItems).length + 2]: updatePastOrderTotal(),
      };
    } else {
      orderHistoryItems = {
        [1]: pastOrdersItems,
        [2]: updatePastOrderTotal(),
      };
    }

    localStorage.setItem("orderHistory", JSON.stringify(orderHistoryItems));
  } else if (from == "overviewScreen") {
    if (pastOrdersItems != undefined) {
      pastOrdersItems = {
        ...pastOrdersItems,
        [Object.keys(pastOrdersItems).length + 1]: orderItems,
      };
    } else {
      pastOrdersItems = {
        [1]: orderItems,
      };
    }

    localStorage.setItem("pastOrders", JSON.stringify(pastOrdersItems));
  }
  updateOrderCount();
}

function updateOrderCount() {
  let orderItems = localStorage.getItem("dishesInOrder");
  let orderNumber = 0;

  orderItems = JSON.parse(orderItems);

  if (orderItems != null) {
    Object.values(orderItems).map((item) => {
      orderNumber += item.inOrder;
    });
  }

  document.getElementById("count1").innerHTML = orderNumber;
  document.getElementById("count2").innerHTML = orderNumber;
  return orderNumber;
}

function updateOrderTotal() {
  let orderItems = localStorage.getItem("dishesInOrder");
  let subTotal = 0;

  orderItems = JSON.parse(orderItems);

  if (orderItems != null) {
    Object.values(orderItems).map((item) => {
      subTotal += item.inOrder * item.price + addOnsPrice(item);
    });
  }
  return subTotal;
}

function updatePastOrderTotal() {
  let pastOrdersItems = localStorage.getItem("pastOrders");
  let totalPastOrders = 0;

  pastOrdersItems = JSON.parse(pastOrdersItems);

  if (pastOrdersItems != null) {
    Object.entries(pastOrdersItems).forEach(([key, value]) => {
      Object.entries(value).forEach(([key, item]) => {
        totalPastOrders += item.inOrder * item.price + addOnsPrice(item);
      });
    });
  }
  return totalPastOrders;
}

//delete dish from order: wrapper
function deleteDish(dish) {
  let orderItems = localStorage.getItem("dishesInOrder");
  orderItems = JSON.parse(orderItems);

  if (dish == "All") {
    //hard reset everything to be safe
    dishes.forEach((dish) => {
      dish.inOrder = 0;
    });
    window.localStorage.removeItem("dishesInOrder");
  } else if (dish == "pastOrders") {
    //hard reset everything to be safe
    dishes.forEach((dish) => {
      dish.inOrder = 0;
    });
    window.localStorage.removeItem("pastOrders");
  } else {
    if (updateOrderTotal() > 0) {
      //delete from local storage
      dish.inOrder = 0;
      delete orderItems[dish.id];
      orderItems = { ...orderItems };
      localStorage.setItem("dishesInOrder", JSON.stringify(orderItems));
    } else {
      window.localStorage.removeItem("dishesInOrder");
    }
  }
  displayOrders();
}

//add dish to order: wrapper
function addDish(dish, from) {
  if (from == "dishoverview") {
    //from dishoverview
    if (isGroupOrderActive()) {
      addToGroupOrder(dish, from);
      displayGroupOrder();
    } else {
      //show preloader for 0.37 seconds
      showLoading(0.37);
      setItems(dish, "dishoverview");
    }
  } else if (from == "detailedView") {
    //from detailedview - accessed through orderscreen
    if (isGroupOrderActive()) {
      addToGroupOrder(dish, from);
      displayGroupOrder();
    } else {
      //show preloader for 0.6 seconds
      showLoading(0.6);
      setItems(dish, "detailedView");
    }
  } else if (from == "orderscreen") {
    //from detailedview - accessed through orderscreen
    //show preloader for 0.6 seconds
    showLoading(0.6);
    setItems(dish, "orderscreen");
  }
  displayOrders();
}

//load orders to:pastOrders/orderHistory
function loadTo(to) {
  let orderHistoryList = document.getElementById("orderHistory-list");
  let pastOrdersList = document.getElementById("pastOrders-list");
  let orderItems = localStorage.getItem("dishesInOrder");
  let orderHistoryItems = localStorage.getItem("orderHistory");
  let pastOrdersItems = localStorage.getItem("pastOrders");

  orderItems = JSON.parse(orderItems);
  orderHistoryItems = JSON.parse(orderHistoryItems);
  pastOrdersItems = JSON.parse(pastOrdersItems);

  if (to == "orderHistory") {
    if (orderHistoryItems != null) {
      orderHistoryList.innerHTML = "";

      Object.entries(orderHistoryItems).forEach(([key, value]) => {
        //print string on all even numbers
        if (key % 2 == 0) {
          orderHistoryList.innerHTML += `<li>
        <div class="item-content">
          <div class="item-media detailed">
            <img
              id="restaurant-img"
              src="assets/italian-restaurant-logo.jpg"
              width="61"
            />
          </div>
          <div class="item-inner">
            <div class="item-title-row">
              <div class="item-title">Meritiamo un aumento</div>
              <a
                href="#"
                class="
                  col
                  button button-small button-round button-outline
                  order-again
                "
                onclick="showLoading(0.6);"
                >ReOrder</a
              >
            </div>
            <div class="item-subtitle">${value.toFixed(2)} €</div>
            <div class="item-after">Order #${key / 2}</div>
          </div>
        </div>
      </li>`;
        }
      });
    } else {
      orderHistoryList.innerHTML = ``;
      orderHistoryList.innerHTML = "Ordered and paid dishes go here!";
    }
  } else if (to == "pastOrders") {
    if (pastOrdersItems != null) {
      pastOrdersList.innerHTML = "";

      Object.entries(pastOrdersItems).forEach(([key, value]) => {
        pastOrdersList.innerHTML += `<li class="item-divider">Order #${key}</li>`;
        Object.entries(value).forEach(([key, item]) => {
          pastOrdersList.innerHTML +=
            '<li><div class="item-content swipeout-content"><div class="item-media serving-counter"><!-- serving - counter --><i class="icon f7-icons if-not-md"><span class="badge color-blue serving-count1">' +
            item.inOrder +
            '</span></i><i class="icon material-icons md-only"><span class="badge color-blue serving-count1">' +
            item.inOrder +
            '</span></i></div><div class="item-inner"><div class="item-title-row"><div class="item-title">' +
            item.name +
            '</div><div class="item-after order-price">' +
            (item.inOrder * item.price).toFixed(2) +
            '€</div></div><div class="item-subtitle">' +
            item.tab +
            "</div></div>";
        });
      });

      pastOrdersList.innerHTML += `<li>
          <div class="item-content">
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title" id="totalPast">Subtotal</div>
                <div class="item-after" id="totalPastPrice">${updatePastOrderTotal().toFixed(
                  2
                )} €</div>
              </div>
            </div>
          </div>
        </li>`;
    } else {
      pastOrdersList.innerHTML = ``;
      pastOrdersList.innerHTML = "Ordered but unpaid dishes go here!";
    }
  }
}

//========================================================GROUP-ORDERING STUFF=======================================================================================================================================

let firstTime;

function isFirstTime() {
  if (firstTime) {
    filterIconString = "filter_list";
    firstTime = false;
  } else {
    filterIconString = document.getElementById("filter-icon-on").innerHTML;
  }
  return firstTime;
}

function isGroupOrderActive() {
  let viewGroupOrderButton = document.querySelector("#view-grouporder-button");
  let groupOrderActive =
    viewGroupOrderButton.style.display == "block" ? true : false;
  console.log("isGroupOrderActive() = ", groupOrderActive);
  return groupOrderActive;
}

function clearYourOrder() {
  let numberOfDishes = yourOrder.length;
  for (i = 0; i < numberOfDishes; i++) {
    console.log("Before pop(): yourOrder.length = ", yourOrder.length);
    yourOrder.pop();
    console.log("After pop(): yourOrder.length = ", yourOrder.length);
  }

  clearGroupOrder();
}

function addToGroupOrder(dish, from) {
  stpValueInt = app.stepper.getValue("#steppy");

  console.log("addToGroupOrder(dish) called!");
  console.log("We want to add = ", dish);
  console.log("BEFORE: yourOrder = ", yourOrder);
  let notInGroupOrder = true;
  if (from == "dishoverview") {
    if (yourOrder != null) {
      console.log("if (yourOrder != null)");
      yourOrder.forEach((item) => {
        if (dish == item) {
          console.log("(dish == item)");
          /*if dish already in array*/
          item.inOrder += 1;
          notInGroupOrder = false;
        }
      });
      if (notInGroupOrder) {
        dish.inOrder = 1;
        yourOrder.push(dish);
      }
    } else {
      dish.inOrder = 1;
      yourOrder.push(dish);
    }
  } else if (from == "detailedView") {
    if (yourOrder != null) {
      console.log("if (yourOrder != null)");
      yourOrder.forEach((item) => {
        if (dish == item) {
          console.log("(dish == item)");
          /*if dish already in array*/
          item.inOrder += stpValueInt;
          notInGroupOrder = false;
        }
      });
      if (notInGroupOrder) {
        dish.inOrder = stpValueInt;
        yourOrder.push(dish);
      }
    } else {
      dish.inOrder = stpValueInt;
      yourOrder.push(dish);
    }
  }
  console.log("AFTER: yourOrder = ", yourOrder);
}

function groupOrderName() {
  let groupOrderName = document.querySelector("#groupOrder-name");
  document.querySelector(
    ".groupOrder-name"
  ).innerHTML = `${groupOrderName.value}'s Group Order`;
  document.querySelector(
    ".groupOrder-name3"
  ).innerHTML = `${groupOrderName.value}'s Group Order`;
}

function groupOrder() {
  console.log("groupOrder() called!");

  let groupOrderName = document.querySelector("#groupOrder-name");
  let groupOrderButton = document.querySelector("#grouporder-button");
  let orderButton = document.querySelector("#order-button");
  let inviteGuestsButton = document.querySelector("#shareGroupOrder");
  let createGroupButton = document.querySelector("#groupOrderCreate");
  let viewGroupOrderButton = document.querySelector("#view-grouporder-button");
  let viewGroupOrderButton2 = document.querySelector(
    "#view-grouporder-button2"
  );
  let viewGroupOrderButton3 = document.querySelector(
    "#view-grouporder-button3"
  );
  document.querySelector(
    ".groupOrder-name2"
  ).innerHTML = `${groupOrderName.value} (You)`;

  console.log("groupOrderButton.innerHTML = ", groupOrderButton.innerHTML);

  groupOrderButton.innerHTML = `<i class="icon material-icons if-md group_add">group_add</i>View Group Order`;
  groupOrderButton.setAttribute("data-sheet", ".my-sheet-swipe-to-step");
  groupOrderButton.setAttribute("onclick", "displayGroupOrder()");
  viewGroupOrderButton.setAttribute("onclick", "displayGroupOrder()");
  viewGroupOrderButton2.setAttribute("onclick", "displayGroupOrder()");
  viewGroupOrderButton3.setAttribute("onclick", "displayGroupOrder()");
  inviteGuestsButton.setAttribute("onclick", "shareOrderLink()");
  createGroupButton.setAttribute("onclick", "shareOrderLink()");
  orderButton.style.display = "none";
  viewGroupOrderButton.style.display =
    viewGroupOrderButton2.style.display =
    viewGroupOrderButton3.style.display =
      "block";

  if (firstGroupOrder) {
    firstGroupOrder = false;
    showDishes(currentTab, currentLink);
    activateChips(currentTab);
  }
}

function shareOrderLink() {
  if (navigator.share) {
    navigator
      .share({
        title: "Menu App",
        text: "Join my MeNu order from Meritiamo un aumento",
        url: "https://framework7.io/docs/installation",
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    console.log("Web Share API is not supported in your browser.");
  }
}

function clearGroupOrder() {
  console.log("clearGroupOrder() called!");
  let groupOrderButton = document.querySelector("#grouporder-button");
  let orderButton = document.querySelector("#order-button");
  let viewGroupOrderButton = document.querySelector("#view-grouporder-button");
  let viewGroupOrderButton2 = document.querySelector(
    "#view-grouporder-button2"
  );
  let viewGroupOrderButton3 = document.querySelector(
    "#view-grouporder-button3"
  );
  let profileBlock1 = document.querySelector(".profile-block1");
  let profileBlock2 = document.querySelector(".profile-block2");
  let profileBlock3 = document.querySelector(".profile-block3");
  let yourOrderList = document.getElementById("yourGroupOrder");
  let friend1OrderList = document.getElementById("friend1GroupOrder");
  let friend2OrderList = document.getElementById("friend2GroupOrder");
  let groupOrderTotalHtml = document.getElementById("groupOrderTotal");

  //putting relevant stuff on orderList
  //Your order items
  yourOrderList.innerHTML =
    friend1OrderList.innerHTML =
    friend2OrderList.innerHTML =
      " ";

  groupOrderTotalHtml.innerHTML = `0.00 €`;
  profileBlock1.style.display =
    profileBlock2.style.display =
    profileBlock3.style.display =
      "none";

  //do some stuff here
  viewGroupOrderButton.style.display =
    viewGroupOrderButton2.style.display =
    viewGroupOrderButton3.style.display =
      "none";
  orderButton.style.display = "block";

  groupOrderButton.innerHTML ==
    `<i class="icon material-icons if-md group_add">group_add</i>Group Order`;
  groupOrderButton.removeAttribute("data-sheet", ".my-sheet-swipe-to-step");

  app.sheet.close(".my-sheet-swipe-to-step", true);

  let orderItems = localStorage.getItem("dishesInOrder");
  orderItems = JSON.parse(orderItems);

  //reset dishes.inOrder
  //if the dish is in an active order set inOrder to 1
  //if dish is in the groupOrder set inOrder to 0
  if (orderItems !== null) {
    dishes.forEach((dish) => {
      if (orderItems[dish.id] != null) {
        dish.inOrder = 1;
      } else {
        dish.inOrder = 0;
      }
    });
  } else {
    dishes.forEach((dish) => {
      dish.inOrder = 0;
    });
  }

  showLoading(1);
  firstGroupOrder = true;
  firstTime = true;
  isGroupOrderActive();
  showDishes(currentTab, currentLink);
  activateChips(currentTab);
}

function cancelGroupOrder(makePayment) {
  console.log("cancelGroupOrder(makePayment) called!");
  if (makePayment == "yes") {
    app.dialog.confirm(
      "Click ok to proceed with payment",
      "Group Order Payment",
      clearYourOrder
    );
  } else {
    app.dialog.confirm(
      "All items will be removed",
      "Cancel group order?",
      clearYourOrder
    );
  }
}

let first;

function displayGroupOrder() {
  console.log("displayGroupOrder() called!");
  let profileBlock1 = document.querySelector(".profile-block1");
  let groupOrderButton = document.querySelector("#grouporder-button");
  let yourOrderList = document.getElementById("yourGroupOrder");
  let friend1OrderList = document.getElementById("friend1GroupOrder");
  let friend2OrderList = document.getElementById("friend2GroupOrder");
  let groupOrderTotalHtml = document.getElementById("groupOrderTotal");
  let viewGroupOrderButton = document.querySelector("#view-grouporder-button");
  let here1 = document.querySelector(".here1");
  let here2 = document.querySelector(".here2");
  let viewGroupOrderButton2 = document.querySelector(
    "#view-grouporder-button2"
  );
  let viewGroupOrderButton3 = document.querySelector(
    "#view-grouporder-button3"
  );
  let groupOrderTotal = 0.0;

  if (first) {
    mockTime = 1000;
    first = false;
  } else {
    mockTime = 0;
  }
  //putting relevant stuff on orderList
  //Your order items
  yourOrderList.innerHTML =
    friend1OrderList.innerHTML =
    friend2OrderList.innerHTML =
    here1.innerHTML =
    here2.innerHTML =
      " ";
  profileBlock1.style.display = "block";

  yourOrder.forEach((item) => {
    groupOrderTotal += item.inOrder * item.price;
    yourOrderList.innerHTML +=
      '<li class="swipeout swiper"><div class="item-content swipeout-content"><div class="item-media serving-counter"><!-- serving - counter --><i class="icon f7-icons if-not-md"><span class="badge color-blue serving-count2">' +
      item.inOrder +
      '</span></i><i class="icon material-icons md-only"><span class="badge color-blue serving-count2">' +
      item.inOrder +
      '</span></i></div><div class="item-inner"><div class="item-title-row"><div class="item-title">' +
      item.name +
      '</div><div class="item-after order-price">' +
      (item.inOrder * item.price).toFixed(2) +
      '€</div></div><div class="item-subtitle">' +
      item.tab +
      '</div></div><div class="swipeout-actions-right"></div></div></li><li>';
  });
  //   //Update total
  groupOrderTotalHtml.innerHTML = `${groupOrderTotal.toFixed(2)} €`;

  //Friends order items
  setTimeout(() => {
    here1.innerHTML += `<div class="block-title margin-top profile-block2">
      <img
        class="profile-image"
        src="assets/Avatars2.png"
        alt="image"
      /><span>Luna</span>
    </div>`;
    friendsOrder1.forEach((item) => {
      item.inOrder = 1;
      groupOrderTotal += item.inOrder * item.price;
      friend1OrderList.innerHTML +=
        '<li class="swipeout swiper"><div class="item-content swipeout-content"><div class="item-media serving-counter"><!-- serving - counter --><i class="icon f7-icons if-not-md"><span class="badge color-blue serving-count2">' +
        item.inOrder +
        '</span></i><i class="icon material-icons md-only"><span class="badge color-blue serving-count2">' +
        item.inOrder +
        '</span></i></div><div class="item-inner"><div class="item-title-row"><div class="item-title">' +
        item.name +
        '</div><div class="item-after order-price">' +
        (item.inOrder * item.price).toFixed(2) +
        '€</div></div><div class="item-subtitle">' +
        item.tab +
        '</div></div><div class="swipeout-actions-right"></div></div></li><li>';
    });
    //   //Update total
    groupOrderTotalHtml.innerHTML = `${groupOrderTotal.toFixed(2)} €`;
  }, mockTime);

  //Friends order items
  setTimeout(() => {
    here2.innerHTML += `<div class="block-title margin-top profile-block3">
      <img
        class="profile-image"
        src="assets/Avatars4.png"
        alt="image"
      /><span>Jens</span>
    </div>`;
    friendsOrder2.forEach((item) => {
      item.inOrder = 1;
      groupOrderTotal += item.inOrder * item.price;
      friend2OrderList.innerHTML +=
        '<li class="swipeout swiper"><div class="item-content swipeout-content"><div class="item-media serving-counter"><!-- serving - counter --><i class="icon f7-icons if-not-md"><span class="badge color-blue serving-count2">' +
        item.inOrder +
        '</span></i><i class="icon material-icons md-only"><span class="badge color-blue serving-count2">' +
        item.inOrder +
        '</span></i></div><div class="item-inner"><div class="item-title-row"><div class="item-title">' +
        item.name +
        '</div><div class="item-after order-price">' +
        (item.inOrder * item.price).toFixed(2) +
        '€</div></div><div class="item-subtitle">' +
        item.tab +
        '</div></div><div class="swipeout-actions-right"></div></div></li><li>';
    });
    //   //Update total
    groupOrderTotalHtml.innerHTML = `${groupOrderTotal.toFixed(2)} €`;
  }, mockTime * 4);
  groupOrderButton.removeAttribute("onclick", "displayGroupOrder()");
  viewGroupOrderButton.removeAttribute("onclick", "displayGroupOrder()");
  viewGroupOrderButton2.removeAttribute("onclick", "displayGroupOrder()");
  viewGroupOrderButton3.removeAttribute("onclick", "displayGroupOrder()");
}

//========================================================DETAILED-DISH-VIEW STUFF=======================================================================================================================================

//load unique detailed-view based on card clicked in dishoverview

function loadDetailedView(from) {
  let detailedViewImg = document.querySelector(".detailed-img");
  let detailedViewTitle = document.querySelector(".detailed-title");
  let detailedViewDesc = document.querySelector(".detailed-desc");
  let addOnsList = document.querySelector("#addOns-list");
  let stepperDown = document.querySelector(".stepper-button-minus");
  let stepperUp = document.querySelector(".stepper-button-plus");
  let back_link = document.querySelector("#arrow_back");
  let orderedDishes = localStorage.getItem("dishesInOrder");
  let orderedDish = [];
  let ingredientAccordion = document.getElementById("ingredient-list");
  let allergyWarning = document.getElementById("allergy-paragraph");
  document.querySelector(".detailed-img").classList.remove("alter-height");

  orderedDishes = JSON.parse(orderedDishes);

  detailedViewImg.src = `${selectedDish.imgSrc}`;
  detailedViewTitle.innerHTML = `${selectedDish.name}`;
  detailedViewDesc.innerHTML = `${selectedDish.description}`;
  ingredientAccordion.innerHTML = addIngredientList();
  allergyWarning.style.display =
    selectedDish.ingredients.filter((element) => allergyArray.includes(element))
      .length == 0
      ? "none"
      : "block";

  stpValueInt = app.stepper.getValue("#steppy");

  if (from == "dishoverview") {
    app.stepper.setValue("#steppy", 1);
    resetCheckboxes();

    //load rest of elements on page: using data from local storage
    back_link.href = "";
    back_link.href = "#view-dishoverview";
    addOnsList.innerHTML = addOns(selectedDish);
    //add-to-order button
    updateDetailedPrice("dontMatter", "dishoverview");

    //update button price when stepper is pressed
    stepperDown.addEventListener("click", () => {
      updateDetailedPrice("dontMatter", "dishoverview");
    });
    stepperUp.addEventListener("click", () => {
      updateDetailedPrice("dontMatter", "dishoverview");
    });
  } else if (from == "orderscreen") {
    //load rest of elements on page: using data from local storage
    back_link.href = "";
    back_link.href = "#view-order";

    for (j = 0; j < selectedDish.id; j++) {
      if (orderedDishes[j + 1] != null) {
        if (selectedDish.id == parseInt(orderedDishes[j + 1].id)) {
          app.stepper.setValue("#steppy", orderedDishes[j + 1].inOrder);
          addOnsList.innerHTML = addOns(selectedDish);
          // add-to-order button
          updateDetailedPrice(orderedDishes[j + 1], "orderscreen");
          orderedDish = orderedDishes[j + 1];
          //update button price when stepper is pressed
          stepperDown.addEventListener("click", () => {
            updateDetailedPrice(orderedDish, "orderscreen");
          });
          stepperUp.addEventListener("click", () => {
            updateDetailedPrice(orderedDish, "orderscreen");
          });
        }
      }
    }
  }

  let imageHeight = document.querySelector(".detailed-img").clientHeight;
  let body45vh = 0.45 * document.body.clientHeight;
  let tooShort = imageHeight < body45vh ? true : false;

  if (tooShort) {
    document.querySelector(".detailed-img").classList.add("alter-height");
  }
}

//Add ingredient list to detailed view
function addIngredientList() {
  let ingredientString = "";
  selectedDish.ingredients.forEach((ingredient) => {
    ingredientString += "<li>" + ingredient + "</li>";
  });
  return ingredientString;
}

//Add "Add-Ons" list to detailed view
function addOns(dish) {
  let addOnString = "";

  dish.addOns.forEach((addOn, i) => {
    console.log(`checking: ${addOn.name}.added = `, addOn.added);
    if (addOn.added == true) {
      addOnString +=
        '<li><label class="item-checkbox item-content"><input type="checkbox" name="demo-checkbox" id="checkbox' +
        i +
        '"  onchange="checkAddOn(' +
        "'" +
        addOn.name +
        "'" +
        ')" checked="true"><i class="icon icon-checkbox"></i><div class="item-inner"><div class="item-title-row"><div class="item-title">' +
        addOn.name +
        '</div></div><div class="item-subtitle">' +
        addOn.price +
        " €</div></div></label></li>";
      console.log(addOnString);
    } else {
      addOnString +=
        '<li><label class="item-checkbox item-content"><input type="checkbox" name="demo-checkbox" id="checkbox' +
        i +
        '"  onchange="checkAddOn(' +
        "'" +
        addOn.name +
        "'" +
        ')"><i class="icon icon-checkbox"></i><div class="item-inner"><div class="item-title-row"><div class="item-title">' +
        addOn.name +
        '</div></div><div class="item-subtitle">' +
        addOn.price +
        " €</div></div></label></li>";
    }
  });
  return addOnString;
}

//increment/decrement total based on addOns
function addOnsPrice(dish) {
  console.log(
    "==============================================addOnsPrice() called!=============================================="
  );
  let checkedItems = localStorage.getItem("addOnsChecked");
  checkedItems = JSON.parse(checkedItems);
  let addOnsPrice = 0;

  console.log("let addOnsPrice = ", addOnsPrice);
  dish.addOns.forEach((addOn) => {
    if (checkedItems != null) {
      if (checkedItems[`${dish.id}_${addOn.name}`] == undefined) {
        checkedItems = {
          ...checkedItems,
          [`${dish.id}_${addOn.name}`]: addOn,
        };
        if (checkedItems[`${dish.id}_${addOn.name}`].added == true) {
          if (addOn.name.includes("no")) {
            //if the word contains extra - add to total
            addOnsPrice -= addOn.price;
          } else {
            //else if it contains no - decrement total
            addOnsPrice += addOn.price;
          }
        } else {
          addOnsPrice += 0;
        }
      } else {
        if (checkedItems[`${dish.id}_${addOn.name}`].added == true) {
          if (addOn.name.includes("no")) {
            //if the word contains extra - add to total
            addOnsPrice -= addOn.price;
          } else {
            //else if it contains no - decrement total
            addOnsPrice += addOn.price;
          }
        } else {
          addOnsPrice += 0;
        }
      }
    }
  });
  console.log("return value =", addOnsPrice);
  return addOnsPrice;
}

function resetCheckboxes() {
  console.log(
    "==================================================resetCheckboxes() called================================================"
  );
  let checkedItems = localStorage.getItem("addOnsChecked");
  let orderItems = localStorage.getItem("dishesInOrder");

  orderItems = JSON.parse(orderItems);
  checkedItems = JSON.parse(checkedItems);

  dishes.forEach((dish) => {
    if (orderItems != null) {
      if (orderItems[dish.id] === null) {
        console.log("not it order, get rid of it!!");
        dish.addOns.forEach((addOn) => {
          addOn.added = false;
          if (checkedItems != null) {
            if (checkedItems[`${dish.id}_${addOn.name}`] == undefined) {
              checkedItems = {
                ...checkedItems,
                [`${dish.id}_${addOn.name}`]: addOn,
              };
            } else {
              checkedItems[`${dish.id}_${addOn.name}`].added = false;
            }
          }
          localStorage.setItem("addOnsChecked", JSON.stringify(checkedItems));
        });
      }
    }
  });
}

function checkAddOn(checkedAddOnName) {
  console.log(
    "==============================================checkAddOn() called!=============================================="
  );
  let checkedItems = localStorage.getItem("addOnsChecked");
  checkedItems = JSON.parse(checkedItems);

  selectedDish.addOns.forEach((addOn, i) => {
    console.log(`checking addOn[${i}]:`);
    if (addOn.name == checkedAddOnName) {
      console.log(`${addOn.name} == ${checkedAddOnName}`);
      addOn.added = addOn.added ? false : true;
      if (checkedItems != null) {
        if (checkedItems[`${selectedDish.id}_${addOn.name}`] == undefined) {
          checkedItems = {
            ...checkedItems,
            [`${selectedDish.id}_${addOn.name}`]: addOn,
          };
        } else {
          checkedItems[`${selectedDish.id}_${addOn.name}`].added = addOn.added;
        }
      } else {
        checkedItems = {
          [`${selectedDish.id}_${addOn.name}`]: addOn,
        };
      }
    } else {
      console.log(`${addOn.name} /= ${checkedAddOnName}`);
    }
    localStorage.setItem("addOnsChecked", JSON.stringify(checkedItems));
  });
  if (
    document.getElementById("add-button").innerHTML.slice(0, 12) ==
    "Add to order"
  ) {
    updateDetailedPrice(selectedDish, "dishoverview");
  } else {
    updateDetailedPrice(selectedDish, "orderscreen");
  }
}

//update price on "add-to-order" button as stepper is increased/decreased
function updateDetailedPrice(dish, from) {
  let addToOrderBtn = document.querySelector(".detailedBtn-block");
  let buttonPrice = 0;

  stpValueInt = app.stepper.getValue("#steppy");

  if (from == "dishoverview") {
    buttonPrice = parseFloat(
      selectedDish.price * stpValueInt + addOnsPrice(selectedDish)
    );
    //add-to-order button
    addToOrderBtn.innerHTML = `<div class="block">
      <a
        onclick="addDish(dishes[${selectedDish.id - 1}],'detailedView');"
        href="#view-dishoverview"
        class="col button button-large button-fill button-raised tab-link"
        id="add-button"
        >Add to order • ${buttonPrice.toFixed(2)} €
      </a>
    </div>`;
  } else if (from == "orderscreen") {
    buttonPrice = parseFloat(
      dish.price * stpValueInt + addOnsPrice(selectedDish)
    );
    // add-to-order button
    if (stpValueInt == 0) {
      addToOrderBtn.innerHTML = `<div class="block">
        <a
          onclick="showLoading(1);deleteDish(dishes[${selectedDish.id - 1}]);"
          href="#view-order"
          class="col button button-large button-fill button-raised tab-link"
          id="add-button"
          >Delete Dish</a></div>`;
    } else {
      addToOrderBtn.innerHTML = `<div class="block">
    <a
      onclick="addDish(dishes[${dish.id - 1}],'orderscreen');"
      href="#view-dishoverview"
      class="col button button-large button-fill button-raised tab-link"
      id="add-button"
      >Update Order • ${buttonPrice.toFixed(2)} €
    </a>
  </div>`;
    }
  }
}

//========================================================PAYMENT STUFF=======================================================================================================================================

//display payment screen with relevant order summary
function displayPayment(from) {
  let paymentList = document.querySelector(".payment-card");
  let pastPaymentList = document.querySelector(".past-payment-card");
  let pastOrdersInner = document.querySelector(".pastOrders-inner");
  let orderItems = localStorage.getItem("dishesInOrder");
  let pastOrderItems = localStorage.getItem("pastOrders");

  orderItems = JSON.parse(orderItems);
  pastOrderItems = JSON.parse(pastOrderItems);

  paymentButtonOnclick("remove");

  if (from == "order") {
    //hide pastOrders summary
    pastOrdersInner.style.display = "none";
    printOrderSummary(orderItems, paymentList);

    if (pastOrderItems) {
      //hide pastOrders summary
      pastOrdersInner.style.display = "block";

      Object.entries(pastOrderItems).forEach(([key, value]) => {
        if (key > 1) {
          pastPaymentList.innerHTML += `<hr>`;
        }
        printOrderSummary(value, pastPaymentList);
      });
    }

    printPaymentPrice(from);
    paymentButtonOnclick("set", 1);
  } else if (from == "pastOrders") {
    //hide pastOrders summary
    pastOrdersInner.style.display = "none";

    Object.entries(pastOrderItems).forEach(([key, value]) => {
      printOrderSummary(value, pastPaymentList);
    });
    printPaymentPrice(from);
    paymentButtonOnclick("set", 2);
  }
}

function printPaymentPrice(from) {
  let paymentPrice = document.querySelector(".payment-price");
  paymentPrice.innerHTML = "";

  if (from == "order") {
    paymentPrice.innerHTML += `${(
      updateOrderTotal() + updatePastOrderTotal()
    ).toFixed(2)} €`;
  } else if (from == "pastOrders") {
    paymentPrice.innerHTML += `${updatePastOrderTotal().toFixed(2)} €`;
  }
}

function printOrderSummary(items, list) {
  list.innerHTML = "";

  Object.entries(items).forEach(([key, item]) => {
    list.innerHTML += `<span class="dish">${item.name} (x${
      item.inOrder
    })</span><span class="price">${(
      item.inOrder * item.price +
      addOnsPrice(item)
    ).toFixed(2)} €</span><br />`;
  });
}

function paymentButtonOnclick(action, variation) {
  let paymentButton = document.querySelector("#confirm-button");

  if (action == "set") {
    if (variation == 1) {
      paymentButton.setAttribute(
        "onclick",
        "showLoading(1);app.tab.show('#view-homescreen');setItems('doesntMatter', 'paymentScreen');deleteDish('All');deleteDish('pastOrders');loadTo('orderHistory');displayOrders();resetCheckboxes()"
      );
    } else if (variation == 2) {
      paymentButton.setAttribute(
        "onclick",
        "showLoading(1);app.tab.show('#view-homescreen');setItems('doesntMatter', 'pastOrders');deleteDish('pastOrders');loadTo('orderHistory');displayOrders();resetCheckboxes()"
      );
    }
  } else if (action == "remove") {
    paymentButton.removeAttribute(
      "onclick",
      'showLoading(1);app.tab.show("#view-homescreen");setItems("doesntMatter", "paymentScreen");deleteDish("All");loadTo("orderHistory");displayOrders();'
    );
    paymentButton.removeAttribute(
      "onclick",
      'showLoading(1);app.tab.show("#view-homescreen");setItems("doesntMatter", "pastOrders");deleteDish("pastOrders");loadTo("orderHistory");displayOrders();'
    );
  }
}

//========================================================HOMESCREEN STUFF=======================================================================================================================================

//change "call-a-waiter"/"d-n-d" button state after clicked
function changeButtonState(button) {
  let btn = document.querySelector(button);
  let pressed = btn.style.backgroundColor === "red";

  if (button == ".call-a-waiter") {
    if (pressed) {
      app.dialog.confirm(
        "Waiter will no longer come",
        "Do you want to cancel?",
        () => {
          //change colour to green
          btn.style.backgroundColor = "#bbd01b";
          //change opacity
          btn.style.opacity = "1";
        }
      );
    } else {
      //alert
      app.dialog.alert(
        "A waiter will be with you soon",
        "Waiter has been called"
      );

      //change colour to red
      btn.style.backgroundColor = "red";
      //change opacity
      btn.style.opacity = "0.5";
    }
  } else {
    if (pressed) {
      app.dialog.confirm(
        "Warning: you can be bothered again",
        "Do you want to disable?",
        () => {
          //change colour to green
          btn.style.backgroundColor = "#bbd01b";
          //change opacity
          btn.style.opacity = "1";
        }
      );
    } else {
      //alert
      app.dialog.alert(
        "A waiter wont bother you anymore",
        "Do Not Disturb Mode Enabled"
      );

      //change colour to red
      btn.style.backgroundColor = "red";
      //change opacity
      btn.style.opacity = "0.5";
    }
  }
}

//show check-in status on homescreen
function showCheckIn() {
  document.getElementById("checkin").innerHTML = `
  Checked into table 4
  `;
}

//========================================================FAVOURITE STUFF=======================================================================================================================================

function showDetailedHeader() {
  //access the favourite boolean of the currently selected channel.
  document.querySelector(".favourite-button").innerHTML = selectedDish.favourite
    ? "favorite"
    : "favorite_border";
}

// Toggles favourite property of dish and displays dish accordingly in panel
function favouriteDish() {
  selectedDish.favourite = selectedDish.favourite ? false : true;
  dishes.forEach((dish) => {
    if (dish.id == selectedDish.id) {
      dish = selectedDish;
    }
  });
  displaySelected();
  switchDish(selectedDish.id);
  document
    .querySelector(".favourite-panel")
    .setAttribute("onclick", "displaySelected()");
}

function displaySelected() {
  const favouriteList = document.getElementById("favourites-list");
  favouriteList.innerHTML = ""; // making sure that there is no content inside these two lists
  let notFavourite = 0;

  //The code below takes the empty favourite list, and loads the dishes into this list
  dishes.forEach((dish) => {
    if (dish.favourite) {
      favouriteList.innerHTML += `<li>
      <div class="item-content">
        <div class="item-media detailed">
          <img
            id="restaurant-img"
            src="${dish.imgSrc}"
            width="61"
            height="61"
          />
        </div>
        <div class="item-inner">
          <div class="item-title-row">
            <div class="item-title">${dish.name}</div>
            <a
              href="#"
              class="
                col
                button button-small button-round button-outline
                order-again
              "
              onclick="showLoading(0.6);"
              >Order</a
            >
          </div>
          <div class="item-subtitle">${dish.price.toFixed(2)} €</div>
        </div>
      </div>
    </li>`;
    } else {
      notFavourite++;
    }
  });

  if (dishes.length - notFavourite == 0) {
    /* if there are no favourite dishes */
    favouriteList.innerHTML = ``;
    favouriteList.innerHTML = "Favourite dishes go here!";
  }

  //always add selected class to current dish
  if (!!selectedDish) {
    document.getElementById(selectedDish.id).classList.add("selected");
  }
}

function switchDish(selectedDishID) /*dish in detailed view.*/ {
  if (!!selectedDish) {
    if (!!document.getElementById(selectedDish.id)) {
      document.getElementById(selectedDish.id).classList.remove("selected");
    }
  }
  document.getElementById(selectedDishID).classList.add("selected");
  dishes.forEach((dish) => {
    if (dish.id == selectedDishID) {
      selectedDish = dish;
    }
  });
  showDetailedHeader();
}

//========================================================MISCELLANEUOS STUFF=======================================================================================================================================

//checkout from the restaurarnt: if there are no current orders/past orders active
function checkout() {
  let pastOrdersItems = localStorage.getItem("pastOrders");
  let orderItems = localStorage.getItem("dishesInOrder");

  if (pastOrdersItems == null && orderItems) {
    //alert
    app.dialog.alert("You have items in your order list", "Unable to checkout");
  } else if (pastOrdersItems && orderItems == null) {
    //alert
    app.dialog.alert(
      "You have to pay for your past orders",
      "Unable to checkout"
    );
  } else if (pastOrdersItems && orderItems) {
    //alert
    app.dialog.alert(
      "You have to pay for your past orders and you have items in your order list",
      "Unable to checkout"
    );
  } else {
    displayToolbar(0);
    showLoading(1);
    deleteDish("All");
    displayOrders();
    app.tab.show("#view-preorder");
    //remove your dishes are being prepared
    document.getElementById("prep").innerHTML = ``;
  }
}

//show preloader for specified number of seconds
function showLoading(seconds) {
  //1 second = 1000 milliseconds
  let milliseconds = seconds * 1000;

  app.preloader.show();
  setTimeout(() => {
    app.preloader.hide();
  }, milliseconds);
}

function initSwipeout() {
  let orderNumber = localStorage.getItem("orderNumbers");
  orderNumber = JSON.parse(orderNumber);

  if (orderNumber > 0) {
    // swipeout preview when app used for the first time
    document
      .getElementById("order-toolbar")
      .removeAttribute("onclick", "initSwipeout()");

    setTimeout(() => {
      app.swipeout.open(".swiper", "right", () => {
        setTimeout(() => {
          app.swipeout.close(`.swiper`);
        }, 1500);
      });
    }, 2000);
  } else {
    return;
  }
}

//Mini Game on Entertainment-view. User has to correctly order the items to win
function checkAnswer() {
  let arrayEntertainment = [];
  let correctOrder = ["Water", "Kombucha", "Beer", "Wine", "Grappa"];
  var alcoholDiv = document.getElementById("alcohol-list");
  var liElements = alcoholDiv.getElementsByTagName("li");
  for (var i = 0; i < liElements.length; i += 1) {
    arrayEntertainment.push(liElements[i].innerText);
  }
  if (correctOrder.toString() === arrayEntertainment.toString()) {
    app.dialog.alert("Well done! That was the correct answer");
  } else {
    app.dialog.alert("Try again!");
  }
}

//===================================================================TIC TAC TOE GAME=======================================================================
/* sources: https://github.com/WebDevSimplified/JavaScript-Tic-Tac-Toe.git */

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let circleTurn;

function startGame() {
  displayToolbar(0);
  //======================================================================
  const cellElements = document.querySelectorAll("[data-cell]");
  const winningMessageElement = document.getElementById("winningMessage");
  const restartButton = document.getElementById("restartButton");
  //======================================================================
  restartButton.addEventListener("click", startGame);
  circleTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  //=======================================================================
  const winningMessageElement = document.getElementById("winningMessage");
  const winningMessageTextElement = document.querySelector(
    "[data-winning-message-text]"
  );
  //========================================================================
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add("show");
}

function isDraw() {
  //=========================================================================
  const cellElements = document.querySelectorAll("[data-cell]");
  //=========================================================================
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  //============================================================
  const cellElements = document.querySelectorAll("[data-cell]");
  //============================================================
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}
//===================================================================TIC TAC TOE GAME:footer=======================================================================
