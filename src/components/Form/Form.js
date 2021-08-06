import React from "react"
import "./Form.css"
import { Link } from 'react-router-dom';

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
      inputStatus: true,
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

    if (foundBrand) {
      const listOptions = foundBrand.colors.map(color => {
        return (
          <option key={color.hex_value} value={color.colour_name}>
            {color.colour_name}
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
    const { name, value } = event.target

    this.setState({ [name]: value})
    const filteredPolishes =  this.filterByBrand(name)
    const brandOpts = this.buildBrandOptions(filteredPolishes, "brand")
    this.setState({ filtPolishes: filteredPolishes, brandOptions: brandOpts });
  }

  handleColorChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value})
    const colorOpts = this.buildColorOptions()
    this.setState({ colorOptions: colorOpts });
  }

  handleClick = event => {
    event.preventDefault()
    const reverse = !this.state.inputStatus
    this.setState({ inputStatus: reverse })
  }

  sendPolish = (event) => {
    //event.preventDefault()
    const freshPolish = {
      brand: this.state.brand,
      colorway: this.state.colorway
    }
    this.props.addPolish(freshPolish)
  }

  render() {
    return (
      <section className="add-view polish-display">
        <form className="card add-border">
          <section className="brand-inputs">
            <input 
            required
            disabled={!this.state.inputStatus}
            type="search" 
            name="brand" 
            placeholder="Add your brand"
            list="brands"
            id="brand" 
            value={this.state.brand} 
            onChange={event => this.handleBrandChange(event)}
            />
            <datalist 
              id="brands">{this.state.brandOptions}
            </datalist>
            <button className="confirm-polish" onClick={(event) => this.handleClick(event)}></button>
          </section>
          <section className="brand-inputs">
            <input 
              disabled={this.state.inputStatus}
              required
              type="search" 
              name="colorway" 
              list="colors"
              placeholder="Add your colorway" 
              value={this.state.colorway} 
              onChange={event => this.handleColorChange(event)}
            />
            <datalist 
              id="colors">{this.state.colorOptions}
            </datalist>
            <button className="confirm-polish" onClick={(event) => this.handleClick(event)}></button>
          </section>
        {/* <input 
          disabled
          required
          type="text" 
          name="hue" 
          placeholder="Pick your hue" 
          value={this.state.hue} 
          onChange={}
        /> */}
        <Link to="/"><button 
          required
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