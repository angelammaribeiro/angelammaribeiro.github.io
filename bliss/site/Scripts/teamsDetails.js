// ViewModel KnockOut
var vm = function() {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Formula1/api/Constructors/Constructor?id=');
    self.displayName = 'Driver Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.ConstructorId = ko.observable('');
    self.ConstructorRef = ko.observable('');
    self.ImageUrl = ko.observable('');
    self.Name = ko.observable('');
    self.Nationality = ko.observable('');
    self.Races = ko.observableArray('');
    self.Url = ko.observable('');

    //--- Page Events
    self.activate = function(id) {
        console.log('CALL: getConstructor...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function(data) {
            console.log(data);
            self.ConstructorId(data.ConstructorId);
            self.ConstructorRef(data.ConstructorRef);
            if (data.ImageUrl == null) {
                self.ImageUrl('../Imagens/Stuff/quim.jpeg')
            } else {
                self.ImageUrl(data.ImageUrl);
            }
            self.Name(data.Name);
            self.Nationality(data.Nationality);
            self.Races(data.Races);
            self.Url(data.Url);
            hideLoading();
        });
    };
    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });

    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function(e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    ko.bindingHandlers.jScrollPane = {
        init: function(element, valueAccessor) {
            var o = valueAccessor() || {};

            // initialize
            $(element).jScrollPane(o.options);

            var reinit = function() {
                var scroll = $(element).data("jsp");
                if (scroll) {
                    scroll.reinitialise();
                }
            };

            // handle window resize (though not really necessary if your chat box has a set pixel width)
            $(window).resize(reinit);

            // add subscription to observable if passed in
            if (o.subscribe) {
                o.subscribe.subscribe(function() {
                    // use setTimeout so the DOM finishes updating before reinitialising
                    setTimeout(reinit, 0);
                });
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
};

$(document).ready(function() {
    console.log("ready!");
    ko.applyBindings(new vm());
});