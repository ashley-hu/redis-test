const socket = io();

document.addEventListener('DOMContentLoaded', init);
function init() {
    
    const btn = document.querySelector('#addBtn');
    const values = document.querySelector('#messages');

    btn.addEventListener('click', function(){

        const name = document.querySelector("#name").value;
        socket.emit('chat message', name);
    });

    socket.on('chat message', function(msg){
        const bleh = document.createElement('li');
        bleh.append(document.createTextNode(msg));
        values.append(bleh);
    });
}



