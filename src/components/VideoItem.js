import React from 'react'
import { ListItem } from 'material-ui/List';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Star from 'material-ui/svg-icons/toggle/star';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import { cyan500, red500, green500 } from 'material-ui/styles/colors';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './item.css'
import TextField from 'material-ui/TextField';
import { Card } from 'material-ui/Card';


const styles = {
  icons: {
    width: 60,
  },
  star: {
    color: green500
  },
  textField: {
    fontSize: '1.5em',
    paddingLeft: '20px',
    height: '68px',
    width: '100%'
  }
}


export default class VideoItem extends React.Component {

  getVoteIcon() {
    const userId = this.props.user ? this.props.user.uid : undefined;
    if (!userId) return <StarBorder color={styles.star.color} />
    if (!this.props.video.votedBy || !this.props.video.votedBy[userId]) return <StarBorder color={styles.star.color} />
    return <Star color={styles.star.color} />
  }

  onEdit(e,id) {
    e.stopPropagation();
    if(!this.props.user) return this.props.userNotAllowedStarting();    
    this.props.editItem(id);
  }

  handleVote(e, id) {
    if(!this.props.user) return this.props.userNotAllowedStarting();

    this.props.voteUp(id)
  }

  handleInput(e) {
    const {id, editedValue} = this.props.video;
    // esc
    if(e.which === 27) this.props.cancelEditing(id);
    // enter
    if(e.which === 13) this.props.itemEdited(id, editedValue);
  }

  handleDelete(e, id) {
    e.stopPropagation();
    if(!this.props.user) return this.props.userNotAllowedStarting();

    this.props.deleteItem(id);
  }

  render() {
    const {video, changingItem, itemEdited} = this.props;

    return (

      <Card>
        {!video.isEditing ?
          <ReactCSSTransitionGroup
            transitionName="item"
            transitionEnterTimeout={0}
            transitionLeave={false}>

            <ListItem primaryText={video.name}
              key={video.id}
              secondaryText={<span><b>{video.votes}</b> votes</span>}
              leftIcon={this.getVoteIcon()}
              onClick={e => this.handleVote(e, video.id)}
              rightIcon={<span style={styles.icons}>
                <ModeEdit color={cyan500} 
                  onClick={(e) => this.onEdit(e,video.id)} />
                <ContentClear color={red500} onClick={e => this.handleDelete(e,video.id)} /></span>}
              >
            </ListItem>

          </ReactCSSTransitionGroup>
          :
          <TextField id={video.id} value={video.editedValue}
            style={styles.textField}
            underlineShow={false}
            onChange={e => changingItem(video.id, e.target.value)}
            onKeyDown={e => this.handleInput(e)}
            onBlur={() => itemEdited(video.id, video.editedValue)} />}
      </Card>)
  }

}