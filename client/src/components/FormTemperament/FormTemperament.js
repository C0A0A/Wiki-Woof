import React, {useEffect, useState} from 'react';
import "./formtemperament.css"
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import {getTemperaments, addTemperament, getDogsCreated, searchDogs} from "../../actions/index.js"

function validate(input) {
    let errors = {};
    if(input.otros && !/^[A-Za-z,\s]+$/g.test(input.otros)) {
        errors.otros = "Sólo palabras sin tilde separadas por coma.";
      }
    return errors;
}
export function setter (input) {
    for(const key in input) {
        if (typeof input[key] === "boolean") {
        input[key] = false
        } else {
            input[key] = ""
        }
}
return input
}

export function FormTemperament ({allTemperaments, getTemperaments, dogsCreated, addTemperament, temperamentDetail, getDogsCreated, searchDogs}) {
    useEffect(() => {
        getTemperaments();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const [temperaments, setTemperaments] = useState({
        otros:""
    });
    const [filterValue, setFilter] = useState("");
    const [dogs, setDogs] = useState ({});
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({
        init: false,
        completed: false
    });

    function handleFinal () {
        searchDogs("name", filterValue);
        setFilter("");
        setState({
            ...state,
            completed: false,
        });
    }
    
    function handleSubmitSearch(e) {
        e.preventDefault();
        setState({
            ...state,
            init: true
        });
        getDogsCreated("name", filterValue);
    }
 
    function submiting (e) {
        e.preventDefault();
        let dogsEntries = Object.entries(dogs);
        let resultDogs = dogsEntries.map(item=> item[1] === true ? item[0] : "").join(",");
        let temperamentsEntries = Object.entries(temperaments);
        let resultTemperaments= temperamentsEntries.map(item=> item[1] === true ? item[0] : "").join(",") + `,${temperaments.otros}`;
        addTemperament({
            id: resultDogs,
            temperament: resultTemperaments});
        setTemperaments(setter(temperaments));
        setDogs(setter(dogs));
        setState({
            completed: true,
            init: false
        });
    }
    function handleChangeSearch(e) {
        setFilter(e.target.value);
    }
    function handleChangeId(e) {
        setDogs({
            ...dogs,
            [e.target.name]: e.target.checked
        });
    }
    function handleChangeTemp(e) {
        setTemperaments({
            ...temperaments,
            [e.target.name]: e.target.checked
          });
    }
    function handleChangeOtrosTemp(e) {
        setTemperaments({
            ...temperaments,
            [e.target.name]: e.target.value
          });
        setErrors(validate({
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
              value={filterValue}
              onChange={handleChangeSearch}
             />
             <button className="btn-submit" type="submit">BUSCAR</button>
             </form>
             {dogsCreated.length && state.init ? dogsCreated.map((dog, i) =>
                <div key={dog.id} className="dog-container">
                   { dog.image_url && (<img key={i + "-image"} src={dog.image_url} className="img-home" alt={dog.name}/>)}
                    <NavLink exact to={`/dogs/${dog.id}`} className="link-dog-detail" >{dog.name}</ NavLink>
                    <label key={"label" + dog} for={i}>
                    <input key={"check" + dog} type="checkbox" checked={dogs[dog.id]} name={dog.id} id={dog + i} onClick={handleChangeId}/>Seleccionar</label>
                    {dog.temperament ? (<span key={i + dog.temperament}>{dog.temperament}</span>) : (<span>Woof? Puedes agregar mi
                        <NavLink exact to={`/temperament/`} className="link-dog-detail" >{" temperamento"}</ NavLink>?</span>)
                        }                   
                </div>
                ) : <div></div>}
            <form id="form-temperaments-container" onSubmit={submiting}>  
                <div id="checkboxes-container">
                {
                    allTemperaments.map((temp, i) => 
                    <label className="label-check" key={"label" + temp} for={i}>
                    <input id={temp + i} key={"check" + temp} type="checkbox" name={temp} checked={temperaments[temp]} onClick={handleChangeTemp}/>{temp}</label>
                    )
                }
                </div>
                <input
                type="text"
                id="newtemperaments"
                className= {errors.otros ? "danger" : "success"}
                name="otros"
                placeholder="Crear otros temperamentos..."
                value={temperaments.otros}
                onChange={handleChangeOtrosTemp}
                />
                {errors.otros && (
                <p className="danger">{errors.otros}</p>
                )}
                <button className="btn-submit" type="submit" disabled={(errors.otros || !dogs || !state.init) ? "disabled" : ""}>AÑADIR</button>
            </form>            
            { temperamentDetail[0] && state.completed ? (
                <div id="form-temp-response-success"> 
                <h3>¡Woof, woof! Muchas gracias por tu contribución! </h3>
                <NavLink exact to={`/dogs/`} onClick={handleFinal}>Observa tu creación</NavLink>
                </div>
            ) : <div></div>
            }
            { !temperamentDetail[0] && state.completed ? (
                 <h3>Woof? Algo salió mal. ¡Inténtalo de nuevo!</h3>
            ) : <div></div>
            }
        </div>
        );
    }



function mapStateToProps(state) {
    return {
        allTemperaments: state.temperaments,
        dogsCreated: state.dogsCreated,
        temperamentDetail: state.temperamentDetail
    }
}
  
function mapDispatchToProps(dispatch) {
    return {
    getTemperaments: () => dispatch(getTemperaments()),
    addTemperament: data => dispatch(addTemperament(data)),
    getDogsCreated: (filter, filterValue) => dispatch(getDogsCreated(filter, filterValue)),
    searchDogs: (filter, filterValue, order, direction, standarLimit) => dispatch(searchDogs(filter, filterValue, order, direction, standarLimit))
    };
} 

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormTemperament);