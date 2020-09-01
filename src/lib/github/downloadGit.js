require('dotenv').config({ path: __dirname + './.env' })
const config = require('../../config/envVars');
const fetch = require('node-fetch');
const fs= require('fs')
const path = require('path');
 
// ESCRIBE EL ARCHIVO EN LA RUTA CON EL NOMBRE Y FORMATO LA DATA QUE SE DESCARGA DEL GITHUB 
function saveJsonFile(data, route){
  return new Promise( (resolve, reject)=>{
    
    let pathRoute = route.split('/');
    let filename = pathRoute.pop();
    let path = pathRoute.join('/')
      try {
        if(!fs.existsSync(path)){
            fs.mkdirSync(path, {recursive: true}, (err) => {
               if (err) throw err;          
              });
            fs.writeFile(path +'/'+filename, data, function(err) {
              if(err) {
                  reject(err);
              }
              //console.log("Archivo descargado en la carpeta nueva");
              resolve('ok');              
            });  
              
        }else {
            //console.log('La carpeta ya existe en la ruta seleccionada');
            fs.writeFile(path+'/'+filename, data, function(err) {
              if(err) {
                reject(err);
              }
              resolve('ok');
              //console.log("Archivo descargado en la carpeta existente");
            }); 
        }          
      } 
      catch (error) {
          reject(error);
      }
  });
}

// TODO: Configurar para recibir una carpeta con archivos e iterar sobre los archivos
function getFilesFromGithub(owner, repository, path){
  return new Promise( (resolve, reject)=>{   
    const apiUrl = "https://api.github.com/";
    let endpoint= "repos/"+owner+"/"+repository+"/contents/"+path;

    fetch(apiUrl + endpoint, {method:'GET', headers: {'Accept':'application/vnd.github.v3+json', 'Authorization' : 'Bearer ' + config.OAuthToken }})
    .then(response => response.json())
    .then((json)=>{
      //console.log(json);
      for (const i in json) {
        if(json[i]['type']!='dir'){
          fetch(json[i]['download_url'])
          .then(res=>res.buffer())
          .then((data)=>{  
            saveJsonFile(data, json[i]['path']);
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
        }else {
          //Si es directorio cambia el path al directorio y obtiene los archivos.
          getFilesFromGithub(owner, repository, path + '/' + json[i]['name']);
        }
      }      
    })
    .catch((err)=>{
      console.log(err);
      reject(err);
    });    
  });
}

module.exports = {saveJsonFile, getFilesFromGithub}
