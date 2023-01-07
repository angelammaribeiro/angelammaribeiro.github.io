// ViewModel KnockOut
var vm = function() {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Formula1/api/Statistics/Season?year=');
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);

    self.metaData = {
        favs: [],
        teams: [],
        races: [],
    }
    self.years=ko.observableArray([])
    for (i=1950;i<2022;i++){
        self.years.push(i)
    }

    //--- Page Events
    self.activate = function(year) {
        console.log('CALL: getSeasonsDrivers...');
        var composedUri = self.baseUri() + year;
        ajaxHelper(composedUri, 'GET').done(function(data) {
            console.log(data);
            hideLoading();
            self.records(data.DriverStandings);
            console.log(data.DriverStandings)
            console.log(self.metaData.favs)
            for (var i = 0; i <= self.records().length; i++) {
                self.updateheart(self.records()[i].DriverId, 'favs')
            }

        });
    };

    self.init = function() {
        for (let k in self.metaData) {
            if (localStorage.getItem(k) != undefined) {
                self.metaData[k] = JSON.parse(localStorage.getItem(k))
            } else {
                self.metaData[k] = []
            }
        }



        /* $('.page-number').click(function(e) {
            $('.page-number').removeClass("active")
            $(this).addClass("active")
        }); */


    }

    self.updateLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
        console.log(data)
    }

    /* self.checkButtons = function(id) {
        for (let k in self.metaData) {
            if (self.metaData[k].includes(String(id))) {
                document.getElementById(k + '-button').classList.add("active")
            }
        }
    } */

    self.updateMetaData = function(id, name) {
        //Adicionar
        console.log(self.metaData[name])
        if (self.metaData[name].includes(String(id)) == false) {
            self.metaData[name].push(String(id))
            self.updateLocalStorage(name, self.metaData[name])
        } else {
            //Remover
            self.metaData[name].splice(self.metaData[name].indexOf(String(id)), 1)
            self.updateLocalStorage(name, self.metaData[name])
        }
        self.updateheart(id, name)
    }

    self.updateheart = function(id, name) {
        console.log(self.metaData[name].includes(String(id)))
        if (self.metaData[name].includes(String(id)) == true) {
            $('.' + id).removeClass('fa fa-heart-o')
            $('.' + id).addClass('fa fa-heart')
        } else {
            $('.' + id).removeClass('fa fa-heart')
            $('.' + id).addClass('fa fa-heart-o')
        }
    }

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

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }



    function showLoading() {
        $("#myModal").modal('show', {
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
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }

    };



    //--- start ....
    showLoading();
    self.init()
    self.currentYear=ko.observableArray([])
    self.currentYear(getUrlParameter('year'));
    if (self.currentYear() == undefined) self.currentYear(1950)
    self.activate(self.currentYear());
};

$(document).ready(function() {
    console.log("ready!");
    ko.applyBindings(new vm());
});