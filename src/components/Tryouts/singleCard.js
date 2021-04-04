import ClassNames from 'classnames';
import './cards.scss';

export default function SingleCard(props) {
  return (
    <>
      <div className={ClassNames(`column${props.slideIndex}`, 'singleCard')}>
        <span className="cardTitle">
          {props.name}
        </span>
      </div>
    </>
  );
}
