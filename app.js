// 🔹 Firebase config (GANTI DENGAN PUNYA KAMU)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 🔹 Buat thread
window.createThread = async function(){
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const file = document.getElementById('image').files[0];

  let imageURL = "";

  if(file){
    const imgRef = ref(storage, 'images/' + Date.now());
    await uploadBytes(imgRef, file);
    imageURL = await getDownloadURL(imgRef);
  }

  await addDoc(collection(db, "threads"), {
    title, content, imageURL, date: Date.now()
  });

  location.href = "index.html";
}

// 🔹 Tampilkan thread list
async function loadThreads(){
  const box = document.getElementById("threads");
  if(!box) return;

  const snap = await getDocs(collection(db, "threads"));
  snap.forEach(docu=>{
    const d = docu.data();
    box.innerHTML += `
      <div class="card">
        <h3><a href="thread.html?id=${docu.id}">${d.title}</a></h3>
        ${d.imageURL ? `<img src="${d.imageURL}" width="150">` : ""}
      </div>
    `;
  });
}
loadThreads();

// 🔹 Tampilkan satu thread
async function loadThread(){
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if(!id) return;

  const refDoc = doc(db,"threads",id);
  const snap = await getDoc(refDoc);
  if(!snap.exists()) return;

  const d = snap.data();
  document.getElementById("thread").innerHTML = `
    <h2>${d.title}</h2>
    <p>${d.content}</p>
    ${d.imageURL ? `<img src="${d.imageURL}" width="300">` : ""}
  `;
}
loadThread();

