const planets = [
  { name: "Mercury", img: "Mercury-PNG-Pic.png" },
  { name: "Venus", img: "venus.png" },
  { name: "Earth", img: "earth.png" },
  { name: "Mars", img: "mars.png" },
  { name: "Jupiter", img: "jupiter.png" },
  { name: "Saturn", img: "saturn.png" },
  { name: "Uranus", img: "uranus.png" },
  { name: "Neptune", img: "neptune.png" }
];

let gameCards = [];

planets.forEach(planet => {
  gameCards.push({ type: "name", value: planet.name });
  gameCards.push({ type: "image", value: planet.img, name: planet.name });
});

gameCards = gameCards.sort(() => 0.5 - Math.random());

const gameGrid = document.getElementById("gameGrid");
let firstCard = null;
let lockBoard = false;
let matchedCount = 0;

gameCards.forEach(card => {
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.name = card.name || card.value;

  if (card.type === "image") {
    div.innerHTML = `<img src="${card.value}" alt="${card.name}" style="width:60px;height:60px;">`;
  } else {
    div.textContent = card.value;
  }

  div.addEventListener("click", () => {
    if (lockBoard || div.classList.contains("matched") || div === firstCard) return;

    div.style.backgroundColor = "#555";

    if (!firstCard) {
      firstCard = div;
    } else {
      lockBoard = true;
      if (firstCard.dataset.name === div.dataset.name) {
        firstCard.classList.add("matched");
        div.classList.add("matched");
        matchedCount += 1;
        if (matchedCount === planets.length) {
          setTimeout(() => alert("🎉 You matched all planets!"), 500);
        }
        firstCard = null;
        lockBoard = false;
      } else {
        setTimeout(() => {
          firstCard.style.backgroundColor = "#333";
          div.style.backgroundColor = "#333";
          firstCard = null;
          lockBoard = false;
        }, 1000);
      }
    }
  });

  gameGrid.appendChild(div);
});
