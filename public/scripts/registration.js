function updateResult(q) {
    fetch(`https://react-event.herokuapp.com/find/${q}`)
        .then((data) => {
            return data.json();
        })
        .then((data) => {
            var tb = document.querySelector("tbody");
            tb.innerHTML = "";
            data.forEach((st) => {
                var tr = document.createElement('tr');
                tr.innerHTML = `<td>${st.name}</td><td class="upperCase">${st.reg}</td><td>${st.paymentStatus}</td>
                <td><a class="btn btn-default btn-md" href="/id/${st._id}">Details</a></td>
                <td><input type="checkbox" ${st.joined ? "checked" : ""} value=${st._id} class="switch_1" onclick='changeJoined(this)'/></td>`;
                tb.appendChild(tr);
            });
            var info = data.reduce((acc, next) => {
                next.paymentStatus === "Paid" ? (acc[0] += 200, acc[1]++) : acc[2]++;
                next.joined === true ? acc[3]++ : acc[3];
                return acc;
            }, [0, 0, 0, 0]);
            document.querySelector("#rS").textContent = info[0];
            document.querySelector("#tP").textContent = info[1];
            document.querySelector("#tU").textContent = info[2];
            document.querySelector("#tJ").textContent = info[3];
        }); 
}
document.querySelector(".search").onkeyup = () => {
    updateResult(document.querySelector(".search").value.toLowerCase());
};
window.onload = () => {
    updateResult("");
}

function changeJoined(reg) {
    reg.disabled = true;
    var q = reg.value;
    var bool;
    if (reg.checked) {
        bool = true;
    } else {
        bool = false;
    }
    fetch(`http://localhost:3000/joined/${q}/${bool}`)
        .then((data) => {
            if (data.ok) {
                reg.disabled = false;
            } else {
                reg.checked = false;                                
                throw new Error('Response 404!');
            }
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
        });
}