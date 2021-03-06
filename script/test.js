var twq = require('./state');
var Board = require('./board');
var clc = require('cli-color');
var readline = require('readline');

var colors = [clc.red, clc.blue, clc.green, clc.yellow, clc.magenta, clc.cyan, clc.white, clc.black, clc.bgRed, clc.bgCyan, clc.bgGreen, clc.bgYellow ];
var shapes = [ '@', '#', '$', '%', '&', "8", "+", "=", "?", "\\", '*', "Z" ];

var _ = require('underscore');
var numTypes = 6;
var copies = 1;

var printCell = function(cell, coords, state, width, bgColor) {
    if (typeof bgColor !== 'function') bgColor = clc.bgWhite;
    var ret = '';


    if (typeof cell === 'undefined') {
        var pIndex = coords.in(state.playable());
        ret = pIndex !== -1 ? (new Array(width - String(pIndex).length)).join(' ') + clc.black(String(pIndex)) : 
                               new Array(width).join(' ');
    } else {
        ret = colors[state.getColor(cell)](shapes[state.getShape(cell)]);
        ret = (new Array(width - 1).join(' ')) + ret;
    }

    return bgColor(ret);
}

var printTile = function(state, tile, bgColor) {
    if (typeof tile != 'number' || tile < 0 || tile > state.numTypes*state.numTypes) {
        return typeof bgColor == 'function' ? bgColor(' ') : ' ';
    }
    var color = state.getColor(tile);
    var shape = state.getShape(tile);

    if (typeof bgColor == 'function') return bgColor(colors[color](shapes[shape]));
    return colors[color](shapes[shape]);
}

var printTiles = function(state, tiles) {
    if (typeof tiles === 'undefined') var tiles = state.getCurrentPlay().tiles;
    // var printTile = this.printTile;
    return tiles.map(function(x) { return printTile(state, x); }).join(' ');
}

// var printBoard = function(state, gridPkg) {
//     if (typeof gridPkg == 'undefined') gridPkg = state.turnGrid();
//     var grid = gridPkg.grid;
//     row = '   ';
//     var colNum;
//     var rowNum;
//     var cell;
//     var coords;
//     // add columns index
//     // for (var i = 0; i < grid[0].length; i++) {
//     //     colNum = i - gridPkg.colOffset;
//     //     row += new Array(4 - String(colNum).length).join(' ');
//     //     row += colNum;
//     // };

//     console.log(row);

//     for (var i = 0; i < grid.length; i++) {
//         row = '';
//         rowNum = i - gridPkg.rowOffset;
//         // row += rowNum;
//         // row += new Array(4 - String(rowNum).length).join(' ');
//         for (var j = 0; j < grid[0].length; j++) {
//             coords = new Board.Coordinates(j - gridPkg.colOffset, rowNum);

//             if ( grid[i][j] === undefined ) {
//                 if (coords.in(state.playable()) != -1) {
//                     cell = clc.bgGreen(' ');
//                 } else {
//                     cell = ' ';
//                 }
//             } else if (coords.in(state.turnHistory) != -1) {
//                 cell = printTile(state, grid[i][j], clc.bgGreen);
//             } else if (coords.in(state.lastTilePlacements()) != -1) {
//                 cell = printTile(state, grid[i][j], clc.bgWhite);
//             } else {
//                 cell = printTile(state, grid[i][j]);
//             }
//             // row += '  '; 
//             row += cell;
//         };
//         console.log(row);
//     };
//     console.log('');

// }
var printBoard = function(state, gridPkg, cellWidth) {
    if (typeof gridPkg == 'undefined') gridPkg = state.board.grid();
    if (typeof cellWidth == 'undefined') cellWidth = 4;
    cellWidth++;
    var grid = gridPkg.grid;
    row = '   ';
    var colNum;
    var rowNum;
    var cell;
    var coords;
    // add columns index
    for (var i = 0; i < grid[0].length; i++) {
        colNum = i - gridPkg.colOffset;
        row += new Array(cellWidth - String(colNum).length).join(' ') + colNum;
    };
    row += '\n';
    var pIndex;
    for (var i = grid.length - 1; i >= 0; i--) {
        row += '';
        rowNum = i - gridPkg.rowOffset;
        row += rowNum;
        row += new Array(4 - String(rowNum).length).join(' ');
        for (var j = 0; j < grid[0].length; j++) {
            coords = new Board.Coordinates(j - gridPkg.colOffset, rowNum);
            row += printCell(grid[i][j], coords, state, cellWidth)
        };
        row += '\n';
    };
    return row;

}
var playTurn = function(state) {
	// console.log(state.gameHistory.length +1);

	var plyr = state.getCurrentPlayer();
	plyr.selectedTiles = [];
	// var timetocheck = state.turn() === 10;

	var move = state.computerPlay(state.turn() % 2);
	// var move = state.computerPlay();
	if (move[0] === 'play') {
		// debugger;
		g.turnHistory = move[1];

        for (var i = g.turnHistory.length - 1; i >= 0; i--) {
            plyr.removeTile(g.turnHistory[i].tile);
        };
		// debugger;
		// console.log(g.turnHistory);

		var gameOver = state.gameOver();

		var lines = state.moveLines();

		// twerqs += lines.filter(function(x) { return x.length === numTypes; }).length;

		plyr.endTurn(g);
		return !gameOver;
	} else {
		var tiles = move[1];
		for (var i = 0; i < tiles.length; i++) {
			plyr.selectTile(state, tiles[i]);
		};

		plyr.endTurn(g);
		return true;
	}
}

// var coord1 = new Board.Coordinates(0,1);
// var coord2 = new Board.Coordinates(0,2);

// console.log(coord1.equals(coord2));


// REPEAT CODE
// var reps = 500;
// var i = 0;
// var skip = false;
// var player1score = 0;
// var player2score = 0;
// var player1wins = 0;
// var player2wins = 0;
// var start = +new Date();
// while (i < reps) {
// 	var g = twq.initState(['a', 'b'], [0, 0], numTypes, 3);	

// 	while (playTurn(g)) {
// 		if (g.turn() > 80) {
// 			skip = true;
// 			break;
// 		}
// 		// g.board.printBoard();
// 		// console.log(g.players.map(function(x) { return ' ' + x.score + ' ';}).join(','));
// 		// console.log(g.players.map(function(x) { return ' ' + x.tiles.length + ' ';}).join(','));
// 	}
// 	if (!skip) {
// 		i++;

// 		player1score += g.players[0].score;
// 		player2score += g.players[1].score;
// 		if (g.players[0].score >= g.players[1].score) {
// 			player1wins++;
// 		} 
// 		if (g.players[1].score >= g.players[0].score) {
// 			player2wins++;
// 		}
// 		console.log('finished game ' + i);
// 		console.log('optimize wins ' + player1wins + ' (' + (Math.round((player1wins/i) * 100)) + '%) avg-score: ' + player1score);
// 		console.log('avoider wins ' + player2wins + ' (' + (Math.round((player2wins/i) * 100)) + '%) avg-score: ' + player2score);

// 	} else {
// 		skip = false;
// 	}
// }
// var end = +new Date();
// console.log('exec time: ' + (end - start));
// console.log('player 1 score: ' + player1score);
// console.log('player 2 score: ' + player2score);

// END REPEAT CODE


var g = twq.initState(['a', 'b'], [0, 0], numTypes, copies);	
// var plyr = g.getCurrentPlayer();
// var first_move = g.computerPlay(10);
// console.log(plyr.tiles);
// console.log(first_move);
// var moves = first_move[1];
// var grid;


var start = +new Date();

playTurn(g);
console.log(printBoard(g));

// var tiles = g.getCurrentPlayer().tiles;

// for (var i = tiles.length - 1; i >= 0; i--) {
//     console.log(printTile(g, tiles[i]));
// };
console.log('0 1 2 3 4 5')
console.log(printTiles(g, g.getCurrentPlayer().tiles));

var rl = readline.createInterface(process.stdin, process.stdout);
var moveRegex = /(\d+)\s(\d+)/, player = g.getCurrentPlayer(), matches;
rl.setPrompt('TWQ> ');
rl.prompt();

rl.on('line', function(line) {
    matches = line.match(moveRegex);

    if (matches == null) {
        if (line == 'end') {
            g.getCurrentPlayer().endTurn(g);
            console.log('0 1 2 3 4 5')
            console.log(printTiles(g, g.getCurrentPlayer().tiles));
            console.log(printBoard(g));
            console.log(_.pluck(g.players, 'score'));
        } else {
            console.log('nup');
        }
    } else{
        console.log(matches);
        var tile = g.getCurrentPlayer().tiles[Number(matches[1])];
        var coords = g.playable()[Number(matches[2])];
        if (g.getCurrentPlayer().selectTile(g, tile).placeSelectedTile(g, coords)) {
            console.log(g.getCurrentPlayer().tiles.map(function(x, i) {return String(i); }).join(' '));
            console.log(printTiles(g, g.getCurrentPlayer().tiles));

            console.log(printBoard(g));
        } else {
            console.log('no good');
        }
    }
    rl.prompt();
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});

// playTurn(g);

// g.board.printBoard();
// console.log(g.players.map(function(x) { return ' ' + x.score + ' ';}).join(','));
// console.log(g.players.map(function(x) { return ' ' + x.tiles.length + ' ';}).join(','));

// while (playTurn(g)) {

// 	printBoard(g);
// 	console.log(g.players.map(function(x) { return ' ' + x.score + ' ';}).join(','));
// 	console.log(g.players.map(function(x) { return ' ' + x.tiles.length + ' ';}).join(','));
// }
// var end = +new Date();
// // g.board.printBoard();
// // console.log(g.players.map(function(x) { return ' ' + x.score + ' ';}).join(','));
// // console.log(g.players.map(function(x) { return ' ' + x.tiles.length + ' ';}).join(','));
// console.log('exec time: ' + (end - start));
// console.log('grid calls: ' + g.board.gridCache.timesCalled);
// console.log(g.players);

// console.log('turn 42');
// var turn42 = g.board.grid(g.tilePlacements(g.gameHistory.slice(0, 42)));
// g.board.printBoard(turn42);















// console.log(g.players.map(function(x) { return ' ' + x.score + ' ';}).join(','));

// 	g.board.printBoard();

// 	console.log(g.players.map(function(x) { return ' ' + x.score + ' ';}).join(','));
// 	console.log(g.players.map(function(x) { return ' ' + x.tiles.length + ' ';}).join(','));

// console.log(g.players);
// var numExchanges = g.gameHistory.filter(function(x) { return x[0] === 'exchange'; }).length;
// console.log('exchanges: ' + numExchanges);
// console.log(twerqs);

// var newgrid = new Array(g.board.grid.length);

// for (var i = 0; i < newgrid.length; i++) {
// 	newgrid[i] = new Array(g.board.grid.length);

// };

// g.gameHistory.map(function(turnHistory) {
// 	if (typeof turnHistory[0] == 'string') return;
// 	turnHistory.map(function(move) {
// 		newgrid[move[0]][move[1]] = move[2]
// 	});
// });

// // console.log(newgrid[91]);
// g.board.grid = newgrid;

// for (var i = 0; i < g.gameHistory.length; i++) {
// 	if (g.gameHistory[i][0] != 'exchange') {
// 		for (var j = 0; j < g.gameHistory[i].length; j++) {
// 			g.gameHistory[i][j][0] = g.gameHistory[i][j][0] - g.board.center;
// 			g.gameHistory[i][j][1] = g.gameHistory[i][j][1] - g.board.center;
// 		};
// 	}
// };


// console.log(g.gameHistory);
// var rows = _.flatten(g.gameHistory.map(function(x) {
//             if ( x[0] != 'exchange') {
//                 return x.map(function(y) {
//                     return y[0]
//                 });
//             } else {
//             	return 0;
//             }
//         }));
// var cols = _.flatten(g.gameHistory.map(function(x) {
//             if ( x[0] != 'exchange') {
//                 return x.map(function(y) {
//                     return y[1]
//                 });
//             } else {
//             	return 0;
//             }
//         }));

// var highRow = Math.max.apply(null, rows) + 1;
// var lowRow = Math.min.apply(null, rows) - 1;
// var highCol = Math.max.apply(null, cols) + 1;
// var lowCol = Math.min.apply(null, cols) - 1;

// console.log(highRow);
// console.log(lowRow);
// console.log(highCol);
// console.log(lowCol);

// var rowCount = highRow - lowRow;
// var rowOffset = lowRow * -1;
// var colCount = highCol - lowCol;
// var colOffset = lowCol * -1;

// var newgrid = new Array(rowCount);

// for (var i = 0; i < newgrid.length; i++) {
// 	newgrid[i] = new Array(colCount);
// };

// g.gameHistory.map(function(turnHistory) {
// 	if (turnHistory[0] == 'exchange') return;
// 	turnHistory.map(function(move) {
// 		newgrid[move[0] + rowOffset][move[1] + colOffset] = move[2]
// 	});
// });

// var row;
// var grid = newgrid;



// // var playable = state.playable();


// console.log(g.board.printTile(g.gameHistory[0][0][2]))

// // for (var i = 0; i < newgrid.length; i++) {
// // 	console.log(g.board.printTiles(newgrid[i]));
// // };
// // console.log(newgrid);
// // g.board.printBoard;

