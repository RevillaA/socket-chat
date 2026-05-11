const login = document.querySelector('#login');
login.addEventListener('click', (event) => {
    event.preventDefault();
    const user = document.querySelector('#username').value;
    if (user != "") {
        document.cookie = `username=${user}`;
        document.location.href = "/";
    } else {
        alert('Por favor, ingrese un nombre de usuario');
    }
});
