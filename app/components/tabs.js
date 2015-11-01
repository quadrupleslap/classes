import React, {PropTypes} from 'react';

export default React.createClass({
  getInitialState() {
    return { selectedIndex: 0 };
  },

  propTypes: {
    //TODO: Fix this propType.
    tabs: PropTypes.arrayOf(PropTypes.shape({
      button: PropTypes.node,
      content: PropTypes.node
    })).isRequired,
    activeButtonStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    headerStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  },

  render() {
    let buttons = [];
    for (let i = 0; i < this.props.tabs.length; i++) {
      if (!this.props.tabs[i].button) { // Assume it's a divider.
        buttons.push(<li key={i} style={{ 'flexGrow': '1;' }} />); //HACK: ; required for unitless values
        continue;
      }

      buttons.push(
        <li
          key={i}
          style={{
              ...this.props.buttonStyle,
              ...(i == this.state.selectedIndex ? { ...this.props.activeButtonStyle, 'background': '#00BFFF' } : {}),
              'color': '#FFF',
              'display': 'flex',
              'boxSizing': 'border-box',
              'textAlign': 'center',
              'width': '100%',
            }}
          //TODO: Also let us specify our own custom onClick handler.
          onClick={this.props.tabs[i].content && () => this.setState({ selectedIndex: i })}>
          { this.props.tabs[i].button }
        </li>);
    }

    return <div style={{ height: '100%' }}>
      <ul style={{
        ...this.props.headerStyle,
        'margin': 0, 'padding': 0,
        'listStyleType': 'none',
        'background': '#212121',
        'display': 'flex',
        'flexFlow': 'column nowrap',
        'overflowY': 'auto',
        'height': '100%', 'width': this.props.width || 64,
        'position': 'absolute'
      }}>{ buttons }</ul>
      <div style={{
        ...this.props.containerStyle,
        'position': 'absolute',
        'top': 0, 'left': this.props.width || 64, 'right': 0, 'bottom': 0,
        'overflow': 'auto'
      }}>{ this.props.tabs[this.state.selectedIndex].content }</div>
    </div>;
  }
});