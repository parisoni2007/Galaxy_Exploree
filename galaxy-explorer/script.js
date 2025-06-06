// ====== Galaxy Quiz Data & Logic ======

const quizQuestions = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Earth"],
    answer: "Jupiter",
  },
  {
    question: "Which planet has famous rings around it?",
    options: ["Uranus", "Saturn", "Venus", "Mercury"],
    answer: "Saturn",
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    answer: "Mercury",
  },
  {
    question: "Which planet rotates on its side?",
    options: ["Neptune", "Uranus", "Saturn", "Jupiter"],
    answer: "Uranus",
  },
  {
    question: "Which planet is known for its strong winds and storms?",
    options: ["Neptune", "Venus", "Mars", "Mercury"],
    answer: "Neptune",
  },
  {
    question: "What planet do we live on?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    answer: "Earth",
  },
  {
    question: "Which planet has the largest volcano?",
    options: ["Mars", "Venus", "Earth", "Saturn"],
    answer: "Mars",
  },
  {
    question: "Which planet is extremely hot with a thick atmosphere?",
    options: ["Mercury", "Venus", "Mars", "Earth"],
    answer: "Venus",
  },
  {
    question: "What is the smallest planet in the solar system?",
    options: ["Mercury", "Mars", "Venus", "Pluto"],
    answer: "Mercury",
  },
];

// DOM Elements
const startScreen = document.getElementById("startScreen");
const usernameInput = document.getElementById("usernameInput");
const startQuizBtn = document.getElementById("startQuizBtn");

const quizBox = document.querySelector(".quiz-box");
const questionText = quizBox.querySelector(".question-text");
const optionsContainer = quizBox.querySelector(".options");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

const resultScreen = document.querySelector(".quiz-result");
const scoreDisplay = document.getElementById("scoreDisplay");
const playerNameDisplay = document.getElementById("playerNameDisplay");
const badgeDisplay = document.getElementById("badgeDisplay");
const restartQuizBtn = document.getElementById("restartQuizBtn");
const screenshotBtn = document.getElementById("screenshotBtn");

const leaderboardList = document.getElementById("leaderboardList");

// Sound Effects
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const winSound = document.getElementById("winSound");

let currentQuestionIndex = 0;
let score = 0;
let username = "";
let answered = false;

// Badge system based on score
function getBadge(score) {
  if (score === quizQuestions.length) return "🌟 Galaxy Master";
  if (score >= quizQuestions.length * 0.7) return "🚀 Space Commander";
  if (score >= quizQuestions.length * 0.4) return "🪐 Rookie Explorer";
  return "👽 Cosmic Newbie";
}

function updateLeaderboard(name, score) {
  let leaderboard = JSON.parse(localStorage.getItem("galaxyLeaderboard")) || [];

  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 5) leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem("galaxyLeaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("galaxyLeaderboard")) || [];
  leaderboardList.innerHTML = "";

  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = "<li>No explorers yet. Be the first!</li>";
    return;
  }

  leaderboard.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${entry.name} - ${entry.score}/${quizQuestions.length}`;
    leaderboardList.appendChild(li);
  });
}

// Show question and options
function showQuestion() {
  answered = false;
  nextBtn.disabled = true;
  let q = quizQuestions[currentQuestionIndex];
  questionText.textContent = q.question;

  // Clear previous options
  optionsContainer.innerHTML = "";

  q.options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("option-btn");
    button.textContent = option;
    button.onclick = () => selectOption(button, option, q.answer);
    optionsContainer.appendChild(button);
  });

  // Update progress bar
  let progressPercent = ((currentQuestionIndex) / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";
}

function selectOption(button, selected, correctAnswer) {
  if (answered) return; // prevent multiple clicks
  answered = true;
  nextBtn.disabled = false;

  if (selected === correctAnswer) {
    button.classList.add("correct");
    score++;
    correctSound.play();
  } else {
    button.classList.add("wrong");
    wrongSound.play();
    // Highlight the correct answer
    Array.from(optionsContainer.children).forEach((btn) => {
      if (btn.textContent === correctAnswer) btn.classList.add("correct");
    });
  }
}

// Move to next question or show results
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

// Show results and badge
function showResults() {
  quizBox.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  playerNameDisplay.textContent = username;
  scoreDisplay.textContent = `Your Score: ${score} out of ${quizQuestions.length}`;
  badgeDisplay.textContent = getBadge(score);

  progressBar.style.width = "100%";

  // Play win sound if perfect score
  if (score === quizQuestions.length) {
    winSound.play();
  }

  // Update leaderboard
  updateLeaderboard(username, score);
}

// Start quiz
startQuizBtn.addEventListener("click", () => {
  username = usernameInput.value.trim() || "Galactic Traveler";
  startScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  progressBar.style.width = "0%";
  showQuestion();
});

// Restart quiz
restartQuizBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  usernameInput.value = "";
});

// Screenshot share using html2canvas
screenshotBtn.addEventListener("click", () => {
  import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js")
    .then((html2canvas) => {
      html2canvas.default(resultScreen).then((canvas) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${username}_GalaxyQuizScore.png`;
          link.click();
          URL.revokeObjectURL(url);
        });
      });
    })
    .catch((e) => alert("Screenshot capture failed: " + e.message));
});

// Initialize leaderboard on page load
renderLeaderboard();


// Optional: Starfield animation or other page scripts below...
// For brevity, starCanvas code is omitted here but should be in your script.js as well.
const funnyFacts = [
  "🚀 There are more stars in the universe than grains of sand on Earth! But none of them pay taxes.",
  "🌌 If you could fly to Pluto by plane, it would take over 800 years... hope you packed snacks!",
  "👽 Aliens might exist... but maybe they’re just avoiding Earth after watching our reality TV.",
  "🪐 Saturn is so light it could float in water — too bad you can’t find a tub big enough!",
  "🌠 A day on Venus is longer than its year. So technically, Venus has really long Mondays.",
  "🌍 Earth is the only planet not named after a god — and it's also the messiest!",
  "☄️ Halley's Comet only shows up every 76 years — kind of like your weird uncle at family reunions.",
  "🛸 Scientists say time slows down near black holes. Perfect place to take a nap!",
  "🌕 The Moon is moving away from Earth by 1.5 inches every year — it’s trying to ghost us.",
  "🔭 The universe is expanding — but don’t worry, your jeans shrinking in the wash isn’t cosmic."
];

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createFlipCard(factText) {
  const card = document.createElement("div");
  card.className = "fact-card";

  const front = document.createElement("div");
  front.className = "fact-front";
  front.textContent = factText.trim().slice(0, 2); // Emoji or symbol

  const back = document.createElement("div");
  back.className = "fact-back";
  back.textContent = factText.trim().slice(3); // Fact text

  card.appendChild(front);
  card.appendChild(back);

  return card;
}

function displayRandomFunnyFacts(count = 5) {
  const container = document.getElementById("funnyFactsContainer");
  container.innerHTML = "";

  shuffle(funnyFacts).slice(0, count).forEach(fact => {
    const card = createFlipCard(fact);
    container.appendChild(card);
  });
}

// Run on page load
displayRandomFunnyFacts();
// Animate when visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, {
  threshold: 0.2
});

const encyclopediaGrid = document.querySelector('.encyclopedia-grid');
if (encyclopediaGrid) observer.observe(encyclopediaGrid);

// Search filtering
document.getElementById('searchBar').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const cards = document.querySelectorAll('.planet-card');

  cards.forEach(card => {
    const name = card.getAttribute('data-name');
    if (name.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});
// Reveal animation when in view
const missionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, { threshold: 0.3 });

const missionContainer = document.getElementById('missionContainer');
if (missionContainer) missionObserver.observe(missionContainer);

// Mission summary generation
document.querySelector('.mission-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const destination = document.getElementById('destination').value;
  const crew = document.getElementById('crew').value;
  const date = document.getElementById('launchDate').value;
  const objective = document.getElementById('objective').value;

  const summary = `
    🌌 Mission to <strong>${destination}</strong><br>
    👨‍🚀 Crew Members: <strong>${crew}</strong><br>
    🚀 Launch Date: <strong>${date}</strong><br>
    🛰️ Objective: <em>${objective}</em>
  `;

  document.getElementById('summaryText').innerHTML = summary;
});
function updateTimeTravelLog(text) {
  const log = document.getElementById('timeTravelLog');
  log.textContent = '';
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      log.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }
  }
  typeWriter();
}
 // Example cosmic history data (expand as you like)
  const cosmicEvents = {
    "1900": "1900 - The birth of modern astrophysics begins.",
    "1969": "1969 - Apollo 11 lands on the Moon, humanity’s first steps on another world.",
    "2025": "2025 - Advanced space missions unlock new cosmic secrets.",
    "3000": "3000 - Humans colonize Mars and explore beyond our solar system."
  };

  // Handle button click
  document.getElementById('travelBtn').addEventListener('click', () => {
    const year = document.getElementById('yearInput').value;
    if (!year || year < 1900 || year > 3000) {
      updateTimeTravelLog("Please enter a valid year between 1900 and 3000.");
      return;
    }

    const eventText = cosmicEvents[year] || `Year ${year} - No historical data available for this cosmic year.`;
    updateTimeTravelLog(`Traveling to year ${year}...\n${eventText}`);
  });

  const apiKey = "DEMO_KEY"; // Replace with your NASA API key
  const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  fetch(apodUrl)
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById('apodImageContainer');
      const title = document.getElementById('apodTitle');
      const date = document.getElementById('apodDate');
      const explanation = document.getElementById('apodExplanation');
      const downloadBtn = document.getElementById('downloadBtn');

      title.textContent = data.title || "Astronomy Picture of the Day";
      date.textContent = data.date ? `📅 ${data.date}` : "";
      explanation.textContent = data.explanation || "No explanation available.";

      // Image
      if (data.media_type === "image") {
        container.innerHTML = `
          <img id="apodImg" src="${data.url}" alt="${data.title}" class="apod-img" />
        `;

        // Enable download
        downloadBtn.onclick = () => {
          const link = document.createElement("a");
          link.href = data.hdurl || data.url;
          link.download = `${data.title.replaceAll(' ', '_')}.jpg`;
          link.click();
        };

        // Lightbox
        document.getElementById("apodImg").addEventListener("click", () => {
          const overlay = document.createElement("div");
          overlay.className = "apod-lightbox";
          overlay.innerHTML = `<img src="${data.hdurl || data.url}" alt="Full View" />`;
          overlay.onclick = () => document.body.removeChild(overlay);
          document.body.appendChild(overlay);
        });

      // Video
      } else if (data.media_type === "video") {
        container.innerHTML = `
          <iframe class="apod-video" src="${data.url}" frameborder="0" allowfullscreen></iframe>
        `;
        downloadBtn.style.display = "none"; // Hide download for videos
      } else {
        container.innerHTML = "<p>Media type not supported.</p>";
        downloadBtn.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error loading APOD:", error);
      document.getElementById('apodImageContainer').innerHTML = "<p>Unable to load NASA image.</p>";
    });
const events = [
  {
    title: "Perseid Meteor Shower",
    date: "August 12, 2025",
    description: "Peak night for one of the brightest meteor showers of the year."
  },
  {
    title: "Geminid Meteor Shower",
    date: "December 13, 2025",
    description: "Bright and intense meteors with up to 120 meteors/hour."
  },
  {
    title: "Total Lunar Eclipse",
    date: "September 7, 2025",
    description: "A complete eclipse visible in many parts of the world."
  }
];

const eventsList = document.getElementById("eventsList");

events.forEach(event => {
  const card = document.createElement("div");
  card.className = "event-card";
  card.innerHTML = `
    <h3>${event.title}</h3>
    <p><strong>Date:</strong> ${event.date}</p>
    <p>${event.description}</p>
  `;
  eventsList.appendChild(card);
});
function startCountdowns() {
  const countdowns = document.querySelectorAll('.countdown');
  countdowns.forEach(cd => {
    const eventDate = new Date(cd.getAttribute('data-event-date')).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance <= 0) {
        cd.innerHTML = "🌌 Happening Now!";
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        cd.innerHTML = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  });
}

window.addEventListener("DOMContentLoaded", startCountdowns);
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.game-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('visible');
        observer.unobserve(card); // Animate once only
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.15}s`; // stagger effect
    observer.observe(card);
  });
});
function drawGlowingStar(ctx, x, y, radius, glowColor) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, glowColor);
  gradient.addColorStop(1, "transparent");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}
const canvas = document.getElementById('constellationCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
let connections = [];
let selectedStar = null;
let dragging = false;
let dashOffset = 0;

canvas.width = 800;
canvas.height = 500;

function drawStar(star) {
  const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 15);
  gradient.addColorStop(0, star.color);
  gradient.addColorStop(1, "transparent");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(star.x, star.y, 6, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(star.x, star.y, 2.5, 0, 2 * Math.PI);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Animate dashed glowing lines
  ctx.setLineDash([5, 5]);
  ctx.lineDashOffset = -dashOffset;
  ctx.strokeStyle = '#00ccff';
  ctx.lineWidth = 1.5;

  connections.forEach(pair => {
    ctx.beginPath();
    ctx.moveTo(pair[0].x, pair[0].y);
    ctx.lineTo(pair[1].x, pair[1].y);
    ctx.stroke();
  });

  ctx.setLineDash([]); // Reset line style

  stars.forEach(drawStar);

  dashOffset += 0.8; // Animate dash movement
  requestAnimationFrame(draw);
}

canvas.addEventListener('click', (e) => {
  if (dragging) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  stars.push({ x, y, name: "", color: "#a3d1ff" });
});

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let star of stars) {
    const dist = Math.hypot(x - star.x, y - star.y);
    if (dist < 10) {
      selectedStar = star;
      dragging = true;
      break;
    }
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (!dragging) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let star of stars) {
    const dist = Math.hypot(x - star.x, y - star.y);
    if (star !== selectedStar && dist < 10) {
      connections.push([selectedStar, star]);
    }
  }

  dragging = false;
  selectedStar = null;
});

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let star of stars) {
    const dist = Math.hypot(x - star.x, y - star.y);
    if (dist < 10) {
      selectedStar = star;
      document.getElementById('starNameInput').value = star.name || '';
      document.getElementById('starColorInput').value = star.color || '#a3d1ff';
      document.getElementById('starProperties').style.display = 'block';
      return;
    }
  }

  document.getElementById('starProperties').style.display = 'none';
});

document.getElementById('saveStarBtn').addEventListener('click', () => {
  if (selectedStar) {
    selectedStar.name = document.getElementById('starNameInput').value;
    selectedStar.color = document.getElementById('starColorInput').value;
  }
  document.getElementById('starProperties').style.display = 'none';
});

document.getElementById('deleteStarBtn').addEventListener('click', () => {
  if (selectedStar) {
    connections = connections.filter(pair => pair[0] !== selectedStar && pair[1] !== selectedStar);
    stars = stars.filter(s => s !== selectedStar);
    selectedStar = null;
    document.getElementById('starProperties').style.display = 'none';
  }
});

document.getElementById('clearCanvasBtn').addEventListener('click', () => {
  stars = [];
  connections = [];
  selectedStar = null;
  document.getElementById('starProperties').style.display = 'none';
});

document.getElementById('downloadImageBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'constellation.png';
  link.href = canvas.toDataURL();
  link.click();
});

draw(); // Start the animation loop
stars.push({ x, y, name: "", color: "#a3d1ff" });
stars.push({
  x, y,
  name: "",
  color: "#a3d1ff",
  twinklePhase: Math.random() * Math.PI * 2 // For random brightness timing
});
function drawStar(star, time) {
  const brightness = 0.7 + 0.3 * Math.sin(time / 500 + star.twinklePhase); // Twinkle
  const glow = `rgba(163, 209, 255, ${brightness})`;

  const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 15);
  gradient.addColorStop(0, glow);
  gradient.addColorStop(1, "transparent");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(star.x, star.y, 6, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = brightness;
  ctx.beginPath();
  ctx.arc(star.x, star.y, 2.5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;
}
function draw(time = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw animated constellation lines
  ctx.setLineDash([5, 5]);
  ctx.lineDashOffset = -dashOffset;
  ctx.strokeStyle = '#00ccff';
  ctx.lineWidth = 1.5;

  connections.forEach(pair => {
    ctx.beginPath();
    ctx.moveTo(pair[0].x, pair[0].y);
    ctx.lineTo(pair[1].x, pair[1].y);
    ctx.stroke();
  });

  ctx.setLineDash([]);

  // Draw stars with twinkling
  stars.forEach(s => drawStar(s, time));

  dashOffset += 0.8;
  requestAnimationFrame(draw);
}



canvas.width = 800;
canvas.height = 500;

function drawStar(star) {
  const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 15);
  gradient.addColorStop(0, star.color);
  gradient.addColorStop(1, "transparent");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(star.x, star.y, 6, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(star.x, star.y, 2.5, 0, 2 * Math.PI);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Animate dashed glowing lines
  ctx.setLineDash([5, 5]);
  ctx.lineDashOffset = -dashOffset;
  ctx.strokeStyle = '#00ccff';
  ctx.lineWidth = 1.5;

  connections.forEach(pair => {
    ctx.beginPath();
    ctx.moveTo(pair[0].x, pair[0].y);
    ctx.lineTo(pair[1].x, pair[1].y);
    ctx.stroke();
  });

  ctx.setLineDash([]); // Reset line style

  stars.forEach(drawStar);

  dashOffset += 0.8; // Animate dash movement
  requestAnimationFrame(draw);
}

canvas.addEventListener('click', (e) => {
  if (dragging) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  stars.push({ x, y, name: "", color: "#a3d1ff" });
});

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let star of stars) {
    const dist = Math.hypot(x - star.x, y - star.y);
    if (dist < 10) {
      selectedStar = star;
      dragging = true;
      break;
    }
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (!dragging) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let star of stars) {
    const dist = Math.hypot(x - star.x, y - star.y);
    if (star !== selectedStar && dist < 10) {
      connections.push([selectedStar, star]);
    }
  }

  dragging = false;
  selectedStar = null;
});

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let star of stars) {
    const dist = Math.hypot(x - star.x, y - star.y);
    if (dist < 10) {
      selectedStar = star;
      document.getElementById('starNameInput').value = star.name || '';
      document.getElementById('starColorInput').value = star.color || '#a3d1ff';
      document.getElementById('starProperties').style.display = 'block';
      return;
    }
  }

  document.getElementById('starProperties').style.display = 'none';
});

document.getElementById('saveStarBtn').addEventListener('click', () => {
  if (selectedStar) {
    selectedStar.name = document.getElementById('starNameInput').value;
    selectedStar.color = document.getElementById('starColorInput').value;
  }
  document.getElementById('starProperties').style.display = 'none';
});

document.getElementById('deleteStarBtn').addEventListener('click', () => {
  if (selectedStar) {
    connections = connections.filter(pair => pair[0] !== selectedStar && pair[1] !== selectedStar);
    stars = stars.filter(s => s !== selectedStar);
    selectedStar = null;
    document.getElementById('starProperties').style.display = 'none';
  }
});

document.getElementById('clearCanvasBtn').addEventListener('click', () => {
  stars = [];
  connections = [];
  selectedStar = null;
  document.getElementById('starProperties').style.display = 'none';
});

document.getElementById('downloadImageBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'constellation.png';
  link.href = canvas.toDataURL();
  link.click();
});

draw(); // Start the animation loop

// Clear All functionality
document.getElementById("clear-btn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Also reset constellation data if applicable
});

// Download Image functionality
document.getElementById("download-btn").addEventListener("click", () => {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "constellation.png";
  link.click();
});
document.getElementById("space-log-form").addEventListener("submit", function(e) {
  e.preventDefault();

  // Optionally, store or send story here...

  document.getElementById("log-feedback").classList.remove("hidden");
  this.reset();

  // Hide message after 5 seconds
  setTimeout(() => {
    document.getElementById("log-feedback").classList.add("hidden");
  }, 5000);
});
