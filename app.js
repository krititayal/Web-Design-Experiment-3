const form=document.querySelector('#task-form'),input=document.querySelector('#task-input'),list=document.querySelector('#task-list'),empty=document.querySelector('#empty'),count=document.querySelector('#count'),filters=[...document.querySelectorAll('[data-filter]')];
let tasks=JSON.parse(localStorage.getItem('small-steps')||'[]'),filter='all';
function save(){
  localStorage.setItem('small-steps',JSON.stringify(tasks));
  render()
}
function render(){
  list.replaceChildren();
  const shown=tasks.filter(t=>filter==='all'||(filter==='active'&&!t.done)||(filter==='completed'&&t.done));
  for(const t of shown){
    const li=document.createElement('li');
    li.className=`task${
      t.done?' done':''
    }
    `;
    const cb=document.createElement('input');
    cb.type='checkbox';
    cb.checked=t.done;
    cb.setAttribute('aria-label',`Mark ${
      t.text
    }
    ${
      t.done?'not done':'done'
    }
    `);
    cb.onchange=()=>{
      t.done=cb.checked;
      save()
    }
    ;
    const label=document.createElement('label');
    label.textContent=t.text;
    const del=document.createElement('button');
    del.className='remove';
    del.textContent='×';
    del.type='button';
    del.setAttribute('aria-label',`Remove ${
      t.text
    }
    `);
    del.onclick=()=>{
      tasks=tasks.filter(x=>x.id!==t.id);
      save()
    }
    ;
    li.append(cb,label,del);
    list.append(li)
  }
  const n=tasks.filter(t=>!t.done).length;
  count.textContent=`${
    n
  }
  ${
    n===1?'thing':'things'
  }
  left`;
  empty.hidden=shown.length>0;
  list.hidden=!shown.length
}
form.onsubmit=e=>{
  e.preventDefault();
  const text=input.value.trim();
  if(!text)return;
  tasks.unshift({
    id:Date.now()+Math.random(),text,done:false
  }
  );
  input.value='';
  save();
  input.focus()
}
;
filters.forEach(b=>b.onclick=()=>{
  filter=b.dataset.filter;
  filters.forEach(x=>x.classList.toggle('active',x===b));
  render()
}
);
document.querySelector('#clear-done').onclick=()=>{
  tasks=tasks.filter(t=>!t.done);
  save()
}
;
render();
