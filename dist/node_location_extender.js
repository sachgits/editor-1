var NodeLocationExtender, _, jsdom;

jsdom = require('jsdom');

_ = require('lodash');

module.exports = NodeLocationExtender = (function() {
  function NodeLocationExtender(event, combination) {
    this.event = event;
    this.combination = combination;
  }

  NodeLocationExtender.prototype.extend = function() {
    return _.merge(this.combination, this.coords());
  };

  NodeLocationExtender.prototype.noContentPositions = function() {
    var fixed_positions, offset, parent_start_tag, start_tag_position;
    start_tag_position = jsdom.nodeLocation(this.combination.node);
    parent_start_tag = jsdom.nodeLocation(this.combination.node.parentElement).startTag;
    offset = parent_start_tag.end - parent_start_tag.start;
    fixed_positions = {
      start: start_tag_position.start + offset,
      end: start_tag_position.end + offset
    };
    return {
      content_position: {},
      start_tag_position: fixed_positions
    };
  };

  NodeLocationExtender.prototype.coords = function() {
    var NO_CONTENT_TAGS, content_position, start_tag_position;
    switch (this.combination.type) {
      case 'html':
        NO_CONTENT_TAGS = ['INPUT', 'BUTTON', 'IMG'];
        if (_.includes(NO_CONTENT_TAGS, this.combination.node.tagName)) {
          return this.noContentPositions();
        }
        content_position = jsdom.nodeLocation(this.combination.node);
        start_tag_position = jsdom.nodeLocation(this.combination.node.parentElement).startTag;
        return {
          content_position: content_position,
          start_tag_position: start_tag_position
        };
      case 'front_matter':
        console.log('FRONT MATTER NOT IMPLEMENTED YET');
        return {};
      default:
        console.log('NOT IMPLEMENTED');
        return {};
    }
  };

  return NodeLocationExtender;

})();