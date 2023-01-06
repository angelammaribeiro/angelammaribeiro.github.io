// ViewModel KnockOut
var vm = function() {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Formula1/api/drivers');
    //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(21);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function() {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function() {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function() {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function() {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function() {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };
    self.nationalities = ko.observableArray([])

    self.metaData = {
        favs: [],
        teams: [],
        races: [],
    }

    //--- Page Events

    self.activate = function(id,sortfield='name') {
        console.log('CALL: getDrivers...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize() + "&sortfield=" + sortfield;
        ajaxHelper(composedUri, 'GET').done(function(data) {
            console.log("getDrivers", data);
            hideLoading();
            self.records(data.List);
            console.log(data.List)
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.PageCount);
            self.totalRecords(data.Total);
            for (var i = 0; i <= data.PageSize; i++){
                self.updateheart(data.List[i].DriverId, 'favs')
            }            
        });
    };

    self.activate2 = function(search, page) {
        console.log('CALL: searchDrivers...');
        var composedUri = "http://192.168.160.58/Formula1/api/Search/Drivers?q=" + search;
        ajaxHelper(composedUri, 'GET').done(function(data) {
            console.log("searchDrivers", data);
            hideLoading();
            self.records(data.slice(0 + 21 * (page - 1), 21 * page));
            console.log(self.records())
            self.totalRecords(data.length);
            self.currentPage(page);
            if (page == 1) {
                self.hasPrevious(false)
            } else {
                self.hasPrevious(true)
            }
            if (self.records() - 21 > 0) {
                self.hasNext(true)
            } else {
                self.hasNext(false)
            }
            if (Math.floor(self.totalRecords() / 21) == 0) {
                self.totalPages(1);
            } else {
                self.totalPages(Math.ceil(self.totalRecords() / 21));
            }
            console.log(self.records()[0].DriverId)
            for (var i = 0; i <= self.records().length; i++){
                self.updateheart((self.records()[i]).DriverId, 'favs')
            }  
        });

    };

    self.activate3 = function() {
        console.log('CALL: getNationalities...');
        var composedUri = "http://192.168.160.58/Formula1/api/Nationalities";
        ajaxHelper(composedUri, 'GET').done(function(data) {
            console.log("getNationalities", data);
            hideLoading();
            self.nationalities(data.List)
        });
    };

    self.activate4 = function(Nid, page) {
        self.currentPage(page)
        console.log('CALL: getSpecificNationality...');
        var composedUri = "http://192.168.160.58/Formula1/api/Nationalities/Nationality?id=" + Nid;
        ajaxHelper(composedUri, 'GET').done(function(data) {
            console.log("getSpecificNationality", data);
            hideLoading();
            self.records(data.Drivers.slice(0 + 21 * (page - 1), 21 * page));
            self.totalRecords(data.Drivers.length);
            self.currentPage(page);
            if (page == 1) {
                self.hasPrevious(false)
            } else {
                self.hasPrevious(true)
            }
            if (self.records() - 21 > 0) {
                self.hasNext(true)
            } else {
                self.hasNext(false)
            }
            if (Math.floor(self.totalRecords() / 21) == 0) {
                self.totalPages(1);
            } else {
                self.totalPages(Math.ceil(self.totalRecords() / 21));
            }
            for (var i = 0; i <= self.records().length; i++){
                self.updateheart((self.records()[i]).DriverId, 'favs')
            }
        });
    }

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
        console.log(self.metaData.name)
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

    self.updateheart = function(id, name){
        console.log(self.metaData[name].includes(String(id)))
        if (self.metaData[name].includes(String(id)) == true) {
            $('.'+id).removeClass('fa fa-heart-o')
            $('.'+id).addClass('fa fa-heart')
        } else {
            $('.'+id).removeClass('fa fa-heart')
            $('.'+id).addClass('fa fa-heart-o')
    }}

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

    self.pesquisa = function() {
        self.pesquisado($("#searchbarall").val().toLowerCase());
        if (self.pesquisado().length > 0) {
            window.location.href = "drivers.html?search=" + self.pesquisado();
        }
    }



    //--- start ....
    showLoading();
    self.init()
    $("#searchbarall").val(undefined) /* Reseta barra de pesquisa quando venho da pesquisa para trás (usando o browser) para drivers */
    var pg = getUrlParameter('page');
    console.log(pg);
    self.pesquisado = ko.observable(getUrlParameter('search'));
    self.nationId = ko.observable(getUrlParameter('Nid'));
    self.sortfield = ko.observable(getUrlParameter('sortfield'));
    self.displayName = 'Drivers List';
    self.activate3()
    if (self.nationId() == undefined) {
        if (self.pesquisado() == undefined) {
            if (pg == undefined) {
                if (self.sortfield()!=undefined) self.activate(1,self.sortfield());
                else self.activate(1)
            }
            else {
                if (self.sortfield()!=undefined) self.activate(pg,self.sortfield());
                else self.activate(pg)
            }
        } else {
            if (pg == undefined) self.activate2(self.pesquisado(), 1);
            else self.activate2(self.pesquisado(), pg)
            self.displayName = 'Founded results for <b>' + self.pesquisado() + '</b>';
        }
    } else {
        if (pg == undefined) self.activate4(self.nationId(), 1)
        else self.activate4(self.nationId(), pg)
    }

};

$(document).ready(function() {
    ko.applyBindings(new vm());

});

