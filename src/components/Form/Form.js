import React from "react";
import "./Form.css";
import { Link } from 'react-router-dom';
import { CirclePicker } from "react-color";

export class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      polishes: props.polishes,
      filtPolishs: [],
      filtColors: [],
      brandOptions: [],
      colorOptions: [],
      brand: "",
      colorway: "",
      hue: "",
      image: "",
      inputStatus: true,
      bgBrandColor: "",
      bgColorwayColor: "",
      submitReady: true
    }
  }

  buildBrandOptions = (location, name) => {
    const listOptions = location.map(polish => {
      return (
        <option key={polish.id} value={polish[name]}>
          {polish[name]}
        </option>
      );
    });
    return listOptions
  }

  buildColorOptions = () => {
    const chosenBrand = this.state.brand
    const foundBrand = this.state.polishes.find(polish => {
      return polish.brand === chosenBrand
    })

    if (!foundBrand) {
      return
    } else {
      const listOptions = foundBrand.colors.map(color => {
        return (
          <option key={color.hue} value={color.colorway}>
            {color.colorway}
          </option>
        );
      });
      return listOptions
    } 
  }

  filterByBrand = name => {
    const lowerCase = this.state[name].toLowerCase()
    const filtered = this.state.polishes.filter(polish => {
      const polishCase = polish[name].toLowerCase()
      return polishCase.includes(lowerCase)
    })
    return filtered
  }

  handleBrandChange = event => {
    this.handleChange(event)
    const filteredPolishes =  this.filterByBrand(event.target.name)
    const brandOpts = this.buildBrandOptions(filteredPolishes, "brand")
    this.setState({ filtPolishes: filteredPolishes, brandOptions: brandOpts });
  }

  handleColorwayChange = event => {
    this.handleChange(event)
    const colorOpts = this.buildColorOptions()
    this.setState({ colorOptions: colorOpts });
  }

  handleClick = (event, buttonName) => {
    event.preventDefault()
    this.validateInputs()
    const reverse = !this.state.inputStatus
    if (!this.state[buttonName]) {
      this.setState({ inputStatus: reverse, [buttonName]: "#93ccc1" })
    } else {
      this.setState({ inputStatus: reverse, [buttonName]: "" })
    }
  }

  sendPolish = (event) => {
    const freshPolish = {
      id: Date.now(),
      brand: this.state.brand,
      colorway: this.state.colorway,
      hue: this.state.hue,
      image: this.state.image
    }
    this.props.addPolish(freshPolish)
  }

  setHue = color => {
    this.setState({ hue: color.hex})
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  validateInputs = () => {
    if (this.state.brand && this.state.colorway) {
      this.setState({ submitReady: false })
    } 
  }

  render() {
    return (
      <section className="add-view polish-display">
        <form className="card add-border">
          <h2>Add a polish!</h2>
          <section className="brand-inputs">
            <input 
              type="text"
              name="image"
              placeholder="Add Image"
              value={this.state.image}
              onChange={event => this.handleChange(event)}
            />
          </section>
          <section className="brand-inputs">
            <input 
            required
            // disabled={!this.state.inputStatus}
            type="search" 
            name="brand" 
            placeholder="Add brand"
            list="brands"
            id="brand" 
            value={this.state.brand} 
            onChange={event => this.handleBrandChange(event)}
            />
            <datalist 
              id="brands">{this.state.brandOptions}
            </datalist>
            <button 
              className="add-input" 
              onClick={(event) => this.handleClick(event, "bgBrandColor")}
              style={{backgroundColor: this.state.bgBrandColor}}
            >
                ok
            </button>
          </section>
          <section className="brand-inputs">
            <input 
              disabled={this.state.inputStatus}
              required
              type="search" 
              name="colorway" 
              list="colors"
              placeholder="Add colorway" 
              value={this.state.colorway} 
              onChange={event => this.handleColorwayChange(event)}
            />
            <datalist 
              id="colors">{this.state.colorOptions}
            </datalist>
            <button 
              className="add-input" 
              onClick={(event) => this.handleClick(event, "bgColorwayColor")}
              style={{backgroundColor: this.state.bgColorwayColor}}
            >
                ok
            </button>
            {/* <button className="confirm-polish" onClick={(event) => this.handleClick(event)}></button> */}
          </section>
        <CirclePicker 
          disabled={this.state.inputStatus}
          color={this.state.hue} 
          onChange={this.setHue}
        />
        <Link to="/"><button 
          disabled={this.state.submitReady}
          type="submit" 
          className="add-button" 
          onClick={(event) => this.sendPolish(event)}>
            Add me!
          </button></Link>
      </form>
      </section>
    )
  }

}