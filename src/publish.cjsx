React = require 'react/addons'
Promise = require 'bluebird'
request = require 'request'

Loader = require('./loader')
Published = require('./published')

module.exports =
React.createClass
  getInitialState: ->
    {
      published: false
    }
  componentWillMount: ->
    @execPublish().then =>
      @setState(published: true)
  execPublish: ->
    new Promise (resolve, reject) =>
      request.post url: "#{window.location.origin}/apps/#{APP_SLUG}/live_edit/publish", (err, status, resp) ->
        return reject(err) if err

        resolve()
  render: ->
    if @state.published
      <Published website_url={@props.website_url}/>
    else
      <Loader title='Publishing your website...'/>
