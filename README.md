# ServerSemilla
Proyecto CRUD base armado con Node.js/Express, rabbitmq y mongoDb

# Requisitos
* Node.js: Runtime de javascript
https://nodejs.org/en/download/
* Erlang: lenguaje en el que esta hecho RabbitMQ 
https://www.erlang.org/downloads
* RabbitMQ: Sistema de colas 
https://www.rabbitmq.com/download.html

# CONFIGURACION PARA RABBITMQ

Windows 10:

-Tras instalar Erlang hay que setear la variable de entorno del sistema para la carpeta donde está instalado Erlang.

-Luego vamos a la carpeta donde estén los binarios de RabbitMQ y ejecutamos el archivo rabbitmqctl.bat desde consola con permisos de administrador. 

-Por último se ejecuta rabbitmq-server.bat o rabbitmq-service.bat desde la consola para iniciar los brokers.

(server inicia los brokers como una aplicación / service los inicia como servicio) Tener en cuenta que se ejecuta una de las opciones, no  ambas, para este ejemplo se utilizo rabbitmq-server.bat

* DUDAS:
 - Esta bien agregarle la metadata (tiempo, url, etc..) a cada post?
 - Como manejo la capa para llamar a las bds, los separo en sql y nosql?
 - Como hago el manejo si quiero tener varias db con mongo por ejemplo?
 - Un cluster de MongoDb para cada cliente?
 - el front end tiene q conocer la estructura del back?
 - my_secret_key: variable de entorno, esta bien?
 - Como logeaer bien


*Roadmap:
 - Agregar bd sql (mariadb)
 - Manejar desconexión de las colas
 - Encriptar passwords
 - Hacer tests automáticos
