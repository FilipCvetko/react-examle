import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import axios from 'axios';
import { render } from '@testing-library/react';

const SearchbarDropdown = (props) => {
  const { options, onInputChange, sendChosen} = props;
  const ulRef = useRef();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.addEventListener('click', (event) => {
      event.stopPropagation();
      ulRef.current.style.display = 'flex';
      onInputChange(event);
    });
    document.addEventListener('click', (event) => {
      ulRef.current.style.display = 'none';
    });
  }, []);
  return (
    <div className="search-bar-dropdown card shadow mb-3">
      <input
        id="search-bar"
        type="text"
        className="form-control"
        placeholder="Search"
        ref={inputRef}
        onChange={onInputChange}
        autoComplete='off'
      />
      <ul id="results" className="list-group" ref={ulRef}>
        {options.map((option, index) => {
          return (
            <button
              type="button"
              key={index}
              onClick={(e) => {
                inputRef.current.value = option;
                sendChosen(option)
              }}
              className="list-group-item list-group-item-action form-control bg-light border-0 small"
            >
              {option}
            </button>
          );
        })}
      </ul>
    </div>
  );
};

// const OneProgressBar = (props) => {
//   return (
//     <div className="progress mb-4">
//       <div className="progress-bar bg-danger w-${}" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
//     </div>
//   )
// }

const LikelyCulpritsDisplay = (props) => {
  if (Object.keys(props.culprits_dict).length === 0) {
    return <div></div>
  }
  else {

    const culprit_names = [];
    const culprit_percentages = [];
    const width_stylings = [];

    for (const [key, value] of Object.entries(props.culprits_dict["data"]["culprits"])) {
      culprit_names.push(key)
      culprit_percentages.push(value)
      width_stylings.push({width: value + '%'})
    }

    function create_width_style(percentage) {
      const perc_str = percentage
      return {width: perc_str}
    }


    return (
      <div className="card shadow mb-4">
          <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Verjetni povzročitelji</h6>
          </div>
          <div className="card-body">
              {culprit_names.map((culp, index) =>
                <div key={index}>
                  <h4 className="small font-weight-bold">{culp}<span style={{float: 'right'}} className="float-right">{culprit_percentages[index]} %</span></h4>
                  <div className="progress mb-4">
                    <div style={width_stylings[index]} className="progress-bar bg-success" role="progressbar" aria-valuenow={culprit_percentages} aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <a href="#" class="btn btn-success btn-circle">
                                        <i class="fas fa-check"></i>
                                    </a>
                </div>      
              )}
          </div>
      </div>
    );
  };
}

function App() {
  const [options, setOptions] = useState([]);
  const [antibioticsOptions, setAntibioticsOptions] = useState([]);
  const [likelyCulprits, setLikelyCulprits] = useState({});
  const [chosen, setChosen] = useState("");
  const [chosenAntibiotic, setChosenAntibiotic] = useState("");
  const [chosenRendered, setChosenRendered] = useState("");
  const [chosenAntibioticRendered, setChosenAntibioticRendered] = useState("");
  const [allInfections, setAllInfections] = useState({});
  const [antibioticsList, setAntibioticsList] = useState({})
  const [results, setResults] = useState({});
  
  useEffect(async () => {
    const result = await axios(
      'http://127.0.0.1:8000/list_infections',
    );

    setAllInfections(result);
  }, [])

  useEffect(async () => {
    const antibiotics = await axios(
      'http://127.0.0.1:8000/list_antibiotics',
    );

    setAntibioticsList(antibiotics);
  }, [])

  function getLikelyCulprits (chosenVal) {
    const culprits_result = axios.post(
      'http://127.0.0.1:8000/get_culprits', {query: chosenVal}
    ).then(response => setLikelyCulprits(response));
    return culprits_result
  }

  function getResults (chosenVal, chosenAnt) {
    const results = axios.post(
      'http://127.0.0.1:8000/get_culprits', {query: chosenVal}
    ).then(response => setLikelyCulprits(response));
    return results
  }

  console.log(antibioticsList)
  console.log(allInfections)

  const onInputChange = (event) => {
    console.log(allInfections["data"]["data"])
    setOptions(
      allInfections["data"]["data"].filter((option) => option.includes(event.target.value))
    );
  };

  const onAntibioticsInputChange = (event) => {
    console.log(antibioticsList["data"]["data"])
    setAntibioticsOptions(
      antibioticsList["data"]["data"].filter((option) => option.includes(event.target.value))
    );
  };



  if (chosen !== chosenRendered) {
    // Perform a POST request to backend
      const curr_culprits = getLikelyCulprits(chosen)
      setLikelyCulprits(curr_culprits)
      setChosenRendered(chosen)
  }

  if (options.length === 1) {
    if (chosenAntibiotic !== chosenRendered) {
    // Perform a POST request to backend
      const curr_results = getResults(chosenAntibiotic)
      setResults(curr_results)
      setChosenAntibioticRendered(chosenAntibiotic)
    }
  }

  return (
    <div className="App col-lg-6 mb-4">
      <div className='row'>
      <h1 className='h1 mb-4 mt-2 text-gray-800'>Smotrno predpisovanje antibiotikov</h1>
      <div className='col-lg-6 mb-4'>
      
      <h3 className='h3 mb-4 mt-2 text-gray-800'>Izberite vrsto okužbe</h3>
      <SearchbarDropdown options={options} onInputChange={onInputChange} sendChosen={setChosen} />
      <br />
      <h3 className='h3 mb-4 mt-2 text-gray-800'>Izberite antibiotik</h3>
      <SearchbarDropdown options={antibioticsOptions} onInputChange={onAntibioticsInputChange} sendChosen={setChosenAntibiotic} />
      </div>
      <div className='col-lg-6 mb-4'>
      <LikelyCulpritsDisplay culprits_dict={likelyCulprits} />
      </div>
      </div>
      <br />
      
    </div>
  );
}

export default App;
