###
Copyright (c) 2012 James Frasca

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
###

###
A self-contained modal library
###
window.picoModal = ((window, document) ->
  "use strict"
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
  
  # Generates observable objects that can be watched and triggered
  observable = ->
    callbacks = []
    watch: (callback) ->
      callbacks.push callback
      return

    trigger: ->
      i = 0

      while i < callbacks.length
        window.setTimeout callbacks[i], 1
        i++
      return

  
  # A small interface for creating and managing a dom element
  make = (parent) ->
    elem = document.createElement("div")
    (parent or document.body).appendChild elem
    iface =
      elem: elem
      
      # Creates a child of this node
      child: ->
        make elem

      
      # Applies a set of styles to an element
      stylize: (styles) ->
        styles = styles or {}
        styles.filter = "alpha(opacity=" + (styles.opacity * 100) + ")"  if typeof styles.opacity isnt "undefined"
        for prop of styles
          if styles.hasOwnProperty(prop)
            type = typeof styles[prop]
            if type=="number" and !cssNumber[prop]
              styles[prop] += "px"
            elem.style[prop] = styles[prop] 
        iface

      
      # Adds a class name
      clazz: (clazz) ->
        elem.className += clazz
        iface

      
      # Sets the HTML
      html: (content) ->
        elem.innerHTML = content
        iface

      
      # Returns the width of this element
      getWidth: ->
        elem.clientWidth

      
      # Adds a click handler to this element
      onClick: (callback) ->
        if elem.attachEvent
          elem.attachEvent "onclick", callback
        else
          elem.addEventListener "click", callback
        iface

      
      # Removes this element from the DOM
      destroy: ->
        document.body.removeChild elem
        iface

    iface

  
  # An interface for generating the grey-out effect
  overlay = (getOption) ->
    
    # The registered on click events
    clickCallbacks = observable()
    
    # The overlay element
    elem = make().clazz("pico-overlay").stylize(
      display: "block"
      position: "fixed"
      top: "0px"
      left: "0px"
      height: "100%"
      width: "100%"
      zIndex: 10000
    ).stylize(getOption("overlayStyles",
      opacity: 0.5
      background: "#000"
    )).onClick(clickCallbacks.trigger)
    elem: elem.elem
    destroy: elem.destroy
    onClick: clickCallbacks.watch

  
  # A function for easily displaying a modal with the given content
  (options) ->
    
    # Returns a named option if it has been explicitly defined. Otherwise,
    # it returns the given default value
    getOption = (opt, defaultValue) ->
      (if options[opt] is undefined then defaultValue else options[opt])
    options = content: options  if typeof options is "string"
    shadow = overlay(getOption)
    closeCallbacks = observable()
    elem = make().clazz("pico-content").stylize(
      display: "block"
      position: "fixed"
      zIndex: 10001
      left: "50%"
      top: "50px"
    ).html(options.content)
    width = getOption("width", elem.getWidth())
    elem.stylize(
      width: width + "px"
      margin: "0 0 0 " + (-(width / 2) + "px")
    ).stylize getOption("modalStyles",
      backgroundColor: "white"
      padding: "20px"
      borderRadius: "5px"
    )
    close = ->
      closeCallbacks.trigger()
      shadow.destroy()
      elem.destroy()
      return

    shadow.onClick close  if getOption("overlayClose", true)
    closeButton = undefined
    if getOption("closeButton", true)
      closeButton = elem.child().html(getOption("closeHtml", "&#xD7;")).clazz("pico-close").stylize(getOption("closeStyles",
        borderRadius: "2px"
        cursor: "pointer"
        height: "15px"
        width: "15px"
        position: "absolute"
        top: "5px"
        right: "5px"
        fontSize: "16px"
        textAlign: "center"
        lineHeight: "15px"
        background: "#CCC"
      )).onClick(close)
    modalElem: elem.elem
    closeElem: (if closeButton then closeButton.elem else null)
    overlayElem: shadow.elem
    close: close
    onClose: closeCallbacks.watch
)(window, document)