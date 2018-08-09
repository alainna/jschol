// ##### Tab Metrics Component ##### //
// Usage data represented by an array like this:
// [
//    {month: '2016-01', hits: 2000, downloads: 20},
//    {month: '2016-02', hits: 2762, downloads: 24},
//    {month: '2016-03', hits: 2221, downloads: 29} ... ]

import React from 'react'
import Utils from '../utils.jsx'
import PropTypes from 'prop-types'

class TotalUsage extends React.Component {
  render() {
    let hitsTotal = Utils.sumValueTotals(this.props.usage, "hits"),
        hitsTotal_str = hitsTotal.toLocaleString(),
        hitsAvg = this.props.usage.length > 0 ? Math.round(hitsTotal / this.props.usage.length).toLocaleString() : 0,
        downloadsTotal = Utils.sumValueTotals(this.props.usage, "downloads"),
        downloadsTotal_str = downloadsTotal.toLocaleString(),
        downloadsAvg = this.props.usage.length > 0 ? Math.round(downloadsTotal / this.props.usage.length).toLocaleString() : 0
    return (
      <div className="c-datatable">
        <table>
          <caption>Total Usage</caption>
          <thead>
            <tr>
              <th scope="col">Actions</th>
              <th scope="col">Total</th>
              <th scope="col">Monthly Average</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Hits</th>
              <td>{hitsTotal_str}</td>
              <td>{hitsAvg}</td>
            </tr>
            <tr>
              <th scope="row">Downloads</th>
              <td>{downloadsTotal_str}</td>
              <td>{downloadsAvg}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

class MonthlyUsage extends React.Component {
  getMonth = (rows, i) => {
    let len = rows.length
    if (len == 0) return ''
    if (i > len) i = len
    let recent12 = (len < 12) ? rows : rows.slice(-12)
    return recent12[i-1].month
  }

  // Using method above, set default selectors to most recent 12 months
  state = { from: this.getMonth(this.props.usage, 1),
            to: this.getMonth(this.props.usage, 12) }

  changeFrom = e => {
    this.setState({from: e.target.value})
  }

  changeTo = e => {
    this.setState({to: e.target.value})
  }

  render() {
    let months_all = this.props.usage.map( r => { return r.month }),
        monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        fullDate = ym => {
         let d = ym.split('-')
         let month = monthNames[parseInt(d[1]) - 1]
         return month + " " + d[0] 
        },
        selector = months_all.map( (m, i) => {
          return <option key={i} value={m}>{fullDate(m)}</option>
        }),
        selectedUsage = this.props.usage.map( (r, i) => {
          if ((r.month >= this.state.from) && (r.month <= this.state.to)) { 
            return (
              <tr key={i}>
                <th scope="row">{r.month}</th>
                <td>{r.hits.toLocaleString()}</td>
                <td>{r.downloads.toLocaleString()}</td>
              </tr>
            )
          }
        })
    return (
      <div>
        <h2 className="o-heading3">By Month</h2>
        <div className="c-itemactions">
          <div className="o-input__droplist2">
            <label htmlFor="o-input__droplist-label2">From:</label>
            <select name="" id="o-input__droplist-label2" onChange={this.changeFrom} value={this.state.from}>
              {selector}
            </select>
          </div>
          <div className="o-input__droplist2">
            <label htmlFor="o-input__droplist-label2">To:</label>
            <select name="" id="o-input__droplist-label2" onChange={this.changeTo} value={this.state.to}>
              {selector}
            </select>
          </div>
        </div>
        <div className="c-datatable">
          <table>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Hits</th>
                <th scope="col">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {selectedUsage}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

class TabMetricsComp extends React.Component {
  static propTypes = {
    usage: PropTypes.arrayOf(PropTypes.shape({
      month: PropTypes.string,
      hits: PropTypes.number,
      downloads: PropTypes.number
    })).isRequired,
    altmetrics_ok: PropTypes.bool,
    attrs: PropTypes.shape({
      doi: PropTypes.string
    })
  }

  componentWillMount() {
    if (!(typeof document === "undefined")) {
      // Altmetric widget  https://api.altmetric.com/embeds.html
      const script = document.createElement("script")
      script.src = "https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js"
      script.async = true
      document.body.appendChild(script)
    }
  }

  render() {
    return (
      <div className="c-tabcontent">
        <h1 className="c-tabcontent__main-heading" tabIndex="-1">Metrics</h1>
      {!this.props.altmetrics_ok && (!this.props.usage || (this.props.usage && this.props.usage.length == 0)) ?
        <div className="o-well-colored">
          No usage data currently found for this item.
        </div>
      :
        <div className="c-tabcontent__divide2x">
        {this.props.usage && this.props.usage.length > 0 ?
          <div className="c-tabcontent__divide2x-child">
            <TotalUsage usage={this.props.usage} />
            <MonthlyUsage usage={this.props.usage} />
          </div>
        :
          <div className="c-tabcontent__divide2x-child">
            <div className="o-well-colored">
              No usage data currently found for this item.
            </div>
          </div>
        }
          <div className="c-tabcontent__divide2x-child">
          {this.props.altmetrics_ok && this.props.attrs.doi &&
           [<h2 key="0" className="o-heading3">Online Attention</h2>,
            <div key="1" className='altmetric-embed' data-badge-type='donut' data-badge-details='right' data-doi={this.props.attrs.doi}></div>]
          }
          </div>
          <div className="c-tabcontent__divide2x-child">
          {this.props.attrs.doi &&
           [<h2 key="0" className="o-heading3">Citations</h2>,
            <div key="1" className="dimensions-embed" >Dimension Badge here</div>]
          }
          </div>
        </div>
      }
      </div>
    )
  }
}

module.exports = TabMetricsComp;
