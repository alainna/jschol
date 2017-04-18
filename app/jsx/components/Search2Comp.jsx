// ##### Search Component - With Search Controls ##### //

import React from 'react'
import Form from 'react-router-form'

// var customRadioLabel = ""
// if (["oru", "series", "monograph_series", "seminar_series", "special"].includes(p.type)) {
//    customRadioLabel = "This department"
// }
// if (p.type == 'journal') {
//    customRadioLabel = "This Journal"
// }
// if (p.type == 'campus') {
//    customRadioLabel = "This campus"
// }

class SearchControls extends React.Component {
  render() {
    let p = this.props,
        searchUnit = null;

    if (p.unitID) {
      searchUnit = [
        <input key="r2" type="radio" id="c-search2__refine-campus" name="searchType" value={p.unitID}
               onClick={this.props.handleRadioSelect} onFocus={this.props.makeActive} onBlur={this.props.makeInactive}/>,
        <label key="l2" htmlFor="c-search2__refine-campus">This {p.label}</label>
      ]
    }

    return (
    <div className={this.props.refineActive ? "c-search2__refine--active" : "c-search2__refine"}>
      <input key="r1" type="radio" id="c-search2__refine-eschol" name="searchType" value="eScholarship" defaultChecked={true}
             onClick={this.props.handleRadioSelect} onFocus={this.props.makeActive} onBlur={this.props.makeInactive}/>
      <label key="l1" htmlFor="c-search2__refine-eschol" >All of eScholarship</label>
      { searchUnit }
    </div>
  )}
}

class SearchComp2 extends React.Component {
  state={refineActive: false, search: '/search'}
  makeActive = ()=> this.setState({refineActive: true})
  makeInactive = ()=> this.setState({refineActive: false})

  handleRadioSelect = event => {
    if (event.target.value == 'eScholarship') {
      this.setState({search: '/search'})
    } else {
      this.setState({search: '/unit/' + event.target.value + '/search'})
    }
  }

  render() {
    var label;
    if (["series", "monograph_series", "seminar_series", "special"].includes(this.props.type)) {
      label = "Series"
    } else if (this.props.type == "oru") {
      label = "Department"
    } else if (this.props.type == "journal") {
      label = "Journal"
    } else if (this.props.type == "campus") {
      label = "Campus"
    }

    return (
        <Form to={this.state.search} method="GET">
          <div className="c-search2">
            <div className="c-search2__inputs">
              <div className="c-search2__form">
                  <label className="c-search2__label" htmlFor="global-search">Search eScholarship</label>
                  <input type="search" name="q" id="global-search" className="c-search2__field" placeholder="Search" 
                         onFocus={this.makeActive} onBlur={this.makeInactive}/>
              </div>
              <SearchControls refineActive={this.state.refineActive}
                              handleRadioSelect={this.handleRadioSelect}
                              label={label}
                              makeActive={this.makeActive}
                              makeInactive={this.makeInactive}
                              unitID={this.props.unitID} />
            </div>
            <button type="submit" className="c-search2__submit-button" aria-label="search"></button>
            <button className="c-search2__search-close-button" aria-label="close search field" onClick = {()=>this.props.onClose()}></button>
          </div>
        </Form>
    )
  }
}

module.exports = SearchComp2;
