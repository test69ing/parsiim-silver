
const PASSWORD = "PA1STCO";
const MAX_STEPS = 5;
const EXPIRY_DAYS = 180;

let code = prompt("Enter your unique code:");
document.getElementById("displayedCode").innerText = code;

let stateKey = `silver_${code}`;
let state = JSON.parse(localStorage.getItem(stateKey)) || {
  usedSteps: [],
  startDate: Date.now()
};

function isExpired() {
  const now = Date.now();
  const diff = now - state.startDate;
  const daysPassed = diff / (1000 * 60 * 60 * 24);
  return daysPassed >= EXPIRY_DAYS;
}

function updateCountdown() {
  const endDate = new Date(state.startDate + EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diff = endDate - now;
  if (diff <= 0) {
    document.getElementById("countdown").innerText = "⛔ This card has expired!";
    document.getElementById("applyBtn").disabled = true;
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("countdown").innerText = `⏳ ${days} days left`;
}

function updateUI() {
  document.querySelectorAll(".step").forEach((el, idx) => {
    if (state.usedSteps.includes(idx)) {
      el.classList.remove("locked");
      el.innerText = el.innerText.split(" ")[0] + " ✅ Used";
    } else if (idx === state.usedSteps.length) {
      el.classList.remove("locked");
    } else {
      el.classList.add("locked");
    }
  });

  if (state.usedSteps.length === MAX_STEPS) {
    document.getElementById("message").innerText = "🎉 You got a Free Saree and a Gold Coupon";
    document.getElementById("applyBtn").style.display = "none";
  }
}

document.getElementById("applyBtn").addEventListener("click", () => {
  if (isExpired()) {
    alert("This coupon has expired!");
    return;
  }
  let pass = prompt("Enter password to apply:");
  if (pass === PASSWORD) {
    const nextStep = state.usedSteps.length;
    if (nextStep < MAX_STEPS) {
      state.usedSteps.push(nextStep);
      localStorage.setItem(stateKey, JSON.stringify(state));
      updateUI();
    }
  } else {
    alert("Incorrect password!");
  }
});

updateCountdown();
updateUI();
