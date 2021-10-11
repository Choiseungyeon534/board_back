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


// 댓글 보여주기
app.get('/api/reply/:boardId', function(req, res) {
    let boardId = parseInt(req.params.boardId)
    connection.query(`select * from reply where BOARD_ID=${boardId};`,(err, result) => {
        if(err) throw err;
        res.send(result)
    })
})

// 댓글 쓰기
app.post('/api/replyWrite', function(req, res) {
    console.log(req.body)
    connection.query(`insert into reply(writer, comment, time, BOARD_ID) values("${req.body.writer}","${req.body.comment}","${req.body.time}","${req.body.boardId}")`,(err,result) => {
        if(err) throw err;
        res.send({status:"성공"})
    })
})


// 특정게시글 생성
app.post('/api/boardInput',(req,res) => {
    console.log(req.body)
    connection.query(`insert into board(TITLE,CONTENT,WRITER) values("${req.body.title}","${req.body.content}","${req.body.user_id}")`,(err,result) => {
        if(err) throw err;
        res.send({status:"성공"})
    })
})

// 특정게시글 삭제
app.get('/api/boardDelete/:boardId',(req,res) => {
    console.log(req.params.boardId)
    let boardId = parseInt(req.params.boardId)
    connection.query(`delete from board where BOARD_ID=${boardId};`, (err, result) => {
        if(err) throw err;
        res.send({status:"삭제성공"})
    })
})

// 특정게시글 수정(update)
app.post('/api/boardEdit/:boardId',(req,res) => {
    let boardId = parseInt(req.params.boardId)
    connection.query(`update board set TITLE="${req.body.title}", CONTENT="${req.body.content}", WRITER="${req.body.user_id}" WHERE BOARD_ID=${boardId};`,(err,result) => {
        if(err) throw err;
        res.send({status:"수정성공"})
    })
})



app.listen(4000)