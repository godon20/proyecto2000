import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   ID LOCAL DEL AUTOR
========================= */
let authorId = localStorage.getItem("authorId");
if (!authorId) {
  authorId = crypto.randomUUID();
  localStorage.setItem("authorId", authorId);
}

/* =========================
   REFERENCIAS HTML
========================= */
const commentsList = document.getElementById("commentsList");
const nameInput = document.getElementById("name");
const commentInput = document.getElementById("comment");
const sendBtn = document.getElementById("sendComment");

/* =========================
   ESTADO VIÑETA
========================= */
let currentComicIndex = 0;

/* =========================
   ESCUCHAR COMENTARIOS
========================= */
let unsubscribe = null;

function listenComments() {
  if (unsubscribe) unsubscribe();

  const q = query(
    collection(db, "comments"),
    where("comic", "==", currentComicIndex),
    orderBy("created", "asc")
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    commentsList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.className = "comment";

      div.innerHTML = `
        <strong>${data.name}</strong>
        <small> • ${data.created?.toDate().toLocaleString() || ""}</small>
        <p>${data.text}</p>
        ${
          data.authorId === authorId
            ? `<button data-id="${docSnap.id}" class="delete-btn">🗑 borrar</button>`
            : ""
        }
      `;

      commentsList.appendChild(div);
    });
  });
}

/* =========================
   ENVIAR COMENTARIO
========================= */
sendBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const text = commentInput.value.trim();

  if (!name || !text) return;

  await addDoc(collection(db, "comments"), {
    name,
    text,
    comic: currentComicIndex,
    authorId,
    created: serverTimestamp()
  });

  commentInput.value = "";
});

/* =========================
   BORRAR COMENTARIO
========================= */
commentsList.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const id = e.target.dataset.id;
  await deleteDoc(doc(db, "comments", id));
});

/* =========================
   CAMBIO DE VIÑETA
========================= */
window.loadComments = function (index = currentComicIndex) {
  currentComicIndex = index;
  listenComments();
};

/* =========================
   INICIAL
========================= */
listenComments();
