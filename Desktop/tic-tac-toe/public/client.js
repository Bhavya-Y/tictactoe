function Client() {
	var occupied;
	var socket;
	var turn = 1;
	var lastplayer;
	var playernum;

	var element = document.getElementById('messages');
	socket = io.connect('/');

	this.initialize = function() {
		socket.on('board',function(board){
			occupied = board;
			console.log("board updated");
		});

		socket.on('player', function(num) {
			playernum = num;
			console.log("playernum" + playernum);
		});

		socket.on('turn', function(playersturn) {
			turn = playersturn;
			if(turn == playernum) {
				element.innerHTML = "Its your turn";
			} else {
				element.innerHTML = "Its player" + turn + "'s turn";
			}
		});

		socket.on('gameover', function(winner) {
			if(winner == 0) {
				element.innerHTML = "Its a tie!!"
			} else {
				if(playernum == winner) {
					element.innerHTML = "You win!!";
				} else {
					element.innerHTML = "You lose!!";
				}
			}
			alert("Gameover");
		});
		socket.on('change',function(id, playernum){
			setbackground(id, playernum);
		});

		//socket.on('reset', function() {
		//	location.reload(true);
		//});

	}
	function setbackground(id, playernum) {
		var change = document.getElementById(id);
	    change.style.backgroundSize = "100px 100px"; 
	    if(playernum == 1) {
            change.style.backgroundImage = "url(http://upload.wikimedia.org/wikipedia/commons/thumb/archive/7/73/20100809121043%21Orange_x.svg/105px-Orange_x.svg.png)";
        } else {
            change.style.backgroundImage = "url(http://arro-signs.co.uk/blog/wp-content/uploads/2011/01/wpid-letter-o-green.jpg)";
        }
        document.getElementById(id).style.backgroundRepeat = "no-repeat";
        occupied[parseInt(id)] = playernum;
	}

	this.click = function(evt) {
		if(occupied[parseInt(evt.id)] != 0) {
			element.innerHTML = "This space is already filled";
		} else if(turn == playernum) {
			setbackground(evt.id, playernum);
            socket.emit('update',parseInt(evt.id),playernum);
		}
    }
}