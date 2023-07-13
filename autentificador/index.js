import Express, { json } from "express"
import express from "express"
import cors from "cors"
import mysql from "mysql2"
import dotenv from "dotenv"
import multer from "multer"
import path from "path"
//app
const app = Express()

//midddlewares
dotenv.config()
app.use(express.json())
app.use(cors({ origin: "*"}))




//database
const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    port:process.env.DATABASE_PORT,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME
})

//routes
db.query("SELECT * FROM Usuarios",(error, resultado)=> {

    if(error) {
        console.log(error)
    }else {
        console.log(resultado)
    }})

//MUESTRA TODOS LOS USUARIOS

app.get("/usuarios", (req,res)=>{

db.query("SELECT * FROM Usuarios",(error , resultado)=>{
    if(error)return res.status(500).json(error)
    return res.status(200).json(resultado)
})
})


//SUBE EL REGISTRO A LA BASE DE DATOS


app.post("/registrar",(req,res)=>{
    const { nombre,imail,foto,usuario,password}= req.body

db.query("INSERT INTO Usuarios (nombre,imail,foto,usuario,password) VALUES(?,?,?,?,?)",
[nombre,imail,foto,usuario,password],
(error,resultado)=>{
if(error) return res.status(500).json(error)

res.status(201).json(resultado)

})
})
//COMPRUEBA SI EL USUARIO ES CORRECTO EN LA BASE DE DATOS


app.post("/iniciar_sesion", (req, res) => {
    const { identifier, password } = req.body
  
    const imailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
  
    function passwordIsValid(passwordFromClient, passwordFromDB) {
      return passwordFromClient === passwordFromDB
    }
  
    if(imailRegex.test(identifier)) {
      
      db.query("SELECT * FROM Usuarios WHERE imail = ?",
        [identifier],
        (error, datos) => {
          if(error) return res.status(400).json(error)
  
          const usuario = {...datos[0]}
  
          if(passwordIsValid(password, usuario.password)) {
            res.status(200).json(usuario)
          } else {
            res.status(400).json({ message: "Contrasena incorrecta!" })
          }
  
        }
      )
  
    } else {
      
      db.query("SELECT * FROM Usuarios WHERE usuario = ?",
        [identifier],
        (error, datos) => {
          if(error) return res.status(400).json(error)
  
          const usuario = {...datos[0]}
  
          if(passwordIsValid(password, usuario.password)) {
            res.status(200).json(usuario)
          } else {
            res.status(400).json({ message: "Contrasena incorrecta!" })
          }
  
          
        }
      )
  
    }
})



//SUBE LOS COMENTARIOS DE UN USUARIO 
app.post("/comentario", (req, res) => {
    const {usuario_id, contenido,usuario,foto_usuario} = req.body;

    db.query("INSERT INTO Comentarios (usuario_id, contenido, usuario , foto_usuario) VALUES (?, ?, ?,?)",
  [usuario_id, contenido, usuario, foto_usuario],
  (error, resultado) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(201).json(resultado);
  }
);

})

//LEVANTA TODOS LOS COMENTARIOS DE LOS USUARIOS

app.get("/Comentario", (req,res)=>{

  db.query("SELECT * FROM Comentarios",(error , resultado)=>{
      if(error)return res.status(500).json(error)
      return res.status(200).json(resultado)
  })
})




//LEVANTA LOS COMENTARIOS DE UN USUARIO SEGUN ID 


 app.get("/comentarios/usuarios/:usuarioID", (req, res) => {
  const { usuarioID } = req.params;

  db.query("SELECT * FROM Comentarios WHERE usuario_id = ?",
    [usuarioID],
    (error, resultado) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(resultado);
    }
  )
})



//REGISTRA EN LA BASE DE DATOS LOS SEGUIDOS DE UN USUARIO -- recibe usuario -- recibe el seguido


app.post("/seguidores", (req, res) => {
  const {usuario_id, Seguido} = req.body;

  db.query("INSERT INTO Seguidores (usuario_id, Seguido) VALUES (?, ?);",
[usuario_id, Seguido],
(error, resultado) => {
  if (error) {
    return res.status(500).json(error);
  }
  return res.status(201).json(resultado);
}
);

})


// LEVANTA LOS SEGUIDOS DE UN USUARIO POR ID

app.get("/seguidores/:usuarioID", (req, res) => {
  const { usuarioID } = req.params;

  db.query("SELECT * FROM Seguidores WHERE usuario_id = ?",
    [usuarioID],
    (error, resultado) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(resultado);
    }
  )
})

// MUESTRA A UN USUARIO SEGUN SU NOMBRE DE USUARIO

app.get("/usuarios/:nombreUsuario", (req, res) => {
  const { nombreUsuario } = req.params;

  db.query("SELECT * FROM Usuarios WHERE usuario = ?",
    [nombreUsuario],
    (error, resultado) => {
      if (error) {
        return res.status(500).json(error);
      }

      if (resultado.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const usuarioEncontrado = resultado[0];
      return res.status(200).json(usuarioEncontrado);
    }
  );
});







app.post("/usuarios",(req,res)=>{
  const { nombre,imail,foto,usuario,password}= req.body

db.query("INSERT INTO Usuarios (nombre,imail,foto,usuario,password) VALUES(?,?,?,?,?)",
[nombre,imail,foto,usuario,password],
(error,resultado)=>{
if(error) return res.status(500).json(error)

res.status(201).json(resultado)

})
})






app.put('/usuarios/:id', (req, res) => {
  const usuarioId = req.params.id;

  db.query("UPDATE Usuarios SET seguidores = seguidores + 1 WHERE id = ?",
    [usuarioId],
    (error, resultado) => {
      if (error) {
        console.error('Error al actualizar los seguidores: ', error);
        return res.status(500).json({ error: 'Error al actualizar los seguidores' });
      }

      res.status(200).json({ mensaje: 'Actualización exitosa de seguidores' });
    }
  );
});




app.get("/usuarios/:usuarioID", (req, res) => {
  const { usuarioID } = req.params;

  db.query("SELECT * FROM Usuarios WHERE id = ?",
    [usuarioID],
    (error, resultado) => {
      if (error) {
        return res.status(500).json(error);
      }

      if (resultado.length === 0) {
        // El usuario no se encontró en la base de datos, pero no se considera un error
        return res.status(200).json({ mensaje: "Usuario no encontrado" });
      }

      const usuario = resultado[0];
      return res.status(200).json(usuario);
    }
  );
});






//inicio
app.listen(80, ()=>{
  console.log("Servidor Levantado en puerto 80")
})

app.get("/seguidores/:usuarioID/:seguidoID", (req, res) => {
  const { usuarioID, seguidoID } = req.params;

  db.query(
    "SELECT * FROM Seguidores WHERE usuario_id = ? AND Seguido = ?",
    [usuarioID, seguidoID],
    (error, resultado) => {
      if (error) {
        return res.status(500).json(error);
      }

      if (resultado.length > 0) {
        return res.status(200).json({ siguiendo: true });
      } else {
        return res.status(200).json({ siguiendo: false });
      }
    }
  );
});
