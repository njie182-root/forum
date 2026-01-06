const API = "https://script.google.com/macros/s/AKfycbxzINfTLqZ0rW5KmZDL8zDqiFQaOw8AihOmGy2qMw4UG0Rxj724WWpyM50I3OAsAXVF/exec";

// 🔐 auth check
const user = localStorage.getItem("forumUser");
if(!user && location.pathname.indexOf("login") === -1){
  location.href="login.html";
}

// tampilkan user
const authBox = document.getElementById("auth");
if(authBox) authBox.innerHTML = "Login sebagai: " + user;

// load threads
async function loadThreads(){
  const res = await fetch(API + "?type=threads");
  const data = await res.json();

  const box = document.getElementById("threads");
  if(!box) return;

  data.reverse().forEach(t=>{
    box.innerHTML += `
      <div class="card">
        <h3><a href="thread.html?id=${t.id}">${t.title}</a></h3>
        <small>oleh ${t.user}</small>
        ${t.image ? `<img src="${t.image}" width="150">` : ""}
      </div>
    `;
  });
}
loadThreads();

// single thread
async function loadThread(){
  const p = new URLSearchParams(location.search);
  const id = p.get("id");
  if(!id) return;

  const res = await fetch(API + "?type=threads");
  const data = await res.json();
  const t = data.find(x=>x.id==id);

  document.getElementById("thread").innerHTML = `
    <h2>${t.title}</h2>
    <p>${t.content}</p>
    ${t.image ? `<img src="${t.image}" width="300">` : ""}
  `;

  loadComments(id);
  document.getElementById("commentLink").href =
    "https://docs.google.com/forms/d/e/1FAIpQLSdfM7C0-TyKoa7QCcb-5_oNOBcgOvXPbLnuw6w6ncVlRxyFBQ/viewform?entry.123="+id;
}
loadThread();

// comments
async function loadComments(id){
  const res = await fetch(API + "?type=comments&thread="+id);
  const data = await res.json();
  const box = document.getElementById("comments");

  data.forEach(c=>{
    box.innerHTML += `
      <p><b>${c.user}</b>: ${c.text}</p>
    `;
  });
}
