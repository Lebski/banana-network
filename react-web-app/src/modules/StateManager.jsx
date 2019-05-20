import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InfoCard from "./views/InfoCard";
import HorizontalLinearStepper from "./views/Steppers";
import Grid from "@material-ui/core/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/GetApp";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";

import {
  faCarrot,
  faTruck,
  faTruckLoading,
  faDollyFlatbed,
  faStore
} from "@fortawesome/free-solid-svg-icons";

const styles = theme => ({
  title: {
    display: "inline-block",
    padding: 30,
    color: theme.palette.secondary.light,
    fontSize: 48
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
    width: 80
  },
  fab: {
    marginTop: theme.spacing.unit * 2
  },
  root: {
    ...theme.mixins.gutters(),
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 17,

    width: "max-content",
    position: "absolute",
    top: 0,
    right: 0
  }
});

const availableUsers = [
  "BananasCorpSouthAmerica",
  "TruckfleetCo",
  "WeArePackagingPower",
  "Middlepeople",
  "EinzelhandelsGmbH"
];

class StateManager extends Component {
  state = {
    activeStep: 5,
    bananas: null,
    id: "123",
    inputChange: "123"
  };

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.getNewId = this.getNewId.bind(this);
  }

  // Responsible for network connection --> Periodic get request
  componentDidMount() {
    this.getBananas();
    this.timer = setInterval(() => this.getBananas(), 5000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  getBananas = () => {
    this.setState({ ...this.state, isFetching: true });
    fetch("http://34.73.109.142:3000/api/Product/" + this.state.id)
      .then(response => response.json())
      .then(result => {
        this.setState({ bananas: result, isFetching: false });
        this.setState({
          activeStep: this.getCurrentStep(result.position)
        });
      })
      .catch(e => console.log(e));
  };

  // UI Based stuff

  getCurrentStep(position) {
    if (position != null) {
      switch (position) {
        case "PLANTATION":
          return 0;
        case "SHIPPING":
          return 1;
        case "PACKAGING":
          return 2;
        case "WHOLESALE":
          return 3;
        case "RETAIL":
          return 4;

        default:
          return 5;
      }
    }
    return 5;
  }

  getStepContent() {
    return this.getSteps()[this.state.activeStep];
  }

  getSteps() {
    return [plantation, shipping, packaging, wholesale, retail];
  }

  renderBananas = () => {
    if (this.state.bananas == null) {
      return "";
    } else {
      return (
        <Grid container spacing={16}>
          {this.state.bananas.contracts.map(transaction => (
            <Grid item xs={3}>
              <InfoCard
                productId={this.state.bananas.ID}
                cardTime={this.state.bananas}
                transactionData={transaction}
                key={transaction.id}
                availableUsers={availableUsers}
              />
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  getNewId = () => {
    console.log(this.state.inputChange);
    this.setState({
      id: this.state.inputChange
    });
  };

  handleInputChange = event => {
    this.setState({
      inputChange: event.target.value
    });
    console.log(event.target.value);
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <HorizontalLinearStepper
          activeStep={this.state.activeStep}
          getSteps={this.getSteps()}
        />
        <div className={classes.wrapper}>
          <div className={classes.title}>
            {this.getStepContent(this.state.activeStep)}
          </div>
          {this.renderBananas()}
          <Paper className={classes.root} elevation={1}>
            <TextField
              id="input-id"
              variant="outlined"
              label="Id"
              defaultValue="123"
              className={classes.textField}
              margin="normal"
              InputProps={{
                className: classes.input
              }}
              onChange={this.handleInputChange}
            />
            <Fab
              color="primary"
              aria-label="Add"
              className={classes.fab}
              onClick={this.getNewId}
            >
              <AddIcon />
            </Fab>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

StateManager.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(StateManager);

const plantation = (
  <span>
    <FontAwesomeIcon icon={faCarrot} /> Plantation
  </span>
);

const shipping = (
  <span>
    <FontAwesomeIcon icon={faTruck} /> Shipping
  </span>
);

const packaging = (
  <span>
    <FontAwesomeIcon icon={faTruckLoading} /> Packaging
  </span>
);

const wholesale = (
  <span>
    <FontAwesomeIcon icon={faDollyFlatbed} /> Wholesale
  </span>
);

const retail = (
  <span>
    <FontAwesomeIcon icon={faStore} /> Retail
  </span>
);
