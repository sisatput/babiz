// Firebase SDK Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, update, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from "/script/config.js";
import firebase from "@firebase/app-compat";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
let logoutButton = document.querySelector("#logoutBtn");

logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
  
    signOut(auth).then(() => {
      // Sign-out successful.
      alert("Berhasil keluar!");
      location.href = "http://127.0.0.1:5500//../index.html";
      // Redirect or perform other actions after logout
      // Example: window.location.href = "path/to/redirect";
    }).catch((error) => {
      // An error happened.
      console.error("Error while signing out: ", error);
      alert("Terjadi kesalahan saat keluar!");
    });
  });

// Function to save user data to localStorage
function saveUserDataToLocalStorage(userData) {
  localStorage.setItem("userData", JSON.stringify(userData));
}

function getUserDataFromLocalStorage() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
}

function displayUserData(userData) {
    // Display user data in HTML elements
    document.getElementById("displayNamaUsaha").textContent = userData.namaUsaha || "";
    document.getElementById("displayProfemail").href = `mailto:${userData.email || ""}`;
    document.getElementById("displayProfemailText").textContent = userData.email || "";
    document.getElementById("displayProfwa").href = `https://wa.me/${userData.noWhatsApp || ""}`;
    document.getElementById("displayProfwaText").textContent = userData.noWhatsApp || "";
    document.getElementById("displayProfig").href = `https://www.instagram.com/${userData.instagram || ""}`;
    document.getElementById("displayProfigText").textContent = userData.instagram || "";
    document.getElementById("displayProflokasi").href = userData.googleMaps || "#";
    document.getElementById("displayProflokasiText").textContent = userData.googleMaps || "";
    document.getElementById("displayProdesc").textContent = userData.deskripsi || "";
  }

document.addEventListener("DOMContentLoaded", () => {
  const userData = getUserDataFromLocalStorage();
  if (userData) {
    displayUserData(userData);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = ref(database, `users/${uid}`);

    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      displayUserData(userData);
      saveUserDataToLocalStorage(userData);
    });
  }
});

const editProfileForm = document.querySelector("#simpanumkm");

editProfileForm.addEventListener("click", (e) => {
  e.preventDefault();

  const namaUsaha = document.querySelector("#namaUsaha").value;
  const noWhatsApp = document.querySelector("#noWhatsApp").value;
  const instagram = document.querySelector("#instagram").value;
  const googleMaps = document.querySelector("#googleMaps").value;
  const deskripsi = document.querySelector("#deskripsi").value;

  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;

    update(ref(database, `users/${uid}`), {
      namaUsaha: namaUsaha,
      noWhatsApp: noWhatsApp,
      instagram: instagram,
      googleMaps: googleMaps,
      deskripsi: deskripsi,
    })
      .then(() => {
        alert("Profil berhasil diperbarui!");
      })
      .catch((error) => {
        console.error("Error updating profile: ", error);
        alert("Terjadi kesalahan, profil gagal diperbarui!");
      });
  } else {
    alert("Tidak ada pengguna yang masuk!");
  }
});

function fillEditProfileForm(userData) {
  document.querySelector("#namaUsaha").value = userData.namaUsaha || "";
  document.querySelector("#noWhatsApp").value = userData.noWhatsApp || "";
  document.querySelector("#instagram").value = userData.instagram || "";
  document.querySelector("#googleMaps").value = userData.googleMaps || "";
  document.querySelector("#deskripsi").value = userData.deskripsi || "";
}

// Add event listener for edit profile modal opening
document.querySelector("#exampleModal").addEventListener("show.bs.modal", async () => {
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    const userRef = ref(database, `users/${uid}`);

    try {
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      fillEditProfileForm(userData);
    } catch (error) {
      console.error("Error fetching user data: ", error);
      // Handle error
    }
  }
});


//test desc dummy
const dataRef = firebase.database().ref('https://babizfinder-app-default-rtdb.asia-southeast1.firebasedatabase.app/umkm/-NlYLNqhXGueyQE4hISw/desc')
function updateDataInHtml(data){
  const dataContainer = document.getElementById('desc-umkm')
  dataContainer.innerHTML='<p>'+data+'</p>'
}

dataRef.on('value', function(snapshot){
  const data = snapshot.val()
  updateDataInHtml
})
