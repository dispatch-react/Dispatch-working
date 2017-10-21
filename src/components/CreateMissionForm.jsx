var React = require('react');
var Parse = require('parse');
Parse.initialize("9fdf1f81-77f3-4a9e-b0a5-81e52bcc45d3", "TVr5WXdTpemNEMO68JexPGrqlOdv18yh");
import {Button, ButtonToolbar, ButtonGroup, Modal, Col, FormGroup, FormControl, ControlLabel, InputGroup, Checkbox} from 'react-bootstrap';

var Autocomplete = require('./Autocomplete.jsx');

var CreateMissionForm = React.createClass({
  getInitialState() {
    return {
        showModal: false,
        title: '',
        value: '',
        lat: '',
        lng: '',
        att: null,
        description: '',
        carReq: false,
        remote: false,
        category: 'other',
        locationDefined: false
    };
  },
  handleTitleChange: function(e) { this.setState({ title: e.target.value }) },
  handleValueChange: function(e) { this.setState({ value: e.target.value }) },
  handleDescriptionChange: function(e) { this.setState({ description: e.target.value }) },
  handleCarReqChange: function(e) { this.setState({ carReq: !this.state.carReq }) },
  handleRemoteChange: function(e) { this.setState({ remote: !this.state.remote }) },
  handleCategoryChange: function(e) { this.setState({ category: e.target.value }) },
  handleStartLocationChange: function(e) {
    this.setState({
      lat: e.latitude,
      lng: e.longitude,
      locationDefined: true
    })
  },
  handleFormSubmit: function(e) {
    e.preventDefault();
    var self = this;
    var Mission = Parse.Object.extend('Missions');
    var mission = new Mission();
    mission.set('progress: ', 1)
    var att = null;
    var loc = new Parse.GeoPoint({latitude: this.state.lat, longitude: this.state.lng});
    console.dir(this.state)
    let fileUpload = this.state.att
    // Define function to post a mission
    function postMission() {
      console.log('invoked postMission')
      mission.set('title', self.state.title);
      mission.set('value', self.state.value);
      mission.set('startLocationGeo', loc);
      mission.set('description', self.state.description);
      mission.set('category', self.state.category);
      mission.set('carReq', self.state.carReq);
      mission.set('remote', self.state.remote);
      mission.set('missionAttachment', att);
      mission.set('createdBy', self.props.user);
      mission.set('status', 'open');
      mission.set('createdByUsername', self.props.user.userName);
      mission.save(null, {
          success: function(mission){
            self.props.addMission(mission)
            console.log('mission saved')
            console.dir(mission)
          },
          error: function(mission, error){
            console.error(error)
            alert('there was an error, check that console')
          }
        })
      }
      //Check for uploaded file and call postMission either way
      if (!this.state.att) {
        postMission();
        self.close();
      } else {
        let attachment = new Parse.File('attach', fileUpload);
        attachment.save().then(function(){
          postMission();
          self.close();
        });
      }
    },
    close() { this.setState({ showModal: false }) },
    open() { this.setState({ showModal: true }) },
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
                <FormGroup>
                  <ControlLabel>Mission Title</ControlLabel>
                  <FormControl type="text" placeholder="Run the jewels..." onChange={this.handleTitleChange} required/>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Mission Description</ControlLabel>
                  <FormControl componentClass="textarea" onChange={this.handleDescriptionChange} required/>
                </FormGroup>
                <FormGroup>
                  <FormControl type="select" componentClass="select" onChange={this.handleCategoryChange}>
                    <option readOnly>-Select a Category-</option>
                    <option value="construction, trades">Construction, Trades</option>
                    <option value="bar, food, hospitality">Bar, Food, Hospitality</option>
                    <option value="housekeeping, childcare">Housekeeping, Childcare</option>
                    <option value="driver, delivery">Driver, Delivery</option>
                    <option value="gigs">Gigs</option>
                    <option value="general labour">General Labour</option>
                    <option value="other">Other</option>
                  </FormControl>
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Addon>$</InputGroup.Addon>
                    <FormControl type="text" onChange={this.handleValueChange} placeholder="1,000,000"/>
                    <InputGroup.Addon>.00</InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
                <Autocomplete setLocation={this.handleStartLocationChange} className="autocomplete"/>
                <Checkbox onChange={this.handleCarReqChange} checked={this.state.carReq} inline>Car required</Checkbox>
                <Checkbox onChange={this.handleRemoteChange} checked={this.state.remote} inline>Remote Work (ie online)</Checkbox>
                <FormGroup>
                  <ControlLabel>Mission Attachment</ControlLabel>
                  <FormControl type="file" id="MissionAttachment" onChange={(e) => this.setState({att: e.target.files[0]})} ref={(ref) => this.fileUpload = ref} placeholder="attachment" />
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Col xs={4} md={2}>
                    <Button type="reset" value="Reset">Reset</Button>
                </Col>
                <Col xs={4} xsOffset={4} md={2} mdOffset={8}>
                    <Button bsStyle="success" type="submit">Dispatch!</Button>
                </Col>
              </Modal.Footer>
            </form>
          </Modal>
        </div>
      )
    }
})

module.exports = CreateMissionForm;
