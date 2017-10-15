var React = require('react');
var Parse = require('parse');
Parse.initialize("9fdf1f81-77f3-4a9e-b0a5-81e52bcc45d3", "TVr5WXdTpemNEMO68JexPGrqlOdv18yh");

var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;
var ButtonInput = require('react-bootstrap').ButtonInput;
var FormControls = require('react-bootstrap').FormControls;
var Col = require('react-bootstrap').Col;

var Autocomplete = require('./Autocomplete.jsx');


var CreateMissionForm = React.createClass({

    getInitialState() {
            return {
                showModal: false,
                title: '',
                value: '',
                lat: '',
                lng: '',
                description: '',
                carReq: false,
                remote: false,
                category: 'other',
                locationDefined: false
            };
        },

        handleTitleChange: function(e) {
        this.setState({
            title: e.target.value
        });
    },
        handleValueChange: function(e) {
        this.setState({
            value: e.target.value
        });
    },
        handleDescriptionChange: function(e) {
            this.setState({
                description: e.target.value
        });
    },
        handleCarReqChange: function(e) {
            this.setState({
                carReq: !this.state.carReq
        });
    },
        handleRemoteChange: function(e) {
            this.setState({
                remote: !this.state.remote
        });
    },
        handleCategoryChange: function(e) {
        this.setState({
            category: e.target.value
        })
    },
        handleStartLocationChange: function(e) {
            this.setState({
                lat: e.latitude,
                lng: e.longitude,
                locationDefined: true
            })
        },
        handleFormSubmit: function(e) {
          console.log('captured form submission')
            e.preventDefault();
            var self = this;
            var att;
            var loc = 'montreal'
            var Mission = Parse.Object.extend('Missions');
            var mission = new Mission();
            console.log('mission: ');
            console.dir(mission)
            mission.set('progress: ', 1)
            //var loc = new Parse.GeoPoint({latitude: this.state.lat, longitude: this.state.lng});
            //var fileUpload = this.refs.fileUpload.getInputDOMNode().files;
            var fileUpload = [];
            console.log('state is: ')
            console.dir(this.state)

            // Define function to post a mission

            function postMission() {
              console.log('invoked postMission')
                mission.set("title", self.state.title);
                mission.set("value", self.state.value);
                mission.set("startLocationGeo", loc);
                mission.set("description", self.state.description);
                mission.set("category", self.state.category);
                mission.set("carReq", self.state.carReq);
                mission.set("remote", self.state.remote);
                mission.set("missionAttachment", att);
                //mission.set("createdBy", self.props.user);
                //mission.set("createdByUsername", self.props.user.userName);
                console.dir(mission);

                // ...and execute it
                mission.save(null, {
                    success: function(mission){
                      console.log("mission saved")
                    },
                    error: function(mission, error){
                      console.error(error)
                      alert('there was an error, check that console')
                    }
                  })
                }

            //Check for uploaded file and call postMission either way

            if (fileUpload.length === 0) {
                att = null;
                self.close();
                postMission();
            } else {
                console.log('found attachment')
                var file = fileUpload[0];
                att = new Parse.File("attach", file);
                att.save().then(function(){
                    self.close();
                    postMission();
                });
            }
        },
        close() {
            this.setState({
                showModal: false
            });
        },
        open() {
            this.setState({
                showModal: true
        });
        },

        render: function() {

            return (
      <div>
        <img onClick={this.open} src="img/dispatchr-clear-bg-logo.png" id="nav-icon"/>
        <Modal show={this.state.showModal} onHide={this.close}>
        <form onSubmit={this.handleFormSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Dispatchr</Modal.Title>
          </Modal.Header>
          <Modal.Body>


            <Input type="text" placeholder="Mission Title" onChange={this.handleTitleChange} required/>
            <Input type="textarea" label="Mission description" onChange={this.handleDescriptionChange} required/>
            <Input type="text" onChange={this.handleValueChange} addonBefore="Set Bounty" addonAfter="$" required/>
            <Autocomplete setLocation={this.handleStartLocationChange} className="autocomplete"/>

            <Input type="select" label="Category" labelClassName="col-xs-2" wrapperClassName="col-xs-5" onChange={this.handleCategoryChange}>
              <option readOnly>-Select a Category-</option>
              <option value="construction, trades">Construction, Trades</option>
              <option value="bar, food, hospitality">Bar, Food, Hospitality</option>
              <option value="housekeeping, childcare">Housekeeping, Childcare</option>
              <option value="driver, delivery">Driver, Delivery</option>
              <option value="gigs">Gigs</option>
              <option value="general labour">General Labour</option>
              <option value="other">Other</option>
            </Input>

            <Input type="checkbox" label="Car required" wrapperClassName="col-xs-6" onChange={this.handleCarReqChange} checked={this.state.carReq} />

            <Input type="checkbox" label="Remote Work" wrapperClassName="col-xs-6" onChange={this.handleRemoteChange} checked={this.state.remote} />

            <Input type="file" id="MissionAttachment" ref="fileUpload" placeholder="attachment" help="[Optional]" />

            </Modal.Body>
            <Modal.Footer>
              <Col xs={4} md={2}>
                  <ButtonInput type="reset" value="Reset"/>
              </Col>
              <Col xs={4} xsOffset={4} md={2} mdOffset={8}>
                  <ButtonInput bsStyle="success" type="submit" value="Dispatch!" />
              </Col>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
            );
        }
});

module.exports = CreateMissionForm;
