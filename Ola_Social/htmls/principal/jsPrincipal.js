document.addEventListener("DOMContentLoaded", function() {
  const fotoDatoUsuario = document.querySelectorAll('#foto-dato');
  const comentariosContainer = document.getElementById("comentarios-container");
  const contenidoInput = document.getElementById("Contenido_input");
  const FormularioComentario = document.getElementById("FormularioComentario");
  const botoncerrar = document.getElementById("cerrar");
  
  botoncerrar.addEventListener("click", () => {
    resultadoUsuario.style.display = 'none';
  });

  // Los datos guardados en el localstorage se levantan acaa
  const datosDeUsuario = JSON.parse(localStorage.getItem("datos-de-usuario"));
  const foto = datosDeUsuario.foto;
  
  const imagenUsuario = document.getElementById('imagenUsuario');
  const nombreUsuario = document.getElementById('nombreUsuario');
  const seguidoresUsuario = document.getElementById('seguidoresUsuario');
 
  const usuarioDato = document.getElementById('usuario-dato');
  
  fotoDatoUsuario.forEach(fotoDatoUsuario => {
    fotoDatoUsuario.textContent = foto;
    fotoDatoUsuario.setAttribute('src', foto);
  });
  
 
  const usuarioID = datosDeUsuario.id;
  const nombreDeUsuario = datosDeUsuario.usuario;
  
  
  nombreUsuario.textContent = datosDeUsuario.nombre; 
  seguidoresUsuario.textContent = `${datosDeUsuario.seguidores} Seguidores`; 
  usuarioDato.textContent = `@${nombreDeUsuario}`; 


  async function subirDatosABD(comentario) {
    try {
      const res = await fetch("http://190.192.73.224:80/comentario", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(comentario)
      });

      const datos = await res.json();
      return datos;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  FormularioComentario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const comentario = {
      usuario_id: usuarioID,
      contenido: contenidoInput.value.trim(),
      usuario: nombreDeUsuario,
     foto_usuario:foto
    };

    if (comentario.contenido !== "") {
      const comentariosubido = await subirDatosABD(comentario);
      if (comentariosubido) {
        console.log("Comentario enviado");
        contenidoInput.value = "";
        // Actualiza los comentarios después de enviar uno nuevo
        capturaComentarios2(usuarioID);
      }
    } else {
      alert("El campo de comentario está vacío");
    }
  });





/// esto lo probamos (creo que no usamos xDDD)
  function obtenerseguidos(usuarioID) {
    const url = `http://190.192.73.224:80/seguidores/${usuarioID}`;
  let seguidores = [];
  
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          seguidores = data.map(item => item.Seguido);
          seguidores.push(usuarioID)
          resolve(seguidores); 
          console.log(seguidores)
        })
        .catch(error => {
          console.log('Error:', error);
          reject(error); 
        });
    });
  }
  




  async function capturaComentarios2(usuarioID) {
    const url = `http://190.192.73.224:80/Comentarios/usuarios/${usuarioID}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      
      const comentarios = data.map(comentario => ({
        usuario: comentario.usuario,
        contenido: comentario.contenido,
        fecha: comentario.fecha,
        foto: comentario.foto_usuario,
        idComentario: comentario.id
      }));
      return comentarios;
    } catch (error) {
      console.error("Error al obtener los comentarios:", error);
      throw error;
    }
  }



  async function obtenerComentariosSeguidores(usuarioID) {
    try {
      // obtiene el id de todos los sguidores
      const seguidores = await obtenerseguidos(usuarioID);
  
      // guarda el id en un array
      const comentariosSeguidores = [];
  
      // con el id del array de seguidores, agarra todos los comentarios de cada id que le pasamos
      for (const seguidorID of seguidores) {
        const comentarios = await capturaComentarios2(seguidorID);
        comentariosSeguidores.push(...comentarios);
      }
  
      // ordena el array con todos los comentarios por id
      comentariosSeguidores.sort((a, b) => a.idComentario - b.idComentario);
  
      console.log(comentariosSeguidores);
      return comentariosSeguidores;
        
    } catch (error) {
      console.error("Error al obtener los comentarios de los seguidores:", error);
      throw error;
    }
  }
  





  setInterval(async () => {
    try {
      const comentariosSeguidores = await obtenerComentariosSeguidores(usuarioID);
      const comentariosContainer = document.getElementById('comentarios-container');
  
      // limpia todos los comentarios
      comentariosContainer.innerHTML = '';
  
      // invierte el orden pq los primeros quedaban abajo
      const comentariosInvertidos = comentariosSeguidores.reverse();
  
      // Generar y agregar los elementos de comentarios
      comentariosInvertidos.forEach(comentario => {
        const comentarioDiv = document.createElement('div');
        comentarioDiv.classList.add('comentario');
        
        

        const usuarioElement = document.createElement('p');
        usuarioElement.textContent = `@${comentario.usuario}`;
        usuarioElement.classList.add('miClaseUsuario');

        const contenidoElement = document.createElement('p');
        contenidoElement.textContent = `${comentario.usuario} dijo: ${comentario.contenido}`;
        contenidoElement.classList.add('miClaseContenido');

        const fechaElement = document.createElement('p');
        fechaElement.textContent = `Fecha: ${comentario.fecha}`;
        fechaElement.classList.add('miClaseFecha');

        var claseImagen = 'fotoComentario';
        var imagen = document.createElement('img');
        imagen.src = `${comentario.foto}`;
        imagen.classList.add(claseImagen);
        imagen.alt = 'no se ve';
        
        

    

        comentarioDiv.appendChild(imagen);
        comentarioDiv.appendChild(usuarioElement);
        comentarioDiv.appendChild(contenidoElement);
        comentarioDiv.appendChild(fechaElement);
        
        comentariosContainer.appendChild(comentarioDiv);

        
      });
    } catch (error) {
      console.error("Error al obtener los comentarios de los seguidores:", error);
    }
  }, 100);
  
  
  

  obtenerComentariosSeguidores(38)





});


//nofunca 








 


async function buscarUsuario() {
  const nombreUsuario = document.getElementById('inputUsuario').value;


  fetch(`http://190.192.73.224:80/usuarios/${nombreUsuario}`)
    .then(response => {
      if (!response.ok) {
    
        throw new Error('Error en la solicitud al servidor');
      }
      return response.json();
    })
    .then(usuarioEncontrado => {
      if (Object.keys(usuarioEncontrado).length === 0) {
  
        alert('El usuario no existe. Por favor, inténtalo de nuevo.');
        return;
      }

      const resultadoUsuario = document.getElementById('resultadoUsuario');
      const imagenUsuario = document.getElementById('imagenUsuario');
      const nombreUsuarioElement = document.getElementById('nombreUsuario');

   
      nombreUsuarioElement.setAttribute('data-id', usuarioEncontrado.id);

     
      imagenUsuario.src = usuarioEncontrado.foto;
      nombreUsuarioElement.textContent = usuarioEncontrado.nombre;
      resultadoUsuario.style.display = 'block';
    })
    .catch(error => {
      console.error('Error al buscar el usuario: ', error);
      alert('El usuario no existe.');
    });
}



async function seguirUsuario() {
  const datosDeUsuario = JSON.parse(localStorage.getItem("datos-de-usuario"));
  const usuario_id = datosDeUsuario.id;
  const nombreUsuarioElement = document.getElementById('nombreUsuario');
  const Seguido = parseInt(nombreUsuarioElement.getAttribute('data-id'));

  // Verifica si ya estás siguiendo al usuario
  const verificarSeguido = await fetch(`http://190.192.73.224:80/seguidores/${usuario_id}/${Seguido}`);
  const resultadoVerificacion = await verificarSeguido.json();

  if (resultadoVerificacion.siguiendo) {

    alert("Ya estás siguiendo a este usuario");
    return;
  }
  
  const subir = await fetch("http://190.192.73.224:80/seguidores", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ usuario_id, Seguido })
  });
    
  const sumarSeguidores = await fetch(`http://190.192.73.224:80/usuarios/${Seguido}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ Seguido })
  });
  alert("Siguiendo al usuario");
  resultadoUsuario.style.display = 'none';
}







