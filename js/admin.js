const canvas = document.getElementById('canvas');
let elements = [];
let selectedEl = null;

// Drag-and-drop
function makeDraggable(el) {
  let offsetX, offsetY;
  el.onmousedown = (e) => {
    selectedEl = el;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    function mouseMoveHandler(e) {
      el.style.left = e.clientX - offsetX + 'px';
      el.style.top = e.clientY - offsetY + 'px';
    }
    function mouseUpHandler() {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      selectedEl = null;
    }
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };
}

// Add Elements
function addText() {
  const el = document.createElement('div');
  el.className = 'element';
  el.contentEditable = true;
  el.style.left = '50px';
  el.style.top = '50px';
  el.textContent = 'Edit me';
  canvas.appendChild(el);
  makeDraggable(el);
  elements.push({type:'text', el});
}

function addImage() {
  const url = prompt('Enter image URL or relative path in /assets/:');
  if(!url) return;
  const el = document.createElement('div');
  el.className = 'element';
  const img = document.createElement('img');
  img.src = url;
  el.appendChild(img);
  el.style.left = '50px';
  el.style.top = '50px';
  canvas.appendChild(el);
  makeDraggable(el);
  elements.push({type:'image', el, url});
}

function addVideo() {
  const url = prompt('Enter video URL or relative path in /assets/:');
  if(!url) return;
  const el = document.createElement('div');
  el.className = 'element';
  const vid = document.createElement('video');
  vid.src = url;
  vid.controls = true;
  vid.style.maxWidth = '150px';
  vid.style.maxHeight = '150px';
  el.appendChild(vid);
  el.style.left = '50px';
  el.style.top = '50px';
  canvas.appendChild(el);
  makeDraggable(el);
  elements.push({type:'video', el, url});
}

function addButton() {
  const name = prompt('Button text:');
  const link = prompt('Button link:');
  if(!name || !link) return;
  const el = document.createElement('div');
  el.className = 'element';
  const btn = document.createElement('button');
  btn.textContent = name;
  btn.onclick = () => window.open(link,'_blank');
  el.appendChild(btn);
  el.style.left = '50px';
  el.style.top = '50px';
  canvas.appendChild(el);
  makeDraggable(el);
  elements.push({type:'button', el, name, link});
}

// Save layout JSON
function saveLayout() {
  const layout = elements.map(item => ({
    type: item.type,
    left: item.el.offsetLeft,
    top: item.el.offsetTop,
    width: item.el.offsetWidth,
    height: item.el.offsetHeight,
    ...(item.type==='text' && {text:item.el.textContent}),
    ...(item.type==='image' && {url:item.url}),
    ...(item.type==='video' && {url:item.url}),
    ...(item.type==='button' && {name:item.name, link:item.link})
  }));
  fetch('data/layout.json', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(layout)
  }).then(()=>alert('Layout saved online!')).catch(()=>alert('Use server-side to save JSON'));
}

// Load saved layout
window.onload = () => {
  fetch('data/layout.json').then(r=>r.json()).then(saved=>{
    saved.forEach(item => {
      let el = document.createElement('div');
      el.className='element';
      el.style.left = item.left+'px';
      el.style.top = item.top+'px';
      el.style.width = item.width+'px';
      el.style.height = item.height+'px';
      if(item.type==='text'){el.contentEditable=true; el.textContent=item.text;}
      else if(item.type==='image'){const img=document.createElement('img'); img.src=item.url; el.appendChild(img);}
      else if(item.type==='video'){const vid=document.createElement('video'); vid.src=item.url; vid.controls=true; el.appendChild(vid);}
      else if(item.type==='button'){const btn=document.createElement('button'); btn.textContent=item.name; btn.onclick=()=>window.open(item.link,'_blank'); el.appendChild(btn);}
      canvas.appendChild(el);
      makeDraggable(el);
      elements.push({...item, el});
    });
  }).catch(()=>console.log('No layout found or running locally'));
};

function clearCanvas() {
  if(confirm('Clear everything?')){canvas.innerHTML=''; elements=[];}
}
