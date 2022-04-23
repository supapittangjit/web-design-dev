// ref firebase
const ref_gameRoom = firebase.database().ref('Game');
const ref_totalRoom = firebase.database().ref('TotalRoom');
const ref_userProfile = firebase.database().ref('UserProfile');

// User Data
var userName = "";
var userPhoto = "";
var userUID = "";

// Set game-table var
const tableCols = document.querySelectorAll('.table-col');

// Symbol URL
const URL_x_symbol_1 = "https://i.imgur.com/I51vRRO.png";
const URL_o_symbol_1 = "https://i.imgur.com/1HLz1Ej.png";
const URL_triangle_symbol_1 = "https://i.imgur.com/AU3EJ1T.png";
const URL_unknown_symbol_1 = "https://i.imgur.com/Bq2XIeA.png";
const URL_unblind_1 = "https://i.imgur.com/NAhLfGQ.png";
const URL_protect_1 = "https://i.imgur.com/csNOioh.png";

const URL_x_symbol_2 = "https://i.imgur.com/4JmCiF3.png";
const URL_o_symbol_2 = "https://i.imgur.com/yCzPK1a.png";
const URL_triangle_symbol_2 = "https://i.imgur.com/zronXRJ.png";
const URL_unknown_symbol_2 = "https://i.imgur.com/AHspmxr.png";
const URL_unblind_2 = "https://i.imgur.com/4rLOfNI.png";
const URL_protect_2 = "https://i.imgur.com/WT4hrZe.png";

const URL_unblind_all = "https://i.imgur.com/cuoNGnq.png";
const URL_blank_box = "https://i.imgur.com/w64M65K.png";

// Set Up Container
// Open_homepage();

//Utility function:
const delay = ms => new Promise(res => setTimeout(res, ms));

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
    Close_ranking();
    Close_howtoplay();
    join_room_num = '0';
    host_room_Num = '0';
}
Open_homepage();

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
    Close_ranking();
    Close_howtoplay();
}

function Close_room() {
    const room = document.getElementById('container-room');
    room.style.display = 'none';
}

function Open_room() {
    const room = document.getElementById('container-room');
    room.style.display = 'block';
    tableCols.forEach(col => {
        col.querySelector('.col-layer-symbol').src = URL_blank_box;
        col.querySelector('.col-layer-help').src = URL_blank_box;
    });
    Close_homepage();
    Close_lobby();
    Close_game_table();
    Close_ranking();
    Close_howtoplay();
}

function Close_game_table() {
    const game_table = document.getElementById('container-game-table');
    game_table.style.display = 'none';
}

function Open_game_table() {
    tableCols.forEach(col => {
        col.querySelector('.col-layer-symbol').src = URL_blank_box;
        col.querySelector('.col-layer-help').src = URL_blank_box;
    });
    const game_table = document.getElementById('container-game-table');
    game_table.style.display = 'block';
    Close_homepage();
    Close_lobby();
    Close_room();
    Close_ranking();
    Close_howtoplay();
}

function Open_ranking(){
    Close_homepage();
    Close_lobby();
    Close_room();
    Close_game_table();
    Close_howtoplay();
    const container_ranking = document.getElementById('container-ranking');
    container_ranking.style.display = 'block';
}

function Close_ranking(){
    const container_ranking = document.getElementById('container-ranking');
    container_ranking.style.display = 'none';
}

function Open_howtoplay(){
    Close_homepage();
    Close_lobby();
    Close_room();
    Close_game_table();
    Close_ranking();
    const container_howtoplay = document.getElementById('container-howtoplay');
    container_howtoplay.style.display = 'block';
}

function Close_howtoplay(){
    const container_howtoplay = document.getElementById('container-howtoplay');
    container_howtoplay.style.display = 'none';
}

// create room
const btnCreateRoom = document.querySelector('#btn-create-room');
btnCreateRoom.addEventListener('click', createRoom);

function createRoom(event) {
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
            btn.addEventListener("click", check_P2_space);
        });
    });
}

// Join Room
// Join Room from lobby
var isRoomFull = false;
function check_P2_space(event) {
    const room_Num = event.currentTarget.getAttribute('id');
    ref_gameRoom.child(room_Num).once('value', snapshot => {
        if(snapshot.child('Player').child('Player_2_Name').exists()){
            isRoomFull = true;
        }
    });
    joinRoom(room_Num);
}

function joinRoom(room_Num) {
    if (isRoomFull) {
        console.log(isRoomFull);
        console.log('Room is full !!!');
        alert('Room is full !!!');
    } else {
        Open_room();
        join_room_num = room_Num;
        ref_gameRoom.child(room_Num).child('Player').update({
            ['Player_2_Photo']: userPhoto,
            ['Player_2_Name']: userName,
            ['Player_2_Status']: "Ready",
            ['Player_2_UID']: userUID,
        });
        ref_gameRoom.child(room_Num).once('value', snapshot => {
            // set static info
            document.getElementById('room-num').innerText = "Room Number : " + snapshot.child('RoomNum').val();
            document.getElementById('room-id').innerText = "Room ID : " + snapshot.child('RoomID').val();
        });
        set_gameUI_to_Blue();
        // set player 2 info (yourself)
        document.getElementById('player-2-photo').src = userPhoto;
        document.getElementById('player-2-name').innerText = "Name : " + userName;

        document.getElementById('public').disabled = true;
        document.getElementById('private').disabled = true;

        ref_gameRoom.child(room_Num).on('value', snapshot => {
            if (snapshot.exists()) {
                document.getElementById('player-2-status').innerText = "Status : " + snapshot.child('Player').child('Player_2_Status').val();
                // set player 1 info
                let room_type = snapshot.child('RoomType').val();
                document.getElementById(room_type).checked = true;
                document.getElementById('room-name').innerText = "Room Name : " + snapshot.child('RoomName').val();
                document.getElementById('player-1-photo').src = snapshot.child('Player').child('Player_1_Photo').val();
                document.getElementById('player-1-name').innerText = "Name : " + snapshot.child('Player').child('Player_1_Name').val();
                document.getElementById('player-1-status').innerText = "Status : " + snapshot.child('Player').child('Player_1_Status').val();
                if (snapshot.child('Surrender').exists()) {
                    if (snapshot.child('Surrender').val() == "host") {
                        btn_returnRoom.disabled = false;
                        btn_surrender.disabled = true;
                        console.log('host is surrender');
                        document.getElementById('text-game-result').innerText = "Player 1 (" + snapshot.child('Player').child('Player_1_Name').val() + ") is Surrender";
                        document.getElementById('text-turn-number').innerText = 'Turn : -';
                        document.getElementById('text-turn-side').innerText = 'Player : -';
                    } else if (snapshot.child('Surrender').val() == "join") {
                        ref_gameRoom.child(room_Num).update({
                            ['RoomStatus']: 'Waiting',
                        });
                    }
                } else {
                    btn_returnRoom.disabled = true;
                    btn_surrender.disabled = false;
                }
            } else {
                ref_gameRoom.child(room_Num).off('value');
                Open_homepage();
            }

            if (snapshot.child('RoomStatus').val() == 'PLAYING' && !snapshot.child('Surrender').exists()) {
                Open_game_table();
                runGameTable(snapshot, room_Num);
                show_symbol(snapshot, "PLAYER2");
                btn_returnHome.disabled = true;
                document.getElementById('text-game-result').innerText = "";
            } else if (snapshot.child('RoomStatus').val() == 'FINISH') {
                tableCols.forEach((col => {
                    col.disabled = true;
                    col.removeEventListener('click', Add_Or_Use_Selected_Symbol);
                }));
                revealing_vision(snapshot);
                if (snapshot.child('GameResult').val() == 'PLAYER1') {
                    document.getElementById('text-game-result').innerText = "Winner is " + snapshot.child('Player').child('Player_1_Name').val();
                } else if (snapshot.child('GameResult').val() == 'PLAYER2') {
                    document.getElementById('text-game-result').innerText = "Winner is " + snapshot.child('Player').child('Player_2_Name').val();
                } else { // DRAW
                    document.getElementById('text-game-result').innerText = "Game is DRAW";
                }
                btn_surrender.disabled = true;
                btn_returnHome.disabled = false;
                btn_returnRoom.disabled = false;
            }

            if (snapshot.child('RoomStatus').val() == 'Waiting' && snapshot.child('Player').child('Player_2_Status').val() == 'Playing') {
                revealing_vision(snapshot);
                tableCols.forEach((col => {
                    col.disabled = true;
                    col.removeEventListener('click', Add_Or_Use_Selected_Symbol);
                }));
            }
        });
    }
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
                        if (!room.child('Player').child('Player_2_Name').exists()) {
                            is_join_complete = true;
                            join_room_num = room.child('RoomNum').val();
                            formJoinWithCode.reset();
                            joinRoomWithCode();
                        } else {
                            alert('Room is full !!!');
                        }
                    }
                });
            });
            break;
        case 'join-private-room-form':
            ref_gameRoom.child(want_to_join_room_Num).once('value', snapshot => {
                if (snapshot.child('RoomID').val() == joinPrivateRoomForm['join-private-room-input'].value) {
                    if (!snapshot.child('Player').child('Player_2_Name').exists()) {
                        is_join_complete = true;
                        join_room_num = want_to_join_room_Num;
                        joinPrivateModal.hide();
                        joinPrivateRoomForm.reset();
                        joinRoomWithCode();
                    } else {
                        alert('Room is full !!!');
                    }
                }
            });
            break;
        default:
            is_join_complete = false;
    }
}

function joinRoomWithCode() {
    if (is_join_complete) {
        Open_room();
        var room_type = '';
        ref_gameRoom.child(join_room_num).once('value', snapshot => {
            room_type = snapshot.child('RoomType').val();
        });
        ref_gameRoom.child(join_room_num).child('Player').update({
            ['Player_2_Photo']: userPhoto,
            ['Player_2_Name']: userName,
            ['Player_2_Status']: "Ready",
            ['Player_2_UID']: userUID,
        });
        ref_gameRoom.child(join_room_num).once('value', snapshot => {
            // set static info
            document.getElementById('room-num').innerText = "Room Number : " + snapshot.child('RoomNum').val();
            document.getElementById('room-id').innerText = "Room ID : " + snapshot.child('RoomID').val();
        });
        set_gameUI_to_Blue();
        // set player 2 info (yourself)
        document.getElementById('player-2-photo').src = userPhoto;
        document.getElementById('player-2-name').innerText = "Name : " + userName;

        document.getElementById('public').disabled = true;
        document.getElementById('private').disabled = true;

        ref_gameRoom.child(join_room_num).on('value', snapshot => {
            if (snapshot.exists()) {
                document.getElementById('player-2-status').innerText = "Status : " + snapshot.child('Player').child('Player_2_Status').val();
                // set player 1 info
                let room_type = snapshot.child('RoomType').val();
                document.getElementById(room_type).checked = true;
                document.getElementById('room-name').innerText = "Room Name : " + snapshot.child('RoomName').val();
                document.getElementById('player-1-photo').src = snapshot.child('Player').child('Player_1_Photo').val();
                document.getElementById('player-1-name').innerText = "Name : " + snapshot.child('Player').child('Player_1_Name').val();
                document.getElementById('player-1-status').innerText = "Status : " + snapshot.child('Player').child('Player_1_Status').val();
                if (snapshot.child('Surrender').exists()) {
                    if (snapshot.child('Surrender').val() == "host") {
                        btn_returnRoom.disabled = false;
                        btn_surrender.disabled = true;
                        console.log('host is surrender');
                        document.getElementById('text-game-result').innerText = "Player 1 (" + snapshot.child('Player').child('Player_1_Name').val() + ") is Surrender";
                        document.getElementById('text-turn-number').innerText = 'Turn : -';
                        document.getElementById('text-turn-side').innerText = 'Player : -';
                    } else if (snapshot.child('Surrender').val() == "join") {
                        ref_gameRoom.child(join_room_num).update({
                            ['RoomStatus']: 'Waiting',
                        });
                    }
                } else {
                    btn_returnRoom.disabled = true;
                    btn_surrender.disabled = false;
                }
            } else {
                ref_gameRoom.child(join_room_num).off('value');
                Open_homepage();
            }

            if (snapshot.child('RoomStatus').val() == 'PLAYING' && !snapshot.child('Surrender').exists()) {
                Open_game_table();
                runGameTable(snapshot, join_room_num);
                show_symbol(snapshot, "PLAYER2");
                btn_returnHome.disabled = true;
                document.getElementById('text-game-result').innerText = "";
            } else if (snapshot.child('RoomStatus').val() == 'FINISH') {
                tableCols.forEach((col => {
                    col.disabled = true;
                    col.removeEventListener('click', Add_Or_Use_Selected_Symbol);
                }));
                revealing_vision(snapshot);
                if (snapshot.child('GameResult').val() == 'PLAYER1') {
                    document.getElementById('text-game-result').innerText = "Winner is " + snapshot.child('Player').child('Player_1_Name').val();
                } else if (snapshot.child('GameResult').val() == 'PLAYER2') {
                    document.getElementById('text-game-result').innerText = "Winner is " + snapshot.child('Player').child('Player_2_Name').val();
                } else { // DRAW
                    document.getElementById('text-game-result').innerText = "Game is DRAW";
                }
                btn_surrender.disabled = true;
                btn_returnHome.disabled = false;
                btn_returnRoom.disabled = false;
            }

            if (snapshot.child('RoomStatus').val() == 'Waiting' && snapshot.child('Player').child('Player_2_Status').val() == 'Playing') {
                revealing_vision(snapshot);
                tableCols.forEach((col => {
                    col.disabled = true;
                    col.removeEventListener('click', Add_Or_Use_Selected_Symbol);
                }));
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
        ['Player_1_UID']: userUID,
    });
    set_gameUI_to_Red();
    ref_gameRoom.child(room_Num).on('value', snapshot => {
        let room_type = snapshot.child('RoomType').val();
        document.getElementById(room_type).checked = true;
        document.getElementById('room-num').innerText = "Room Number : " + snapshot.child('RoomNum').val();
        document.getElementById('room-name').innerText = "Room Name : " + snapshot.child('RoomName').val();
        document.getElementById('room-id').innerText = "Room ID : " + snapshot.child('RoomID').val();
        document.getElementById('player-1-photo').src = userPhoto;
        document.getElementById('player-1-name').innerText = "Name : " + userName;
        document.getElementById('player-1-status').innerText = "Status : " + snapshot.child('Player').child('Player_1_Status').val();
        if (snapshot.child('Player').child('Player_2_Name').exists()) {
            document.getElementById('player-2-photo').src = snapshot.child('Player').child('Player_2_Photo').val();
            document.getElementById('player-2-name').innerText = "Name : " + snapshot.child('Player').child('Player_2_Name').val();
            document.getElementById('player-2-status').innerText = "Status : " + snapshot.child('Player').child('Player_2_Status').val();
            if (snapshot.child('Surrender').exists()) {
                btnStartGame.disabled = true;
                if (snapshot.child('Surrender').val() == "host") {
                    console.log('host is surrender');
                    ref_gameRoom.child(room_Num).update({
                        ['RoomStatus']: 'Waiting',
                    });
                } else if (snapshot.child('Surrender').val() == "join") {
                    console.log('join is surrender');
                    document.getElementById('text-game-result').innerText = "Player 2 (" + snapshot.child('Player').child('Player_2_Name').val() + ") is Surrender";
                    document.getElementById('text-turn-number').innerText = 'Turn : -';
                    document.getElementById('text-turn-side').innerText = 'Player : -';

                }

                if (snapshot.child('Player').child('Player_1_Status').val() == 'Ready' && snapshot.child('Player').child('Player_2_Status').val() == 'Ready') {
                    const changestatewithdelay = async () => {
                        ref_gameRoom.child(room_Num).child('Surrender').remove();
                        ref_gameRoom.child(host_room_Num).child('table').remove();
                        btn_leaveRooms.forEach((btn) => {
                            btn.disabled = true;
                        });
                        await delay(1000);
                        console.log("Waited 1s");
                        ref_gameRoom.child(room_Num).update({
                            ['RoomStatus']: 'Ready',
                        });
                        await delay(1000);
                        console.log("Waited 1s");
                        btn_leaveRooms.forEach((btn) => {
                            btn.disabled = false;
                        });
                    };
                    changestatewithdelay();
                }
            } else if (snapshot.child('RoomStatus').val() == 'Ready') {
                btnStartGame.disabled = false;
            } else if (snapshot.child('RoomStatus').val() == 'CREATED') {
                if (snapshot.child('Player').child('Player_1_Status').val() == 'Ready' && snapshot.child('Player').child('Player_2_Status').val() == 'Ready') {
                    const changestatewithdelay = async () => {
                        ref_gameRoom.child(room_Num).child('Surrender').remove();
                        await delay(1000);
                        console.log("Waited 1s");
                        ref_gameRoom.child(room_Num).update({
                            ['RoomStatus']: 'Ready',
                        });
                    };
                    changestatewithdelay();
                }
            }

        } else {
            document.getElementById('player-2-photo').src = 'default-user-photo.jpg';
            document.getElementById('player-2-name').innerText = "Name : ";
            document.getElementById('player-2-status').innerText = "Status : ";
            btnStartGame.disabled = true;
        }


        if (snapshot.child('RoomStatus').val() == 'PLAYING') {
            runGameTable(snapshot, room_Num);
            show_symbol(snapshot, "PLAYER1");
            if (snapshot.child('Surrender').exists()) {
                revealing_vision(snapshot);
                if (snapshot.child('Surrender').val() == "join") {
                    btn_returnRoom.disabled = false;
                    btn_surrender.disabled = true;
                }
            } else {
                btn_returnRoom.disabled = true;
                btn_surrender.disabled = false;
            }
            btn_returnHome.disabled = true;
            btnStartGame.disabled = true;
        } else if (snapshot.child('RoomStatus').val() == 'FINISH') {
            tableCols.forEach((col => {
                col.disabled = true;
                col.removeEventListener('click', Add_Or_Use_Selected_Symbol);
            }));
            revealing_vision(snapshot);
            if (snapshot.child('GameResult').val() == 'PLAYER1') {
                document.getElementById('text-game-result').innerText = "Winner is " + snapshot.child('Player').child('Player_1_Name').val();
            } else if (snapshot.child('GameResult').val() == 'PLAYER2') {
                document.getElementById('text-game-result').innerText = "Winner is " + snapshot.child('Player').child('Player_2_Name').val();
            } else { // DRAW
                document.getElementById('text-game-result').innerText = "Game is DRAW";
            }
            btn_surrender.disabled = true;
            btn_returnHome.disabled = false;
            btn_returnRoom.disabled = false;
            if (snapshot.child('Player').child('Player_1_Status').val() == 'Ready' && snapshot.child('Player').child('Player_2_Status').val() == 'Ready') {
                const changestatewithdelay = async () => {
                    await delay(1000);
                    console.log("Waited 1s");
                    ref_gameRoom.child(room_Num).update({
                        ['RoomStatus']: 'Ready',
                    });
                };
                changestatewithdelay();
            }
        } else if (snapshot.child('RoomStatus').val() == 'Waiting' && snapshot.child('Player').child('Player_1_Status').val() == 'Playing') {
            tableCols.forEach((col => {
                col.disabled = true;
                col.removeEventListener('click', Add_Or_Use_Selected_Symbol);
            }));

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

function set_gameUI_to_Red(){
    document.getElementById('img-x').src = URL_x_symbol_1;
    document.getElementById('img-o').src = URL_o_symbol_1;
    document.getElementById('img-tri').src = URL_triangle_symbol_1;
    document.getElementById('img-unblind').src = URL_unblind_1;
    document.getElementById('img-protect').src = URL_protect_1;
}

function set_gameUI_to_Blue(){
    document.getElementById('img-x').src = URL_x_symbol_2;
    document.getElementById('img-o').src = URL_o_symbol_2;
    document.getElementById('img-tri').src = URL_triangle_symbol_2;
    document.getElementById('img-unblind').src = URL_unblind_2;
    document.getElementById('img-protect').src = URL_protect_2;
}


// Leave
// Leave Room from join lobby
const btn_leaveRooms = document.querySelectorAll('.btn-leave-room');
btn_leaveRooms.forEach((btn) => {
    btn.addEventListener('click', leaveRoom);
});
var join_room_num = '0';

function leaveRoom(event) {
    if (host_room_Num != '0') {
        ref_gameRoom.child(host_room_Num).off('value');
        ref_gameRoom.child(host_room_Num).remove();
        host_room_Num = '0';
    } else if (join_room_num != '0') {
        ref_gameRoom.child(join_room_num).off('value');
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_Photo').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_Name').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_Status').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_UID').remove();
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

// Start Game btn
const btnStartGame = document.getElementById('btn-start-game');
btnStartGame.addEventListener('click', startGame);



function startGame(event) {
    document.getElementById('text-game-result').innerText = "";
    var firstPlayer = Math.floor(Math.random() * 2);
    if (firstPlayer == 0) {
        firstPlayer = 'PLAYER1';
    } else {
        firstPlayer = 'PLAYER2';
    }
    ref_gameRoom.child(host_room_Num).update({
        ['turn_side']: firstPlayer,
        ['first_Player']: firstPlayer,
        ['turn_number']: 1,
        ['RoomStatus']: 'PLAYING',
    });
    ref_gameRoom.child(host_room_Num).child('Player').update({
        ['Player_1_Status']: 'Playing',
        ['P1_UNBLIND_left']: 2,
        ['P1_PROTECT_left']: 2,
        ['Player_2_Status']: 'Playing',
        ['P2_UNBLIND_left']: 2,
        ['P2_PROTECT_left']: 2,
    });
    Open_game_table();
    tableCols.forEach((col => {
        col.querySelector('.col-layer-symbol').src = URL_blank_box;
        col.querySelector('.col-layer-help').src = URL_blank_box;
        ref_gameRoom.child(host_room_Num).child('table').child(col.id).update({
            ['symbol']: "no",
            ['placer']: "no",
            ['visible']: "no",
        });
    }));
}

function runGameTable(snapshot, roomNum) {
    var turn_side = snapshot.child('turn_side').val();
    var turn_number = snapshot.child('turn_number').val();
    const text_turn_number = document.getElementById('text-turn-number');
    const text_turn_side = document.getElementById('text-turn-side');
    P1_UID = snapshot.child('Player').child('Player_1_UID').val();
    P2_UID = snapshot.child('Player').child('Player_2_UID').val();

    text_turn_number.innerText = 'Turn : ' + turn_number;


    if (turn_side == 'PLAYER1') {
        text_turn_side.innerText = 'Player : ' + snapshot.child('Player').child('Player_1_Name').val();

        if (userUID == snapshot.child('Player').child('Player_1_UID').val()) {
            tableCols.forEach((col => {
                col.disabled = false;
                col.addEventListener('click', Add_Or_Use_Selected_Symbol, false);
                col.roomNum = roomNum;
                col.turnSide = turn_side;
            }));
        } else {
            tableCols.forEach((col => {
                col.disabled = true;
                col.removeEventListener('click', Add_Or_Use_Selected_Symbol);
            }));
        }
    } else if (turn_side == 'PLAYER2') {
        text_turn_side.innerText = 'Player : ' + snapshot.child('Player').child('Player_2_Name').val();

        if (userUID == snapshot.child('Player').child('Player_2_UID').val()) {
            tableCols.forEach((col => {
                col.disabled = false;
                col.addEventListener('click', Add_Or_Use_Selected_Symbol, false);
                col.roomNum = roomNum;
                col.turnSide = turn_side;
            }));
        } else {
            tableCols.forEach((col => {
                col.disabled = true;
                col.removeEventListener('click', Add_Or_Use_Selected_Symbol);
            }));
        }
    }
}

function show_symbol(snapshot, player_side) {
    tableCols.forEach((col => {
        /* 
        .child('table').child(col.id).child('symbol')
        .child(col.id).child('placer')
        .child(col.id).child('visible')
        symbol {"no" / 'o' / 'x' / 't'} t=triangle
        placer {"no" / 'PLAYER1' / 'PLAYER2'}
        visible {"no" / 'NORMAL' / 'BREAK-1' / 'BREAK-2' / 'BREAK-ALL' / 'BREAK-1-FAIL' / 'BREAK-2-FAIL' / 'BLOCK-1' / 'BLOCK-2' / 'BLOCK-1-ALERT' / 'BLOCK-2-ALERT' } 
            "no" => No symbol
            'NORMAL'=> Placer can see only
            'BREAK-1','BREAK-2' => can see opposite symbol
            'BREAK-FAIL' => when UNBLIND and PROTECT in same col , symbol will change to unknown if you are not placer and all side can see PROTECT symbol
            'BLOCK-1','BLOCK-2' => when UNBLIND use at col that 'BLOCK' , other side can not see the real symbol but Change 'BLOCK' to 'BREAK-FAIL'
            'BLOCK-FAIL' => when use PROTECT on opposite PROTECT , 'BLOCK' will change to 'BLOCK-FAIL' all side can see PROTECT symbol
        */
        if (player_side == "PLAYER1") {
            if (snapshot.child('table').child(col.id).child('placer').val() == player_side) {
                // 'PLAYER1', any => see
                if (snapshot.child('table').child(col.id).child('symbol').val() == 'x') {
                    show_symbol_X(col.id, player_side);
                } else if (snapshot.child('table').child(col.id).child('symbol').val() == 'o') {
                    show_symbol_O(col.id, player_side);
                } else if (snapshot.child('table').child(col.id).child('symbol').val() == 't') {
                    show_symbol_Triangle(col.id, player_side);
                }

                if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-1' || snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-ALL') {
                    show_symbol_Unblind(col.id, player_side);
                }
                if (snapshot.child('table').child(col.id).child('visible').val() == 'BLOCK-1') {
                    show_symbol_Protect(col.id, player_side);
                }
            } else if (snapshot.child('table').child(col.id).child('placer').val() == "PLAYER2") {
                if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-1' || snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-ALL') {
                    // 'PLAYER2','BREAK-1' / 'PLAYER2','BREAK-ALL' => ?
                    show_symbol_Unblind(col.id, player_side);
                    if (snapshot.child('table').child(col.id).child('symbol').val() == 'x') {
                        show_symbol_X(col.id, "PLAYER2");
                    } else if (snapshot.child('table').child(col.id).child('symbol').val() == 'o') {
                        show_symbol_O(col.id, "PLAYER2");
                    } else if (snapshot.child('table').child(col.id).child('symbol').val() == 't') {
                        show_symbol_Triangle(col.id, "PLAYER2");
                    }

                } else {
                    // 'PLAYER2','NORMAL' / 'PLAYER2','BLOCK-2' / 'PLAYER2','BREAK-2' / 'PLAYER2','BLOCK-FAIL' / 'PLAYER2','BREAK-FAIL' => ?
                    show_symbol_Unknown(col.id, "PLAYER2");
                }
            } else if (snapshot.child('table').child(col.id).child('placer').val() == "no") {
                if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-1' || snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-ALL') {
                    show_symbol_Unblind(col.id, player_side);
                } else if (snapshot.child('table').child(col.id).child('visible').val() == 'BLOCK-1') {
                    show_symbol_Protect(col.id, player_side);
                }
            }

            if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-1-FAIL') {
                // BREAK-1 use on BLOCK-2 => 'BREAK-1-FAIL'
                // PLAYER1 will see PROTECT (BLOCK-2) & ALERT
                // PLAYER2 will see PROTECT (BLOCK-2) &  ALERT
                show_symbol_Protect(col.id, "PLAYER2");
                // show ALERT
            }
            if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-2-FAIL') {
                // BREAK-2 use on BLOCK-1 => 'BREAK-2-FAIL'
                // PLAYER2 will see PROTECT (BLOCK-1) & ALERT
                // PLAYER1 will see PROTECT (BLOCK-1) & ALERT
                show_symbol_Protect(col.id, "PLAYER1");
                // show ALERT
            }
            if (snapshot.child('table').child(col.id).child('visible').val() == 'BLOCK-1-ALERT') {
                // BLOCK-2 use on BLOCK-1 => 'BLOCK-1-ALERT'
                // PLAYER2 will see PROTECT (BLOCK-1) & ALERT
                // PLAYER1 will see PROTECT (BLOCK-1) & ALERT
                show_symbol_Protect(col.id, "PLAYER1");
                // show ALERT
            }
            if (snapshot.child('table').child(col.id).child('visible').val() == 'BLOCK-2-ALERT') {
                // BLOCK-1 use on BLOCK-2 => 'BLOCK-2-ALERT'
                // PLAYER1 will see PROTECT (BLOCK-2) & ALERT
                // PLAYER2 will see PROTECT (BLOCK-2) & ALERT
                show_symbol_Protect(col.id, "PLAYER2");
                // show ALERT
            }
        } else if (player_side == "PLAYER2") {
            if (snapshot.child('table').child(col.id).child('placer').val() == player_side) {
                // 'PLAYER2', any => see
                if (snapshot.child('table').child(col.id).child('symbol').val() == 'x') {
                    show_symbol_X(col.id, player_side);
                } else if (snapshot.child('table').child(col.id).child('symbol').val() == 'o') {
                    show_symbol_O(col.id, player_side);
                } else if (snapshot.child('table').child(col.id).child('symbol').val() == 't') {
                    show_symbol_Triangle(col.id, player_side);
                }

                if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-2' || snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-ALL') {
                    show_symbol_Unblind(col.id, player_side);
                } else if (snapshot.child('table').child(col.id).child('visible').val() == 'BLOCK-2') {
                    show_symbol_Protect(col.id, player_side);
                }
            } else if (snapshot.child('table').child(col.id).child('placer').val() == "PLAYER1") {
                if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-2' || snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-ALL') {
                    // 'PLAYER1','BREAK-2' / 'PLAYER1','BREAK-ALL' => ?
                    show_symbol_Unblind(col.id, player_side);
                    if (snapshot.child('table').child(col.id).child('symbol').val() == 'x') {
                        show_symbol_X(col.id, "PLAYER1");
                    } else if (snapshot.child('table').child(col.id).child('symbol').val() == 'o') {
                        show_symbol_O(col.id, "PLAYER1");
                    } else if (snapshot.child('table').child(col.id).child('symbol').val() == 't') {
                        show_symbol_Triangle(col.id, "PLAYER1");
                    }
                } else {
                    // 'PLAYER1','NORMAL' / 'PLAYER1','BLOCK-1' / 'PLAYER1','BREAK-1' / 'PLAYER1','BLOCK-FAIL' / 'PLAYER1','BREAK-FAIL' => ?
                    show_symbol_Unknown(col.id, "PLAYER1");
                }
            } else if (snapshot.child('table').child(col.id).child('placer').val() == "no") {
                if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-2' || snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-ALL') {
                    show_symbol_Unblind(col.id, player_side);
                } else if (snapshot.child('table').child(col.id).child('visible').val() == 'BLOCK-2') {
                    show_symbol_Protect(col.id, player_side);
                }
            }

            if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-1-FAIL') {
                // BREAK-1 use on BLOCK-2 => 'BREAK-1-FAIL'
                // PLAYER1 will see PROTECT (BLOCK-2) & ALERT
                // PLAYER2 will see PROTECT (BLOCK-2) &  ALERT
                show_symbol_Protect(col.id, "PLAYER2");
                // show ALERT
            }
            if (snapshot.child('table').child(col.id).child('visible').val() == 'BREAK-2-FAIL') {
                // BREAK-2 use on BLOCK-1 => 'BREAK-2-FAIL'
                // PLAYER2 will see PROTECT (BLOCK-1) & ALERT
                // PLAYER1 will see PROTECT (BLOCK-1) & ALERT
                show_symbol_Protect(col.id, "PLAYER1");
                // show ALERT
            }
            if (snapshot.child('table').child(col.id).child('visible').val() == 'BLOCK-1-ALERT') {
                // BLOCK-2 use on BLOCK-1 => 'BLOCK-1-ALERT'
                // PLAYER2 will see PROTECT (BLOCK-1) & ALERT
                // PLAYER1 will see PROTECT (BLOCK-1) & ALERT
                show_symbol_Protect(col.id, "PLAYER1");
                // show ALERT
            }
            if (snapshot.child('table').child(col.id).child('visible').val() == 'BLOCK-2-ALERT') {
                // BLOCK-1 use on BLOCK-2 => 'BLOCK-2-ALERT'
                // PLAYER1 will see PROTECT (BLOCK-2) & ALERT
                // PLAYER2 will see PROTECT (BLOCK-2) & ALERT
                show_symbol_Protect(col.id, "PLAYER2");
                // show ALERT
            }
        }
    }));
}

function Add_Or_Use_Selected_Symbol(event) {
    var col_id = event.currentTarget.id;
    var roomNum = event.currentTarget.roomNum;
    var turn_side = event.currentTarget.turnSide;
    if (document.querySelector('input[name="selecter"]:checked') != null) {
        var selectedSymbol = document.querySelector('input[name="selecter"]:checked').value;
        if (selectedSymbol == 'x-symbol') {
            add_X_toCol(col_id, roomNum, turn_side);
        } else if (selectedSymbol == 'o-symbol') {
            add_O_toCol(col_id, roomNum, turn_side);
        } else if (selectedSymbol == 'triangle') {
            add_Triangle_toCol(col_id, roomNum, turn_side);
        } else if (selectedSymbol == 'unblind') {
            useHelp_UNBLIND_toCol(col_id, roomNum, turn_side);
        } else if (selectedSymbol == 'protect') {
            useHelp_PROTECT_toCol(col_id, roomNum, turn_side);
        }
    } else {
        console.log('please select symbol or help');
    }
}

// place & change side
function add_X_toCol(col_id, roomNum, turn_side) {
    ref_gameRoom.child(roomNum).once('value', tableData => {
        if (tableData.child('table').child(col_id).child('symbol').val() == "no") {
            if (tableData.child('table').child(col_id).child('visible').val() == "no") {
                ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                    ['symbol']: 'x',
                    ['placer']: turn_side,
                    ['visible']: 'NORMAL',
                });
            } else {
                ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                    ['symbol']: 'x',
                    ['placer']: turn_side,
                });
            }

            var game_result = gameResult(roomNum);
            // turn_side win => 'win'
            if (game_result == 'win') {
                ref_gameRoom.child(roomNum).update({
                    ['RoomStatus']: 'FINISH',
                    ['GameResult']: turn_side,
                });
                if (turn_side == 'PLAYER1') {
                    give_reward(roomNum, 'P1-win');
                } else {
                    give_reward(roomNum, 'P2-win');
                }
                btn_returnRoom.disabled = false;
                btn_returnHome.disabled = false;
                btn_surrender.disabled = true;
            }
            // no space for next turn_side & turn_side not win => 'draw'
            else if (game_result == 'draw') {
                ref_gameRoom.child(roomNum).update({
                    ['RoomStatus']: 'FINISH',
                    ['GameResult']: 'DRAW',
                });
                give_reward(roomNum, 'draw');
                btn_returnRoom.disabled = false;
                btn_returnHome.disabled = false;
                btn_surrender.disabled = true;
            }
            // turn_side not win & have space left => 'no'
            else {
                changeSide(roomNum, turn_side);
            }
        } else if (tableData.child('table').child(col_id).child('symbol').val() != "no") {
            console.log('can not place here!');
        }
    });
}

function add_O_toCol(col_id, roomNum, turn_side) {
    ref_gameRoom.child(roomNum).once('value', tableData => {
        if (tableData.child('table').child(col_id).child('symbol').val() == "no") {
            if (tableData.child('table').child(col_id).child('visible').val() == "no") {
                ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                    ['symbol']: 'o',
                    ['placer']: turn_side,
                    ['visible']: 'NORMAL',
                });
            } else {
                ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                    ['symbol']: 'o',
                    ['placer']: turn_side,
                });
            }


            var game_result = gameResult(roomNum);
            // turn_side win => 'win'
            if (game_result == 'win') {
                ref_gameRoom.child(roomNum).update({
                    ['RoomStatus']: 'FINISH',
                    ['GameResult']: turn_side,
                });
                if (turn_side == 'PLAYER1') {
                    give_reward(roomNum, 'P1-win');
                } else {
                    give_reward(roomNum, 'P2-win');
                }
                btn_returnRoom.disabled = false;
                btn_returnHome.disabled = false;
                btn_surrender.disabled = true;
            }
            // no space for next turn_side & turn_side not win => 'draw'
            else if (game_result == 'draw') {
                ref_gameRoom.child(roomNum).update({
                    ['RoomStatus']: 'FINISH',
                    ['GameResult']: 'DRAW',
                });
                give_reward(roomNum, 'draw');
                btn_returnRoom.disabled = false;
                btn_returnHome.disabled = false;
                btn_surrender.disabled = true;
            }
            // turn_side not win & have space left => 'no'
            else {
                changeSide(roomNum, turn_side);
            }
        } else if (tableData.child('table').child(col_id).child('symbol').val() != "no") {
            console.log('can not place here!');
        }
    });
}

function add_Triangle_toCol(col_id, roomNum, turn_side) {
    ref_gameRoom.child(roomNum).once('value', tableData => {
        if (tableData.child('table').child(col_id).child('symbol').val() == "no") {
            if (tableData.child('table').child(col_id).child('visible').val() == "no") {
                ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                    ['symbol']: 't',
                    ['placer']: turn_side,
                    ['visible']: 'NORMAL',
                });
            } else {
                ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                    ['symbol']: 't',
                    ['placer']: turn_side,
                });
            }

            var game_result = gameResult(roomNum);
            // turn_side win => 'win'
            if (game_result == 'win') {
                ref_gameRoom.child(roomNum).update({
                    ['RoomStatus']: 'FINISH',
                    ['GameResult']: turn_side,
                });
                if (turn_side == 'PLAYER1') {
                    give_reward(roomNum, 'P1-win');
                } else {
                    give_reward(roomNum, 'P2-win');
                }
                btn_returnRoom.disabled = false;
                btn_returnHome.disabled = false;
                btn_surrender.disabled = true;
            }
            // no space for next turn_side & turn_side not win => 'draw'
            else if (game_result == 'draw') {
                ref_gameRoom.child(roomNum).update({
                    ['RoomStatus']: 'FINISH',
                    ['GameResult']: 'DRAW',
                });
                give_reward(roomNum, 'draw');
                btn_returnRoom.disabled = false;
                btn_returnHome.disabled = false;
                btn_surrender.disabled = true;
            }
            // turn_side not win & have space left => 'no'
            else {
                changeSide(roomNum, turn_side);
            }
        } else if (tableData.child('table').child(col_id).child('symbol').val() != "no") {
            console.log('can not place here!');
        }
    });
}

// place but not change side
function useHelp_UNBLIND_toCol(col_id, roomNum, turn_side) {
    ref_gameRoom.child(roomNum).once('value', tableData => {
        if (turn_side == 'PLAYER1') {
            if (tableData.child('Player').child('P1_UNBLIND_left').val() > 0) {
                // PLAYER1 can use UNBLIND
                var new_P1_UNBLIND_left = tableData.child('Player').child('P1_UNBLIND_left').val() - 1;
                if (tableData.child('table').child(col_id).child('visible').val() == "NORMAL" || tableData.child('table').child(col_id).child('visible').val() == "no" || tableData.child('table').child(col_id).child('visible').val() == "BLOCK-1" || tableData.child('table').child(col_id).child('visible').val() == "BLOCK-1-ALERT") {
                    // any placer change visible "NORMAL" or "no" or 'BLOCK-1' to 'BREAK-1' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BREAK-1',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P1_UNBLIND_left']: new_P1_UNBLIND_left,
                    });
                } else if (tableData.child('table').child(col_id).child('visible').val() == "BREAK-2") {
                    // use 'BREAK-1' on "BREAK-2" => 'BREAK-ALL' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BREAK-ALL',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P1_UNBLIND_left']: new_P1_UNBLIND_left,
                    });
                } else if (tableData.child('table').child(col_id).child('visible').val() == "BLOCK-2") {
                    // use 'BREAK-1' on "BLOCK-2" => 'BREAK-1-FAIL' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BREAK-1-FAIL',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P1_UNBLIND_left']: new_P1_UNBLIND_left,
                    });
                } else {
                    // 'BREAK-1' on ("BREAK-1" || "BREAK-1-FAIL" || "BLOCK-2-ALERT")
                    console.log("Can't Use Here!");
                }
            } else {
                console.log("Not Enough UNBLIND Help point left !!!");
            }
        } else {
            if (tableData.child('Player').child('P2_UNBLIND_left').val() > 0) {
                // PLAYER2 can use UNBLIND
                var new_P2_UNBLIND_left = tableData.child('Player').child('P2_UNBLIND_left').val() - 1;
                if (tableData.child('table').child(col_id).child('visible').val() == "NORMAL" || tableData.child('table').child(col_id).child('visible').val() == "no" || tableData.child('table').child(col_id).child('visible').val() == "BLOCK-2" || tableData.child('table').child(col_id).child('visible').val() == "BLOCK-2-ALERT") {
                    // any placer change visible "NORMAL" or "no" or 'BLOCK-2' to 'BREAK-2' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BREAK-2',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P2_UNBLIND_left']: new_P2_UNBLIND_left,
                    });
                } else if (tableData.child('table').child(col_id).child('visible').val() == "BREAK-1") {
                    // use 'BREAK-2' on "BREAK-1" => 'BREAK-ALL' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BREAK-ALL',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P2_UNBLIND_left']: new_P2_UNBLIND_left,
                    });
                } else if (tableData.child('table').child(col_id).child('visible').val() == "BLOCK-1") {
                    // use 'BREAK-2' on "BLOCK-1" => 'BREAK-2-FAIL' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BREAK-2-FAIL',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P2_UNBLIND_left']: new_P2_UNBLIND_left,
                    });
                } else {
                    // 'BREAK-2' on ("BREAK-2" || "BREAK-2-FAIL" || "BLOCK-1-ALERT")
                    console.log("Can't Use Here!");
                }
            } else {
                console.log("Not Enough UNBLIND Help point left !!!");
            }
        }
    });
}

function useHelp_PROTECT_toCol(col_id, roomNum, turn_side) {
    ref_gameRoom.child(roomNum).once('value', tableData => {
        if (turn_side == 'PLAYER1') {
            if (tableData.child('Player').child('P1_PROTECT_left').val() > 0) {
                // PLAYER1 can use PROTECT
                var new_P1_PROTECT_left = tableData.child('Player').child('P1_PROTECT_left').val() - 1;
                if (tableData.child('table').child(col_id).child('visible').val() == "NORMAL" || tableData.child('table').child(col_id).child('visible').val() == "no" || tableData.child('table').child(col_id).child('visible').val() == "BREAK-1") {
                    // any placer change visible "NORMAL" or "no" or 'BREAK-1' to 'BLOCK-1' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BLOCK-1',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P1_PROTECT_left']: new_P1_PROTECT_left,
                    });
                } else if (tableData.child('table').child(col_id).child('visible').val() == "BLOCK-2") {
                    // use 'BLOCK-1' on "BLOCK-2" => 'BLOCK-2-ALERT' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BLOCK-2-ALERT',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P1_PROTECT_left']: new_P1_PROTECT_left,
                    });
                } else if (tableData.child('table').child(col_id).child('visible').val() == "BREAK-2" || tableData.child('table').child(col_id).child('visible').val() == "BREAK-ALL") {
                    // use 'BLOCK-1' on "BREAK-2" or "BREAK-ALL" => 'BLOCK-1-ALERT' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BLOCK-1-ALERT',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P1_PROTECT_left']: new_P1_PROTECT_left,
                    });
                } else {
                    // 'BLOCK-1' on ("BLOCK-1" || "BLOCK-1-ALERT" || "BLOCK-2-ALERT")
                    console.log("Can't Use Here!");
                }
            } else {
                console.log("Not Enough PROTECT Help point left !!!");
            }
        } else {
            if (tableData.child('Player').child('P2_PROTECT_left').val() > 0) {
                // PLAYER2 can use PROTECT
                var new_P2_PROTECT_left = tableData.child('Player').child('P2_PROTECT_left').val() - 1;
                if (tableData.child('table').child(col_id).child('visible').val() == "NORMAL" || tableData.child('table').child(col_id).child('visible').val() == "no" || tableData.child('table').child(col_id).child('visible').val() == "BREAK-2") {
                    // any placer change visible "NORMAL" or "no" or 'BREAK-2' to 'BLOCK-2' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BLOCK-2',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P2_PROTECT_left']: new_P2_PROTECT_left,
                    });
                } else if (tableData.child('table').child(col_id).child('visible').val() == "BLOCK-1") {
                    // use 'BLOCK-2' on "BLOCK-1" => 'BLOCK-1-ALERT' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BLOCK-1-ALERT',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P2_PROTECT_left']: new_P2_PROTECT_left,
                    });
                } else if (tableData.child('table').child(col_id).child('visible').val() == "BREAK-1" || tableData.child('table').child(col_id).child('visible').val() == "BREAK-ALL") {
                    // use 'BLOCK-2' on "BREAK-1" or "BREAK-ALL" => 'BLOCK-2-ALERT' & use--
                    ref_gameRoom.child(roomNum).child('table').child(col_id).update({
                        ['visible']: 'BREAK-FAIL',
                    });
                    ref_gameRoom.child(roomNum).child('Player').update({
                        ['P2_PROTECT_left']: new_P2_PROTECT_left,
                    });
                } else {
                    // 'BLOCK-2' on ("BLOCK-2" || "BLOCK-2-ALERT" || "BLOCK-1-ALERT")
                    console.log("Can't Use Here!");
                }
            } else {
                console.log("Not Enough PROTECT Help point left !!!");
            }
        }
    });
}

function show_symbol_X(col_id, turn_side) {
    if (turn_side == "PLAYER1") {
        document.getElementById(col_id).querySelector('.col-layer-symbol').src = URL_x_symbol_1;
    } else {
        document.getElementById(col_id).querySelector('.col-layer-symbol').src = URL_x_symbol_2;
    }
}

function show_symbol_O(col_id, turn_side) {
    if (turn_side == "PLAYER1") {
        document.getElementById(col_id).querySelector('.col-layer-symbol').src = URL_o_symbol_1;
    } else {
        document.getElementById(col_id).querySelector('.col-layer-symbol').src = URL_o_symbol_2;
    }
}

function show_symbol_Triangle(col_id, turn_side) {
    if (turn_side == "PLAYER1") {
        document.getElementById(col_id).querySelector('.col-layer-symbol').src = URL_triangle_symbol_1;
    } else {
        document.getElementById(col_id).querySelector('.col-layer-symbol').src = URL_triangle_symbol_2;
    }
}

function show_symbol_Unknown(col_id, turn_side) {
    if (turn_side == "PLAYER1") {
        document.getElementById(col_id).querySelector('.col-layer-symbol').src = URL_unknown_symbol_1;
    } else {
        document.getElementById(col_id).querySelector('.col-layer-symbol').src = URL_unknown_symbol_2;
    }
}

function show_symbol_Protect(col_id, turn_side) {
    if (turn_side == "PLAYER1") {
        document.getElementById(col_id).querySelector('.col-layer-help').src = URL_protect_1;
    } else {
        document.getElementById(col_id).querySelector('.col-layer-help').src = URL_protect_2;
    }

}

function show_symbol_Unblind(col_id, turn_side) {
    if (turn_side == "PLAYER1") {
        document.getElementById(col_id).querySelector('.col-layer-help').src = URL_unblind_1;
    } else if (turn_side == "PLAYER2") {
        document.getElementById(col_id).querySelector('.col-layer-help').src = URL_unblind_2;
    } else if (turn_side == "ALL") {
        document.getElementById(col_id).querySelector('.col-layer-help').src = URL_unblind_all;
    }
}

function gameResult(roomNum) {
    /*
    WIN condition
    1 - 5 
    horizontal 5 
    ***** ----- ----- ----- -----
    ----- ***** ----- ----- -----
    ----- ----- ***** ----- -----
    ----- ----- ----- ***** -----
    ----- ----- ----- ----- *****
    6 - 10 
    vertical 5
    *---- -*--- --*-- ---*- ----*
    *---- -*--- --*-- ---*- ----*
    *---- -*--- --*-- ---*- ----*
    *---- -*--- --*-- ---*- ----*
    *---- -*--- --*-- ---*- ----*
    11 - 12
    diagonal 5
    *---- ----*
    -*--- ---*-
    --*-- --*--
    ---*- -*---
    ----* *----
    */
    var result = 0;
    var win_condition = new Array();
    var col_val_empty = 0;
    ref_gameRoom.child(roomNum).once('value', conData => {
        var gametable = conData.child('table');
        gametable.forEach(col => {
            if (col.child('symbol').val() == "no") {
                col_val_empty++;
            }
        });
        // 1-5
        for (let ROW = 1; ROW <= 5; ROW++) {
            // console.log("condition :" + ROW);
            let this_row_same_symbol_x = 0;
            let this_row_same_symbol_o = 0;
            let this_row_same_symbol_t = 0;
            for (let COL = 1; COL <= 5; COL++) {
                if (gametable.child(`row-${ROW}-col-${COL}`).child('symbol').val() == 'x') {
                    this_row_same_symbol_x++;
                } else if (gametable.child(`row-${ROW}-col-${COL}`).child('symbol').val() == 'o') {
                    this_row_same_symbol_o++;
                } else if (gametable.child(`row-${ROW}-col-${COL}`).child('symbol').val() == 't') {
                    this_row_same_symbol_t++;
                }
            }
            if (this_row_same_symbol_x == 5 || this_row_same_symbol_o == 5 || this_row_same_symbol_t == 5) {
                result++;
                win_condition.push([ROW]);
                break;
            }
        }


        for (let COL = 1; COL <= 5; COL++) {
            // console.log("condition :" + COL + 5);
            let this_col_same_symbol_x = 0;
            let this_col_same_symbol_o = 0;
            let this_col_same_symbol_t = 0;
            for (let ROW = 1; ROW <= 5; ROW++) {
                if (gametable.child(`row-${ROW}-col-${COL}`).child('symbol').val() == 'x') {
                    this_col_same_symbol_x++;
                } else if (gametable.child(`row-${ROW}-col-${COL}`).child('symbol').val() == 'o') {
                    this_col_same_symbol_o++;
                } else if (gametable.child(`row-${ROW}-col-${COL}`).child('symbol').val() == 't') {
                    this_col_same_symbol_t++;
                }
            }
            if (this_col_same_symbol_x == 5 || this_col_same_symbol_o == 5 || this_col_same_symbol_t == 5) {
                result++;
                win_condition.push([COL + 5]);
                break;
            }
        }

        for (let SYM = 1; SYM <= 3; SYM++) {
            // console.log("condition : 11/" + SYM);
            let this_rowcol_same_symbol_x = 0;
            let this_rowcol_same_symbol_o = 0;
            let this_rowcol_same_symbol_t = 0;
            for (let ROW = 1; ROW <= 5; ROW++) {
                if (SYM == 1) {
                    if (gametable.child(`row-${ROW}-col-${ROW}`).child('symbol').val() == 'x') {
                        this_rowcol_same_symbol_x++;
                    }
                } else if (SYM == 2) {
                    if (gametable.child(`row-${ROW}-col-${ROW}`).child('symbol').val() == 'o') {
                        this_rowcol_same_symbol_o++;
                    }
                } else {
                    if (gametable.child(`row-${ROW}-col-${ROW}`).child('symbol').val() == 't') {
                        this_rowcol_same_symbol_t++;
                    }
                }
            }
            if (this_rowcol_same_symbol_x == 5 || this_rowcol_same_symbol_o == 5 || this_rowcol_same_symbol_t == 5) {
                result++;
                win_condition.push([11]);
                break;
            }
        }

        for (let SYM = 1; SYM <= 3; SYM++) {
            // console.log("condition : 12/" + SYM);
            let this_rowcolinv_same_symbol_x = 0;
            let this_rowcolinv_same_symbol_o = 0;
            let this_rowcolinv_same_symbol_t = 0;
            for (let ROW = 1; ROW <= 5; ROW++) {
                let colinv = 6 - ROW;
                if (SYM == 1) {
                    if (gametable.child(`row-${ROW}-col-${colinv}`).child('symbol').val() == 'x') {
                        this_rowcolinv_same_symbol_x++;
                    }
                } else if (SYM == 2) {
                    if (gametable.child(`row-${ROW}-col-${colinv}`).child('symbol').val() == 'o') {
                        this_rowcolinv_same_symbol_o++;
                    }
                } else {
                    if (gametable.child(`row-${ROW}-col-${colinv}`).child('symbol').val() == 't') {
                        this_rowcolinv_same_symbol_t++;
                    }
                }
            }
            if (this_rowcolinv_same_symbol_x == 5 || this_rowcolinv_same_symbol_o == 5 || this_rowcolinv_same_symbol_t == 5) {
                result++;
                win_condition.push([12]);
                break;
            }
        }
    });

    if (result > 0) {
        return 'win';
    } else if (col_val_empty == 0) {
        return 'draw';
    } else {
        return 'no';
    }
}

// 2 change side = +1 turn number & reset count
function changeSide(roomNum, turn_side) {
    ref_gameRoom.child(roomNum).once('value', data => {
        if (turn_side == 'PLAYER1') {
            if (data.child('first_Player').val() == 'PLAYER2') {
                let next_turn_number = data.child('turn_number').val() + 1;
                ref_gameRoom.child(roomNum).update({
                    ['turn_side']: 'PLAYER2',
                    ['turn_number']: next_turn_number,
                });
            } else {
                ref_gameRoom.child(roomNum).update({
                    ['turn_side']: 'PLAYER2',
                });
            }

        } else {
            if (data.child('first_Player').val() == 'PLAYER1') {
                let next_turn_number = data.child('turn_number').val() + 1;
                ref_gameRoom.child(roomNum).update({
                    ['turn_side']: 'PLAYER1',
                    ['turn_number']: next_turn_number,
                });
            } else {
                ref_gameRoom.child(roomNum).update({
                    ['turn_side']: 'PLAYER1',
                });
            }
        }
    });
}

function revealing_vision(reviData) {
    tableCols.forEach(col => {
        if (reviData.child('table').child(col.id).child('placer').val() == 'PLAYER1') {
            if (reviData.child('table').child(col.id).child('symbol').val() == 'x') {
                show_symbol_X(col.id, 'PLAYER1');
            } else if (reviData.child('table').child(col.id).child('symbol').val() == 'o') {
                show_symbol_O(col.id, 'PLAYER1');
            } else if (reviData.child('table').child(col.id).child('symbol').val() == 't') {
                show_symbol_Triangle(col.id, 'PLAYER1');
            }
        } else if (reviData.child('table').child(col.id).child('placer').val() == 'PLAYER2') {
            if (reviData.child('table').child(col.id).child('symbol').val() == 'x') {
                show_symbol_X(col.id, 'PLAYER2');
            } else if (reviData.child('table').child(col.id).child('symbol').val() == 'o') {
                show_symbol_O(col.id, 'PLAYER2');
            } else if (reviData.child('table').child(col.id).child('symbol').val() == 't') {
                show_symbol_Triangle(col.id, 'PLAYER2');
            }

        }

        if (reviData.child('table').child(col.id).child('visible').val() == 'BREAK-1') {
            show_symbol_Unblind(col.id, 'PLAYER1');
        } else if (reviData.child('table').child(col.id).child('visible').val() == 'BREAK-2') {
            show_symbol_Unblind(col.id, 'PLAYER2');
        } else if (reviData.child('table').child(col.id).child('visible').val() == 'BREAK-1-FAIL') {
            show_symbol_Protect(col.id, 'PLAYER2');
        } else if (reviData.child('table').child(col.id).child('visible').val() == 'BREAK-2-FAIL') {
            show_symbol_Protect(col.id, 'PLAYER1');
        } else if (reviData.child('table').child(col.id).child('visible').val() == 'BREAK-ALL') {
            show_symbol_Unblind(col.id, 'ALL');
        } else if (reviData.child('table').child(col.id).child('visible').val() == 'BLOCK-1') {
            show_symbol_Protect(col.id, 'PLAYER1');
        } else if (reviData.child('table').child(col.id).child('visible').val() == 'BLOCK-2') {
            show_symbol_Protect(col.id, 'PLAYER2');
        } else if (reviData.child('table').child(col.id).child('visible').val() == 'BLOCK-1-ALERT') {
            show_symbol_Protect(col.id, 'PLAYER1');
        } else if (reviData.child('table').child(col.id).child('visible').val() == 'BLOCK-2-ALERT') {
            show_symbol_Protect(col.id, 'PLAYER2');
        }
    });
}

const btn_returnHome = document.getElementById('btn-table-return-home');
btn_returnHome.addEventListener('click', return_home);
const btn_returnRoom = document.getElementById('btn-table-return-room');
btn_returnRoom.addEventListener('click', return_room);
const btn_surrender = document.getElementById('btn-table-surrender');
btn_surrender.addEventListener('click', surrender);

function surrender() {
    if (host_room_Num != '0') {
        give_reward(host_room_Num, 'P1-surrender');
        return_room();
        ref_gameRoom.child(host_room_Num).update({
            ['Surrender']: 'host',
        });
    } else if (join_room_num != '0') {
        give_reward(join_room_num, 'P2-surrender');
        return_room();
        ref_gameRoom.child(join_room_num).update({
            ['Surrender']: 'join',
        });
    }
}

function return_room() {
    if (host_room_Num != '0') {
        console.log('host return room');
        ref_gameRoom.child(host_room_Num).child('Player').update({
            ['Player_1_Status']: 'Ready',
        });
        ref_gameRoom.child(host_room_Num).child('Player').child('P1_PROTECT_left').remove();
        ref_gameRoom.child(host_room_Num).child('Player').child('P1_UNBLIND_left').remove();
        ref_gameRoom.child(host_room_Num).child('GameResult').remove();
        ref_gameRoom.child(host_room_Num).child('first_Player').remove();
        ref_gameRoom.child(host_room_Num).child('turn_number').remove();
        ref_gameRoom.child(host_room_Num).child('turn_side').remove();
    } else if (join_room_num != '0') {
        console.log('join return room');
        ref_gameRoom.child(join_room_num).child('Player').update({
            ['Player_2_Status']: 'Ready',
        });
        ref_gameRoom.child(join_room_num).child('Player').child('P2_PROTECT_left').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('P2_UNBLIND_left').remove();
    }
    Open_room();
}

function return_home() {
    if (host_room_Num != '0') {
        ref_gameRoom.child(host_room_Num).off('value');
        ref_gameRoom.child(host_room_Num).remove();
    } else if (join_room_num != '0') {
        ref_gameRoom.child(join_room_num).off('value');
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_Photo').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_Name').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_Status').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('Player_2_UID').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('P2_PROTECT_left').remove();
        ref_gameRoom.child(join_room_num).child('Player').child('P2_UNBLIND_left').remove();
    }
    Open_homepage();
}

var P1_UID = '';
var P2_UID = '';

function give_reward(roomNum, result) {
    // result = { 'P1-win' , 'P2-win' , 'P1-surrender' , 'P2-surrender' , 'draw' }
    ref_userProfile.once('value', userData => {
        ref_userProfile.child(P1_UID).update({
            ['total-play']: userData.child(P1_UID).child('total-play').val() + 1,
        });
        ref_userProfile.child(P2_UID).update({
            ['total-play']: userData.child(P2_UID).child('total-play').val() + 1,
        });
        if (result == 'P1-win') {
            console.log(userData.child(P1_UID).child('score').val() + '+ 1');
            ref_userProfile.child(P1_UID).update({
                ['win']: userData.child(P1_UID).child('score').val() + 1,
            });
        } else if (result == 'P2-win') {
            console.log(userData.child(P2_UID).child('score').val() + '+ 1');
            ref_userProfile.child(P2_UID).update({
                ['win']: userData.child(P2_UID).child('score').val() + 1,
            });
        } else if (result == 'P1-surrender') {
            console.log(userData.child(P2_UID).child('score').val() + '+ 1');
            ref_userProfile.child(P2_UID).update({
                ['win']: userData.child(P2_UID).child('score').val() + 1,
            });
        } else if (result == 'P2-surrender') {
            console.log(userData.child(P1_UID).child('score').val() + '+ 1');
            ref_userProfile.child(P1_UID).update({
                ['win']: userData.child(P1_UID).child('score').val() + 1,
            });
        } else if (result == 'draw') {
            console.log(userData.child(P1_UID).child('score').val() + '+ 1');
            ref_userProfile.child(P1_UID).update({
                ['draw']: userData.child(P1_UID).child('score').val() + 1,
            });
            console.log(userData.child(P2_UID).child('score').val() + '+ 1');
            ref_userProfile.child(P2_UID).update({
                ['draw']: userData.child(P2_UID).child('score').val() + 1,
            });
        }
    });

}

//How to Play Page
const btn_howtoplay = document.getElementById('btn-howtoplay');
btn_howtoplay.addEventListener('click', howtoplay);
function howtoplay(){
    Open_howtoplay();
}

//Ranking Page
const btn_ranking = document.getElementById('btn-ranking');
btn_ranking.addEventListener('click', ranking);
function ranking(){
    Open_ranking();
}

// set user value
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user.displayName);
        userName = user.displayName;
        userPhoto = user.photoURL;
        userUID = user.uid;
        const todayDate = new Date();
        ref_userProfile.child(user.uid).update({
            ['LastLogInDate']: todayDate,
        });
        ref_userProfile.once('value', userData => {
            if (!userData.child(user.uid).child('total-play').exists()) {
                ref_userProfile.child(user.uid).update({
                    ['total-play']: 0,
                    ['win']: 0,
                    ['draw']: 0,
                });
            }
        });
    }
});

const pageAccessedByReload = (
    (window.performance.navigation && window.performance.navigation.type === 1) ||
    window.performance
    .getEntriesByType('navigation')
    .map((nav) => nav.type)
    .includes('reload')

);
if (pageAccessedByReload) {
    // on refresh
    ref_gameRoom.once('value', snapshot => {
        snapshot.forEach(room => {
            if (room.child('Player').child('Player_1_UID').val() == userUID) {
                ref_gameRoom.child(room.key).remove();
            }
        });
    });
}

window.addEventListener('beforeunload', checkBeforeLeave);

function checkBeforeLeave(e) {
    e.preventDefault();
    ref_gameRoom.once('value', snapshot => {
        snapshot.forEach(room => {
            if (room.child('Player').child('Player_1_UID').val() == userUID) {
                ref_gameRoom.child(room.key).remove();
            }
        });
    });
    e.returnValue = '';
    Open_homepage();
}

