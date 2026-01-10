import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);

let nameInput;
let commentInput;
let sendBtn;
let list;
let unsubscribe = null;

// escuchar comentarios por viñeta
function listenComments() {
  if (!list) return;

  if (unsubscribe) unsubscribe(); // detener listener anterior

  list.innerHTML = "Cargando comentarios...";

  const comicId = "comic_" + window.currentComicIndex;

  const q = query(
    collection(db, "comments", comicId, "messages"),
    orderBy("date", "asc")
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML = "<i>No hay comentarios todavía</i>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();

      const div = document.createElement("div");
      div.innerHTML = `
        <b>${data.name}</b><br>
        ${data.text}<br>
        <span style="font-size:11px;color:#555">
          ${data.date?.toDate().toLocaleString() || ""}
        </span>
      `;
      list.appendChild(div);
    });
  });
}

// iniciar cuando el DOM esté listo
window.addEventListener("load", () => {
  nameInput = document.getElementById("name");
  commentInput = document.getElementById("comment");
  sendBtn = document.getElementById("sendComment");
  list = document.getElementById("commentList");

  listenComments();

  sendBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const text = commentInput.value.trim();

    if (!name || !text) {
      alert("Completa nombre y comentario");
      return;
    }

    const comicId = "comic_" + window.currentComicIndex;

    await addDoc(
      collection(db, "comments", comicId, "messages"),
      {
        name,
        text,
        date: serverTimestamp()
      }
    );

    commentInput.value = "";
  });
});

// para recargar comentarios al cambiar de viñeta
window.reloadComments = listenComments;



