var Link, React, Router, _;

React = require('react/addons');

_ = require('lodash');

Router = require('react-router');

Link = Router.Link;

module.exports = React.createClass({
  folderFiles: function() {
    var result;
    result = _.map(this.filesystemObject(), (function(_this) {
      return function(parent_data, filename) {
        return {
          type: _this.locationType(parent_data),
          name: filename
        };
      };
    })(this));
    result = _.reject(result, function(file) {
      return file.type === 'folder-marker';
    });
    return _.map(result, (function(_this) {
      return function(file) {
        file.href = _this.fileOrDirHref(file.type, file.name);
        return file;
      };
    })(this));
  },
  fileOrDirHref: function(type, filename) {
    var path;
    path = fs.join(this.props.path || '', filename).replace(/^\//, '');
    return this.props.reuseTabHref(path);
  },
  filesystemObject: function() {
    return fs.data[this.props.path] || fs.data;
  },
  locationType: function(location) {
    if (_.isPlainObject(location)) {
      return 'folder';
    } else if (location === true) {
      return 'folder-marker';
    } else {
      return 'file';
    }
  },
  render: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col editor-col full m12'
    }, React.createElement("div", {
      "className": 'editor'
    }, React.createElement("ul", null, _.map(this.folderFiles(), (function(_this) {
      return function(file) {
        return React.createElement("li", null, React.createElement(Link, {
          "to": 'file',
          "params": {
            splat: file.href
          }
        }, file.type, " - ", file.name));
      };
    })(this)))))));
  }
});