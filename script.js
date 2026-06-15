
const categories=Object.keys(STATIONS[0].props);

function seededRandom(seed){let x=Math.sin(seed)*10000;return x-Math.floor(x);}

function shuffle(arr,seed){
 let a=[...arr];
 for(let i=a.length-1;i>0;i--){
   const j=Math.floor(seededRandom(seed+i)*(i+1));
   [a[i],a[j]]=[a[j],a[i]];
 }
 return a;
}

function dailySeed(){
 const d=new Date();
 return Number(`${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`);
}

function findSolution(rows, cols){
 const cells=[];

 rows.forEach(r=>{
   cols.forEach(c=>{
     cells.push({
       row:r,
       col:c,
       candidates:STATIONS.filter(st => st.props[r] && st.props[c])
     });
   });
 });

 cells.sort((a,b)=>a.candidates.length-b.candidates.length);

 const used=new Set();
 const solution={};

 function backtrack(index){
   if(index===cells.length) return true;

   const cell=cells[index];

   for(const station of cell.candidates){
     if(used.has(station.name)) continue;

     used.add(station.name);
     solution[`${cell.row}|${cell.col}`]=station.name;

     if(backtrack(index+1)) return true;

     used.delete(station.name);
     delete solution[`${cell.row}|${cell.col}`];
   }

   return false;
 }

 return backtrack(0) ? solution : null;
}

function generateValidGrid(seed){
 let attempts=0;

 while(attempts<500){
   const rows=shuffle(categories, seed+attempts).slice(0,3);
   const remainingCategories=categories.filter(c=>!rows.includes(c));
   const cols=shuffle(remainingCategories, seed+1000+attempts).slice(0,3);
   if (remainingCategories.length<3) {throw new Error("Il faut au moins 6 catégories différentes dans data.js");}

   const solution=findSolution(rows, cols);

   if(solution){
     return {rows, cols, solution};
   }

   attempts++;
 }

 throw new Error("Impossible de générer une grille valide");
}

function create(seed){
 const puzzle=generateValidGrid(seed);

 window.currentSolution=puzzle.solution;

 const rows=puzzle.rows;
 const cols=puzzle.cols;

 let h='<table><tr><th></th>';

 cols.forEach(c=>h+=`<th>${c}</th>`);
 h+='</tr>';

 rows.forEach(r=>{
   h+=`<tr><th>${r}</th>`;

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

   h+='</tr>';
 });

 h+='</table>';

 document.getElementById('grid').innerHTML=h;
 setupAutocomplete();
}

function check(){
 let valid=0,total=0;
 const used=new Set();

 document.querySelectorAll('input').forEach(i=>{
   total++;

   const name=i.value.trim().toLowerCase();

   const station=STATIONS.find(
     s=>s.name.toLowerCase()===name
   );

   const ok=station &&
            !used.has(name) &&
            station.props[i.dataset.r] &&
            station.props[i.dataset.c];

   if(ok){
     used.add(name);
     i.className='ok';
     valid++;
   }else{
     i.className='bad';
   }
 });

 document.getElementById('result').textContent =
   `${valid}/${total} cases correctes`;
}

document.getElementById('dailyBtn').onclick=()=>create(dailySeed());
document.getElementById('randomBtn').onclick=()=>create(Date.now());
document.getElementById('checkBtn').onclick=check;

document.getElementById('shareBtn').onclick=()=>{
 navigator.clipboard.writeText('Je joue à Metrodoku Rennes !');
 alert('Texte copié.');
};

create(dailySeed());

function setupAutocomplete() {
  document
        .querySelectorAll(".station-input")
        .forEach(input => {

            const suggestions =
                input.parentElement.querySelector(
                    ".suggestions"
                );

            input.addEventListener("input", () => {

                const value =
                    input.value.trim().toLowerCase();

                suggestions.innerHTML = "";

                if (value.length < 3)
                    return;

                const matches = STATIONS
                    .filter(st =>
                        st.name.toLowerCase().includes(value)
                    )
                    .slice(0, 10);

                matches.forEach(station => {

                    const item =
                        document.createElement("div");

                    item.className = "suggestion-item";
                    item.textContent = station.name;

                    item.onclick = () => {
                        input.value = station.name;
                        suggestions.innerHTML = "";
                    };

                    suggestions.appendChild(item);
                });
            });
        });
}
