// Order history
fetch("http://localhost:5000/orders/history")
.then(res=>res.json())
.then(data=>{
    const table=document.getElementById("orderTable");

    data.forEach(o=>{
        table.innerHTML+=`
        <tr>
        <td>${o.name}</td>
        <td>${o.product_name}</td>
        <td>${o.quantity}</td>
        <td>${o.price}</td>
        <td>${o.total_price}</td>
        <td>${o.order_date}</td>
        </tr>`;
    });
});

// Highest order
fetch("http://localhost:5000/orders/highest")
.then(res=>res.json())
.then(data=>{
    document.getElementById("highest").innerText =
    `${data[0].name} placed the highest order worth ₹${data[0].order_value}`;
});

// Most active
fetch("http://localhost:5000/customers/active")
.then(res=>res.json())
.then(data=>{
    document.getElementById("active").innerText =
    `${data[0].name} has the most orders (${data[0].total_orders})`;
});
