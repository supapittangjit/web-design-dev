// ref firebase
const ref_gameRoom = firebase.database().ref('Game');
const ref_totalRoom = firebase.database().ref('TotalRoom');

// Dummy Data
const userName_host = "Big";

// Set Up Container
Open_homepage();

function Close_homepage(){
    const homepage = document.getElementById('container-homepage');
    homepage.style.display = 'none';
}
function Open_homepage(){
    const homepage = document.getElementById('container-homepage');
    homepage.style.display = 'block';
    Close_lobby();
    Close_room();
    Close_game_table();
}
function Close_lobby(){
    const lobby = document.getElementById('container-lobby');
    lobby.style.display = 'none';
}
function Open_lobby(){
    const lobby = document.getElementById('container-lobby');
    lobby.style.display = 'block';
    Close_homepage();
    Close_room();
    Close_game_table();
}
function Close_room(){
    const room = document.getElementById('container-room');
    room.style.display = 'none';
}
function Open_room(){
    const room = document.getElementById('container-room');
    room.style.display = 'block';
    Close_homepage();
    Close_lobby();
    Close_game_table();
}
function Close_game_table(){
    const game_table = document.getElementById('container-game-table');
    game_table.style.display = 'none';
}
function Open_game_table(){
    const game_table = document.getElementById('container-game-table');
    game_table.style.display = 'block';
    Close_homepage();
    Close_lobby();
    Close_room();
}

ref_totalRoom.on('value', snapshot => {
    snapshot.forEach(totalRoom => {
        console.log(totalRoom);
    })
});

// create room
const btnCreateRoom = document.querySelector('#btn-create-room');
btnCreateRoom.addEventListener('click', createRoom);

function createRoom(event){
    console.log("creating room...");
    // generate room info
    const roomID = guidGenerator();
    var roomNumber = 0;
    ref_totalRoom.once('value', snapshot => {
        if(snapshot.child('totalroom').val() == 0){
            roomNumber = 1;
            console.log(roomNumber);
        }
        else{
            roomNumber = snapshot.child('totalroom').val()+1;
            console.log(roomNumber);
        }
    });
    
    
    const hostName = userName_host;
    // const hostPicture = "";
    const roomType = "public";
    const roomStatus = "CREATED";
    const room_Num = padLeadingZeros(roomNumber, 5);

    // push data into database
    ref_gameRoom.child(room_Num).update({
        ["RoomID"]: roomID,
        ["RoomNum"]: room_Num,
        ["RoomName"]: hostName,
        ["RoomType"]: roomType,
        ["RoomStatus"]: roomStatus,
    });
    ref_totalRoom.update({
        ['totalroom']: roomNumber,
    });
    hostJoinRoom(room_Num);
}

// random id for ID room
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4());
}
function padLeadingZeros(num, size) {
    var s = num+"";
    if (s == "0"){s="1"}
    while (s.length < size) s = "0" + s;
    return s;
}

// goto lobby
const btnGotoLobby = document.querySelector('#btn-goto-lobby');
btnGotoLobby.addEventListener('click', gotoLobby);

function gotoLobby(event){
    console.log("Listing rooms...");
    Open_lobby();
    readRoomList();
}

// read list of room from database
function readRoomList(){
    ref_gameRoom.on('value', snapshot => {
        document.getElementById("room-list").innerHTML = '';
        snapshot.forEach(room => {
            const roomName = room.child('RoomName').val();
            const roomStatus = room.child('RoomStatus').val();
            const roomType = room.child('RoomType').val();
            const room_Num = room.child('RoomNum').val();
            let template = document.createElement( 'template' );
            template.innerHTML = `<tr>
                                    <th scope='row' class='align-middle'>${room_Num}</th>
                                    <td class='align-middle'>${roomName}</td>
                                    <td class='align-middle'>${roomStatus}</td>
                                    <td class='align-middle'>${roomType}</td>
                                    <td class='align-middle'>
                                        <button class='btn btn-success btn-join-room' id='${room_Num}'>JOIN</button>
                                    </td>
                                </tr>`;
            let frag = template.content;
            document.getElementById("room-list").appendChild(frag);
        });
        document.querySelectorAll("button.btn-join-room").forEach(btn => {
            btn.addEventListener("click", joinRoom);
        });
    }); 
}

// Join Room
    // Join Room from lobby
function joinRoom(event){
    const room_Num = event.currentTarget.getAttribute('id');
    console.log(room_Num);
    var room_status = '';
    ref_gameRoom.on('value', snapshot =>{
        room_status = snapshot.child(room_Num).child('RoomStatus').val();
    });
    if(room_status == 'public'){
        Open_room();
        // document.getElementById('room-num');
        // document.getElementById('room-name');
        // document.getElementById('room-id');
    }else{
        // open modal to input room id
        console.log('pls enter the room-id');
    }
}
    // Join Room from Code
const formJoinWithCode = document.querySelector('#form-join-with-code');
formJoinWithCode.addEventListener('submit',joinRoomWithCode);
function joinRoomWithCode(event){
    const input_code = document.querySelector('#input-room-code').value;
    ref_gameRoom.on('value', snapshot => {
        // loop check code == room.id
    });
}
    // Join Room from hosting
function hostJoinRoom(room_Num){
    console.log(room_Num);
    Open_room();
    ref_gameRoom.child(room_Num).update({
        ['PlayerInRoom']: 1,        
    });
    ref_gameRoom.child(room_Num).child('Player').update({
        ['Player_1_Name']: userName_host,
        ['Player_1_Status']: "Ready",     
    });
    ref_gameRoom.on('value', snapshot => {
        let room_type = snapshot.child(room_Num).child('RoomType').val();
        document.getElementById(room_type).checked = true;
        document.getElementById('room-num').innerText = "Room Number : "+ snapshot.child(room_Num).child('RoomNum').val();
        document.getElementById('room-name').innerText = "Room Name : "+ snapshot.child(room_Num).child('RoomName').val();
        document.getElementById('room-id').innerText = "Room ID : "+ snapshot.child(room_Num).child('RoomID').val();
        document.getElementById('player-1-name').innerText = "Name : "+ userName_host;
        document.getElementById('player-1-status').innerText = "Status : Ready";
    });
}

// Leave
    // Leave Room from join lobby
    document.querySelectorAll('.btn-leave-room').forEach((btn) => {
        btn.addEventListener('click',leaveRoom);
    });
    function leaveRoom(event){
        
        Open_homepage();
    }
    // Leave Lobby
    document.querySelectorAll('.btn-leave-lobby').forEach((btn) => {
        btn.addEventListener('click',leaveLobby);
    });
    function leaveLobby(event){
        Open_homepage();
    }
