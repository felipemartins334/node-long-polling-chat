const fs = require('fs')
const path = require('path')
const connection = require('.')

function runMigrations(){
  const migrationsPath = path.resolve(__dirname, "migrations")
  fs.readdir(migrationsPath, (error, files) => {
    files.forEach(file => {
      fs.readFile(migrationsPath+`/${file}`, (error, data) => {
        connection.query(data.toString())
      })
    })
  })


}  

module.exports = runMigrations