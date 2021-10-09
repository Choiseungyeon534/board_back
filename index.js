const express = require('express')
const app = express()


const mysql = require('mysql');
app.use(express.urlencoded({extended:false}))
app.use(express.json())

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'board_db',
    port: '3306'
});

app.post("/api/login", function(req, res) {
    let id = req.body.id
    let pass = req.body.pass
    connection.query(`select * from user where id="${id}" and pass="${pass}";`,(err,result) => {
        if(err) throw err;
        console.log(result.length)
        let isSuccess = result.length;

        if(isSuccess >= 1) {
            res.send({
                status:'성공'
            })
        }else {
            res.send({
                status:"실패"
            })
        }
    })
})
app.post('/api/signUp', function(req, res) {
    let id = req.body.id
    let pass = req.body.pass
    connection.query(`insert into user values ('${id}', ${pass});`, (err, result) => {
        if(err) throw err;
        res.send({
            status: "성공"
        })
    })
})

app.post('/api/todoInsert', function (req,res) {
    let today = req.body.today
    let clear = req.body.clear
    connection.query(`insert into todo_table( today, clear ) values ( '${today}', '${clear}');`,(err,result) => {
        if(err) throw err;
        res.send({
            status:"성공"
        })
    })             
})


//board
app.get('/api/board/allInfo', function(req, res) {
    connection.query(`select * from board;`,(err, result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/api/boardDetail/:boardId', function(req, res) {
    console.log(req.params.boardId)
    let boardId = parseInt(req.params.boardId)
    connection.query(`select * from board where BOARD_ID=${boardId};`, (err, result) => {
        if(err) throw err;
        console.log(result)
        res.send(result)
    })
})


app.listen(4000)