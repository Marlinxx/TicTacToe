import { Component, Fragment, React } from 'react';
import AgoraRTM from 'agora-rtm-sdk';

import Box from './tictacBox';
import './tictac.scss';
// import images from '../assets/images';

const image = require('../assets/images/logo.svg');

class TicTacToe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boxes:  new Array(9).fill(null),
            nextSymbol: 'X',
            isWin: false,
            winner: null,
            isStale: false,
            winningBlock: [],
            userName: null,
            isLoggedIn: false
        }
        this.client = null;
        this.channel = null;
        this.canPlay = null;
    }

    initiateRTM = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('channelId');
        const { userName } = this.state;
        const client = AgoraRTM.createInstance('dd1bdd5406a642fea84499861dcef2e3');
        const channelName = myParam ? myParam : 'channel1'
        const channel = client.createChannel(channelName);
        this.canPlay = !myParam;
        this.client = client;
        this.channel = channel;
        client.on('ConnectionStateChanged', (newState, reason) => {
            console.log('on connection state changed to ' + newState + ' reason: ' + reason);
          });

        client.login({ token: null, uid: userName }).then(() => {
            console.log('AgoraRTM client login success');
            channel.join().then(() => {
                console.log(`AgoraRTM channel -${channelName}- join success`);
                this.setState({
                    isLoggedIn: true
                });
            }).catch(err => {
                console.log('AgoraRTM channel join failure', err);
            });
        }).catch(err => {
            console.log('AgoraRTM client login failure', err);
        });

        channel.on('ChannelMessage', ({ text }, senderId) => {
            this.onIncomingMessage(text);
        });
    };

    alterNextSymbol = () => {
        this.setState(prevState => ({
            nextSymbol: prevState.nextSymbol === 'X' ? 'O' : 'X'
        }));
    }

    onClickHandler = (index) => {
        const { isWin, boxes, nextSymbol } = this.state;
        if(isWin || !this.canPlay)
            return;
        let boxArray = [...boxes];
        if(boxArray[index])
            return;
        this.canPlay = false;
        this.setState({
            boxes: boxArray
        });
        boxArray[index] = nextSymbol;
        this.sendMessage(index);
        this.alterNextSymbol();
        this.checkWinState(boxArray);
    }

    onIncomingMessage = (index) => {
        const { isWin, boxes, nextSymbol } = this.state;
        let boxArray = [...boxes];
        if(boxArray[index])
            return;
        this.setState({
            boxes: boxArray
        });
        this.canPlay = true;
        boxArray[index] = nextSymbol;
        this.alterNextSymbol();
        this.checkWinState(boxArray);
    }

    checkWinState = (box) => {
        const winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        for(var i=0; i < winCombos.length; i++) {
            if((box[winCombos[i][0]] === 'X' || box[winCombos[i][0]] === 'O') && 
            (box[winCombos[i][0]] === box[winCombos[i][1]] && box[winCombos[i][1]] === box[winCombos[i][2]])) {
                this.setState({
                    isWin: true,
                    winner: box[winCombos[i][0]],
                    winningBlock: winCombos[i]
                })
                return
            }
        }
        if(box.find(el =>  el === null) === undefined)
            this.setState({
                isStale: true
            })
    }

    isWinningBlock = (index) => {
        const { winningBlock } = this.state;
        return winningBlock.find(el => el === index) !== undefined
    }

    onChangeHandler = (event) => {
        this.setState({
            userName: event.target.value
        });
   }

sendMessage = (data) => {
        this.channel.sendMessage(
            { text: data.toString() }, // An RtmMessage object.
            ).then(sendResult => {
            /* Your code for handling the event that the remote user receives the message. */
            console.log('Message sent')
            }).catch(error => {
            /* Your code for handling the event of a message send failure. */
            });

}
    
   render () {
    const { isLoggedIn, boxes, isWin, isStale, winner } = this.state;
    return (
        <Fragment>
            <h1 className='header'>Tic Tac Toe</h1>
            {/* <img src={images.logo} alt='logo' /> */}
            <img src={image.default} alt='logo' />
            {
            !isLoggedIn && 
            <Fragment>
                <input type='text' onChange={($event) => this.onChangeHandler($event)}></input>
                <button onClick={() => this.initiateRTM()}>Login</button>
            </Fragment>
            }
            {
                isLoggedIn &&
                <Fragment>
                     <div className='board'>
                {boxes.map((box, index) => 
                    <Box value={box} onClickHandler={() => this.onClickHandler(index)} key={index} winnerBlockcss={isWin && this.isWinningBlock(index)? 'winnerBlock': ''}></Box>
                )}
            {isWin ? <div> Winner declared - {winner}</div>: null}
            {isStale || isWin ? <div> <span>Reset game to start again</span></div>: null}
            </div>
                </Fragment>
            }
            
        </Fragment>
        )
    }
}

export default TicTacToe;