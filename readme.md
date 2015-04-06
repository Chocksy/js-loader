# Widget loader

Super nice plugin to load elements widget.

## Installation

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
        loader.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'localhost/src/loader-v1.0.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(loader, s);
    })();
	</script>   


## Configuration

### _lopts

You have to specify this "_lopts" array that holds the options to configure that plugin. We can also set these as defaults in the plugin so this won't be required.

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
