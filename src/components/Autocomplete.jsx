var React = require('react');

var Autocomplete = React.createClass({
    getInitialState: function(){
                return {
                    lat: '',
                    lng: '',
                    location: ''
                }  
    },
    setupInput: function() {
        var nthis = this;
        var input = this.refs.searchField;
        google.maps.event.clearInstanceListeners(input);
        var autocomplete = new google.maps.places.Autocomplete(input);
        
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            var place = autocomplete.getPlace();
            var lat = place.geometry.location.lat()
            var lng = place.geometry.location.lng()
             
            nthis.props.setLocation({latitude: lat, longitude: lng})

         });
     },
     componentDidMount() {
        this.setupInput();
     },
     handleChange(e){
        this.setState({
            location: e.target.value
        })
     },
     keyPressed(e){
         console.log(e)
         if (e.keyCode === 13){
         e.preventDefault();
         }
     },
     
     render: function() {
       return (
           <div>
               <input onKeyDown={this.keyPressed} className="autocomplete" ref="searchField" type="text" size="50" required onChange={this.handleChange} placeholder="Enter a Location"/>
           </div>
           );
   }
   });



module.exports = Autocomplete;