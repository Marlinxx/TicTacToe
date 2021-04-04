import { createRef, Fragment, useRef } from 'react';
import './sessionJoin.scss';

const image = require('../../assets/images/logo.svg');

export default function StudentAvatar({ student }) {
  const divRef = createRef(null);
  // divRef.current().css(student.position)
  console.log(divRef.current);
  return (
    <Fragment>
      <div ref={divRef} className={`student-container ${student.isMyAvatar ? 'center' : ''}`}>
        {
                student.hasDp ? <img src={image.default} alt="logo" className="studentDp" /> : <div className="student">{student.avatarLetter}</div>
            }
      </div>
    </Fragment>
  );
}
