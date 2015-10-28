import React, {PropTypes} from 'react';

export default React.createClass({
  propTypes: {
    'vertical': PropTypes.bool,
    'horizontal': PropTypes.bool,
    'style': PropTypes.object
  },

  render() {
    let {style, vertical, horizontal, ...props} = this.props;
    return <div style={{
      ...style,
      'display': 'flex',
      'flexDirection': 'column',
      'alignItems': horizontal ? 'center' : null,
      'justifyContent': vertical ? 'center' : null,
      'minHeight': '100%',
      'minWidth': '100%'
    }} {...props} />
  }
});