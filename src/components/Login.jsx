var React = require('react');
var Parse = require('parse');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var Login = React.createClass({
    getInitialState: function() {
        return {
            email: '',
            password: '',
            confPw: '',
            username: '',
            login: true
        };
    },

    handleEmailChange: function(e) {
        this.setState({
            email: e.target.value
        });
    },
    handleUsernameChange: function(e) {
        this.setState({
            username: e.target.value
        });
    },
    handlePasswordChange: function(e) {
        this.setState({
            password: e.target.value
        });
    },
    handleConfPasswordChange: function(e) {
        this.setState({
            confPw: e.target.value
        });

    },
    handleTypeChange: function(e) {
        this.setState({
            login: !this.state.login
        });
    },

    /*LogIn Function*/

    logIn: function(e) {
        var self = this;
        e.preventDefault();
        Parse.User.logIn(this.state.email, this.state.password).then(function(user) {
            //alert('welcome back!'); //ALERT will mess with the loading animation
            self.props.onChange('home')
        }, function(user, error) {
            alert('bad login, check your inputs');
        });
    },

    /* SignUp Function */

    signUp: function(e) {
        var self = this;
        e.preventDefault();
        var user = new Parse.User();
        user.set("username", this.state.email);
        user.set("password", this.state.password);
        user.set("email", this.state.email);
        user.set("userName", this.state.username);

        user.signUp(null, {
            success: function(user) {
                self.props.onChange('home')
                // Hooray! Let them use the app now.
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    },

    /*Rendering the Login Page OR Register, based on this.state.login*/

    render: function() {
        if (this.state.login) {
            return (
                <div>

            <h2 style={{color: "#222", textAlign: "center"}}>Dispatchr</h2>
            <p style={{color: "#222", textAlign: "center"}}>Welcome Back</p>
                    <br/>
        
         <form className="form-horizontal" onSubmit={this.logIn}>
         
        {/*EMAIL AND PASSWORD FIELDS*/}
        
    <div className="input-group">
      <span className="input-group-addon"><i className="fa fa-at"></i></span>
      <input type="text" className="form-control" placeholder=" Email" id="formEmail" onChange={this.handleEmailChange}></input>
    </div>
             <br/>
    <div className="input-group">
      <span className="input-group-addon"><i className="fa fa-key"></i></span>
      <input type="password" className="form-control" placeholder=" Password" id="formPw" onChange={this.handlePasswordChange}></input>
    </div>
    
        <br/> {/*BUTTONS TO LOGIN OR GO TO REGISTRATION*/}

  <div>
    
    <Button bsStyle="success" bsSize="large" block disabled={!(this.state.email.length && this.state.password.length)} type="submit">Sign In
    <span className="fa fa-sign-in"></span>
    </Button>
    
    <Button bsStyle="primary" bsSize="large" type="reset" block id="register-btn" onClick={this.handleTypeChange}>
    Create
    <span className="fa fa-user-plus"></span>
    </Button>
  </div>

      </form>
      
      </div>)
        }
        else {
            /*RENDERING THE REGISTER PAGE*/

            return (<div>

      <h1 style={{color: "#222", textAlign: "center"}}>Get Busy!</h1>
        
      <form onSubmit={this.signUp} className="form-horizontal">
         
        {/*EMAIL AND PASSWORD FIELDS*/}
    
    <div className="input-group">
      <span className="input-group-addon"><i className="fa fa-at"></i></span>
      <input type="email" className="form-control" placeholder=" Email" id="formEmail" onChange={this.handleEmailChange} required></input>
    </div>
    
    <div className="input-group">
      <span className="input-group-addon"><i className="fa fa-user"></i></span>
      <input type="text" className="form-control" placeholder=" Username" id="formUsername" onChange={this.handleUsernameChange} required></input>
    </div>

    <div className="input-group">
      <span className="input-group-addon"><i className="fa fa-key"></i></span>
      <input type="password" className="form-control" placeholder=" Password" id="formPw" onChange={this.handlePasswordChange} required></input>
    </div>
    
    <div className="input-group" id="pwConfirm">
      <span className="input-group-addon"><i className="fa fa-key"></i></span>
      <input type="password" className="form-control" placeholder=" Confirm Password" onChange={this.handleConfPasswordChange} required></input>
    </div>
    
        <br/> {/*BUTTONS TO REGISTER*/}
    <div>
        <Button bsStyle="info" bsSize="large" id="register-btn" block type="submit"
            disabled={!(this.state.email.length && this.state.password.length && (this.state.confPw === this.state.password))}
            >Sign Up
          <span className="fa fa-user-plus"></span>
        </Button>
        
        {/* Button to go back */}
        <Button bsStyle="warning" bsSize="large" id="back-to-login" type="reset" block onClick={this.handleTypeChange}>Go back
          <span className="fa fa-sign-in"></span>
        </Button>
    </div>

      </form> </div>);
        }
    }
});


module.exports = Login;