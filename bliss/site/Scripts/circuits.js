function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}
//--- Page Events
function activate() {
    var baseUri="http://192.168.160.58/Formula1/api/Circuits/Locations"
    console.log("Loading Map")
    var map= L.map('map',{zoomSnap: 0.5}).on("click", function(e){var coord= e.latlng;console.log(coord)}).setView([15,12],2);
    var bounds = L.latLngBounds([[81.5, 192], [-75.5, -170.5]]);
    map.dragging.disable()
    map.setMaxBounds(bounds);
    // Set up the OSM layer
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
            maxZoom:18,
            minZoom:2,
            bounds:bounds,
        }).addTo(map);
    console.log('CALL: getMarkerCircuit...');
    ajaxHelper(baseUri, 'GET').done(function (data) {
        console.log(data);
        for (var id=0;id<77;id++){
            var CircuitId=data[id].CircuitId;
            var Name=data[id].Name;
            var Location=data[id].Location;
            var Country=data[id].Country;
            var Lat=data[id].Lat;
            var Lng=data[id].Lng;
            var myIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            console.log(CircuitId)
            L.marker([Lat,Lng],{icon: myIcon}).on("click", showLocation).bindPopup("<a style='text-decoration:none; 'href='./circuitsDetails.html?id=" + CircuitId+ "'"+ "'" + "'><b>" + Name + "</b></a><br>" + Location + ", "+ Country).addTo(map);
        }
        
    });
    hideLoading();
    map.on('zoomend', function(e) {
        if (map.getZoom()==2) map.dragging.disable()
        else map.dragging.enable()
    });
    function showLocation(e){
        var coord= e.latlng;
        console.log(coord)
        console.log("("+ coord.lat+ ","+ coord.lng+ ")");
        zoom=map.getZoom()
        console.log(zoom)
        if (zoom<5) map.setZoomAround(coord,5)
        else return
    }
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });
};



//--- Internal functions
function ajaxHelper(uri, method, data) {
    var error='' 
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
            hideLoading();
            error=errorThrown;
        }
    });

}
function showLoading() {
    $('#myModal').modal('show',{
        backdrop: 'static',
        keyboard: false
    });
}
function hideLoading() {
    $('#myModal').on('shown.bs.modal', function (e) {
        $("#myModal").modal('hide');
    })
}



$(document).ready(function(){
    //--- start ....
    showLoading();
    activate();
    /* if (map.getZoom()==2) map.dragging.disable()
    else map.dragging.enable() */
    // Quandose carragarno mapa, mostraas coordenadas
    /* map.on('click', function(e) {
        var coord= e.latlng;
        console.log("("+ coord.lat+ ","+ coord.lng+ ")");
        console.log(Zoom)
    }); */
    
});
