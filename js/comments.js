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

const nameInput = document.getElementById("name");
const commentInput = document.getElementById("comment");
const sendBtn = document.getElementById("sendComment");
const list = document.getElementById("commentList");

// escuchar comentarios por viñeta
window.listenComments = function () {
  if (!list) return;

  list.innerHTML = "Cargando comentarios...";

  const comicId = "comic_" + window.currentComicIndex;

  const q = query(
    collection(db, "comments", comicId, "messages"),
    orderBy("date", "asc")
  );

  onSnapshot(q, (snapshot) => {
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
};

// enviar comentario
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

// cargar al iniciar
window.addEventListener("load", () => {
  window.listenComments();
});

