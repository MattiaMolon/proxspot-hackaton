import React, { Component } from 'react';
import Place from './Place';
import firebase from '../firebase.js';
import '../css/Main.css';
import Loading from './Loading';

class Main extends Component {

  constructor() {
    super();
    this.state = {
      places: [],
      selectedPlace: false,
      placeName: "",
      loading: true
    }
  }

  componentDidMount() {
    const placesRef = firebase.database().ref('Places');
    placesRef.on('value', (snapshot) => {
      let newState = [];
      let places = snapshot.val();
      for (let place in places) {
        newState.push({
          name: place,
          ...places[place]
        })
      }
      this.setState({ places: newState, loading: false });
    })
  }

  openSection(name) {
    this.setState({ selectedPlace: true, placeName: name });
  }

  returnHome() {
    this.setState({ selectedPlace: false });
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    } else if (this.state.selectedPlace) {
      return (
        <Place
          name={this.state.placeName}
          returnHome={this.returnHome.bind(this)}
        />
      )
    } else {
      return (
        <div className="container">
          <div className="title">
            <p className="titleText"> ProxSpot </p>
          </div>
          <div className="places">
            {
              this.state.places.map(place =>
                (<p
                  key={place.name}
                  onClick={() => this.openSection(place.name)}
                  className="placesText"
                  style={{ "backgroundColor": place.Colore }}
                >
                  {place.name}
                </p>))
            }
            <p
              key="aggiungi"
              className="addPlace"
            >
              +
            </p>
          </div>
        </div >
      )
    }

  }
}

export default Main;