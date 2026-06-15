const categories = Object.keys(STATIONS[0].props);

const categories=Object.keys(STATIONS[0].props);
let errors = 0;
const MAX_ERRORS = 3;
let gameOver = false;

function seededRandom(seed){let x=Math.sin(seed)*10000;return x-Math.floor(x);}
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

function shuffle(arr,seed){
 let a=[...arr];
 for(let i=a.length-1;i>0;i--){
   const j=Math.floor(seededRandom(seed+i)*(i+1));
   [a[i],a[j]]=[a[j],a[i]];
 }
 return a;
  return a;
}

function dailySeed(){
 const d=new Date();
 return Number(`${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`);
function dailySeed() {
  const d = new Date();
  return Number(
    `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`
  );
}

function findSolution(rows, cols){
 const cells=[];
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

 rows.forEach(r=>{
   cols.forEach(c=>{
     cells.push({
       row:r,
       col:c,
       candidates:STATIONS.filter(st => st.props[r] && st.props[c])
     });
   });
 });
    if (index === cells.length) {
      return true;
    }

 cells.sort((a,b)=>a.candidates.length-b.candidates.length);
    const cell = cells[index];

 const used=new Set();
 const solution={};
    for (const station of cell.candidates) {

 function backtrack(index){
   if(index===cells.length) return true;
      if (used.has(station.name)) {
        continue;
      }

   const cell=cells[index];
      used.add(station.name);

   for(const station of cell.candidates){
     if(used.has(station.name)) continue;
      solution[
        `${cell.row}|${cell.col}`
      ] = station.name;

     used.add(station.name);
     solution[`${cell.row}|${cell.col}`]=station.name;
      if (backtrack(index + 1)) {
        return true;
      }

     if(backtrack(index+1)) return true;
      used.delete(station.name);

     used.delete(station.name);
     delete solution[`${cell.row}|${cell.col}`];
   }
      delete solution[
        `${cell.row}|${cell.col}`
      ];
    }

   return false;
 }
    return false;
  }

 return backtrack(0) ? solution : null;
  return backtrack(0)
    ? solution
    : null;
}

function generateValidGrid(seed){
 let attempts=0;
function generateValidGrid(seed) {

 while(attempts<500){
   const rows=shuffle(categories, seed+attempts).slice(0,3);
   const remainingCategories=categories.filter(c=>!rows.includes(c));
   const cols=shuffle(remainingCategories, seed+1000+attempts).slice(0,3);
   if (remainingCategories.length <3) {throw new Error("Il faut au moins 6 catégories différentes dans data.js");}
  let attempts = 0;

   const solution=findSolution(rows, cols);
  while (attempts < 500) {

   if(solution){
     return {rows, cols, solution};
   }
    const rows =
      shuffle(categories, seed + attempts)
      .slice(0, 3);

   attempts++;
 }
    const cols =
      shuffle(categories, seed + 1000 + attempts)
      .slice(0, 3);

 throw new Error("Impossible de générer une grille valide");
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

function create(seed){
 const puzzle=generateValidGrid(seed);
function create(seed) {

 window.currentSolution=puzzle.solution;
  errors = 0;
  gameOver = false;

 const rows=puzzle.rows;
 const cols=puzzle.cols;
  const puzzle = generateValidGrid(seed);

 let h='<table><tr><th></th>';
  window.currentSolution = puzzle.solution;

 cols.forEach(c=>h+=`<th>${c}</th>`);
 h+='</tr>';
  const rows = puzzle.rows;
  const cols = puzzle.cols;

 rows.forEach(r=>{
   h+=`<tr><th>${r}</th>`;
  let h = '<table><tr><th></th>';

   cols.forEach(c=>{
     h+=`
     <td class="cell">
      <input
        class="station-input"
        data-r="${r}"
        data-c="${c}"
        autocomplete="off"
      >
      <div class="suggestions"></div>
     </td>`;
   });
  cols.forEach(c => {
    h += `<th>${c}</th>`;
  });

   h+='</tr>';
 });
  h += '</tr>';

 h+='</table>';
  rows.forEach(r => {

 document.getElementById('grid').innerHTML=h;
 setupAutocomplete();
}
    h += `<tr><th>${r}</th>`;

    cols.forEach(c => {

function check(){
 let valid=0,total=0;
 const used=new Set();
      h += `
        <td>
          <input
            data-r="${r}"
            data-c="${c}"
            autocomplete="off"
          >
        </td>
      `;

 document.querySelectorAll('input').forEach(i=>{
   total++;
    });

   const name=i.value.trim().toLowerCase();
    h += '</tr>';

   const station=STATIONS.find(
     s=>s.name.toLowerCase()===name
   );
  });

   const ok=station &&
            !used.has(name) &&
            station.props[i.dataset.r] &&
            station.props[i.dataset.c];
  h += '</table>';

   if(ok){
     used.add(name);
     i.className='ok';
     valid++;
   }else{
     i.className='bad';
   }
 });
  document.getElementById('grid').innerHTML = h;

 document.getElementById('result').textContent =
   `${valid}/${total} cases correctes`;
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

document.getElementById('dailyBtn').onclick=()=>create(dailySeed());
document.getElementById('randomBtn').onclick=()=>create(Date.now());
document.getElementById('checkBtn').onclick=check;
function validateInput(input) {

document.getElementById('shareBtn').onclick=()=>{
 navigator.clipboard.writeText('Je joue à Metrodoku Rennes !');
 alert('Texte copié.');
};
  if (gameOver) {
    return;
  }

create(dailySeed());
  const name =
    input.value.trim().toLowerCase();

function setupAutocomplete() {
  document
        .querySelectorAll(".station-input")
        .forEach(input => {
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

            const suggestions =
                input.parentElement.querySelector(
                    ".suggestions"
                );
  const valid =
    station &&
    !duplicate &&
    station.props[input.dataset.r] &&
    station.props[input.dataset.c];

            input.addEventListener("input", () => {
  if (valid) {

                const value =
                    input.value.trim().toLowerCase();
    input.classList.remove('bad');
    input.classList.add('ok');

                suggestions.innerHTML = "";
    input.disabled = true;

                if (value.length < 3)
                    return;
  } else {

                const matches = STATIONS
                    .filter(st =>
                        st.name.toLowerCase().includes(value)
                    )
                    .slice(0, 10);
    input.classList.remove('ok');
    input.classList.add('bad');

                matches.forEach(station => {
    errors++;

                    const item =
                        document.createElement("div");
    document.getElementById('result').textContent =
      `Erreurs : ${errors}/${MAX_ERRORS}`;

                    item.className = "suggestion-item";
                    item.textContent = station.name;
    if (errors >= MAX_ERRORS) {

                    item.onclick = () => {
                        input.value = station.name;
                        suggestions.innerHTML = "";
                    };
      gameOver = true;

                    suggestions.appendChild(item);
                });
            });
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
