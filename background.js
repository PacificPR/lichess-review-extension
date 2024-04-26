chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //The api requires the request body to be of type application/x-www-form-urlencoded

  let formBody = [];
  formBody.push(
    encodeURIComponent("pgn") + "=" + encodeURIComponent(request.pgn)
  );

  fetch("https://lichess.org/api/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
  })
    .then((response) => {
      console.log(response, response.json());
      return response;
    })
    .then((data) => {
      sendResponse({ url: data.url });
    })
    .catch((error) => {
      console.log(error);
    });

  return true;
});
