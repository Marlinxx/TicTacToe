import {React} from 'react';

import './tictac.scss';

function Box (props) {
    return (
        <div className={`box ${props.winnerBlockcss}`} onClick={props.onClickHandler}>
            <span>{props.value}</span>
        </div>
    )
}

export default Box;