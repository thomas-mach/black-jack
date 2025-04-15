const getCardBtn = document.getElementById("btn-get-card");
const standBtn = document.getElementById("btn-stand");
const dealerCardsDIV = document.getElementById("dealer-cards");
const playerCardsDIV = document.getElementById("player-cards");
const resetBtn = document.getElementById("reset");

let deckId = null;
let dealerCards = [];
let playerCards = [];
let isFetchingCard = false;

const getDeck = async () => {
  try {
    const response = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2"
    );
    if (!response.ok) {
      // Checks the succsess of HTTP response status, which might not trow an erro but still indicates a faliure
      throw new Error("There was a problem with the API");
    }
    const data = await response.json();
    // console.log(data);
    return data.deck_id;
  } catch (err) {
    console.log(err);
  }
};

const playerHand = async () => {
  if (!deckId) {
    console.log("Deck id not avaible");
    return;
  }
  try {
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
    );
    if (!response.ok) {
      // Checks the succsess of HTTP response status, which might not trow an erro but still indicates a faliure
      throw new Error("There was a problem with the API");
    }
    const data = await response.json();
    playerCards = data.cards;
    console.log("PlayerCards", playerCards);
    console.log("Player Cards Points", calcPoints(getPoints(playerCards)));
    renderCards(playerCardsDIV, playerCards);
    let points = calcPoints(getPoints(playerCards));
    if (points === 21) {
      console.log(`Player Cards points:", ${points} BlacJack`);
      getCardBtn.disabled = true;
      standBtn.disabled = true;
      dealerPlay();
      return;
    }
    // console.log(data);
  } catch (err) {
    console.log(err);
  }
};

const dealerHand = async () => {
  if (!deckId) {
    console.log("Deck id not avaible");
    return;
  }
  try {
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
    );
    if (!response.ok) {
      // Checks the succsess of HTTP response status, whitch might not trow an erro but still indicates a faliure
      throw new Error("There was a problem with the API");
    }
    const data = await response.json();
    dealerCards = data.cards;
    console.log("Dealer Cards", dealerCards);
    console.log("Dealer Cards Points", calcPoints(getPoints(dealerCards)));
    renderCards(dealerCardsDIV, dealerCards);
    // console.log(data);
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  deckId = await getDeck();
  await dealerHand();
  playerHand();
})();

getCardBtn.addEventListener("click", async () => {
  if (!isFetchingCard) {
    isFetchingCard = true;
    let points = calcPoints(getPoints(playerCards));
    if (points < 21) {
      await getCard(playerCards, playerCardsDIV);
      points = calcPoints(getPoints(playerCards));
      console.log("Player Cards points:", points);
    }
    if (points >= 21) {
      console.log(`Player Cards points:", ${points} sballo o 21`);
      getCardBtn.disabled = true;
      standBtn.disabled = true;
      dealerPlay();
      return;
    }
  }
});

standBtn.addEventListener("click", () => {
  getCardBtn.disabled = true;
  standBtn.disabled = true;
  dealerPlay(calcPoints(getPoints(dealerCards)));
});

resetBtn.addEventListener("click", () => {
  location.reload();
});

function renderCards(element, cards) {
  element.innerHTML = "";
  cards.forEach((el) => {
    element.innerHTML += `<img src="${el.image}">`;
  });
}

async function getCard(forWhoArr, domElement) {
  if (!deckId) {
    console.log("Deck id not avaible");
    return;
  }
  try {
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    );
    if (!response.ok) {
      // Checks the succsess of HTTP response status, which might not trow an erro but still indicates a faliure
      throw new Error("There was a problem with the API");
    }
    const data = await response.json();
    forWhoArr.push(data.cards[0]);
    // console.log(`Cards for element`, domElement, forWhoArr);
    console.log(getPoints(forWhoArr));
    renderCards(domElement, forWhoArr);
    isFetchingCard = false;
    // console.log(data);
  } catch (err) {
    console.log(err);
  }
}

function getPoints(cardsArr) {
  return cardsArr.map((card) => {
    let val = card.value;
    if (["JACK", "QUEEN", "KING"].includes(val)) {
      return 10;
    } else if (val === "ACE") {
      return 11;
    } else {
      return Number(val);
    }
  });
}

function calcPoints(pointsArr) {
  let total = pointsArr.reduce((tot, el) => tot + el);
  let aces = pointsArr.filter((el) => el === 11).length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

async function dealerPlay(points) {
  console.log(`dealer play run...`);
  points = calcPoints(getPoints(dealerCards));
  if (points < 17) {
    await getCard(dealerCards, dealerCardsDIV);
    calcPoints(getPoints(dealerCards));
    await dealerPlay(points);
  } else if (points >= 17) {
    checkWinner(
      calcPoints(getPoints(playerCards)),
      calcPoints(getPoints(dealerCards))
    );
  }
  points = calcPoints(getPoints(dealerCards));
}

function checkWinner(player, dealer) {
  if (player > 21) {
    console.log(`player:${player}, dealer:${dealer}`);
    return console.log(`dealer win`);
  }

  if (dealer < player || dealer > 21) {
    console.log(`player:${player}, dealer:${dealer}`);
    return console.log(`player win`);
  }

  if (dealer > player && dealer < 22) {
    console.log(`player:${player}, dealer:${dealer}`);
    return console.log(`dealer win`);
  } else {
    console.log(`player:${player}, dealer:${dealer}`);
    return console.log(`pareggio`);
  }
}
