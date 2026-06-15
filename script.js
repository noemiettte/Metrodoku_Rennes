const categories = Object.keys(STATIONS[0].props);

let errors = 0;
const MAX_ERRORS = 3;
let gameOver = false;

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffle(arr, seed) {
  let a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

function dailySeed() {
  const d = new Date();
  return Number(
    `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`
  );
}

function findSolution(rows, cols) {

  const cells = [];

  rows.forEach(row => {
    cols.forEach(col => {

      cells.push({
        row,
        col,
        candidates: STATIONS.filter(
          station =>
            station.props[row] &&
            station.props[col]
        )
      });

    });
  });

  cells.sort(
    (a, b) => a.candidates.length - b.candidates.length
  );

  const used = new Set();
  const solution = {};

  function backtrack(index) {

    if (index === cells.length) {
      return true;
    }

    const cell = cells[index];

    for (const station of cell.candidates) {

      if (used.has(station.name)) {
        continue;
      }

      used.add(station.name);

      solution[
        `${cell.row}|${cell.col}`
      ] = station.name;

      if (backtrack(index + 1)) {
        return true;
      }

      used.delete(station.name);

      delete solution[
        `${cell.row}|${cell.col}`
      ];
    }

    return false;
  }

  return backtrack(0)
    ? solution
    : null;
}

function generateValidGrid(seed) {

  let attempts = 0;

  while (attempts < 500) {

    const rows =
      shuffle(categories, seed + attempts)
      .slice(0, 3);

    const cols =
      shuffle(categories, seed + 1000 + attempts)
      .slice(0, 3);

    const solution = findSolution(rows, cols);

    if (solution) {
      return {
        rows,
        cols,
        solution
      };
    }

    attempts++;
  }

  throw new Error(
    "Impossible de générer une grille valide"
  );
}

function create(seed) {

  errors = 0;
  gameOver = false;

  const puzzle = generateValidGrid(seed);

  window.currentSolution = puzzle.solution;

  const rows = puzzle.rows;
  const cols = puzzle.cols;

  let h = '<table><tr><th></th>';

  cols.forEach(c => {
    h += `<th>${c}</th>`;
  });

  h += '</tr>';

  rows.forEach(r => {

    h += `<tr><th>${r}</th>`;

    cols.forEach(c => {

      h += `
        <td>
          <input
            data-r="${r}"
            data-c="${c}"
            autocomplete="off"
          >
        </td>
      `;

    });

    h += '</tr>';

  });

  h += '</table>';

  document.getElementById('grid').innerHTML = h;

  document.getElementById('result').textContent =
    `Erreurs : 0/${MAX_ERRORS}`;

  document
    .querySelectorAll('#grid input')
    .forEach(input => {

      input.addEventListener(
        'change',
        () => validateInput(input)
      );

    });
}

function validateInput(input) {

  if (gameOver) {
    return;
  }

  const name =
    input.value.trim().toLowerCase();

  if (!name) {
    return;
  }

  const station = STATIONS.find(
    s => s.name.toLowerCase() === name
  );

  const duplicate =
    [...document.querySelectorAll('#grid input')]
      .filter(i => i !== input)
      .some(
        i =>
          i.value.trim().toLowerCase() === name
      );

  const valid =
    station &&
    !duplicate &&
    station.props[input.dataset.r] &&
    station.props[input.dataset.c];

  if (valid) {

    input.classList.remove('bad');
    input.classList.add('ok');

    input.disabled = true;

  } else {

    input.classList.remove('ok');
    input.classList.add('bad');

    errors++;

    document.getElementById('result').textContent =
      `Erreurs : ${errors}/${MAX_ERRORS}`;

    if (errors >= MAX_ERRORS) {

      gameOver = true;

      document
        .querySelectorAll('#grid input')
        .forEach(i => {
          i.disabled = true;
        });

      document.getElementById('result').textContent =
        '💀 Game Over (3 erreurs)';

      return;
    }
  }

  checkVictory();
}

function checkVictory() {

  const inputs =
    [...document.querySelectorAll('#grid input')];

  const won = inputs.every(
    input =>
      input.disabled &&
      input.classList.contains('ok')
  );

  if (won) {

    gameOver = true;

    document.getElementById('result').textContent =
      '🎉 Bravo ! Métrodoku complété';
  }
}

document.getElementById('dailyBtn').onclick =
  () => create(dailySeed());

document.getElementById('randomBtn').onclick =
  () => create(Date.now());

document.getElementById('shareBtn').onclick =
  () => {

    navigator.clipboard.writeText(
      'Je joue à Métrodoku Rennes !'
    );

    alert('Texte copié.');
  };

create(dailySeed());
