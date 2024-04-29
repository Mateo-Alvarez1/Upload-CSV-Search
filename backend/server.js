import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from 'convert-csv-to-json'
import { log } from "console";

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage()
const upload = multer({ storage })

const userData = []
app.use(cors());

app.post('/api/files' , upload.single('file') , async( req , res) => {

  const { file } = req

  if (!file) {
    return res.status(500).json( { message:"No se cargo ningun archivo" } )
  }

  if (file.mimetype != 'text/csv') {
    return res.status(500).json( { message:"El archivo debe ser CSV" } )
  }
  let json  = []
  try{
    // Transformarmaos el buffer a un string
    const rawCsv = Buffer.from(file.buffer).toString('utf-8')
    // Transformamos el string (csv) en un json
    json= csvToJson.fieldDelimiter(',').csvStringToJson(rawCsv)
    userData = csv

  }catch(error){
    return res.status(500).json({ message: 'Error parsing the file'})
  }

  userData = json
  console.log('hola')
  return res.status(200).json({ data: json, message: 'El archivo se cargo correctamente'})
})


app.get( '/api/users' , async (req , res) => {

 const q = req.query 
 if (!q) {
    return res.status(500).json({
      message: "Debe de incluirse el query param"
    })
 }


 if (Array.isArray(q)) {
  return res.json({
    message: "q must be a string"
  })
 }
 
 const search = q.toLowerCase()

 const filteredData = userData.filter( row => {
    return Object
    .values(row) // Toma todas las propieades de un objeto y las convierte en un arrego de sus valores 
    .some( values => values.toLowerCase().includes(search))
 })

 return res.status(200).json({ data: filteredData})

})

app.listen(port, () => {
  console.log(`server running on port : http://localhost:${port}`);
});
 