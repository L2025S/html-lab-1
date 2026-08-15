function copyAddress(){
    const text = document.getElementById("company-address").innerText;
    navigator.clipboard.writeText(text);
    AudioListener("Address copied to clipboard!")
}