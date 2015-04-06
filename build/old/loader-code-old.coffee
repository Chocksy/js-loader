(($) ->
  "use strict" 
  # Define the plugin class
  class widgetIframeLoader
 
    defaults:
      widget_domain:  '//app.tablebookings.com/widgets/'
      widget_url:     ''
      modal_width:    false
      modal_height:   false
      iframe_widget:  false
      iframe_width:   "100%"
      iframe_height:  "100%"
      side_btn:       true 

    elements: 
      side_btn_content:     '<div id="WDG_sideBtn_ctn"><a href="#" id="WDG_sideBtn">Reservations Widget</a></div>'
      popup_widget_content: '<div id="WDG_popWidget"></div>'
      side_btn:             "#WDG_sideBtn"
      popup_widget:         "#WDG_popWidget"

    constructor: (el,options) ->
      @trace "constructor"
      @options = $.extend({}, @defaults, options)
      @$el = $(el)
      if @options.iframe_widget
        @addWidget()
        @addWidgetListeners()
      if @options.side_btn
        @addSideButton()
      @assignModal()

    # ---- assignModal Method
    # -- assign modal method to element class
    assignModal: ->
      $('a.tb-modal').on 'click',(e)=>
        e.preventDefault()
        element = $(e.currentTarget)
        widget_token = element.data('widget')
        moduleInfo = JSON.stringify({url:widget_token})
        @loadModule({data:moduleInfo})

    # ---- isMobile Method
    # -- check if the browser is a mobile browser
    isMobile: ->
      /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())

    # ---- addWidget Method
    # -- we add the iframe widget to the element specified when initializing the plugin
    addWidget: ()->
      url = @options.widget_domain+@options.widget_url+"?theme=#{@options.theme}"
      widget_iframe_html = '<iframe id="iframe_widget" src="'+url+'" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>'
      @$el.html(widget_iframe_html)
      
    # ---- addSideButton Method
    # -- we add a fixed side button that has a click event on it for opening the widget
    addSideButton: ()->
      $('body').append(@elements.side_btn_content)
      $(@elements.side_btn).css(
                      position:"fixed"
                      top: "20%"
                      left: "0"
                      width: "50px"
                      height: "157px"
                      background: "url(//d1u2f2r665j4oh.cloudfront.net/side_button.png)"
                      textIndent: "-9999px"
                      boxShadow: "2px 1px 4px #ccc"
                      borderRadius: "5px"
                      )

      moduleInfo = JSON.stringify({url:@options.widget_url})

      $(@elements.side_btn).on "click", (event)=> 
                                            @loadModule({data:moduleInfo})
                                            event.preventDefault()

    # ---- addWidgetListeners Method
    # -- we listen to the widget actions and make the actions acordingly
    # -- and example would be clicking on the submit button and loading the next step iframe 
    # -- into a modal
    addWidgetListeners: ()->
      @trace "adding listener for selecting the date for showing time"
      eventMethod = (if window.addEventListener then "addEventListener" else "attachEvent")
      eventer = window[eventMethod]
      messageEvent = (if eventMethod is "attachEvent" then "onmessage" else "message")

      # Listen to message from child window
      eventer messageEvent, ((e)=> @loadModule(e) ), false

    # ---- openModal Method
    # -- we use this method to initialize the modal and add the iframe to it
    openModal: ()->
      current_height = $(window).height()
      current_width = $(window).width()
      widget_width = if @options.modal_width then @options.modal_width else current_width/1.2
      widget_height = if @options.modal_height then @options.modal_height else current_height/1.6

      $(@elements.popup_widget).remove()
      $('body').append(@elements.popup_widget_content)
      $(@elements.popup_widget).css(
                       width:widget_width
                       height:widget_height
                       top:"20%"
                       background: "#fff"
                       boxShadow: "0px 0px 7px #444"
                       border: "5px solid #444"
                       #overflowY: "scroll"
                       )
      $(@elements.popup_widget).easyModal(
                             top: "20%"
                             overlayOpacity: 0.3
                             overlayColor: "#333"
                             overlayClose: true
                             closeOnEscape: false
                             )
      $(@elements.popup_widget).append('<iframe id="WDG_widgetIframe" src="'+ @options.widget_domain+@options.widget_url+'" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>')
      $('#WDG_widgetIframe').css(
                            width:@options.iframe_width
                            height:@options.iframe_height
                            borderRadius:"7px"
                            )
      $(@elements.popup_widget).trigger('openModal')

    # ---- loadModule Method
    # -- we use this method as a way to verify if we need to open a new window or a modal
    # -- depending by the browser type. This is also called by the iframe in case of displaying
    # -- a new step.
    loadModule: (e)->
      info_received = JSON.parse(e.data)
      @options.widget_url = info_received.url

      if @isMobile()
        window.open(@options.widget_domain+@options.widget_url,'_blank')
      else
        @openModal()


    trace: (s) ->
      window.console.log "widgetLoader: " + s  if window["console"] isnt `undefined`
    error: (s) ->
      window.console.error "widgetLoader: " + s  if window["console"] isnt `undefined`
    
  # Define the plugin
  $.extend($.fn, 
    widgetIframeLoader: (option, args) ->
      @each ->
        $this = $(this)
        data = $this.data('widgetIframeLoader')

        if !data
          $this.data 'widgetIframeLoader', (data = new widgetIframeLoader(this, option))
        if typeof option == 'string'
          data[option].apply(data, args)
 
)(Zepto)


window.onload = ()->
  if _lopts.widget_container is undefined
    _lopts.widget_container = 'body'
  $(_lopts.widget_container).widgetIframeLoader(_lopts)

