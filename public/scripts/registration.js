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
                tr.innerHTML = `<td>${st.name}</td><td class="upperCase">${st.reg}</td><td>${st.paymentStatus}</td><td><a target="_blank" class="btn btn-default btn-md" href="/id/${st._id}">Details</a></td>`;
                tb.appendChild(tr);
            });
            var info = data.reduce((acc, next) => {
                next.paymentStatus === "Paid" ? (acc[0] += 200, acc[1]++) : acc[2]++;
                return acc;
            }, [0, 0, 0]);
            document.querySelector("#rS").textContent = info[0];
            document.querySelector("#tP").textContent = info[1];
            document.querySelector("#tU").textContent = info[2];
        });
}
document.querySelector(".search").onkeyup = () => {
    updateResult(document.querySelector(".search").value.toLowerCase());
};
window.onload = () => {
    updateResult("");
}