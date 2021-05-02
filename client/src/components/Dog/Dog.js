import React, {useEffect} from 'react';
import "./dog.css";
import { connect } from 'react-redux';
import { getDogDetail} from '../../actions/index';

export function Dog (props) {

    useEffect(() => {
        const dogId = props.match.params.id;
        props.getDogDetail(dogId);
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div id="global-dob-container">
        <div key={props.dog.id} className="dog-container dog-detail">
        <h2>{props.dog.name}</h2>
       { props.dog.image_url && (<img id="img-dog-detail" key={"image" + props.dog.id} src={props.dog.image_url} className="img-home" alt={props.dog.name}/>)}
        <span key={"weight" + props.dog.weight}> <b>Peso:</b> {props.dog.weight} kg.</span>
        <span key={"height" + props.dog.height}><b>Altura:</b> {props.dog.height} m.</span> 
        <span key={"life_span" + props.dog.life_span}><b>Esperanza de vida:</b> {props.dog.life_span}.</span>
       { props.dog.temperament && (<span key={"temperament" + props.dog.temperament}><b>Temperamento:</b> {props.dog.temperament}.</span>) }                
        </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
     dog: state.dogDetail
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
    getDogDetail: id => dispatch(getDogDetail(id))
    };
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dog);