const express = require("express")
const server = express()

//importar o banco de dados
const db = require("./database/db")
//habilitar o uso do req.body
server.use(express.urlencoded({extends: true}))

// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views",{
    express: server,
    noCache: true
})

//configurar a pasta publica
server.use(express.static("public"))
//configurar caminhos da minha aplicação
//pagina inicial
// req: requisição
// res: resposta

server.get("/", (req,res)=>{
    return res.render("index.html")
})

server.get("/create-point", (req,res)=>{
    //req: query são os query strings da url

    return res.render("create-point.html")
})

server.post("/savepoint",(req,res)=>{
    //req.body: o corpo do formulario 
    //console.log(req.body)
    //inserir dados no banco de dados
    
    const query = `
    INSERT INTO places (
        image, 
        name,
        adress,
        adress2,
        state,
        city,
        items) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.adress,
        req.body.adress2,
        req.body.state,
        req.body.city,
        req.body.items
    ]
    function afterInsertData (err){
        if(err) {
            console.log(err)
            return res.send("Erro no Cadastro")
        }

        console.log("Cadastrado com Sucesso")
        console.log(req.body)
        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)   
})



server.get("/search", (req,res)=>{
    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", {total: 0})    
    }

    //pegar os dados do banco
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }
        
        //mostrar a pagina html com os dados do banco de dados
        const total = rows.length
        return res.render("search-results.html", {total, places: rows})
    })   
    
})

//ligar o servidor
server.listen(3000)
