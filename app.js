const EXERCISE_FILES = ['sample1.json']; // εδώ μπορείς να προσθέσεις κι άλλα

let currentStep = 0;
let currentExercise = null;

async function loadExercises(filename = 'sample1.json') {
  const resp = await fetch('exercises/' + filename);
  const data = await resp.json();

  // Προαιρετικά: Αν έχεις string στο JSON με $...$ κάνουμε μετατροπή σε \( ... \)
  // Αν έχεις ήδη το σωστό format, μπορείς να αφαιρέσεις το μπλοκ αυτό
  function convertDollarToLatex(input) {
    return input.replace(/\$(.+?)\$/g, (_, expr) => `\\(${expr.trim()}\\)`);
  }

  // Αν θέλεις να κάνεις τη μετατροπή σε όλα τα βήματα:
  for (let step of data.steps) {
    step.question = convertDollarToLatex(step.question);
    step.hint = convertDollarToLatex(step.hint);
    step.solution = convertDollarToLatex(step.solution);
  }

  currentExercise = data;
  currentStep = 0;
  renderExercise(data);
}

function renderExercise(ex) {
  const container = document.getElementById('exercises');
  container.innerHTML = `
    <h2>${ex.title}</h2>
    <p class="description">${ex.description}</p>
    <div id="step-container"></div>
    <button id="next-step" onclick="showNextStep()">Επόμενο βήμα</button>
    <button id="reset-step" onclick="resetExercise()">Επαναφορά</button>
  `;
  MathJax.typesetPromise();
  showNextStep(); // ξεκινάμε με το πρώτο βήμα
}

function showNextStep() {
  const step = currentExercise.steps[currentStep];
  if (!step) {
    document.getElementById('next-step').disabled = true;
    return;
  }

  const container = document.getElementById('step-container');
  const div = document.createElement('div');
  div.className = 'step';
  div.innerHTML = `
    <p><strong>${step.question}</strong></p>
    <button onclick="toggle('hint-${currentStep}')">Υπόδειξη</button>
    <div id="hint-${currentStep}" class="hint" style="display:none;">${step.hint}</div>
    <button onclick="toggle('sol-${currentStep}')">Λύση</button>
    <div id="sol-${currentStep}" class="solution" style="display:none;">${step.solution}</div>
  `;
  container.appendChild(div);

  MathJax.typesetPromise();

  currentStep++;
}

function resetExercise() {
  currentStep = 0;
  const container = document.getElementById('step-container');
  container.innerHTML = ''; // καθαρίζουμε όλα τα βήματα
  document.getElementById('next-step').disabled = false; // ενεργοποιούμε το κουμπί "Επόμενο βήμα"
  showNextStep(); // ξαναδείχνουμε το πρώτο βήμα
}

function toggle(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.style.display === 'none') {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

// Αυτό το κομμάτι ξεκινάει τη φόρτωση της πρώτης άσκησης όταν φορτώνει η σελίδα
window.addEventListener('DOMContentLoaded', () => {
  loadExercises(EXERCISE_FILES[0]);
});
