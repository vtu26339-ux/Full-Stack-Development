const API = "http://localhost:3000";

window.onload = function(){
loadAdminEvents();
loadStats();
loadBookings(); 
};

//  Load Events
function loadAdminEvents(){
fetch(API+"/events")
.then(r=>r.json())
.then(data=>{
let html="";
data.forEach(e=>{
html+=`
<div class="card">
<h3>${e.title}</h3>
<p>${e.description}</p>
<p>Date: ${e.event_date}</p>
<p>Venue: ${e.venue}</p>
<p>Price: ₹${e.price}</p>

<button onclick="deleteEvent(${e.id})" style="background:red;color:white;">Delete</button>
</div>
`;
});
document.getElementById("adminEvents").innerHTML=html;
});
}

//  Add Event
function addEvent(){

fetch(API+"/addevent",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({

title: document.getElementById("title").value,
description: document.getElementById("description").value,
event_date: document.getElementById("date").value,
venue: document.getElementById("venue").value,
price: document.getElementById("price").value,
total_seats: document.getElementById("seats").value

})
})
.then(r=>r.text())
.then(msg=>{
alert(msg);
loadAdminEvents();
});
}

//  Delete Event
function deleteEvent(id){

fetch(API+"/deleteevent/"+id,{
method:"DELETE"
})
.then(r=>r.text())
.then(msg=>{
alert(msg);
loadAdminEvents();
});
}

function loadStats(){
fetch(API+"/status")
.then(r=>r.json())
.then(data=>{

setTimeout(()=>{
document.getElementById("usersCount").innerText = data.totalUsers;
document.getElementById("bookingsCount").innerText = data.totalBookings;
}, 100);

});
}

function loadBookings(){
fetch(API+"/bookings")
.then(r=>r.json())
.then(data=>{
console.log("Bookings data:", data);  // 👈 CHECK THIS

let html="";

data.forEach(b=>{
html+=`
<div class="card">
<h3>Event: ${b.event_name}</h3>
<p>Name: ${b.name}</p>
<p>Email: ${b.email}</p>
<p>Phone: ${b.phone}</p>
<p>Venue: ${b.venue}</p>
<p>Date: ${b.event_date}</p>
<p>Status: ${b.paid}</p>
</div>
`;
});

document.getElementById("bookings").innerHTML = html;
});
}