import React, {useEffect, useState} from 'react';
import "./formtemperament.css"
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import {getTemperaments, searchDogs, addTemperament} from "../../actions/index.js"

export function validate(input) {
    let errors = {};
    if(input.otros && !/^[A-Za-z-\s]+$/g.test(input.otros)) {
        errors.otros = "Sólo palabras sin tilde separadas por guión medio";
      }
    return errors;
}

let init = false;
export function FormTemperament ({temperaments, getTemperaments, searchDogs, filterDogs, addTemperament}) {
    useEffect(() => {
        getTemperaments();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const [input, setInput] = useState({
        otros:""
    })
    const [inputSearch, setInputSearch] = useState ({
        filterValue: "",
        idSelected: ""
      });
    const [errors, setErrors] = useState({});
    
    function handleSubmitSearch(e) {
        e.preventDefault();
        init = true;
        searchDogs(inputSearch.filterValue);
    }
 
    function submiting (e) {
        e.preventDefault();
        let temperamentsValues = Object.entries(input);
        let resultTemperaments= temperamentsValues.map(item=> item[1] === true ? item[0] : "").join(" ");
        addTemperament({
            id: Object.keys(inputSearch.idSelected).join(""),
            temperament: resultTemperaments})
    }
    function handleChangeSearch(e) {
        setInputSearch({
            ...inputSearch,
            [e.target.name]: e.target.value
          });
      }
    function handleChangeId(e) {
        setInputSearch({
            ...inputSearch,
            idSelected: {[e.target.name]: e.target.value}
          });
      }
      function handleChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.checked
          });
    }
    function handleChangeTemp(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
          });
        setErrors(validate({
            ...input,
            [e.target.name]: e.target.value,
        }));
    }
 
    return (
        <div id="global-tempertament-container">
             <form id="form-search-container" onSubmit={handleSubmitSearch}>
             <input
              type="text"
              id="filterValue"
              name="filterValue"
              placeholder="Ingrese el nombre de la raza..."
              value={inputSearch.filterValue}
              onChange={handleChangeSearch}
             />
             <button className="btn-submit" type="submit">BUSCAR</button>
             </form>
             {filterDogs.dogs && init ? filterDogs.dogs.map((dog, i) =>
                <div key={dog.id} className="dog-container">
                   { dog.image_url && (<img key={i + "-image"} src={dog.image_url} className="img-home" alt={dog.name}/>)}
                    <NavLink exact to={`/dogs/${dog.id}`} className="link-dog-detail" >{dog.name}</ NavLink>
                    <label key={"label" + dog} for={i}>
                    <input key={"check" + dog} type="checkbox" name={dog.id} id={dog + i} onClick={handleChangeId}/>Seleccionar</label>
                    {dog.temperament ? (<span key={i + dog.temperament}>{dog.temperament}</span>) : (<span>Woof? Puedes agregar mi
                        <NavLink exact to={`/temperament/`} className="link-dog-detail" >{" temperamento"}</ NavLink>?</span>)
                        }                   
                </div>
                ) : <div></div>}
            <form id="form-temperaments-container" onSubmit={submiting}>  
                <div id="checkboxes-container">
                {
                    temperaments.map((temp, i) => 
                    <label className="label-check" key={"label" + temp} for={i}>
                    <input key={"check" + temp} type="checkbox" name={temp} id={temp + i} onClick={handleChange}/>{temp}</label>
                    )
                }
                </div>
                <input
                type="text"
                id="newtemperaments"
                className= {errors.otros ? "danger" : "success"}
                name="otros"
                placeholder="Crear otros temperamentos..."
                value={input.otros}
                onChange={handleChangeTemp}
                />
                {errors.otros && (
                <p className="danger">{errors.otros}</p>
                )}
                <button className="btn-submit" type="submit" disabled={(errors.otros || !inputSearch.idSelected) ? "disabled" : ""}>AÑADIR</button>
            </form>
        </div>
    )  

}



function mapStateToProps(state) {
    return {
      temperaments: state.temperaments,
      filterDogs: state.filterDogs,
      temperamentDetail: state. temperamentDetail
    }
}
  
function mapDispatchToProps(dispatch) {
    return {
    getTemperaments: () => dispatch(getTemperaments()),
    searchDogs: (filter, filterValue, order, direction, mix, standarLimit) => dispatch(searchDogs(filter, filterValue, order, direction, mix, standarLimit)),
    addTemperament: (data) => dispatch(addTemperament(data))
    };
} 

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormTemperament);