/* Importamos o express, que trata as rotas,
   Em seguida importamos o path, importação padrão do node
*/

const express = require('express');
const path = require('path');


/* Criamos o app do express,
   Cria um 'servidor' com o protocolo http,
   Criamos o server usando socket
*/
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

/* Informamos o diretório onde ficarão os arquivos publicos acessados pela aplicação
   Então criamos uma pasta 'public' no diretório da aplicação, local onde ficarão os arquivos front-end
   do projeto */
app.use(express.static(path.join(__dirname, 'public')));

/* Informamos que as views estão dentro de 'public' e que utilizaremos html */
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/* Quando acessarmos o endereço padrão a view index.html será renderizada, criamos
   este arquivo dentro de 'public' */

app.use('/',(req, res) => {
    res.render('index.html');
});
/* Array para armazenar as mensagens enviadas */
let messages = [];

/* Ligamos o io do tipo socket que irá informar quando houver uma nova conexão
   no endereço localhost:3000 
   
   O socket id é o id criado pelo sistema para cada usuário que se conectar*/
io.on('connection', socket => {       
    console.log(`Socket conectado: ${socket.id}`);


    socket.emit('previousMessage', messages);


    /* Recebe o objeto do html contendo o autor e a mensagem, o array messages armazena os
       dados recebidos */    
    socket.on('sendMessage', data => {
        messages.push(data)
         /* Envia o array para todos o usuários conectados na porta 3000 */
        socket.broadcast.emit('receivedMessage', data);     
    });
});

/* A porta 3000 será utilizada pelo servidor para comunicação */
server.listen(3000);
