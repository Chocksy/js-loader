# Bookings widget loader

Super nice jQuery plugin to load the bookings widget.

## Notice for 2.0

We don't need jQuery library included. Only if you want to use the previous 2.0 versions of the library then it's required to add it.

## Installation

Include the jQuery library above your &lt;/body&gt; tag for previous 2.0 versions 

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

Add the script below. This will load the iframe in the page and also by the button.
	
	<div id="side_widget"></div>

	<script type="text/javascript">
    var _lopts = _lopts || [];
        _lopts.widget_url = "d321d6f7ccf98b51540ec9d933f20898af3bd71e";
        _lopts.modal_width = 417;
        _lopts.modal_height = 190;
        _lopts.widget_container = "#side_widget";
        _lopts.iframe_widget = true;

    (function() {
        var loader = document.createElement('script'); loader.type = 'text/javascript'; loader.async = true;
        loader.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'd1u2f2r665j4oh.cloudfront.net/loader-v2.0.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(loader, s);
    })();
	</script>   


## Configuration

### _lopts

You have to specify this "_lopts" array that holds the options to configure that plugin. We can also set these as defaults in the plugin so this won't be required.

### .specials_domain

You can specify the domain of the specials website to view and show them on the modal when setting the following settings on an url:

```<a href="http://yahoo.com" class='tb-modal-special' data-special="324d84" data-restaurant="1" data-restaurant-slug="chocksy-s-restaurant">Voucher loader</a>```

__Note__: the specials is only openable from links or buttons and not showable via iframe. The ```.tb-modal-special``` class is required to assign the click action on the element.

### .widget_domain

The widget domain is the location of the widget.

	_lopts.widget_domain = "//localhost/"

### .widget_url

The widget url are the parameters that come after the domain if you have any for example ?id=333&do=match

	_lopts.widget_url = "?id=2"

### .modal_width

You can specify the popup modal width that opens when you click the button on the side.

	_lopts.modal_width = 400 //default is auto (must be number)

### .modal_height

You can specify the popup modal height that opens when you click the button on the side.

	_lopts.modal_height = 170 //default is auto (must be number)

### .iframe_widget

You can specify if you want the plugin to load in the page an iframe with the widget on load.

	_lopts.iframe_widget = false

### .side_btn

You can specify if you want to turn off the sidebar button that loads the widget

	_lopts.side_btn = true

### .widget_container

Give here the element you want the iframe widget to be inserted in if you don't specify it then it will be added to the body

	_lopts.widget_container = 'body' 

	//or 

	_lopts.widget_container = '#my_widget'

	//or

	_lopts.widget_container = '.widget'


### Made by: [Chocksy](http://github.com/Chocksy)
