document.addEventListener("DOMContentLoaded", function(){

const stucount = document.getElementById("countList");

let students = [];

function loadStudents(){
    fetch("http://localhost:5000/students")
    .then(res => res.json())
    .then(data => {
        students = data;
        displayStudents(students);
    });
}

window.onload = loadStudents;

function displayStudents(data){

    const table = document.getElementById("tableBody");
    table.innerHTML = "";

    data.forEach(s => {
        const row = `
        <tr>
            <td>${s.firstName} ${s.lastName}</td>
            <td>${s.email}</td>
            <td>${s.dept}</td>
            <td>${s.DOB}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

window.sortByName = function(){
    const sorted = [...students].sort((a,b)=>
        a.firstName.localeCompare(b.firstName)
    );
    displayStudents(sorted);
}

window.sortByDOB = function(){

    const sorted = [...students].sort((a,b)=>
        new Date(a.DOB) - new Date(b.DOB)
    );
    displayStudents(sorted);
}

document.getElementById("deptFilter").addEventListener("change", function(){

    if(this.value === "all"){
        displayStudents(students);
        return;
    }

    fetch(`http://localhost:5000/students/department/${this.value}`)
    .then(res=>res.json())
    .then(data=>displayStudents(data));
});

const countBtn = document.getElementById("countBtn");
const count = document.querySelector(".count h1");
countBtn.addEventListener("click", loadCounts);
count.classList.remove("hide");

function loadCounts(){

    fetch("http://localhost:5000/students/count")
    .then(res => res.json())
    .then(data => {

        const list = document.getElementById("countList");
        list.innerHTML = "";

        data.forEach(d => {
            const li = document.createElement("li");
            li.textContent = `${d.dept} : ${d.total}`;
            list.appendChild(li);
        });

    })
    .catch(err=>{
        console.log(err);
    });
}

});