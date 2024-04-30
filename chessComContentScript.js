//Listen to changes on DOM tree using MutationObserver then
let observer = new MutationObserver(async (mutations) => {
  if (document.querySelector(".game-review-buttons-review")) {
    await addLichessReviewButton();
  }
});
observer.observe(document, { childList: true, subtree: true });

//Function which listens to dom changes and looks for a given element and returns that element when found
function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer2 = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer2.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer2.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

let addLichessReviewButton = async () => {
  //Sometimes the button is removed on re-render, so checking if the button exists and returning, else re-inject it

  if (document.querySelector("#lichessReview")) return;

  //Inject Review on lichess button
  //Clone the review button and style it as lichess review

  let elm = document.querySelector(".game-review-buttons-review");
  let lichessReviewButton = elm.cloneNode(false);
  lichessReviewButton.id = "lichessReview";
  lichessReviewButton.innerHTML =
    "<span style='font-size:36px;font-weight:100;'>&nbsp;&nbsp;&nbsp;&#9822;</span>Review on Lichess";
  lichessReviewButton.style.padding = "0 12px";
  lichessReviewButton.style.background = "white";
  lichessReviewButton.style.display = "flex";
  lichessReviewButton.style.alignItems = "center";
  lichessReviewButton.style.background = "white";
  lichessReviewButton.style.cursor = "pointer";
  lichessReviewButton.style.fontWeight = "600";
  lichessReviewButton.style.borderRadius = "4px";

  //Now attach the lichess review button to parent div
  let parentDiv = elm.parentNode;
  parentDiv.append(lichessReviewButton);

  lichessReviewButton.addEventListener("click", async () => {
    await reviewLichess();
  });
};

let reviewLichess = async () => {
  //Click the Share button

  document
    .querySelector("div.live-game-buttons-component button.share")
    .click();

  //The popup appears which contains the PGN inside a text area, extract it
  let pgn;
  await waitForElm(".share-menu-tab-pgn-textarea ").then((elm) => {
    pgn = elm.value;
  });

  //After getting PGN, close the modal
  document.querySelector("button.ui_outside-close-component").click();

  //Send pgn to background as message
  //it will make api request to Lichess for importing game as pgn ( which returns a url to analyse it)

  chrome.runtime.sendMessage(
    {
      pgn: pgn,
    },
    (response) => {
      if (response.url) window.open(response.url);
      else alert("Couldn't get response from Lichess");
    }
  );
};
