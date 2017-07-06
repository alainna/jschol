import React from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router'

import MarqueeComp from '../components/MarqueeComp.jsx'
import JournalInfoComp from '../components/JournalInfoComp.jsx'
import ScholWorksComp from '../components/ScholWorksComp.jsx'
import ItemActionsComp from '../components/ItemActionsComp.jsx'

class VolumeSelector extends React.Component {
  static PropTypes = {
    vip: PropTypes.array.isRequired,     // [unit_id, Volume, Issue, Pub_date]
    issues: PropTypes.array.isRequired   // [ {:id=>3258, :volume=>"1", :issue=>"2", :pub_date=>#<Date: ...}, ... ]
  }

  getIssuePath = (unit_id, v,i) => {
    return `${unit_id}/${v}/${i}`
  }

  getPubYear = date => {
    return date.match(/\d{4}/)
  }

  render() {
    let p = this.props
    return (
      <div className="o-input__droplist1">
        <label htmlFor="c-sort1">Select</label>
        <select name="" id="c-sort1" value={this.getIssuePath(p.vip[0], p.vip[1], p.vip[2])} onChange={(e)=>{browserHistory.push("/uc/"+e.target.value)}}>
        {p.issues.map((i) => 
          <option key={i.id} value={this.getIssuePath(i.unit_id, i.volume, i.issue)}>Volume {i.volume}, Issue {i.issue}, {this.getPubYear(i.pub_date)}</option>)}
        </select>
      </div>
    )
  }
}

class SectionComp extends React.Component {
  static PropTypes = {
    section: PropTypes.shape({
      articles: PropTypes.array,
      id: PropTypes.number,
      issue_id: PropTypes.number,
      name: PropTypes.string
    }).isRequired
  }
  render() {
    return (
      <div>
        <h3 className="o-heading3">{this.props.section.name}</h3>
        {this.props.section.articles.map(article => <ScholWorksComp key={article.id} result={article}/>)}
      </div>
    )
  }
}

// Issue SIMPLE
class IssueSimpleComp extends React.Component {
  static PropTypes = {
    issue: PropTypes.shape({
      id: PropTypes.number,
      unit_id: PropTypes.string,
      volume: PropTypes.string,
      issue: PropTypes.string,
      pub_date: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      cover: PropTypes.shape({
        asset_id: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        image_type: PropTypes.string.isRequired
      }),
      sections: PropTypes.array,    //See SectionComp prop types directly above 
    }).isRequired,
    issues: PropTypes.array.isRequired   // Array of issue hashes
  }

  render() {
    let pi = this.props.issue,
        year = pi.pub_date.match(/\d{4}/),
        issueCurrent = [pi.unit_id, pi.volume, pi.issue, year]
    return (
      <section className="o-columnbox1">
        {/* ToDo: Enhance ItemActioncComp for journal issue */}
        <ItemActionsComp />
        <div className="c-pub">
          <VolumeSelector vip={issueCurrent} issues={this.props.issues} />
          {/* No cover page image for simple layout */}
        {pi.title &&
          <div className="c-pub__subheading">{pi.title}</div> }
        {pi.description &&
          <p>{pi.description}</p> }
        </div>
        {pi.sections.map(section => <SectionComp key={section.name} section={section}/>)}
      </section>
    )
  }
}

// Issue 2-column magazine layout 
class IssueMagazineComp extends React.Component {
  static PropTypes = {
    issue: PropTypes.shape({
      id: PropTypes.number,
      unit_id: PropTypes.string,
      volume: PropTypes.string,
      issue: PropTypes.string,
      pub_date: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      cover: PropTypes.shape({
        asset_id: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        image_type: PropTypes.string.isRequired
      }),
      sections: PropTypes.array,    //See SectionComp prop types directly above 
    }).isRequired,
    issues: PropTypes.array.isRequired   // Array of issue hashes
  }
  
  render() {
    let pi = this.props.issue,
        year = pi.pub_date.match(/\d{4}/),
        issueCurrent = [pi.unit_id, pi.volume, pi.issue, year]
    return (
      <section className="o-columnbox1">
        {/* ToDo: Enhance ItemActioncComp for journal issue */}
        <ItemActionsComp />
        <div className="c-pub">
          <VolumeSelector vip={issueCurrent} issues={this.props.issues} />
        {pi.cover &&
          <img className="c-scholworks__article-preview" src={"/assets/"+pi.cover.asset_id} width="150" height="200" alt="Issue cover image" />}
        {pi.title &&
          <div className="c-pub__subheading">{pi.title}</div> }
        {pi.description &&
          <p>{pi.description}</p> }
        </div>
        {/* <h3 className="o-heading3">Table of Contents</h3> */}
        <div className="o-dividecontent2x--ruled">
          {pi.sections.map(section => <SectionComp key={section.name} section={section}/>)}
        </div>
      </section>
    )
  }
}

class JournalLayout extends React.Component {
  static propTypes = {
    unit: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      extent: PropTypes.object
    }).isRequired,
    data: PropTypes.shape({
      display: PropTypes.string,
      issue: PropTypes.object,     // See IssueComp prop types directly above
      issues: PropTypes.array
    }).isRequired,
    marquee: PropTypes.shape({
      carousel: PropTypes.any,
      about: PropTypes.about
    })
  }
  
  render() {
    let data = this.props.data
    return (
      <div>
        {this.props.marquee && <MarqueeComp marquee={this.props.marquee} unit={this.props.unit}/>}
        <div className="c-columns">
          <main id="maincontent">
          {this.props.data.issue ?
            data.display=='magazine' ?
              <IssueMagazineComp issue={data.issue} issues={data.issues} />
            : <IssueSimpleComp issue={data.issue} issues={data.issues} />
          :
            <p>Currently no issues to display     {/* ToDo: Bring in issue-specific about text here? */}
            </p>
          }
          </main>
          <aside>
            <section className="o-columnbox1">
              <header>
                <h2>Journal Information</h2>
              </header>
              <JournalInfoComp />
            </section>
            {this.props.sidebar}
          </aside>
        </div>
      </div>
    )
  }
}

module.exports = JournalLayout
