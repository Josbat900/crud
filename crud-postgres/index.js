const express = require("express")
const app = express();
const PORT = 3000
require("dotenv").config();
 
app.use(express.json());

const { Pool } = require('pg');
/*
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  })
*/
 const pool = new Pool({
     user: 'default',
     host: 'ep-steep-brook-50699158-pooler.us-east-1.postgres.vercel-storage.com',
     database: 'verceldb',
     password: 'srXfylHn4jC9',
     port: 5432,
     ssl: {rejectUnauthorized: false}
 });

const listUsersQuery = `SELECT * FROM students;`;


//importando la middleware
const authMiddleware = require("./apikey")
app.use(authMiddleware)

app.get("/prueba", (req,res)=>{
    res.send("the port is running")
})


app.get("/students",(req,res)=>{
    
    pool.query(listUsersQuery)
    .then(respond => {
        
        console.log("List students: ", respond.rows);
        
        res.send(respond.rows)
        pool.end();
    })
    .catch(err => {
        
        console.error(err);
        pool.end();
    });
    
})


// el pool.end cierra la base de datos

app.get("/students/:id",(req,res)=>{
    console.log(req.params.id)
    let id = req.params.id
    
    pool.query(listUsersQuery)
    .then(respond => {
        
        const resultadoId = (respond.rows).find(usuario => usuario.id == id)
        console.log("List students: ", resultadoId/*respond.rows*/);
        
        res.send(resultadoId)
        //pool.end();
    })
    .catch(err => {
        
        console.error(err);
        //pool.end();
    });
    
})


//ahora con sql

app.get("/studentsSQL/:id",(req,res)=>{
    console.log(req.params.id)
    let id = req.params.id
    const searchIDQuery = `SELECT * FROM students WHERE id = ${id}`
    
    pool.query(searchIDQuery)
    .then(respond => {
        
        console.log("List students: ", respond.rows/*respond.rows*/);
        
        res.send(respond.rows)
        //pool.end();
    })
    .catch(err => {
        
        res.status(404).send("hubo un error")
        console.error(err);
        //pool.end();
    });
    
})

//agregar un post a la base de datos

app.post("/students/post",(req,res)=>{
    console.log(req.body)
    
     const agregarUsuario = `INSERT INTO students (id, name, lastname, notes) values
     (${req.body.id}, '${req.body.name}', '${req.body.lastname}', '${req.body.notes}')`

    pool.query(agregarUsuario)
    .then(respond => {
        
        
        console.log(respond.rows);
        
        res.status(201).send("se ha subido el usuarios")

      
        //pool.end();
    })
    .catch(err => {
        
        console.error(err);
        //pool.end();
    });
    
})

app.put("/students/put/:id", (req,res)=>{
    const id = req.params.id
    const actualizarDatos = `UPDATE students SET name = '${req.body.name}', lastname = '${req.body.lastname}', notes = '${req.body.notes}' WHERE id IN (${id})` ;
    

    pool.query(actualizarDatos)
    .then(respond => {
        
        
        console.log(respond.rows);
        
        res.status(201).send("se ha subido el usuarios")

      
        //pool.end();
    })
    .catch(err => {
        
        res.status(404).send("page not found")

        console.error(err);
        //pool.end();
    });


})

app.delete("/students/delete/:id", (req,res)=>{
    const id = req.params.id
    const borrarUnUsuario = `DELETE FROM students WHERE ID = ${id}` ;
    

    pool.query(borrarUnUsuario)
    .then(respond => {
        
        
        console.log(respond.rows);
        
        res.status(201).send("se ha subido el usuarios")

      
        //pool.end();
    })
    .catch(err => {
        
        res.status(404).send("page not found")
        console.error(err);
        //pool.end();
    });


})

app.listen(PORT, ()=>{console.log("the app is running")})

module.exports = app