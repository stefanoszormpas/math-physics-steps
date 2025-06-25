const EXERCISE_FILES = ['sample1.json', 'sample2.json', 'sample3.json']; // βάλε εδώ όλα τα αρχεία JSON σου

let currentStep = 0;
let currentExercise = null;

async function loadExercises(filename = 'sample1.json') {
  const resp = await fetch('exercises/' + filename);
  const data = await resp.json();

  function convertDollarToLatex(input) {
    return input.replace(/\$(.+?)\$/g, (_, expr) => `\\(${expr.trim()}\\)`);
  }

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
  showNextStep();
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
    <div id="hint-${currentStep}" class="hint">${step.hint}</div>
    <button onclick="toggle('sol-${currentStep}')">Λύση</button>
    <div id="sol-${currentStep}" class="solution">${step.solution}</div>
  `;
  container.appendChild(div);

  MathJax.typesetPromise();

  currentStep++;
}

function resetExercise() {
  currentStep = 0;
  const container = document.getElementById('step-container');
  container.innerHTML = '';
  document.getElementById('next-step').disabled = false;
  showNextStep();
}

function toggle(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('show');
}

function populateExerciseSelect() {
  const select = document.getElementById('exercise-select');
  EXERCISE_FILES.forEach(file => {
    const option = document.createElement('option');
    option.value = file;
    option.textContent = file.replace('.json', '').replace(/_/g, ' ');
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => {
    loadExercises(e.target.value);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  populateExerciseSelect();
  loadExercises(EXERCISE_FILES[0]);
});
