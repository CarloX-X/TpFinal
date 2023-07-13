import './style.css'
const formularioDeLogin = document.getElementById("formulario-login");
const usuarioInput = document.getElementById("login-indentificador-input");
const passwordInput = document.getElementById("login-password-input");

async function iniciarSesion(identifier , password) {
  const res = await fetch("http://190.192.73.224:80/iniciar_sesion", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({identifier , password}) 
  });

  const datos = await res.json();

  return datos;
}

formularioDeLogin.addEventListener("submit", async (evento) => { 
  evento.preventDefault();

  const usuarioEsValido = await iniciarSesion(usuarioInput.value, passwordInput.value);

  if (usuarioEsValido.message) {
    alert(usuarioEsValido.message);
    console.log("hasta aca funciona no inicio");
    window.location.href = "index.html"; 
  } else {
    
    alert("Sesión iniciada");
    localStorage.setItem("datos-de-usuario", JSON.stringify(usuarioEsValido));
    console.log("hasta aca funciona inicio");
    window.location.href = "htmls/principal/indexPrincipal.html"; 
  }
});

