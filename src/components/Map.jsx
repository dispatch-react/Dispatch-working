var React = require('react');
var reactGoogleMaps = require('react-google-maps');
var GoogleMap = reactGoogleMaps.GoogleMap;
var GoogleMapLoader = reactGoogleMaps.GoogleMapLoader;

var Map = React.createClass({
render: function() {
	return (
<GoogleMapLoader
containerElement={<div {...this.props} style={{height: "70vh"}}/>}
googleMapElement={<GoogleMap ref={(map) => console.log(map)} defaultZoom={0} defaultCenter={{lat: 45.50, lng: -73.57}} />}
/>
)

}

})



module.exports = Map;