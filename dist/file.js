var Navigation, React, Router;

React = require('react/addons');

Router = require('react-router');

Navigation = Router.Navigation;

module.exports = React.createClass({
  mixins: [Navigation],
  activeClass: function() {
    var result;
    result = 'tab col m2';
    if (this.props.active) {
      result += ' tab-active';
    }
    return result;
  },
  onClick: function() {
    return this.transitionTo('file', {
      splat: this.props.file.href
    });
  },
  kind: function() {
    if (this.props.file.type === 'dir') {
      return 'Folder';
    }
    return this.props.file.path.match(/\.([0-9a-z]+)$/i)[1];
  },
  icon: function() {
    if (this.props.file.type === 'dir') {
      return React.createElement("i", {
        "className": 'material-icons'
      }, "folder_open");
    } else {
      return React.createElement("i", {
        "className": 'material-icons'
      }, "class");
    }
  },
  render: function() {
    return React.createElement("tr", {
      "onClick": this.onClick
    }, React.createElement("td", {
      "className": 'file-list-icon'
    }, this.icon()), React.createElement("td", null, this.props.file.name), React.createElement("td", {
      "className": 'file-list-kind'
    }, this.kind()));
  }
});