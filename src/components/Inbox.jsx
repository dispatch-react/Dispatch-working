var React = require('react');
var Parse = require('parse');
import {Input, Button, Row, Col, Panel, Label, ListGroup, ListGroupItem, Modal, Image} from 'react-bootstrap'
var Profile = require('./Profile.jsx');

var Inbox = React.createClass({

  getInitialState: function () {
    return {
      text: '',
      messageType: 'reply',
      recipient: '',
      recipientUserName: 'No user selected...',
      showModal: false,
      agent: null,
      userEmail: null,
      userProfilePicture: null,
      userScore: null,
      userHometown: null,
      inbox: []
    }
  },
  setButtonValueR: function() {this.setState({buttonValue: "Reject"})},
  setButtonValueA: function() {this.setState({buttonValue: "Accept"})},
  setRecipientMissionReply: function (userObj, userName, missionLink) {
      let self = this;

      //DO NOT DELETE! KEEP FOR REFERENCE!
      //Here we are looping over all the users.

      //var query = new Parse.Query(Parse.User);
      //    query.find().then(function(users){
      //        users.forEach(function(user){
      //            console.log(user.get("email"))
      //        })
      //    });

      //Find the user and set the state.
      var user = new Parse.Query(Parse.User);
      user.get(userObj.objectId).then(function (user) {
        self.setState({
          userEmail: user.get("email"),
          userScore: user.get("RatingScore"),
          userProfilePicture: user.get("profile_pic") ? user.get("profile_pic").url() : null,
          userHometown: user.get("Hometown"),
          agent: user.get("userName")
        })
      })
      this.setState({
        recipient: userObj,
        recipientUserName: userName,
        messageType: 'acceptedReply',
        missionLink: missionLink,
        showModal: true
    })
  },
  handleBodyChange: function (e) { this.setState({ text: e.target.value }) },
  sendMessage: function (e) {
    e.preventDefault();
    var self = this;
    var Message = Parse.Object.extend('Messages');
    var message = new Message();
    message.set('content', self.state.text)
    message.set('createdBy', self.props.user)
    message.set('writtenTo', self.state.recipient)
    message.set('authorUserName', self.props.user.userName)
    message.set('authorEmail', self.props.user.email)
    message.set('type', self.state.messageType)
    message.set('missionLink', self.state.missionLink)
    message.set('read', false)
    message.save(null, {
      success: function () {
        alert('message sent')
        self.refs.formElement.reset();
        self.setState({recipientUserName: 'No user selected...'})
        self.close();
      },
      error: function () {
        alert(`couldn't send that message`)
      }
    })
  },
  acceptApplicant: function (userObj, userName, missionLink, message, e) {
    var nthis = this;
    e.preventDefault();
    // ParseReact.Mutation.Destroy(message).dispatch()
    // if (this.state.buttonValue === "Accept") {
    //   ParseReact.Mutation.Set(missionLink, {status: 'active', activeAgent: userObj, acceptedAgentUsername: userName}).dispatch()
    //   ParseReact.Mutation.Create('Messages', {
    //     content: 'Mission is active! Go for it',
    //     createdBy: nthis.props.user,
    //     writtenTo: userObj,
    //     authorUserName: nthis.props.user.userName,
    //     authorEmail: nthis.props.user.email,
    //     type: 'applicationAccepted',
    //     missionLink: missionLink,
    //     read: false
    //   }).dispatch()
    //   alert('Mission is set to active!')
    // }
    // else {
    //   ParseReact.Mutation.Create('Messages', {
    //     content: 'Application rejected',
    //     createdBy: nthis.props.user,
    //     writtenTo: userObj,
    //     authorUserName: nthis.props.user.userName,
    //     authorEmail: nthis.props.user.email,
    //     type: 'applicationRejected',
    //     missionLink: missionLink,
    //     read: false
    //   }).dispatch()
    //   alert('Application Rejected')
    // }
  },
  expandMessages (m) {
    return {
      writtenTo: m.get('writtenTo'),
      content: m.get('content'),
      type: m.get('type'),
      createdBy: m.get('createdBy'),
      authorUserName: m.get('authorUserName'),
      missionLink: m.get('missionLink'),
      objectId: m.id
    }
  },
  componentWillMount() {
    let self = this
    var messageQuery = new Parse.Query("Messages").equalTo("writtenTo", this.props.user).descending('createdAt')
    messageQuery.find({
      success: function (results) {
        self.setState({ inbox:
          results.map(m => self.expandMessages(m)),
          loading: false
        })
      },
      error: function(error, results){
        console.log('retrieve missions error: logging out')
        console.error(error)
        Parse.User.logOut();
      }
    })
  },
  close() { this.setState({ showModal: false }) },
  render: function () {
    var self = this;
    var title = (<h1>Inbox</h1>);
    var Buttons;
    console.dir(this.state)
    return (
      <div id="viewContent">
        {/* Begin the inbox section*/}
        <Panel header={title} bsStyle="success">
          <Row>
            {this.state.inbox.map(function (c) {
              if (c.type === "missionAccepted") {
                Buttons = (
                  <form onSubmit={self.acceptApplicant.bind(self, c.createdBy, c.authorUserName, c.missionLink, c)}>
                    <Col xs={2}><Button bsStyle="danger" type="submit" onClick={self.setButtonValueR}>Reject</Button></Col>
                    <Col xs={2}><Button bsStyle="success" type="submit" onClick={self.setButtonValueA}>Accept</Button></Col>
                  </form>
                )
              }
              else {
                Buttons = (<span></span>)
              }
              return (
                <Panel key={c.objectId}>
                  <ListGroup fill>
                    <ListGroupItem>
                      <Row>
                        <Col xs={2}>
                          <Label bsStyle="info" id="msgAuthor" onClick={self.setRecipientMissionReply.bind(self, c.createdBy, c.authorUserName, c.missionLink, c)}>{c.authorUserName}</Label>
                        </Col>
                        <Col xs={6}>
                          <span id="msgInfo">{c.content}</span>
                        </Col>
                        {Buttons}
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                </Panel>
                )
              }
            )}
          </Row>
        </Panel>
    {/* Begin the send message function*/}
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Agent Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={8} md={8}>
                <ListGroup>
                  <ListGroupItem><Label>username:</Label> <span id="userInfo">{this.state.agent}</span></ListGroupItem>
                  <ListGroupItem><Label bsStyle="info">email:</Label> <span id="userInfo">{this.state.userEmail}</span></ListGroupItem>
                  <ListGroupItem><Label bsStyle="warning">rating:</Label> <span id="userInfo">{this.state.userScore}</span></ListGroupItem>
                  <ListGroupItem><Label bsStyle="primary">Hometown:</Label> <span id="userInfo">{this.state.userHometown}</span></ListGroupItem>
                </ListGroup>
              </Col>
              <Col xs={4} md={4}>
                {this.state.userProfilePicture ? <Image id="profile-pic" src={this.state.userProfilePicture}/> : <Image id="profile-pic" src="img/Spy.png" />}
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <form onSubmit={this.sendMessage} ref="formElement">
                  <h1>Send a new message</h1>
                  <Row id="recipient">
                    <Col xs={2}>
                        <Label>To:</Label>
                    </Col>
                    <Col xs={10}>
                        <Label bsStyle="info">{this.state.recipientUserName}</Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2}>
                      <Label>Message:</Label>
                    </Col>
                    <Col xs={10}>
                      <Input type="textarea" placeholder="Message Body" onChange={this.handleBodyChange} required/>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2} xsOffset={10}>
                      <Button bsStyle="primary" type="submit">Send</Button>
                    </Col>
                  </Row>
                </form>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
})

module.exports = Inbox;
