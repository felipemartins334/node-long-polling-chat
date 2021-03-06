require('dotenv').config()
const dayjs = require('dayjs')
const http = require('http')
const fs = require('fs')
const path = require('path')
const connection = require('../database/index')
const runMigrations = require('../database/runMigrations')

runMigrations()

const publicPath = path.resolve(__dirname, '..', 'public')

let pool = []

function handlePage(req, res){
  fs.createReadStream(publicPath + '/index.html').pipe(res)

}

function handleCSS(req, res){
  fs.createReadStream(publicPath+ "/style.css").pipe(res)
}

function handlePoll(req, res){
  pool.push(res)
}

function handleMessage(req, res){

  let message = ''

  req.on('data', chunk => {
    message += chunk
  })
  req.on('end', () => {
    const { username, text } = JSON.parse(message)
    const date = dayjs()
    connection.query(`
    INSERT INTO messages(created_at, username, content)
    VALUES($1, $2, $3)
    `, [date, username, text])

    emitMessage(text, username, date)
    res.end()
  })
}

function emitMessage(message, user, date){
  const messageObject = {
    username: user,
    content: message,
    created_at: date
  }
  for(let res of pool) res.end(JSON.stringify(messageObject))
}

async function getMessages(req, res){
  const { rows: messages } = await connection.query(`SELECT * FROM messages`)
  res.end(JSON.stringify(messages))
}


http.createServer((req, res) => {

  let { url, method } = req

  if(method === 'GET'){
    if(url === '/messages') getMessages(req, res)
    if(url === '/page') handlePage(req, res)
    if(url === '/style.css') handleCSS(req,res)
    if(url === '/poll') handlePoll(req, res)
  
  }else if(method === 'POST'){
    if(url === '/message') handleMessage(req, res)
  }
}).listen(8000)
