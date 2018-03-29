document.querySelector("form").onsubmit = () => {
    if (document.querySelector(".pay").value === "Select Option") {
        alert("Please Select Payment Status");
        return false;
    }
    return true;
}