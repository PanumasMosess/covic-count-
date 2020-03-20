import React, { Component } from "react";
import Axios from "axios";
import "./style.css";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.getCountryData = this.getCountryData.bind(this);
  }
  state = {
    confirmed: 0,
    recovered: 0,
    deaths: 0,
    countries: []
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const res = await Axios.get("https://covid19.mathdro.id/api/");
    const resCountries = await Axios.get(
      "https://covid19.mathdro.id/api/countries"
    );
    const countries = Object.keys(resCountries.data.countries);
    this.setState({
      confirmed: res.data.confirmed.value,
      recovered: res.data.recovered.value,
      deaths: res.data.deaths.value,
      countries: countries
    });
    // console.log(res);
  }

  async getCountryData(e) {
    if(e.target.value === "World"){
      this.getData();
      return;
    }
    try {
      const resCountriesData = await Axios.get(
        `https://covid19.mathdro.id/api/countries/${e.target.value}`
      );
      this.setState({
        confirmed: resCountriesData.data.confirmed.value,
        recovered: resCountriesData.data.recovered.value,
        deaths: resCountriesData.data.deaths.value
      });
    } catch (err) {
      if (err.response.status === 404) {
        this.setState({
          confirmed: "No data available",
          recovered: "No data available",
          deaths: "No data available"
        });
      }     
    }
  }

  renderCountryOptions() {
    return this.state.countries.map((country, i) => {
      return <option key={i}>{country}</option>;
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Corona Update</h1>
        <select className="dropdown" onChange={this.getCountryData}>
          <option>World</option>
          {this.renderCountryOptions()}
        </select>
        <div className="flex">
          <div className="box confirmed">
            <h3>Confirmed Case</h3>
            <h4>{this.state.confirmed}</h4>
          </div>
          <div className="box recovered">
            <h3>Recovered Case</h3>
            <h4>{this.state.recovered}</h4>
          </div>
          <div className="box deaths">
            <h3>Deaths Case</h3>
            <h4>{this.state.deaths}</h4>
          </div>
        </div>
      </div>
    );
  }
}
