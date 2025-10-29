const canvas = document.getElementById('canvas');
fetch('data/layout.json')
.then(r=>r.json())
.then(saved=>{
  saved.forEach(item=>{
    let el=document.createElement('div');
    el.className='element';
    el.style.left=item.left+'px';
    el.style.top=item.top+'px';
    el.style.width=item.width+'px';
    el.style.height=item.height+'px';
    if(item.type==='text'){el.textContent=item.text;}
    else if(item.type==='image'){const img=document.createElement('img'); img.src=item.url; el.appendChild(img);}
    else if(item.type==='video'){const vid=document.createElement('video'); vid.src=item.url; vid.controls=true; el.appendChild(vid);}
    else if(item.type==='button'){const btn=document.createElement('button'); btn.textContent=item.name; btn.onclick=()=>window.location.href=item.link; el.appendChild(btn);}
    canvas.appendChild(el);
  });
})
.catch(()=>console.log('No layout found'));
