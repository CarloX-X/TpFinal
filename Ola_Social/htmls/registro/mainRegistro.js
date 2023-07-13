console.log("hasta aca funciona")

const formularioDeRegistro = document.getElementById("formulario-registro")
const nombreInput = document.getElementById("nombre-input")
const usuarioInput = document.getElementById("usuario-input")
const emailInput = document.getElementById("email-input")
const passwordinput = document.getElementById("password-input")
const fotoInput = document.getElementById("foto-input")




async function subirDatosABD(datosUsuario) {
  const res = await fetch("http://190.192.73.224:80/registrar", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(datosUsuario)
  });

  const datos = await res.json();
  return datos;
}

function redireccionar(ruta) {
  window.location.href = ruta;
}

formularioDeRegistro.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const usuario = {
    usuario: usuarioInput.value,
    password: passwordinput.value,
    foto: fotoInput.value,
    imail: emailInput.value,
    nombre: nombreInput.value,
  };

  const usuarioSubido = await subirDatosABD(usuario);
  if (usuarioSubido) {
    console.log("Usuario Subido");
    redireccionar("../../index.html");
  }
});
