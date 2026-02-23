document.addEventListener("DOMContentLoaded", function(){

    // fetch audit logs
    fetch("http://localhost:5000/logs")
    .then(res=>res.json())
    .then(data=>{

        const table = document.getElementById("logTable");
        table.innerHTML = "";

        if(data.length === 0){
            table.innerHTML = "<tr><td colspan='4'>No logs yet</td></tr>";
            return;
        }

        data.forEach(log=>{
            table.innerHTML += `
            <tr>
                <td>${log.action_type}</td>
                <td>${log.table_name}</td>
                <td>${log.description}</td>
                <td>${log.action_time}</td>
            </tr>`;
        });
    })
    .catch(err=>console.log(err));



    // fetch daily report
    fetch("http://localhost:5000/daily-report")
    .then(res=>res.json())
    .then(data=>{

        const list = document.getElementById("dailyReport");
        list.innerHTML = "";

        if(data.length === 0){
            list.innerHTML = "<li>No activity today</li>";
            return;
        }

        data.forEach(r=>{
            list.innerHTML +=
            `<li>${r.activity_date} — ${r.action_type}: ${r.total_actions}</li>`;
        });

    })
    .catch(err=>console.log(err));

});
