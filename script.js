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
   const cols=shuffle(categories, seed+1000+attempts).slice(0,3);

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
     h+=`<td><input data-r="${r}" data-c="${c}"></td>`;
   });

   h+='</tr>';
 });

 h+='</table>';

 document.getElementById('grid').innerHTML=h;
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
