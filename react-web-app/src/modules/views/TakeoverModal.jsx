import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import SendIcon from "@material-ui/icons/Send";
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
  responseMessage: {
    paddingTop: theme.spacing.unit * 2
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
});

class SimpleModal extends IconButton {
  state = {
    open: false,
    anchorEl0: null,
    selectedIndex0: 1,
    anchorEl1: null,
    selectedIndex1: 1,
    responseStatus: 0,
    responseMessage: "",
    isFetching: false
  };

  postTakeover = () => {
    var bodyObject = {
      $class: namespace + ".ProductHandover",
      product: namespace + ".Product#" + this.props.productId,
      issuer:
        namespace +
        ".Company#" +
        this.getCompanyFromIndex(this.state.selectedIndex0),
      next:
        namespace +
        ".Company#" +
        this.getCompanyFromIndex(this.state.selectedIndex1)
    };
    console.log(bodyObject);

    this.setState({ ...this.state, isFetching: true });
    fetch("http://34.73.109.142:3000/api/ProductHandover", {
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

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickListItem = (menu, event) => {
    switch (menu) {
      case 0:
        this.setState({ anchorEl0: event.currentTarget });
        break;
      case 1:
        this.setState({ anchorEl1: event.currentTarget });
        break;
      default:
        break;
    }
  };

  handleMenuItemClick = (menu, event, index) => {
    switch (menu) {
      case 0:
        this.setState({ selectedIndex0: index, anchorEl0: null });
        break;
      case 1:
        this.setState({ selectedIndex1: index, anchorEl1: null });
        break;
      default:
        break;
    }
  };

  handleMenuClose = menu => {
    switch (menu) {
      case 0:
        this.setState({ anchorEl0: null });
        break;
      case 1:
        this.setState({ anchorEl1: null });
        break;
      default:
        break;
    }
  };

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

  render() {
    const { classes, availableUsers } = this.props;
    const { anchorEl1, anchorEl0 } = this.state;

    return (
      <div>
        <IconButton aria-label="Add to favorites" onClick={this.handleOpen}>
          <SendIcon />
        </IconButton>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              Accept trade
            </Typography>

            <div className={classes.root}>
              <List component="nav">
                <ListItem
                  button
                  aria-haspopup="true"
                  aria-controls="lock-menu"
                  aria-label="Which user should be used as issuer?"
                  onClick={event => this.handleClickListItem(0, event)}
                >
                  <ListItemText
                    primary="Which user should be used as issuer?"
                    secondary={availableUsers[this.state.selectedIndex0]}
                  />
                </ListItem>
              </List>
              <Menu
                id="users-menu"
                anchorEl={anchorEl0}
                open={Boolean(anchorEl0)}
                onClose={event => this.handleMenuClose(0)}
              >
                {availableUsers.map((option, index) => (
                  <MenuItem
                    key={option}
                    selected={index === this.state.selectedIndex0}
                    onClick={event => this.handleMenuItemClick(0, event, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
              <List component="nav">
                <ListItem
                  button
                  aria-haspopup="true"
                  aria-controls="lock-menu"
                  aria-label="Which user should be used as receiver?"
                  onClick={event => this.handleClickListItem(1, event)}
                >
                  <ListItemText
                    primary="Which user should be used as receiver?"
                    secondary={availableUsers[this.state.selectedIndex1]}
                  />
                </ListItem>
              </List>
              <Menu
                id="users-menu"
                anchorEl={anchorEl1}
                open={Boolean(anchorEl1)}
                onClose={event => this.handleMenuClose(1)}
              >
                {availableUsers.map((option, index) => (
                  <MenuItem
                    key={option}
                    selected={index === this.state.selectedIndex1}
                    onClick={event => this.handleMenuItemClick(1, event, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={this.postTakeover}
              >
                Send&nbsp;
                <SendIcon className={classes.rightIcon}>send</SendIcon>
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
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
const TakeOverModal = withStyles(styles)(SimpleModal);

export default TakeOverModal;
