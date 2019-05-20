import React from "react";
import PropTypes from "prop-types";
import TakeOverModal from "./TakeoverModal";
import ReadyForTradeModal from "./ReadyForTradeModal";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faPenSquare } from "@fortawesome/free-solid-svg-icons";

const styles = theme => ({
  card: {
    maxWidth: 400,
    marginLeft: 40,
    marginBottom: 30
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },

  icon: {
    fontSize: 100,
    textAlign: "center",
    padding: 50
  },
  pending: {
    color: "#f44336"
  },
  arrived: {
    color: "#4caf50"
  }
});

/*
function getDate(dateString) {
  var today = new Date(dateString);
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  var hh = String(today.getHours());
  var min = String(today.getMinutes());
  var sec = String(today.getSeconds());

  var formatedDate =
    dd + "." + mm + "." + yyyy + " " + hh + ":" + min + ":" + sec;
  return formatedDate;
}
*/
class InfoCard extends React.Component {
  state = {
    expanded: false,
    lat: 50.000012,
    long: 40.0002,
    weight: 500
  };

  componentDidMount() {
    switch (this.parseComposerID(this.props.transactionData.issuer)) {
      case "BananasCorpSouthAmerica":
        this.setState({
          lat: 40.0002,
          long: 50.20003,
          image:
            "https://images.unsplash.com/photo-1552901633-210088e17486?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
        });
        break;
      case "TruckfleetCo":
        this.setState({
          lat: 40.0002,
          long: 50.00003,
          image:
            "https://images.unsplash.com/photo-1506306460327-3164753b74c7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80"
        });
        break;
      case "WeArePackagingPower":
        this.setState({
          lat: 40.0002,
          long: 50.00003,
          image:
            "https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1368&q=80"
        });
        break;
      case "Middlepeople":
        this.setState({
          lat: 40.0002,
          long: 50.00003,
          image:
            "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80"
        });
        break;
      case "EinzelhandelsGmbH":
        this.setState({
          lat: 40.0002,
          long: 50.00003,
          image:
            "https://images.unsplash.com/photo-1541855099555-42c6a7c57cfa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
        });
        break;

      default:
        console.log("Could not read issuer");
    }
  }

  parseComposerID(string) {
    return string.split("#")[1];
  }

  getExpandedInfo = () => {
    return (
      <div>
        <p>
          <b>Weight: </b>
          {this.state.weight} lbs
        </p>

        <p>
          <b>Location: </b>
          <a
            href={this.getLocationLink()}
            rel="noopener noreferrer"
            target="_blank"
          >
            {this.state.lat} /{this.state.long}
          </a>
        </p>
      </div>
    );
  };

  getLocationLink = () => {
    return (
      "https://www.latlong.net/c/?lat=" +
      this.state.lat +
      "&long=" +
      this.state.long
    );
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  pendignState = () => {
    if (!this.props.transactionData.ready) {
      return (
        <IconButton
          className={this.props.classes.pending}
          aria-label="Item Pending"
        >
          <Typography className={this.props.classes.pending}>
            <FontAwesomeIcon icon={faPenSquare} />
            &nbsp;Item is waiting for receipt
          </Typography>
        </IconButton>
      );
    } else {
      return (
        <IconButton
          className={this.props.classes.arrived}
          aria-label="LocalShipping"
        >
          <Typography className={this.props.classes.arrived}>
            <FontAwesomeIcon icon={faCheckSquare} />
            &nbsp;Item is ready for takeover
          </Typography>
        </IconButton>
      );
    }
  };

  render() {
    const { classes, productId, transactionData } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={"ID: " + productId}
        />
        <CardMedia
          className={classes.media}
          image={this.state.image}
          title={transactionData.issuer}
        />
        <CardContent>
          <Typography component="p"> {this.pendignState()} </Typography>
          <Typography>
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Owner:</b>
                  </td>
                  <td>{this.parseComposerID(transactionData.issuer)}</td>
                </tr>
                <tr>
                  <td>
                    <b>Acceptor:</b>
                  </td>
                  <td>{this.parseComposerID(transactionData.next)}</td>
                </tr>
              </tbody>
            </table>
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <ReadyForTradeModal
            aria-label="Mark ready for trade"
            availableUsers={this.props.availableUsers}
            productId={productId}
          />
          <TakeOverModal
            aria-label="Make trade of item"
            availableUsers={this.props.availableUsers}
            productId={productId}
          />
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph> {this.getExpandedInfo()} </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

InfoCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InfoCard);
