import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);

// elementos HTML
const nameInput = document.getElementById("name");
const commentInput = document.getElementById("comment");
const sendBtn = document.getElementById("sendComment");
const commentsList = document.getElementById("commentsList");

// ID local del autor (ya creado en el HTML)
const authorId = localStorage.getItem("authorId");

// referencia a colección
const commentsRef = collection(db, "comments");

// escuchar cambios según viñeta
function listenComments() {
  const q = query(
    commentsRef,
    where("comicIndex", "==", window.currentComicIndex),
    orderBy("createdAt", "asc")
  );

  onSnapshot(q, snapshot => {
    commentsList.innerHTML = "";

    snapshot.forEach(docSnap => {
      const c = docSnap.data();
      const div = document.createElement("div");

      const canDelete = c.authorId === authorId;

      div.innerHTML = `
        <b>${c.name}</b>
        <span style="font-size:11px;color:#555;">
          (${c.date})
        </span><br>

        ${c.text}<br>

        <button data-like>👍 ${c.likes || 0}</button>
        ${canDelete ? `<button data-del>🗑 borrar</button>` : ``}
      `;

      // like
      div.querySelector("[data-like]").onclick = () =>
        updateDoc(doc(db, "comments", docSnap.id), {
          likes: increment(1)
        });

      // borrar (solo propio)
      if (canDelete) {
        div.querySelector("[data-del]").onclick = () =>
          deleteDoc(doc(db, "comments", docSnap.id));
      }

      commentsList.appendChild(div);
    });
  });
}

// enviar comentario
sendBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const text = commentInput.value.trim();

  if (!name || !text) return alert("Completa nombre y comentario");

  await addDoc(commentsRef, {
    name,
    text,
    authorId,
    comicIndex: window.currentComicIndex,
    likes: 0,
    date: new Date().toLocaleString("es-AR"),
    createdAt: serverTimestamp()
  });

  commentInput.value = "";
});

// escuchar cambios de viñeta
window.addEventListener("load", () => {
  listenComments();
});

window.addEventListener("click", () => {
  listenComments();
});
