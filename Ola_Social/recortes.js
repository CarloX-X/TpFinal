FormularioComentario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
  
    const comentario = {
      usuario_id: usuarioID,
      contenido: contenidoInput.value.trim()
    };
  
    if (comentario.contenido !== "") {
      const comentariosubido = await subirDatosABD(comentario);
      if (comentariosubido) {
        console.log("Comentario enviado");
        contenidoInput.value = "";
        actualizarComentarios();
      }
    } else {
      alert("El campo de comentario está vacío");
    }
  });

  async function actualizarComentarios() {
    try {
      const response = await fetch(`http://190.192.73.224:3000/comentarios/usuarios/${usuarioID}`);
      const comentarios = await response.json();
      comentariosContainer.innerHTML = ''; // Limpiamos el contenedor de comentarios antes de actualizarlo
      comentarios.reverse();
      comentarios.forEach(comentario => {
        const comentarioElemento = document.createElement('div'); // Creamos un elemento <div> para cada comentario
        comentarioElemento.classList.add('comentario'); // Agregamos la clase 'comentario' para aplicar el estilo

        const fotoElemento = document.createElement('img'); // Creamos un elemento <img> para mostrar la foto del comentario
        fotoElemento.classList.add('fotoPerfil-comentario'); // Agregamos la clase 'fotoPerfil-comentario' para aplicar el estilo
        fotoElemento.id = 'foto-dato'; // Asignamos el id 'foto-dato' para identificar la imagen

        // Obtenemos la URL de la foto del comentario desde el objeto comentario
        fotoElemento.src = foto; // Asignamos la URL de la foto al atributo src de la imagen
        fotoElemento.alt = 'Foto de perfil'; // Asignamos el texto alternativo de la imagen

        const contenidoElemento = document.createElement('p'); // Creamos un elemento <p> para mostrar el contenido del comentario
        contenidoElemento.textContent = comentario.contenido; // Asignamos el contenido del comentario al elemento <p>

        const nombreElemento = document.createElement('span'); // Creamos un elemento <span> para mostrar el nombre del usuario
        nombreElemento.classList.add('nombre-usuario'); // Agregamos la clase 'nombre-usuario' para aplicar el estilo
        nombreElemento.textContent = `${Usuario}:`; // Asignamos el nombre del usuario al elemento

        const fechaElemento = document.createElement('span'); // Creamos un elemento <span> para mostrar la fecha y hora formateada del comentario
        const fecha = new Date(comentario.fecha); // Convertimos la cadena de fecha a un objeto Date
        const dia = fecha.getDate().toString().padStart(2, '0'); // Obtenemos el día y lo formateamos con dos dígitos
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Obtenemos el mes (los meses comienzan desde 0) y lo formateamos con dos dígitos
        const anio = fecha.getFullYear(); // Obtenemos el año
        const hora = fecha.getHours().toString().padStart(2, '0'); // Obtenemos la hora y la formateamos con dos dígitos
        const minutos = fecha.getMinutes().toString().padStart(2, '0'); // Obtenemos los minutos y los formateamos con dos dígitos
        const fechaFormateada = `${dia}/${mes}/${anio} - ${hora}:${minutos}`; // Creamos la cadena de fecha y hora formateada
        fechaElemento.textContent = fechaFormateada; // Asignamos la fecha y hora formateada al elemento <span>

        const infoContainer = document.createElement('div'); // Creamos un elemento <div> para contener el nombre y el contenido del comentario
        infoContainer.classList.add('info-container'); // Agregamos la clase 'info-container' para aplicar el estilo
        infoContainer.appendChild(nombreElemento); // Agregamos el elemento de nombre al contenedor de información
        infoContainer.appendChild(contenidoElemento); // Agregamos el elemento de contenido al contenedor de información

        comentarioElemento.appendChild(fotoElemento); // Agregamos el elemento de foto al elemento de comentario
        comentarioElemento.appendChild(infoContainer); // Agregamos el contenedor de información al elemento de comentario
        comentarioElemento.appendChild(fechaElemento); // Agregamos el elemento de fecha al elemento de comentario

        comentariosContainer.appendChild(comentarioElemento); // Agregamos el elemento de comentario al contenedor de comentarios
      });

    } catch (error) {
      console.log(error);
    }
  }

  actualizarComentarios();



async function subirDatosABD(comentario) {
  try {
    const res = await fetch("http://190.192.73.224:3000/comentario", {
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



//consigo los seguidores del usuarios

let seguidores = [];

function obtenerseguidos(usuarioID) {
  const url = `http://190.192.73.224:3000/seguidores/${usuarioID}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      seguidores = data.map(item => item.Seguido);
     
      actualizarSeguidores();
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function actualizarSeguidores() {
  let seguidoresActualizados = seguidores.length + 1;
  console.log(seguidoresActualizados);

 
  console.log(seguidores);
}


const datosDeUsuario = JSON.parse(localStorage.getItem("datos-de-usuario"));
const usuarioID = datosDeUsuario.id;


obtenerseguidos(usuarioID);




function obtenerComentarios(usuarioID) {
  const url = `http://localhost:3000/Comentarios/usuarios/${usuarioID}`;

  fetch(url)
    .then(response => response.json())
    .then(comentarios => {
      // Mostrar los comentarios por consola
      comentarios.forEach(comentario => {
        console.log(comentario.usuario_id, comentario.contenido);
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Iterar sobre cada elemento del array seguidores
seguidores.forEach(usuarioID => {
  obtenerComentarios(usuarioID);
});



// Realizar la solicitud AJAX
const xhr = new XMLHttpRequest();
xhr.open("GET", `/seguidores/${18}`, true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const resultado = JSON.parse(xhr.responseText);
    const seguidos = resultado.map((fila) => fila.Seguido);
    
    // Aquí puedes hacer lo que necesites con el array de "seguidos"
    console.log(seguidos);
  }
};
xhr.send();

async function obtenerComentariosPorID(ids) {
  const resultados = [];

  for (const id of ids) {
    const response = await fetch(`http://190.192.73.224:3000/comentarios/usuarios/${id}`);
    const comentarios = await response.json();

    for (const comentario of comentarios) {
      const usuarioID = comentario.usuario_id;
      const responseUsuario = await fetch(`http://190.192.73.224:3000/usuarios/${usuarioID}`);
      const usuario = await responseUsuario.json();

      const nombreUsuario = usuario.usuario;

      resultados.push({
        usuario: nombreUsuario,
        contenido: comentario.contenido
      });
    }
  }

  return resultados;
}

// Ejemplo de uso:
const ids = [15]; // Array de IDs de usuarios

obtenerComentariosPorID(ids)
  .then(resultados => {
    resultados.forEach(resultado => {
      console.log(`Usuario: ${resultado.usuario}`);
      console.log(`Comentario: ${resultado.contenido}`);
      console.log("-----");
    });
  })
  .catch(error => {
    console.log(error);
  });

  if (datosDeUsuario) {
   


    fetch(`http://190.192.73.224:3000/comentarios/usuarios/${usuarioID}`)
      .then(response => response.json())
      .then(comentarios => {
        const textoComentarios = comentarios.map(comentario => comentario.contenido);
        comentariosContainer.textContent = textoComentarios.join(" - ");
      })
      .catch(error => console.log(error));
  } else {
    usuarioDato.textContent = "No hay datos";
  }
  













  setInterval(async () => {
    try {
      const comentariosSeguidores = await obtenerComentariosSeguidores(usuarioID);

      // Realizar acciones con los comentarios de los seguidores
      comentariosSeguidores.forEach(comentario => {
        console.log("Usuario:", comentario.usuario);
        console.log("Contenido:", comentario.contenido);
        console.log("Fecha:", comentario.fecha);
        console.log("---------------------------");
      });

      // Otras acciones con los comentarios de los seguidores
      // ...

    } catch (error) {
      console.error("Error al obtener los comentarios de los seguidores:", error);
    }
  }, 100000);
