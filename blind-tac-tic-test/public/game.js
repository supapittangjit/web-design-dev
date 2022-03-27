// ref firebase
const ref_gameRoom = firebase.database().ref('Game');
const ref_totalRoom = firebase.database().ref('TotalRoom');
const ref_userProfile = firebase.database().ref('UserProfile');

// User Data
var userName = "";
var userPhoto = "";

// Set Up Container
Open_homepage();

function Close_homepage() {
    const homepage = document.getElementById('container-homepage');
    homepage.style.display = 'none';
}

function Open_homepage() {
    const homepage = document.getElementById('container-homepage');
    homepage.style.display = 'block';
    Close_lobby();
    Close_room();
    Close_game_table();
    join_room_num = '0';
    host_room_Num = '0';
}

function Close_lobby() {
    const lobby = document.getElementById('container-lobby');
    lobby.style.display = 'none';
}

function Open_lobby() {
    const lobby = document.getElementById('container-lobby');
    lobby.style.display = 'block';
    Close_homepage();
    Close_room();
    Close_game_table();
}

function Close_room() {
    const room = document.getElementById('container-room');
    room.style.display = 'none';
}

function Open_room() {
    const room = document.getElementById('container-room');
    room.style.display = 'block';
    Close_homepage();
    Close_lobby();
    Close_game_table();
}

function Close_game_table() {
    const game_table = document.getElementById('container-game-table');
    game_table.style.display = 'none';
}

function Open_game_table() {
    const game_table = document.getElementById('container-game-table');
    game_table.style.display = 'block';
    Close_homepage();
    Close_lobby();
    Close_room();
}

// ref_totalRoom.on('value', snapshot => {
//     snapshot.forEach(totalRoom => {
//         console.log(totalRoom);
//     })
// });

// create room
const btnCreateRoom = document.querySelector('#btn-create-room');
btnCreateRoom.addEventListener('click', createRoom);

function createRoom(event) {
    console.log("creating room...");
    // generate room info
    const roomID = guidGenerator();
    var roomNumber = 0;
    const roomType = "public";
    const roomStatus = "CREATED";
    var room_Num = '';
    ref_totalRoom.once('value', snapshot => {
        if (snapshot.child('totalroom').val() == 0) {
            roomNumber = 1;
        } else {
            roomNumber = snapshot.child('totalroom').val() + 1;
        }
        room_Num = padLeadingZeros(roomNumber, 5);
        console.log(room_Num);
        ref_totalRoom.update({
            ['totalroom']: roomNumber,
        });
        ref_gameRoom.child(room_Num).update({
            ["RoomID"]: roomID,
            ["RoomNum"]: room_Num,
            ["RoomName"]: userName,
            ["RoomType"]: roomType,
            ["RoomStatus"]: roomStatus,
        });
        // push data into database
        hostJoinRoom(room_Num);
    });
}

// random id for ID room
function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4());
}

function padLeadingZeros(num, size) {
    var s = num + "";
    if (s == "0") {
        s = "1"
    }
    while (s.length < size) s = "0" + s;
    return s;
}

// goto lobby
const btnGotoLobby = document.querySelector('#btn-goto-lobby');
btnGotoLobby.addEventListener('click', gotoLobby);

function gotoLobby(event) {
    console.log("Listing rooms...");
    Open_lobby();
    readRoomList();
}

// // refresh Room List
// const btnRefreshRoomList = document.querySelector('#btn-refresh-room-list');
// btnRefreshRoomList.addEventListener('click', readRoomList);

// read list of room from database
function readRoomList() {
    ref_gameRoom.on('value', snapshot => {
        document.getElementById("room-list").innerHTML = '';
        snapshot.forEach(room => {
            const roomName = room.child('RoomName').val();
            const roomStatus = room.child('RoomStatus').val();
            const roomType = room.child('RoomType').val();
            const room_Num = room.child('RoomNum').val();
            let template = document.createElement('template');
            if (roomType == 'public') {
                template.innerHTML = `<tr>
                    <th scope='row' class='align-middle'>${room_Num}</th>
                    <td class='align-middle'>${roomName}</td>
                    <td class='align-middle'>${roomStatus}</td>
                    <td class='align-middle'>${roomType}</td>
                    <td class='align-middle'>
                        <button class='btn btn-success btn-join-room-public' id='${room_Num}' type="button" >JOIN</button>
                    </td>
                </tr>`;
                join_room_num = room_Num;
            } else {
                template.innerHTML = `<tr>
                    <th scope='row' class='align-middle'>${room_Num}</th>
                    <td class='align-middle'>${roomName}</td>
                    <td class='align-middle'>${roomStatus}</td>
                    <td class='align-middle'>${roomType}</td>
                    <td class='align-middle'>
                        <button class='btn btn-success btn-join-room-private' id='${room_Num}' type="button" data-bs-toggle="modal"
                        data-bs-target="#modal-join-private">JOIN</button>
                    </td>
                </tr>`;
                document.querySelector("#modal-join-private-title").innerText = "Join Private Room : " + roomName;
                want_to_join_room_Num = room_Num;
            }
            let frag = template.content;
            document.getElementById("room-list").appendChild(frag);
        });
        document.querySelectorAll("button.btn-join-room-public").forEach(btn => {
            btn.addEventListener("click", joinRoom);
        });
    });
}

// Join Room
// Join Room from lobby

function joinRoom(event) {
    const room_Num = event.currentTarget.getAttribute('id');
    Open_room();
    join_room_num = room_Num;
    ref_gameRoom.child(room_Num).child('Player').update({
        ['Player_2_Photo']: userPhoto,
        ['Player_2_Name']: userName,
        ['Player_2_Status']: "Ready",
    });
    ref_gameRoom.child(room_Num).once('value', snapshot => {
        // set static info
        document.getElementById('room-num').innerText = "Room Number : " + snapshot.child('RoomNum').val();
        document.getElementById('room-id').innerText = "Room ID : " + snapshot.child('RoomID').val();
    });
    // set player 2 info (yourself)
    document.getElementById('player-2-photo').src = userPhoto;
    document.getElementById('player-2-name').innerText = "Name : " + userName;
    document.getElementById('player-2-status').innerText = "Status : Ready";
    document.getElementById('public').disabled = true;
    document.getElementById('private').disabled = true;

    ref_gameRoom.child(room_Num).on('value', snapshot => {
        if (snapshot.exists()) {
            // set player 1 info
            let room_type = snapshot.child('RoomType').val();
            document.getElementById(room_type).checked = true;
            document.getElementById('room-name').innerText = "Room Name : " + snapshot.child('RoomName').val();
            document.getElementById('player-1-photo').src = snapshot.child('Player').child('Player_1_Photo').val();
            document.getElementById('player-1-name').innerText = "Name : " + snapshot.child('Player').child('Player_1_Name').val();
            document.getElementById('player-1-status').innerText = "Status : " + snapshot.child('Player').child('Player_1_Status').val();
        } else {
            // ref_gameRoom.child(room_Num).off('value', snapshot);
            Open_homepage();
        }
    });

}
const joinPrivateModal = new bootstrap.Modal(document.querySelector("#modal-join-private"));
const joinPrivateRoomForm = document.querySelector("#join-private-room-form");
joinPrivateRoomForm.addEventListener("submit", checkJoinCode);
var want_to_join_room_Num = '0';
// Join Room from Code
const formJoinWithCode = document.querySelector('#form-join-with-code');
formJoinWithCode.addEventListener('submit', checkJoinCode);
var is_join_complete = false;
function checkJoinCode(event) {
    event.preventDefault();
    switch (event.currentTarget.id) {
        case 'form-join-with-code':
            ref_gameRoom.once('value', snapshot => {
                snapshot.forEach(room => {
                    if (room.child('RoomID').val() == formJoinWithCode['input-room-code'].value) {
                        is_join_complete = true;
                        join_room_num = room.child('RoomNum').val();
                        formJoinWithCode.reset();
                        joinRoomWithCode();
                    }
                });
            });
            break;
        case 'join-private-room-form':
            ref_gameRoom.child(want_to_join_room_Num).once('value', snapshot => {
                if (snapshot.child('RoomID').val() == joinPrivateRoomForm['join-private-room-input'].value) {
                    is_join_complete = true;
                    join_room_num = want_to_join_room_Num;
                    joinPrivateModal.hide();
                    joinPrivateRoomForm.reset();
                    joinRoomWithCode();
                }
            });
            break;
        default:
            is_join_complete = false;
            console.log(is_join_complete);
    }
}

function joinRoomWithCode(){
    if (is_join_complete) {
        console.log('Join With Code Complete');
        Open_room();
        var room_type = '';
        ref_gameRoom.child(join_room_num).once('value', snapshot => {
            room_type = snapshot.child('RoomType').val();
        });
        ref_gameRoom.child(join_room_num).child('Player').update({
            ['Player_2_Photo']: userPhoto,
            ['Player_2_Name']: userName,
            ['Player_2_Status']: "Ready",
        });
        ref_gameRoom.child(join_room_num).once('value', snapshot => {
            // set static info
            document.getElementById('room-num').innerText = "Room Number : " + snapshot.child('RoomNum').val();
            document.getElementById('room-id').innerText = "Room ID : " + snapshot.child('RoomID').val();
        });
        // set player 2 info (yourself)
        document.getElementById('player-2-photo').src = userPhoto;
        document.getElementById('player-2-name').innerText = "Name : " + userName;
        document.getElementById('player-2-status').innerText = "Status : Ready";
        document.getElementById('public').disabled = true;
        document.getElementById('private').disabled = true;

        ref_gameRoom.child(join_room_num).on('value', snapshot => {
            if (snapshot.exists()) {
                // set player 1 info
                room_type = snapshot.child('RoomType').val();
                document.getElementById(room_type).checked = true;
                document.getElementById('room-name').innerText = "Room Name : " + snapshot.child('RoomName').val();
                document.getElementById('player-1-photo').src = snapshot.child('Player').child('Player_1_Photo').val();
                document.getElementById('player-1-name').innerText = "Name : " + snapshot.child('Player').child('Player_1_Name').val();
                document.getElementById('player-1-status').innerText = "Status : " + snapshot.child('Player').child('Player_1_Status').val();
            } else {
                // ref_gameRoom.child(join_room_num).off('value', snapshot);
                Open_homepage();
            }
        });
    }
}

// Join Room from hosting
function hostJoinRoom(room_Num) {
    console.log(room_Num);
    Open_room();
    host_room_Num = room_Num;
    ref_gameRoom.child(room_Num).child('Player').update({
        ['Player_1_Photo']: userPhoto,
        ['Player_1_Name']: userName,
        ['Player_1_Status']: "Ready",
    });
    ref_gameRoom.child(room_Num).on('value', snapshot => {
        let room_type = snapshot.child('RoomType').val();
        document.getElementById(room_type).checked = true;
        document.getElementById('room-num').innerText = "Room Number : " + snapshot.child('RoomNum').val();
        document.getElementById('room-name').innerText = "Room Name : " + snapshot.child('RoomName').val();
        document.getElementById('room-id').innerText = "Room ID : " + snapshot.child('RoomID').val();
        document.getElementById('player-1-photo').src = userPhoto;
        document.getElementById('player-1-name').innerText = "Name : " + userName;
        document.getElementById('player-1-status').innerText = "Status : Ready";
        if (snapshot.child('Player').child('Player_2_Name').exists()) {
            document.getElementById('player-2-photo').src = snapshot.child('Player').child('Player_2_Photo').val();
            document.getElementById('player-2-name').innerText = "Name : " + snapshot.child('Player').child('Player_2_Name').val();
            document.getElementById('player-2-status').innerText = "Status : " + snapshot.child('Player').child('Player_2_Status').val();
        } else {
            document.getElementById('player-2-photo').src = 'default-user-photo.jpg';
            document.getElementById('player-2-name').innerText = "Name : ";
            document.getElementById('player-2-status').innerText = "Status : ";
        }
    });
    document.getElementById('btn-copyCode').disabled = false;
    document.getElementById('btn-copyCode').addEventListener('click', copyTextToClipboard);
}

function copyTextToClipboard(event) {
    // Copy the text inside the text field
    ref_gameRoom.child(host_room_Num).once('value', snapshot => {
        navigator.clipboard.writeText(snapshot.child('RoomID').val());
    });
}


// Leave
// Leave Room from join lobby
document.querySelectorAll('.btn-leave-room').forEach((btn) => {
    btn.addEventListener('click', leaveRoom);
});
var join_room_num = '0';

function leaveRoom(event) {
    if (host_room_Num != '0') {
        ref_gameRoom.child(host_room_Num).off('value');
        ref_gameRoom.child(host_room_Num).remove();
        host_room_Num = '0';
    }else if (join_room_num != '0') {
        ref_gameRoom.child(join_room_num).off('value');
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_Photo').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_Name').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_Status').remove();
        
    }
    Open_homepage();
}

// Leave Lobby
document.querySelectorAll('.btn-leave-lobby').forEach((btn) => {
    btn.addEventListener('click', leaveLobby);
});

function leaveLobby(event) {
    Open_homepage();
}

// host change room public/private
const radio_changeRoomType = document.querySelectorAll('input[name="RoomType"]');
radio_changeRoomType.forEach((radio_btn) => {
    radio_btn.addEventListener('click', changeRoomType);
});
var host_room_Num = '0';

function changeRoomType(event) {
    switch (event.currentTarget.id) {
        case 'public':
            ref_gameRoom.child(host_room_Num).update({
                ["RoomType"]: "public",
            });
            console.log("Changed Room Type to Public");
            break;
        case 'private':
            ref_gameRoom.child(host_room_Num).update({
                ["RoomType"]: "private",
            });
            console.log("Changed Room Type to Private");
            break;
    }
}



// set user value
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user.displayName);
        userName = user.displayName;
        userPhoto = user.photoURL;
        const todayDate = new Date();
        ref_userProfile.child(user.uid).update({
            ['LastLogInDate']: todayDate,
        });
    }
});