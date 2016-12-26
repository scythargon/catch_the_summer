var Map = {
    map: false,
    latlng: [],
    centerTimer: false,
    latlngbounds: false,
    activeMarker: false,
    initializeMarkers: function(func){
        /* markers initialized in HTML */
        if(jQuery.isFunction(func)){func.apply(this);}
    },
    initializeMap: function(map){
        if(typeof google == "undefined") return false;
        this.geocoder = new google.maps.Geocoder();

        this.map = map;
        this.latlngbounds = new google.maps.LatLngBounds();
        this.latlng = [];
    },

    createMarker: function(params){
        var self = this;
        var address = params.address;
        console.log(params.coordinates);
        console.log(params.title);
        var location = new google.maps.LatLng(params.coordinates[1], params.coordinates[0]);

        self.latlng.push(location);
        var marker = new google.maps.Marker({
            visible: false,
            map: self.map,
            title: params.title,
            position: location,
            clickable: true,
        });

        self.createLabel(marker, params, 1);
        self.createLabel(marker, params, 0);
    },

    createLabel: function(marker, params, flag){
        var self = this;
        // Define the overlay, derived from google.maps.OverlayView
        function Label(opt_options) {
            // Initialization
            this.setValues(opt_options);

            var div = this.div_ = document.createElement('div');
            div.style.cssText = 'position: absolute; display: none;';
        };
        Label.prototype = new google.maps.OverlayView;

        // Implement onAdd
        Label.prototype.onAdd = function() {
            var pane = this.getPanes().overlayLayer;
            pane.appendChild(this.div_);

            // Ensures the label is redrawn if the text or position is changed.
            var me = this;
            this.listeners_ = [
            google.maps.event.addListener(this, 'position_changed',
                function() { me.draw(); }),
            google.maps.event.addListener(this, 'text_changed',
                function() { me.draw(); })
            ];

            //add element to clickable layer
            this.getPanes().overlayMouseTarget.appendChild(me.div_);

            // Add a listener - we'll accept clicks anywhere on this div, but you may want
            // to validate the click i.e. verify it occurred in some portion of your overlay.
            google.maps.event.addDomListener(me.div_, 'click', function() {
                google.maps.event.trigger(me, 'click');
            });

        };

        // Implement onRemove
        Label.prototype.onRemove = function() {
            this.div_.parentNode.removeChild(this.div_);
            // Label is removed from the map, stop updating its position/text.
            for (var i = 0, I = this.listeners_.length; i < I; ++i) {
                google.maps.event.removeListener(this.listeners_[i]);
            }
        };

        // Implement draw
        Label.prototype.draw = function() {
            var projection = this.getProjection();
            var position = projection.fromLatLngToDivPixel(this.get('position'));

            var content = flag ? params.content : params.marker;
            var offset = flag ? params.contentOffset : params.markerOffset;

            var div = this.div_;
            div.style.left = position.x + offset.x + 'px';
            div.style.top = position.y + offset.y + 'px';
            div.style.display = flag ? 'none' : 'block';
            div.style.zIndex = offset.z;
            div.style.cursor = "pointer";
            div.parentNode.style.zIndex = 120;
            div.innerHTML = content;
        };
        var label = new Label({
            map: self.map
        });
        label.bindTo('position', marker, 'position');

        if(flag){
            marker.customTooltip = label;
        }else{
            marker.customLabel = label;
            marker.showCTT = function(toCenter){
                $(marker.customLabel.div_).addClass('active').attr('old_zIndex', $(marker.customLabel.div_).css('zIndex')).css('zIndex', 500);;
                $(marker.customTooltip.div_).stop(true,true).fadeIn();
                // if(toCenter){
                //     self.map.panTo(this.getPosition());
                // }
                self.activeMarker = marker;
            };
            marker.hideCTT = function(){
                var marker = this;
                marker.timeout = setTimeout(function(){
                    $(marker.customLabel.div_).removeClass('active').css('zIndex', $(marker.customLabel.div_).attr('old_zIndex'));;
                    $(marker.customTooltip.div_).fadeOut();
                    self.activeMarker = false;
                },10);
                $(marker.customTooltip.div_).mouseenter(function(){
                    clearTimeout(marker.timeout);
                }).mouseleave(function(){
                    $(marker.customLabel.div_).removeClass('active').css('zIndex', $(marker.customLabel.div_).attr('old_zIndex'));;
                    $(marker.customTooltip.div_).fadeOut();
                    self.activeMarker = false;
                });
            };

            $('table.map-items tr[title*="'+params.address+'"]').mouseenter(function(){
                marker.showCTT(true);
            }).mouseleave(function(){
                marker.hideCTT();
            });
            $(label.div_).click(function(){
                if($(marker.customTooltip.div_).is(':visible')){
                    marker.hideCTT();
                }else{
                    if(self.activeMarker) self.activeMarker.hideCTT();
                    marker.showCTT(true);
                }
            }).mouseenter(function(){
                $(this).attr('old_zIndex', $(this).css('zIndex')).css('zIndex', 500);
            }).mouseleave(function(){
                $(this).css('zIndex', $(this).attr('old_zIndex'));
                //marker.hideCTT();
            });
        };
    }
}

$(function(){
    Map.initializeMap();
})
