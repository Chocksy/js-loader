(($) ->
  methods = init: (options) ->
    defaults =
      top: "auto"
      autoOpen: false
      overlayOpacity: 0.5
      overlayColor: "#000"
      overlayClose: true
      closeOnEscape: true
      closeButtonClass: ".close"
      onOpen: false
      onClose: false

    options = $.extend(defaults, options)
    @each ->
      o = options
      $overlay = $("<div class=\"lean-overlay\"></div>")
      $overlay.css(
                    display: "none"
                    position: "fixed"
                    "z-index": 2000
                    top: 0
                    left: 0
                    height: 100 + "%"
                    width: 100 + "%"
                    background: o.overlayColor
                    opacity: o.overlayOpacity
                  ).appendTo "body"
      $modal = $(this)
      $modal.css
        display: "none"
        position: "fixed"
        "z-index": 2001
        left: 50 + "%"
        borderRadius: "7px"
        top: (if parseInt(o.top) > -1 then o.top + "px" else 50 + "%")
        "margin-left": -($modal.outerWidth() / 2) + "px"
        "margin-top": ((if parseInt(o.top) > -1 then 0 else -($modal.outerHeight() / 2))) + "px"

      $modal.bind "openModal", (e) ->
        $(this).css "display", "block"
        $overlay.fadeIn 200, ->

          # onOpen callback receives as argument the modal window
          o.onOpen $modal[0]  if o.onOpen and typeof (o.onOpen) is "function"


      $modal.bind "closeModal", (e) ->
        $(this).css "display", "none"
        $overlay.fadeOut 200, ->

          # onClose callback receives as argument the modal window
          o.onClose $modal[0]  if o.onClose and typeof (o.onClose) is "function"



      # Close on overlay click
      $overlay.click ->
        $modal.trigger "closeModal"  if o.overlayClose

      $(document).keydown (e) ->

        # ESCAPE key pressed
        $modal.trigger "closeModal"  if o.closeOnEscape and e.keyCode is 27


      # Close when button pressed
      $modal.find(o.closeButtonClass).click (e) ->
        $modal.trigger "closeModal"
        e.preventDefault()


      # Automatically open modal if option set
      $modal.trigger "openModal"  if o.autoOpen


  $.fn.easyModal = (method) ->

    # Method calling logic
    if methods[method]
      methods[method].apply this, Array::slice.call(arguments, 1)
    else if typeof method is "object" or not method
      methods.init.apply this, arguments
    else
      $.error "Method " + method + " does not exist on jQuery.easyModal"
) jQuery