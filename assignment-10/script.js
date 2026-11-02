const socket = io();
let username= "";

window.onload = pageLoad;

function pageLoad(){
	let submitmsg = document.getElementById("submitmsg");
	let clickok = document.getElementById("clickok");
	submitmsg.addEventListener("click", sendToAll);
	clickok.addEventListener("click", setUsername);
	document.getElementById("userMsg").addEventListener("keydown", (event) => {
		if (event.key === "Enter" && !submitmsg.disabled) sendToAll();
	});
}

socket.on('your id', function(id){
	console.log('Your socket ID is: ' + id);
	document.getElementById("your_id").textContent = id;
});

// รับข้อความทั่วไป (ที่ส่งมาจาก socket.emit, socket.broadcast.emit, io.emit, io.to.emit)
socket.on('message_received', (data) => {
  postMsg(data);
});


// ส่งหาทุกคน รวมฉันด้วย (To All)
function sendToAll() {
	let d = new Date();
	let input = document.getElementById("userMsg");
	let text = input.value.trim();
	if (!text) return;

	let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	socket.emit('send_to_all', { time, user: username, text });
	input.value = "";
}

function postMsg(msg){
	let x = document.getElementById("chatbox");
	console.log(msg);
	let div_d = document.createElement("div");
	div_d.className = "message";
	let timemsg = document.createTextNode("("+ msg.time+") ");
	let boldmsg = document.createElement("b");
	boldmsg.textContent = msg.user;
	let textmsg = document.createTextNode(": "+msg.text);
	
	div_d.append(timemsg,boldmsg,textmsg);
	div_d.appendChild(document.createElement("br"));
	x.appendChild(div_d);

	checkScroll();
}

function setUsername(){
	let userInput = document.getElementById("userInput");
	let usernameElement = document.getElementById("username");
	let enteredUsername = userInput.value.trim();	
	if (!enteredUsername) return;
	username = enteredUsername;
	usernameElement.textContent = username;

	document.getElementById("submitmsg").disabled = false;
	document.getElementById("clickok").disabled = true;
	readLog();
}

const readLog = (async () => {
	try {
		let response = await fetch("/readlog");
		if (!response.ok) throw new Error("ไม่สามารถอ่านประวัติข้อความได้");
		let messages = await response.json();
		messages.forEach((msg) => postMsg(msg));
	} catch (error) {
		console.error(error);
	}
});


function checkScroll(){
	let chatbox = document.getElementById('chatbox');
	let scroll = chatbox.scrollTop+chatbox.clientHeight === chatbox.scrollHeight;
	if (!scroll) {
    	chatbox.scrollTop = chatbox.scrollHeight;
  	}
}
