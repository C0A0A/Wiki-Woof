import React, {useEffect} from "react";
import "./home.css";
import Search from "../Search/Search.js"
import Pagination from "../Pagination/Pagination.js"
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import {searchDogs} from "../../actions/index.js";

export function Home (props) {
    useEffect(() => {
        !props.filterDogs && props.searchDogs();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div id="tools-container">
            <Search/>
            <Pagination/>
            </div>
            <div id="dogs-container">
                {props.filterDogs.dogs && props.filterDogs.dogs.map((dog, i) =>
                <div key={dog.id} className="dog-container">
                   { dog.image_url && (<img key={i + "-image"} src={dog.image_url} className="img-home" alt={dog.name}/>)}
                    <NavLink exact to={`/dogs/${dog.id}`} className="link-dog-detail" >{dog.name}</ NavLink>
                    {dog.temperament ? (<span key={i + dog.temperament}>{dog.temperament}</span>) : (<span>Woof? Puedes agregar mi
                        <NavLink exact to={`/temperament/`} className="link-dog-detail" >{" temperamento"}</ NavLink>?</span>)}                   
                </div>
                )}
            </div>
       </div>
    )
}

function mapStateToProps(state) {
    return {
        filterDogs: state.filterDogs,
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
    searchDogs: (filter, filterValue, order, direction, mix, standarOffset, standarLimit, mixOffsetDb, mixOffsetApi) => dispatch(searchDogs(filter, filterValue, order, direction, mix, standarOffset, standarLimit, mixOffsetDb, mixOffsetApi))
    };
} 

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home);