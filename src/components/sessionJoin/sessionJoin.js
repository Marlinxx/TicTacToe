import { Fragment } from "react";
import './sessionJoin.scss';
import StudentAvatar from "./studentAvatar";

export default function SessionJoin() {

    const students = [
        {
            name: 'Nirmal',
            avatarLetter: 'N',
            isMyAvatar: true,
            hasDp: true,
            position: {
                position: 'absolute',
                top: '10px',
                right: '100px'
            }
        },
        {
            name: 'Mohan',
            avatarLetter: 'M',
            isMyAvatar: false,
            hasDp: false,
            position: {
                position: 'absolute',
                top: '50px',
                right: '200px'
            }
        }
    ]

    return(
    <Fragment>
        <div className='studentsContainer'>
            {
                students?.map((student, index) => (
                    <StudentAvatar student={student} key={index} />
                ))
            }
        </div>
    </Fragment>
    )
}