import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import firebase from '../firebase.js';
import '../css/Place.css';

class Place extends Component {
  constructor(props) {
    super();
    this.state = {
      name: props.name,
      place: {},
      hubs: [],
      date: new Date()
    };
  }

  componentDidMount() {
    const placeRef = firebase.database().ref('Places/' + this.state.name);

    placeRef.on('value', (snapshot) => {
      let place = snapshot.val();
      let hubs = [];
      for (let hubKey in place) {
        if (hubKey.slice(0, 3) === "Hub") {
          let n = this.countPlacesHub(place[hubKey]);
          hubs.push({ ...place[hubKey], postiLiberi: n });
        }
      }
      this.setState({ place, hubs });
    })

  }

  countPlacesHub(hub) {
    let i = 0;
    for (let sensKey in hub) {
      if (sensKey.slice(0, 7) === "Sensore") {
        let sens = hub[sensKey];
        let closestDate = Object.keys(sens)[0];

        for (let tupKey in sens) {
          let date = sens[tupKey].Data;
          if (Date.parse(date) >= Date.parse(sens[closestDate].Data)) {
            closestDate = tupKey;
          }
        }

        i = sens[closestDate].Attivo ? i : i + 1;
      }
    }
    return i
  }


  getHubs() {
    let content = [];
    let hubs = this.state.hubs;
    hubs.forEach(hub => {
      let hubDiv = []
      for (let sensKey in hub) {
        let sensDiv = [];
        if (sensKey.slice(0, 7) === "Sensore") {
          let sens = hub[sensKey];
          sensDiv.push(<div className="sensText" key={sensKey + hub.NomeHub}> {sensKey}: </div>);

          let closestDate = Object.keys(sens)[0];

          for (let tupKey in sens) {
            let date = sens[tupKey].Data;
            if (Date.parse(date) >= Date.parse(sens[closestDate].Data)) {
              closestDate = tupKey;
            }
          }

          sensDiv.push(<div className="tupText" key={sens[closestDate].Data}> {sens[closestDate].Attivo ? "Occupato" : "Libero"}</div>);
        }
        hubDiv.push(<div className="sensContainer" key={sensKey + hub.NomeHub}> {sensDiv} </div>);
      }
      content.push(
        <Collapsible
          key={"collaps" + hub.NomeHub}
          trigger={
            <div
              className="hubText"
              key={hub.NomeHub}
            >
              <i className="material-icons downArrow"> keyboard_arrow_down</i>
              {hub.NomeHub} - Posti liberi: {hub.postiLiberi}
            </div>}
        >
          {hubDiv}
        </Collapsible>)
    });
    return content;
  }

  render() {
    return (
      <div className="container">
        <div className="name" style={{ backgroundColor: this.state.place.Colore }}> {this.state.place.name} </div>
        <div className="via">Via {this.state.place.Via}</div>
        <div className="orario">Orario: {this.state.place.OrarioApertura} - {this.state.place.OrarioChiusura}</div>

        <div className="hubs">
          Hubs:
          {this.getHubs()}
        </div>

        <i
          className="material-icons iconText"
          style={{ color: this.state.place.Colore }}
          onClick={this.props.returnHome}
        >
          home
        </i>
      </div>
    )
  }
}

export default Place;