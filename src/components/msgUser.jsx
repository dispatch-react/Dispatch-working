var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;
var Label = require('react-bootstrap').Label;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Modal = require('react-bootstrap').Modal;
var Profile = require('./Profile.jsx');
var Image = require('react-bootstrap').Image;

var msgUser = React.createClass({
    mixins: [ParseReact.Mixin],
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
            userHometown: null
        }
    },
        observe: function () {
                return {
                    messages: (new Parse.Query("Messages"))
                };
            },
        close() {
        this.setState({
            showModal: false
        });
    },
        open() {
            this.setState({
                showModal: true,
        })
    },
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
        user.get(self.props.recipient.objectId).then(function (user) {
            self.setState({
                userEmail: user.get("email"),
                userScore: user.get("RatingScore"),
                userProfilePicture: user.get("profile_pic") ? user.get("profile_pic").url() : null,
                userHometown: user.get("Hometown"),
                agent: user.get("userName")
            })
        });
        this.setState({
            recipient: self.props.recipient,
            recipientUserName: self.props.recipientUsername,
            messageType: 'activeReply',
            missionLink: this.props.missionLink,
            showModal: true
        })
    },
        handleBodyChange: function (e) {
            this.setState({
                text: e.target.value
            })
    },
        sendMessage: function (e) {
            e.preventDefault();
            var nthis = this;
            var att;
            var fileUpload = this.refs.fileUpload.getInputDOMNode().files;
    
            function sendMessage() {
    
                var creator = ParseReact.Mutation.Create('Messages', {
                    content: nthis.state.text,
                    attachment: att,
                    createdBy: nthis.props.user,
                    writtenTo: nthis.state.recipient,
                    authorUserName: nthis.props.user.userName,
                    authorEmail: nthis.props.user.email,
                    type: nthis.state.messageType,
                    missionLink: nthis.state.missionLink,
                    read: false
                });
                // ...and execute it
                creator.dispatch().then(function (res) {
                        alert('message sent')
                        nthis.refs.formElement.reset();
                        nthis.setState({recipientUserName: 'No user selected...'})
                    },
                    function (error) {
                        alert('there was an error, check your self')
                    });
            }
    
            //Check for uploaded file and call sendMsg either way
    
            if (fileUpload.length === 0) {
                var att = null;
                sendMessage();
    
            }
            else {
                var file = fileUpload[0];
                att = new Parse.File("attach", file);
                att.save().then(function () {
                    sendMessage();
                });
            }

    },
        render: function() {
    return (
        <div>
            <ListGroupItem>
                <Label bsStyle="warning">Dispatchr:</Label> 
                <span id="missionInfo" onClick={this.show}>{this.props.recipientUsername}</span>
            </ListGroupItem>
            
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agent Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={8} md={8}>
                                <ListGroup>
                                    <ListGroupItem><Label>username:</Label> <span
                                        id="userInfo">{this.state.agent}</span></ListGroupItem>
                                    <ListGroupItem><Label bsStyle="info">email:</Label> <span
                                        id="userInfo">{this.state.userEmail}</span></ListGroupItem>
                                    <ListGroupItem><Label bsStyle="warning">rating:</Label> <span
                                        id="userInfo">{this.state.userScore}</span></ListGroupItem>
                                    <ListGroupItem><Label bsStyle="primary">Hometown:</Label> <span
                                        id="userInfo">{this.state.userHometown}</span></ListGroupItem>
                                </ListGroup>
                            </Col>
                            <Col xs={4} md={4}>
                                {this.state.userProfilePicture ? <Image id="profile-pic" src={this.state.userProfilePicture}/> : <Image id="profile-pic" src="../src/img/Spy.png" />}
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
                                            <Input type="textarea" placeholder="Message Body"
                                                   onChange={this.handleBodyChange}/>
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
        )}
});

module.exports = msgUser;