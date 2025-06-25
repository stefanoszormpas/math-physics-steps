const EXERCISE_FILES = ['sample1.json']; // εδώ θα προσθέσουμε κι άλλα

let currentStep = 0;
let currentExercise = null;

async function loadExercises(filename = 'sample1.json') {
  const resp = await fetch('exercises/' + filename);
  const data = await resp.json();
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
    <div id="hint-${currentStep

