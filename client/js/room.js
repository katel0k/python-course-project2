import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
const { io } = require("socket.io-client");
const socket = io();

const url = new URL(`http://localhost:5000/room/${room_id}/`);
console.log(url);
console.log(new URL('game', url));

const waiting_state = 'waiting';
const accept_state = 'accept';
const playing_state = 'playing';

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            state: waiting_state
        }
        // this.state = {
        //     state: props.state
        // }
    }
    componentDidMount() {
        // that is incorrect
        socket.emit('join', room_id);

        socket.on('both_players_joined', (...args) => {
            this.setState({
                state: playing_state
            });
        });

        // socket.on('both_players_agreed', (...args) => {
        //     this.setState({
        //         state: playing_state
        //     })
        // })

        socket.on('player_left', (...args) => {

        });
    }
    render () {
        switch (this.state.state) {
            case waiting_state:
                return (<WaitingState/>);
            // case 'accept':
            //     return (<AcceptanceWaitingState/>);
            case playing_state:
                return (<PlayingState/>);
        }
    }
}

/// pasted from previous project, untested -----------------------------------------------------------------

function CheckerImg ({ghost, color, queen}) {
	return <img className={"checkers-img" + (ghost ? ' checkers-img-ghost' : '') }
		src={`/client/img/${color ? 'white' : 'black'}${queen ? '-queen' : ''}.png`}
		alt={color ? 'wh' : 'bl'}/>
}

function CheckersCell ({checker, bg, pos}) {
	// checker = (checker || state & 4) ? <CheckerImg 
	// 	ghost={state & 4}
	// 	color={checker.color}
	// 	queen={checker.queen || state & 8} /> : undefined;
	// return (
	// 	<div className={'checkers-cell checkers-cell-' + bg + 
	// 			(state & 1 ? ' checkers-cell-movable' : '') +
	// 			(state & 2 ? ' checkers-cell-checked' : '')
	// 			} 
	// 		pos={pos}>
	// 		{checker}
	// 	</div>
	// 	)
    return (
        <div className={`checkers-cell checkers-cell-${bg}`}
                pos={pos}>
            {checker.is_empty ? undefined : <CheckerImg 
                    color={checker.color}
                    queen={checker.queen}

                    />}
        </div>
    )
}

class CheckersField extends React.Component {
	render () {
        console.log(this.props.field);
		// let checked = (i, j) => this.props.checked && (i === this.props.checked.row) && (j === this.props.checked.col);
		return (
			<div className="checkers-field" onClick={this.props.onClick}>
				{this.props.field.reduce((arr, el, i) => 
					arr.concat(el.map((value, j) => 
						<CheckersCell
							key={i + '_' + j}
							pos={i + '_' + j}
							checker={value}
							bg={(i + j) % 2 == 0 ? 'white' : 'black'}
						/>
						)), [])}
			</div>
			)
	}
}

// HOC for checkers
function CheckersUI ({activePlayer, ...passThrough}) {
	const ABC = 'abcdefgh';
	let cl = activePlayer === 'black' ? ' reverse' : '';
	return (
		<div className="checkers-UI">
			<div className={"checkers-UI__top-letters checkers-UI__letters" + cl}>
				{ABC.split('').map((a, i) => <span className="checkers-UI__letter" key={i}>{a}</span>)}
			</div>
			<div className={"checkers-UI__left-letters checkers-UI__letters" + cl}>
				{ABC.split('').map((a, i) => <span className="checkers-UI__letter" key={i}>{i+1}</span>)}
			</div>
			<div className={"checkers" + cl}> <CheckersField {...passThrough}/> </div>
			<div className={"checkers-UI__right-letters checkers-UI__letters" + cl}>
				{ABC.split('').map((a, i) => <span className="checkers-UI__letter" key={i}>{i+1}</span>)}
			</div>
			<div className={"checkers-UI__bottom-letters checkers-UI__letters" + cl}>
				{ABC.split('').map((a, i) => <span className="checkers-UI__letter" key={i}>{a}</span>)}
			</div>
		</div>
		);
}

class CheckersGame extends React.Component {
    // constructor (props) {
    //     super(props);
    //     this.state = {
    //         field: props.field || [],
    //         fieldSelected: false
    //     };
    //     this.handleCheckersClick = this.handleCheckersClick.bind(this);
    // }


    render () {
        // console.log(this.props);
        // console.log(this.state);
        return (
        <div className="game">
            <div className="game-stats-container">
                {/* <GameStats
                    order={this.state.game.order} /> */}
            </div>
            <div className="checkers-UI-container">
                <CheckersUI
                    activePlayer={'white'}
                    onClick={this.props.handleCheckersClick}
                    field={this.props.field} />
            </div>
        </div>
        );
    }
}

/// pasted from previous project, untested -----------------------------------------------------------------

class WaitingState extends React.Component {
    constructor(props) {
        super(props);
        
    }
    render() {
        return (<div>Waiting</div>);
    }
}

function PlayerInfo(props) {
    return (<div></div>);
}

class PlayingState extends React.Component {
    constructor (props) { 
        super(props);
        this.state = {
            player1: undefined,
            player2: undefined,
            field: [],
            fieldSelected: false,
            playerColor: true
        }
    }
    componentDidMount() {
        // useEffect(() => {
            // console.log('hello world');
        fetch(new URL('game', url)).then(response => response.json())
        .then(obj => {
            // console.log(obj);
            // console.log(this);
            this.setState({
                field: obj.field,
                order: obj.order,
                player1Info: obj.player1,
                player2Info: obj.player2,
                playerColor: obj.player_color
            });
        });
        socket.on('made_move', (json) => {
            let {field, move, order, ...rest} = JSON.parse(json);
            console.log(field, move, this);
            if (!move.is_possible) {
                // display error message
                this.setState({
                    fieldSelected: false
                });
                return;
            }
            
            // if (move.changes_order) {
            //     // change order

            // }
            this.setState({
                field: field,
                order: order,
                fieldSelected: false
            });
        });
        // });
    }

    handleCheckersClick(e) {
        let [row, col] = [...e.target.closest('.checkers-cell')
						.getAttribute('pos').split('_').map(Number)];
        if (this.state.fieldSelected) {
            if (this.state.field[this.state.fieldSelected.y][this.state.fieldSelected.x].is_empty) {
                this.setState({
                    fieldSelected: false
                });
                return;
            }
            else if (col == this.state.fieldSelected.x && row == this.state.fieldSelected.y) {
                return;
            }
            let move = {
                x0: this.state.fieldSelected.x,
                y0: this.state.fieldSelected.y,
                x: col,
                y: row,
                player_color: this.state.playerColor // TODO, how can I know this shit????
            };
            console.log(move);
            socket.emit('made_move', room_id, move);
        }
        else {
            if (!this.state.field[row][col].is_empty) {
                this.setState({
                    fieldSelected: {x: col, y: row}
                });
            }
        }
        // socket.emit('made_move', );
    }
    render () {
        // console.log(this.state);
        return (
        <div className="app-container">
            <div className="app">
                <div className="player-container player1">
                    <PlayerInfo info={this.state.player1}/>
                    {/* <PlayerInfo
                        player={this.state.player2}
                        field={this.state.game.field}
                        history={this.state.game.history || []} /> */}
                </div>
                <div className="game-container">
                    <span>{this.state.order ? 'white' : 'black'}</span>
                    <CheckersGame field={this.state.field} 
                            handleCheckersClick={this.handleCheckersClick.bind(this)} />
                </div>
                <div className="player-container player2">
                    <PlayerInfo info={this.state.player2}/>
                    {/* <PlayerInfo
                        player={this.state.player1}
                        field={this.state.game.field}
                        history={this.state.game.history || []} 
                        reverse={true} /> */}
                </div>
            </div>
        </div>
        );
    }
}

class BrokenGameState extends React.Component {
    constructor (props) { super(props); }
    render() {
        return (<div>Broken</div>);
    }
}

class EndGameState extends React.Component  {
    constructor (props) { super(props); }
    render() {
        return (<div>Game ended</div>);
    }
}

class PlayerAcceptanceBtn extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = props.handleClick;
    }
    render () {
        return (
            <button onclick={this.props.handleClick}></button>
        );
    }
}

class AcceptanceWaitingState extends React.Component {
    constructor (props) { super(props); }
    handleAccept (player) {
        // player == true - белый игрок, false - черный
        // io.emit('set_player')
    }
    render () {
        return (
            <div className="form-wrapper">

                {/* <form action="leave"><input type="submit" value="Выйти из игры"/></form> */}
                {/* <form action="agree"><input type="submit" value="Принять игру"/></form> */}
            </div>
        )
    }

}

ReactDOM.render(<App/>, document.querySelector('.__react-root'));