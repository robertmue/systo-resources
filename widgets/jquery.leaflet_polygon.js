(function ($) {

  /***********************************************************
   *         leaflet_polygon widget
   ***********************************************************
   */
    $.widget('systo.leaflet_polygon', {
        meta:{
            short_description: 'Polygon mapping using the leaflet library',
            long_description: 'This is currently a stand-alone demo widget, not '+
                'connected to anything in Systo.   It is in fact simpy the leaflet '+
                '"chloropleth" example (http://leafletjs.com/examples/choropleth-example.html), '+
                're-cast as a Systo widget.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Jan 2015',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'leaflet_polygon:',

        _create: function () {
            var self = this;
            this.element.addClass('leaflet_polygon-1');

            var div = $('<div id="map">Leaflet polygon</div>');

            this._container = $(this.element).append(div);

            leafletPolygon(this);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('leaflet_polygon-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
            };

            // base
            this._super(key, value);

            if (key in fnMap) {
                fnMap[key]();

                // Fire event
                this._triggerOptionChanged(key, prev, value);
            }
        },

        _triggerOptionChanged: function (optionKey, previousValue, currentValue) {
            this._trigger('setOption', {type: 'setOption'}, {
                option: optionKey,
                previous: previousValue,
                current: currentValue
            });
        }
    });

    function leafletPolygon(widget) {

		var map = L.map('map').setView([37.8, -96], 4);

		L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-20v6611k'
		}).addTo(map);


		// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
				'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
				: 'Hover over a state');
		};

		info.addTo(map);


		// get color depending on population density value
		function getColor(d) {
			return d > 1000 ? 'blue' :
			       d > 500  ? '#BD0026' :
			       d > 200  ? '#E31A1C' :
			       d > 100  ? '#FC4E2A' :
			       d > 50   ? '#FD8D3C' :
			       d > 20   ? '#FEB24C' :
			       d > 10   ? 'yellow' :
			                  '#FFEDA0';
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.density)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		geojson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 10, 20, 50, 100, 200, 500, 1000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);
    }
})(jQuery);
