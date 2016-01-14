var React = require('react');
var Parse = require('parse');
var ParseReact = require('parse-react');

var Button = require('react-bootstrap').Button;
var Image = require('react-bootstrap').Image;
var Panel = require('react-bootstrap').Panel;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Input = require('react-bootstrap').Input;
var FormControls = require('react-bootstrap').FormControls;
var Label = require('react-bootstrap').Label;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;

var Profile = React.createClass({

    getInitialState: function() {
        return {
            showButton: true
        }
    },
    toggleImgUpload: function() {
        this.setState({
            showButton: !this.state.showButton
        });
    },
    handleImgUpload: function(e) {
        var nthis = this;

        e.preventDefault();
        var fileUpload = this.refs.fileUpload.getInputDOMNode().files;
        var newPic = fileUpload[0]

        var att = new Parse.File("attach", newPic);
        att.save().then(function(file) {

            var target = {
                className: '_User',
                objectId: nthis.props.user.objectId
            };
            var changes = {
                profile_pic: file
            };
            var updater = ParseReact.Mutation.Set(target, changes)
            updater.dispatch().then(function(res) {
                    alert('profile photo succesfully updated')
                    nthis.toggleImgUpload()
                },
                function(error) {
                    alert('bad file')
                })
        })
    },

    render: function() {
        var title = (<h1>Profile</h1>)
        var imgUpdater;
        if (this.state.showButton) {
            imgUpdater = <Button bsStyle="default" id="updatePhoto" onClick={this.toggleImgUpload} type="button">Update Photo</Button>
        }
        else {
            imgUpdater =
                <Input type="file" id="newProfilePic" ref="fileUpload" label="File" 
                onChange={this.handleImgUpload}
            />
        }
        var profilePic;
        if (this.props.user.profile_pic) {
            profilePic = <Image id="profile-pic" src={this.props.user.profile_pic._url} rounded/>
        }
        else {
            profilePic = <Image id="profile-pic" src="../src/img/bullhorn.png" rounded/>
        }
        return (
            <div id="viewContent">
        <Panel header={title} bsStyle="info">
            <Row>
                <Col xs={12} md={8}>
                    <ListGroup>
                        <ListGroupItem><Label>username:</Label> <span id="userInfo">{this.props.user.userName}</span></ListGroupItem>
                        <ListGroupItem><Label bsStyle="info">email:</Label> <span id="userInfo">{this.props.user.email}</span></ListGroupItem>
                        <ListGroupItem><Label bsStyle="warning">rating:</Label> <span id="userInfo">{this.props.user.userRating}</span></ListGroupItem>
                    </ListGroup>
                </Col>
    
                <Col xs={4} xsOffset={4} md={4} mdOffset={0}>
                             {profilePic}
                    <div>
                             {imgUpdater}
                    </div>
                    
                </Col>  
            </Row>
        </Panel>
    </div>
        )
    }
});



module.exports = Profile;