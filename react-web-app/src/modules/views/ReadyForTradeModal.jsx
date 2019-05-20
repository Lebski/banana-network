import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import CircularProgress from "@material-ui/core/CircularProgress";

var namespace = "sc.demonstrator.net";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const styles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
  },
  button: {
    marginRight: theme.spacing.unit * 1
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
});

class SimpleModal extends IconButton {
  state = {
    open: false,
    anchorEl: null,
    selectedIndex: 2,
    responseStatus: 0,
    responseMessage: "",
    isFetching: false
  };

  postReady = () => {
    var bodyObject = {
      $class: namespace + ".ProductRelease",
      product: namespace + ".Product#" + this.props.productId,
      issuer:
        namespace +
        ".Company#" +
        this.getCompanyFromIndex(this.state.selectedIndex)
    };
    console.log(bodyObject);

    this.setState({ ...this.state, isFetching: true });
    fetch("http://34.73.109.142:3000/api/ProductRelease", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyObject)
    })
      .then(response => {
        this.setState({
          responseStatus: response.status,
          responseMessage: response.statusText,
          isFetching: false
        });
        console.log(response);
      })
      .catch(e => console.log(e));
  };

  getCompanyFromIndex(index) {
    switch (index) {
      case 0:
        return "BananasCorpSouthAmerica";
      case 1:
        return "TruckfleetCo";
      case 2:
        return "WeArePackagingPower";
      case 3:
        return "Middlepeople";
      case 4:
        return "EinzelhandelsGmbH";

      default:
        return null;
    }
  }

  getResponseMessage = () => {
    if (this.state.isFetching === true) {
      return <CircularProgress className={this.props.classes.progress} />;
    }
    if (this.state.responseStatus === 200) {
      return (
        <Typography
          component="p"
          className={this.props.classes.responseMessage}
        >
          Success!
        </Typography>
      );
    } else if (this.state.responseStatus === 0) {
      return "";
    }
    return (
      <Typography component="p" className={this.props.classes.responseMessage}>
        Error: {this.state.responseMessage}
      </Typography>
    );
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, availableUsers } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton onClick={this.handleOpen}>
          <EditIcon />
        </IconButton>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              Mark as ready for trade
            </Typography>
            <Typography variant="p">
              Here you can mark the product ready for trading. After this step
              the next party can take over the item for the next production
              step.
            </Typography>

            <div className={classes.root}>
              <List component="nav">
                <ListItem
                  button
                  aria-haspopup="true"
                  aria-controls="lock-menu"
                  aria-label="Which user should be used?"
                  onClick={this.handleClickListItem}
                >
                  <ListItemText
                    primary="Which user should be used?"
                    secondary={availableUsers[this.state.selectedIndex]}
                  />
                </ListItem>
              </List>
              <Menu
                id="users-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                {availableUsers.map((option, index) => (
                  <MenuItem
                    key={option}
                    selected={index === this.state.selectedIndex}
                    onClick={event => this.handleMenuItemClick(event, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={this.postReady}
              >
                Ready&nbsp;
                <EditIcon className={classes.rightIcon}>send</EditIcon>
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={this.handleClose}
              >
                Discard&nbsp;
                <DeleteIcon className={classes.rightIcon} />
              </Button>
              <div>{this.getResponseMessage()}</div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const ReadyForTradeModal = withStyles(styles)(SimpleModal);

export default ReadyForTradeModal;
