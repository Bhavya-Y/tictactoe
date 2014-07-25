function Game() {
	var player1;
	var player2;
	var board = [0,0,0,0,0,0,0,0,0];
	var turn = 1;
	var lastplayer = 2;
	var current = this;

	this.initialize = function(io) {

		io.sockets.on('connection', function(socket) {
			console.log("connected");

			current.setPlayer(socket);
			socket.emit('board',board);

			socket.emit('turn', turn);

			socket.on('update',function(id, playernum) {
				board[id] = playernum;
				console.log("updated");
				socket.broadcast.emit('change',id,playernum);

				if(turn == 1) {
					turn = 2;
				} else {
					turn = 1;
				}

				if(current.gameover(id, playernum)) {
					if (board.indexOf(0) == -1) {
						io.sockets.emit('gameover', 0);
						console.log("game over");
						console.log(board.indexOf(0));
					} else {
						io.sockets.emit('gameover', playernum);
					}
					reset(socket);
				} else {
					io.sockets.emit('turn', turn);
				}

			});
			socket.on('disconnect', function() {
				current.removePlayer(socket);
				//reset(socket);
				//parent.
			});


		});
	}
	function reset(socket) {
		if ( turn == 1) {
			turn = 2;
		} else {
			turn = 1;
		}
		board = [0,0,0,0,0,0,0,0,0];
		current.setPlayer(socket);
		socket.emit('board', board);
		//socket.emit('turn', turn);
	    socket.emit('reset');
	}

	this.setPlayer = function(socket) {
		if(lastplayer == 2) {
			player1 = socket;
			socket.emit('player', 1);
		} else {
			player2 = socket;
			socket.emit('player', 2);
		}

		if(lastplayer == 1) {
			lastplayer = 2;
		} else { 
			lastplayer = 1;
		}
	};

	this.gameover = function(id,playernum) {
		var i;
        var win_positions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (i = 0; i < 8; i++) {
           if (win_positions[i].indexOf(id) != -1) {
               if (check_possibilities(win_positions[i], playernum)) {
                   return true;
                }
            }
        }
        if (board.indexOf(0) == -1) {
        	return true;
        }
        return false;
	};

	function check_possibilities(arr, playernum) {
        var i, cnt = 0;
        for (i = 0; i < 3; i++) {
            if (board[arr[i]] == playernum) {
               cnt += 1;
            } else {
              return false;
            }
            if (cnt == 3) {
              return true;
            }
        }
    }

    this.removePlayer = function(socket) {
    	if(player1 == socket) {
    		console.log("player1 disconnected");
    		player1 = null;
    	} else if(player2 == socket) {
    		console.log("player2 disconnected");
    		player2 = null;
    	}
    };
}

module.exports = Game;