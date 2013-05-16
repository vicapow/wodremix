module.exports = {
  db : {
    path : "mongodb://localhost/wodremix"
  }
  , log : {
    requests : true
  }
  , allow : {
    mobile : {
      on : {
        localhost : true
      }
    }
  }
}