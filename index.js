console.log("Black Jack");

const getCardBtn = document.getElementById("btn-get-card");
const dealerCardsDIV = document.getElementById("dealer-cards");
const playerCardsDIV = document.getElementById("player-cards");

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
    console.log(data);
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
    console.log("playerCards", playerCards);
    renderCards(playerCardsDIV, playerCards);
    console.log(data);
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
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    );
    if (!response.ok) {
      // Checks the succsess of HTTP response status, whitch might not trow an erro but still indicates a faliure
      throw new Error("There was a problem with the API");
    }
    const data = await response.json();
    dealerCards = data.cards;
    console.log("Dealer Cards", dealerCards);
    renderCards(dealerCardsDIV, dealerCards);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  deckId = await getDeck();
  await dealerHand();
  playerHand();
})();

getCardBtn.addEventListener("click", () => {
  if (!isFetchingCard) {
    isFetchingCard = true;
    getCard(playerCards, playerCardsDIV);
    getCard(dealerCards, dealerCardsDIV);
  }
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
    console.log(`Cards for element`, domElement, forWhoArr);
    renderCards(domElement, forWhoArr);
    isFetchingCard = false;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
