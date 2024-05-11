// Import required Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  Firestore,
  getFirestore,
  onSnapshot,
  query,
  collection,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcsZmmV-D-r565kDIiD8SET0z_W0nBsGI",
  authDomain: "aayush-2329780.firebaseapp.com",
  projectId: "aayush-2329780",
  storageBucket: "aayush-2329780.appspot.com",
  messagingSenderId: "601967363086",
  appId: "1:601967363086:web:d40ecc03cf5d5636afe85f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a live data snapshot (i.e. auto-refresh) of our Reviews collection
const q = query(collection(db, "Reviews"), orderBy("book_name"));
const unsubscribe = onSnapshot(q, (snapshot) => {
  // Empty HTML table
  $("#reviewList").empty();

  // Loop through snapshot data and add to HTML table
  var tableRows = "";
  snapshot.forEach((doc) => {
    const reviewData = doc.data();
    const reviewDate = reviewData.Date.toDate(); // Convert Firestore Timestamp to JavaScript Date object
    const formattedDate = `${reviewDate.getFullYear()}-${
      reviewDate.getMonth() + 1
    }-${reviewDate.getDate()}`; // Format date as year-month-day

    tableRows += "<tr>";
    tableRows += "<td>" + reviewData.book_name + "</td>";
    tableRows += "<td>" + reviewData.book_rating + "/5</td>";
    tableRows += "<td>" + formattedDate + "</td>"; // Display formatted date

    tableRows +=
      "<td><button class='btn btn-primary editButton' data-id='" +
      doc.id +
      "'>Edit</button></td>";
    tableRows +=
      "<td><button class='btn btn-danger deleteButton' data-id='" +
      doc.id +
      "'>Delete</button></td>";
    tableRows += "</tr>";
  });

  $("#reviewList").append(tableRows);
  $("#mainTitle").html(snapshot.size + " book reviews in the list");
});

// Add button pressed
$("#addButton").click(function () {
  // Add review to Firestore collection
  const docRef = addDoc(collection(db, "Reviews"), {
    book_name: $("#bookName").val(),
    book_rating: parseInt($("#bookRating").val()),
    Date: new Date(), // Add current date
  });
  // Reset form
  $("#bookName").val("");
  $("#bookRating").val("1");
});

// Edit button clicked
$(document).on("click", ".editButton", function () {
  const docId = $(this).data("id");
  const newBookName = prompt("Enter the new book name:");
  const newBookRating = parseInt(prompt("Enter the new book rating (1-5):"));

  // Update the document in Firestore
  updateDoc(doc(db, "Reviews", docId), {
    book_name: newBookName,
    book_rating: newBookRating,
  });
});

// Delete button clicked
$(document).on("click", ".deleteButton", function () {
  const docId = $(this).data("id");

  // Delete the document from Firestore
  deleteDoc(doc(db, "Reviews", docId));
});
