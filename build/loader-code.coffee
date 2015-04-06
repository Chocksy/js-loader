#@codekit-prepend "picoModal"
###
Copyright (c) 2012 ElevenBlack
Written by Ciocanel Razvan (chocksy.com)
###

###
A self-contained loader library
###
window.widgetLoader = ((window,document) ->
  "use strict"

  defaults=
    widget_domain:  '//location.for.iframe.widget' # the widget domain/ tablebookings
    domain:         '//domain.for.iframe.widget' # the default domain value (this will change with execution)
    modal_width:    false
    modal_height:   false
    iframe_widget:  false
    iframe_width:   "100%"
    iframe_height:  "100%"
    side_btn:       true 

  cssNumber=
    "columnCount": true,
    "fillOpacity": true,
    "flexGrow": true,
    "flexShrink": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "order": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true

  elements= 
    side_btn_content:     '<div id="WDG_sideBtn_ctn"><a href="#" id="WDG_sideBtn">Errors Widget</a></div>'
    side_btn:             "#WDG_sideBtn"

  # ---- assignModal Method
  # -- assign modal method to element class
  assignModal= ->
    $s('.el-modal').on 'click',(e)=>
      e.preventDefault()
      element = e.currentTarget 
      widget_token = element.getAttribute('data-widget')
      moduleInfo = JSON.stringify({url:widget_token})
      loadModule({data:moduleInfo})

  # ---- loadModule Method
  # -- we use this method as a way to verify if we need to open a new window or a modal
  # -- depending by the browser type. This is also called by the iframe in case of displaying
  # -- a new step.
  loadModule= (e)->
    info_received = JSON.parse(e.data)
    window.ELopts.widget_url = info_received.url
    window.ELopts.domain = window.ELopts.widget_domain
    window.ELopts.domain = info_received.domain if info_received.domain!=undefined

    if isMobile()
      window.open(window.ELopts.domain+window.ELopts.widget_url,'_blank')
    else
      openModal()

  # ---- openModal Method
  # -- we use this method to initialize the modal and add the iframe to it
  openModal= ()->
    current_height = make().getWindow('height')
    current_width = make().getWindow('width')
    widget_width = if window.ELopts.modal_width then window.ELopts.modal_width else current_width/1.2
    widget_height = if window.ELopts.modal_height then window.ELopts.modal_height else current_height/1.6

    outerWidth = if typeof widget_width=="number" then current_width-widget_width else (current_width*parseInt(widget_width)/100)
    outerHeight= if typeof widget_height=="number" then current_height-widget_height else (current_height*parseInt(widget_height)/100)

    picoModal(
      content: '<iframe id="WDG_widgetIframe" src="'+ window.ELopts.domain+window.ELopts.widget_url+'" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>'
      overlayStyles:
        backgroundColor: "#333"
        opacity: "0.3"
      modalStyles: 
        width: widget_width
        height: widget_height
        top: "20%"
        background: "#fff"
        boxShadow: "0px 0px 7px #444"
        border: "1px solid #444"
        borderRadius: "3px"
        marginLeft: -outerWidth/2+"px"
    )
   
  # ---- addSideButton Method
  # -- we add a fixed side button that has a click event on it for opening the widget
  addSideButton= ()->
    $s('body').append(elements.side_btn_content)
    moduleInfo = JSON.stringify({url:window.ELopts.widget_url})
    $s(elements.side_btn)
      .stylize(
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
    $s(elements.side_btn).on "click", (event)=> 
      loadModule({data:moduleInfo})
      event.preventDefault()
    false

  # ---- addWidget Method
  # -- we add the iframe widget to the element specified when initializing the plugin
  addWidget= ()->
    url = window.ELopts.domain+window.ELopts.widget_url+"?theme=#{window.ELopts.theme}"
    widget_iframe_html = '<iframe id="iframe_widget" src="'+url+'" class="iframe-class" style="width:100%;height:100%;" frameborder="0" allowtransparency="true"></iframe>'
    $el = $s(window.ELopts.widget_container)
    $el.html(widget_iframe_html)  

  # ---- isMobile Method
  # -- check if the browser is a mobile browser
  isMobile= ->
    /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())

  # ---- $s Method
  # -- we are making below an utility section to get and manipulate DOM
  $s = (a, b) ->
    a = a.match(/^(\W)?(.*)/)
    elem = (b or document)["getElement" + ((if a[1] then (if a[1] is "#" then "ById" else "sByClassName") else "sByTagName"))] a[2]
    fas = 
      elem: elem
      data : (dataAttr) ->
        elem.getAttribute("data-"+dataAttr)

      # Sets the HTML
      html: (content) ->
        elem.innerHTML = content
        fas

      # Applies a set of styles to an element
      stylize: (styles)->
        styles = styles or {}
        styles.filter = "alpha(opacity=" + (styles.opacity * 100) + ")"  if typeof styles.opacity isnt "undefined"
        for prop of styles
          if styles.hasOwnProperty(prop)
            type = typeof styles[prop]
            if type=="number" and !cssNumber[prop]
              styles[prop] += "px"
            elem.style[prop] = styles[prop] 
        fas

      append : (html)->
        c = document.createElement("p")
        c.innerHTML = html
        el = elem
        el = elem[0] if elem.length # we append just to first element
        el.appendChild c.firstChild
        fas

      # Removes this element from the DOM
      destroy: ->
        document.body.removeChild elem unless !elem
        fas
      on   : (eventName,handler)->
        if elem.length # we add handler just to first element
          elements = elem
        else
          elements = [elem]
        if elements.length>0
          i = 0
          while i < elements.length
            el = elements[i]
            if el.addEventListener
              el.addEventListener eventName, handler
            else
              el.attachEvent "on" + eventName, ->
                handler.call elem
            i++
        return
    fas

  # ---- make Method
  # -- below is the utility method that we use to manipulate data
  make = ()->
    fas = 
      extend : (out) ->
        out = out or {}
        i = 1

        while i < arguments.length
          obj = arguments[i]
          continue  unless obj
          for key of obj
            if obj.hasOwnProperty(key)
              if typeof obj[key] is "object"
                extend out[key], obj[key]
              else
                out[key] = obj[key]
          i++
        out

      getWindow: (type)->
        w = window
        d = document
        e = d.documentElement
        g = d.getElementsByTagName('body')[0]
        x = w.innerWidth || e.clientWidth || g.clientWidth
        y = w.innerHeight|| e.clientHeight|| g.clientHeight
        return x if type=='width'
        return y if type=='height'
    fas
  
  # ---- addWidgetListeners Method
  # -- we listen to the widget actions and make the actions acordingly
  # -- and example would be clicking on the submit button and loading the next step iframe 
  # -- into a modal
  addWidgetListeners= ()->
    trace "adding listener for selecting the date for showing time"
    eventMethod = (if window.addEventListener then "addEventListener" else "attachEvent")
    eventer = window[eventMethod]
    messageEvent = (if eventMethod is "attachEvent" then "onmessage" else "message")

    # Listen to message from child window
    eventer messageEvent, ((e)=> loadModule(e) ), false

  trace = (s) ->
    window.console.log "widgetLoader: " + s  if window["console"] isnt `undefined`
  error = (s) ->
    window.console.error "widgetLoader: " + s  if window["console"] isnt `undefined`

  # A function for easily displaying a modal with the given content
  (options) ->
    window.ELopts = make().extend({}, defaults,options)
    trace "constructor"
    if window.ELopts.iframe_widget
      addWidget()
      addWidgetListeners()
    if window.ELopts.side_btn
      addSideButton()
    assignModal()
    false

)(window,document)


window.onload = ()->
  if _lopts.widget_container is undefined
    _lopts.widget_container = 'body'
  widgetLoader(_lopts)

