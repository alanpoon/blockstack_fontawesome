import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat,faCrow,faDog } from '@fortawesome/free-solid-svg-icons'
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      newStatus:"",
      status:"",
      selectedOption:""
  	};
  }
  saveNewStatus(statusText,selectedOption) {
     const { userSession } = this.props

     let status = {
       text: statusText.trim(),
       selectedOption: selectedOption,
       created_at: Date.now()
     }

     const options = { encrypt: false }
     userSession.putFile('status.json', JSON.stringify(status), options)
       .then(() => {
         this.setState({
           newStatus: status.text,
           selectedOption: status.selectedOption
         })
       })
  }
  fetchData() {
   const { userSession } = this.props
   const options = { decrypt: false }
   userSession.getFile('status.json', options)
     .then((file) => {
       var status = JSON.parse(file || '[]')
       console.log(status)
       this.setState({
         status:status
       })
     })
     .finally(() => {
       console.log("read over")
     })
  }
  handleNewStatusChange(event) {
    this.setState({newStatus: event.target.value})
  }

  handleNewStatusSubmit(event) {
    this.saveNewStatus(this.state.newStatus,this.state.selectedOption)
    this.setState({
      newStatus: "",
      status:{selectedOption: this.state.selectedOption,status:this.state.newStatus}
    })
  }
  
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    let x = this.state.status.selectedOption==="cat"?faCat:this.state.status.selectedOption==="crow"?faCrow:this.state.status.selectedOption==="dog"?faDog:null;
    console.log(person)
    return (
      !userSession.isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
        </div>
        <p>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</p>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ handleSignOut.bind(this) }
          >
            Logout
          </button>
        </p>
        <br/>
        <br/>
        <textarea className="input-status"
                 value={this.state.newStatus}
                 onChange={e => this.handleNewStatusChange(e)}
                 placeholder="输入状态"
               />
        <br/>
        <form>
          <div className="radio">
            <label>
              <input type="radio" value="cat" 
                            checked={this.state.selectedOption === 'cat'} 
                            onChange={e => this.handleOptionChange(e)} />
              cat
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" value="crow" 
                            checked={this.state.selectedOption === 'crow'} 
                            onChange={e => this.handleOptionChange(e)} />
              crow
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" value="dog" 
                            checked={this.state.selectedOption === 'dog'} 
                            onChange={e => this.handleOptionChange(e)} />
              dog
            </label>
          </div>
        </form>

        <p>  status is: {this.state.status.text}</p>        
        <FontAwesomeIcon icon={x} /><br/>
        <button
                 className="btn btn-primary btn-lg"
                 onClick={e => this.handleNewStatusSubmit(e)}
                >
                提交
        </button>
      </div> : null
    );
  }
  componentDidMount() {
    this.fetchData()
  }
  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }
}
