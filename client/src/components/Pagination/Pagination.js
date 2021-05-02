import React from "react";
import "./pagination.css";
import { connect } from "react-redux";
import {searchDogsNavigation} from "../../actions/index.js";

export function Pagination (props) {
    function handleClick (e) {
        e.target.name ==="left" ? props.searchDogsNavigation(props.filterDogs.previousUrl) : props.searchDogsNavigation(props.filterDogs.nextUrl);
    }
    return (
        <div>
        <button id="pagination-button-left" className="pagination-button" name="left" onClick={handleClick} disabled={props.filterDogs.previousUrl ? "" : "disabled"}></button>
        <button id="pagination-button-right" className="pagination-button" name="right" onClick={handleClick} disabled={props.filterDogs.nextUrl ? "" : "disabled"}></button>
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
    searchDogsNavigation: url => dispatch(searchDogsNavigation(url))
    };
} 

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Pagination);