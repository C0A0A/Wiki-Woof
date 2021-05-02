import React, { useState} from "react";
import "./search.css";
import { connect } from "react-redux";
import {searchDogs} from "../../actions/index"

export function Search (props) {
  const [input, setInput] = useState ({
    filter: "name",
    filterValue: "",
    order: "id",
    direction: "ASC",
    standarLimit:""
  });

  function handleChange(e) {
    setInput({
        ...input,
        [e.target.name]: e.target.value
      });
  }
  function handleSubmit(e) {
    e.preventDefault();
    props.searchDogs(input.filter, input.filterValue, input.order, input.direction, input.standarLimit);

  }

    return (
      <div className="searchContainer">
        <form className="form-container" onSubmit={(e) => handleSubmit(e)}>
            <label>Filtrar por:</label>          
            <select name="filter" value={input.filter} onChange={(e) => handleChange(e)}>
            <option value="name">Raza</option>
            <option value="weight">Peso</option>
            <option value="height">Altura</option>
            <option value="life_span">Esperanza de vida</option>
            <option value="temperament">Temperamento</option>
            </select>
            <input
              type="text"
              id="filterValue"
              name="filterValue"
              placeholder="Ingrese un valor de filtro"
              value={input.filterValue}
              onChange={handleChange}
            />
            <label>Ordenar por:</label>          
            <select name="order" value={input.order} onChange={(e) => handleChange(e)}>
            <option value="id">Estándar</option>
            <option value="name">Raza</option>
            <option value="weight">Peso</option>
            <option value="height">Altura</option>
            <option value="life_span">Esperanza de vida</option>
            <option value="temperament">Temperamento</option>
            </select>
            <select name="direction" value={input.direction} onChange={(e) => handleChange(e)}>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
            </select>
            <label>Mostrar:</label>
            <input
              type="number"
              id="standarLimit"
              name="standarLimit"
              disabled={input.mix==="true" ? "disabled" : ""}
              value={input.standarLimit}
              onChange={handleChange}
            />
          <button className="btn-submit" type="submit">BUSCAR</button>
        </form>
      </div>
    );
  }


function mapDispatchToProps(dispatch) {
  return {
    searchDogs: (filter, filterValue, order, direction, standarLimit) => dispatch(searchDogs(filter, filterValue, order, direction, standarLimit))
  };
} 

 export default connect(
  null,
  mapDispatchToProps 
)(Search);
