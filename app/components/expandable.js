import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

export default React.createClass({
  propTypes: {
    title: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    initiallyExpanded: PropTypes.bool
  },

  getInitialState() {
    return {
      expanded: !!this.props.initiallyExpanded,
      maxHeight: 'none'
    };
  },

  fetchMaxHeight() {
    this.setState({
      maxHeight:
        (this.state.expanded ? ReactDOM.findDOMNode(this.refs.content).scrollHeight : 0) + 'px'
    });
  },

  componentDidMount() {
    this.fetchMaxHeight();
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expanded != this.state.expanded)
      this.fetchMaxHeight();
  },

  render() {
    let {title, content, initiallyExpanded, ...rest} = this.props;

    return <div {...rest}>
      <div onClick={() => this.setState({ expanded: !this.state.expanded })}>{title}</div>
      <div ref="content" style={{
        'transition': 'max-height .3s ease',
        'maxHeight': this.state.maxHeight,
        'overflow': 'hidden'
      }}>{content}</div>
    </div>;
  }
});