import { Fragment, useState } from "react";
import SingleCard from "./singleCard";
import './cards.scss';

export default function DynamicCard() {
    
    const cards = [
        {
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        },{
            name: 'Name1'
        }
    ]

    const [slideIndex, setSlideIndex] = useState(3);

    const onChangeHandler = (event) => {
        setSlideIndex(event.target.value);
    }

    return(
        <Fragment>
            <div className='container'>
                <div className='cardsContainer'>
                    {
                        cards.map((card, index) => (
                            <SingleCard key={index} name={card.name} slideIndex={slideIndex}></SingleCard>
                        ))
                    }
                </div>
                <div className='imageSlider'>
                    <input type='range' onChange={($event) => onChangeHandler($event)} min='3' max='5'/>
                </div>
            </div>
        </Fragment>
    )
}