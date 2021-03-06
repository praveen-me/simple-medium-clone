import React, { Component } from 'react';
import {addStory} from '../../store/actions/storyActions';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import { setInitialUser } from '../../store/actions/authActions';


class AddStory extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      storyInfo : {
        title : '',
        description : '',
        cover : ''
      },
      errMsg : '',
      isLoading : false
    }
  }

  componentWillMount() {
    this.props.dispatch(setInitialUser())
  }
  

  handleSubmit = e => {
    e.preventDefault();
    const {_id} = this.props.currentUser;
    this.setState({
      isLoading : true
    })

    // check if internet connection is there
    if(navigator.onLine && _id) {
      fetch('/api/add-story', {
        method : "POST",
        headers : {
          'Content-Type' : "application/json"
        },
        body : JSON.stringify(this.state.storyInfo)
      })
        .then(res => res.json())
        .then(data => {
          this.setState({
            isLoading : false
          })
          // call action here
          this.props.dispatch(addStory(data));
          this.props.history.push('/');
        })
        .catch(err => {
          this.setState({
            isLoading : false,
            errMsg : 'Failed to save your story. Please try again.'
          })
        })
    } else {
      this.setState({
        isLoading : false,
        errMsg : "Please connected to a secure connection."
      })
    }  
  }

  handleChange = e => {
    const elm = e.target;
    if(e.target.id === 'cover') {
      this.setState({
        ...this.state,
        storyInfo : {
          ...this.state.storyInfo,
          [e.target.name] : URL.createObjectURL(elm.files[0])
        }
      })
    } else {
      this.setState({
        ...this.state,
        storyInfo : {
          ...this.state.storyInfo,
          [e.target.name] : e.target.value
        }
      })
    } 
  }

  render() {
    if(!this.props.currentUser._id) return <Redirect to="/login"/>

    return (
      <div className="add_story wrapper-big">
        <h2 className="add_story-head center">add your new story</h2>
        <form className="add_story-form" onSubmit={this.handleSubmit}>
          <input type="text" 
          name="title" 
          placeholder="Title" 
          onChange={this.handleChange}/>
          <div className="file-btn">
            <input type="file" 
            name="cover" 
            id="cover" 
            className="file-hide" 
            accept="image/png, image/jpeg" 
            onChange={this.handleChange}/>
            <div className="file-show">Upload Cover</div>
          </div>
          <textarea name="description" 
          cols="30" 
          rows="15" 
          className="description" 
          onChange={this.handleChange}></textarea>
          <button type="submit" className="btn story-btn">Add Story</button>
        </form>
        {/* {
          storyInfo.cover ? <img src={storyInfo.cover} alt=""/> : ''
        } */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser : state.currentUser
  }
}

export default connect(mapStateToProps)(AddStory);