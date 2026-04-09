let mongoose = require('mongoose');

const database = 'Aulas';
const user = 'arthurvsilva05_db_user'; 
const password = 'Xg7yAApZljW0nKRn';

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`mongodb+srv://${user}:${password}@${database}.irnayl3.mongodb.net/${database}`)
       .then(() => {
         console.log('Database conectado com sucesso')
       })
       .catch(err => {
         console.error('Database não conectado')
       })
  }
}

module.exports = new Database()