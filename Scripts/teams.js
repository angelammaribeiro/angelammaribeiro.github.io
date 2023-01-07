var vm = function() {
    var self = this;
    self.mainUrl = ko.observable('http://192.168.160.58/Formula1/api/Constructors')
    self.displayName = 'Teams List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(12);
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


    self.metaData = {
        favs: [],
        teams: [],
        races: [],
    } 

    self.activate = function(id) {
        console.log('CALL: getTeams...');
        var composedUri = self.mainUrl() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function(data) {
            console.log(data);
            hideLoading();
            self.records(data.List);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.PageCount);
            self.totalRecords(data.Total);
            for (var i = 0; i <= data.PageSize; i++){
                self.updateheart(data.List[i].ConstructorId, 'teams')
            } 
        });
    };

    self.activate2 = function (search,page) {
        console.log('CALL: SearchConstructors...');
        var composedUri = "http://192.168.160.58/Formula1/api/Search/Constructors?q=" + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.slice(0+21*(page-1),21*page));
            self.totalRecords(data.length);
            self.currentPage(page);
            if (page==1){
                self.hasPrevious(false)
            }else{
                self.hasPrevious(true)
            }
            if (self.records()-21>0){
                self.hasNext(true)
            }else{
                self.hasNext(false)
            }
            if (Math.floor(self.totalRecords()/21)==0){
                self.totalPages(1);
            }else{
                self.totalPages(Math.ceil(self.totalRecords()/21));
            }
        });
    };

    $("#searchbarall").autocomplete({
        minLength: 2,
        source: function(request,response){
                console.log("entrou")
                var source=[]
                var all=[]
                $.get("http://192.168.160.58/Formula1/api/Search/Constructors?q=" + $("#searchbarall").val(),function(data,status){
                    all=data
                    console.log(all)
                })
                setTimeout(function(){
                    if(all.length>3){
                        $(".ui-autocomplete").css("overflow-y","scroll")
                    }else $(".ui-autocomplete").css("overflow-y","hidden")
                    console.log(all)
                    for(x of all){
                        source.push(x.Name)
                    }
                    response(source)
                },200)
        }
    });

    self.updateLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
        console.log(data)
    }

    self.checkButtons = function(id) {
        for (let k in self.metaData) {
            if (self.metaData[k].includes(String(id))) {
                document.getElementById(k + '-button').classList.add("active")
            }
        }
    }

    self.updateMetaData = function(id, name) {
        //Adicionar
        if (self.metaData[name].includes(String(id)) == false) {
            self.metaData[name].push(String(id))
            self.updateLocalStorage(name, self.metaData[name])
            $('#coracao').removeClass('fa fa-heart-o')
            $('#coracao').addClass('fa fa-heart')
        } else {
            //Remover
            self.metaData[name].splice(self.metaData[name].indexOf(String(id)), 1)
            self.updateLocalStorage(name, self.metaData[name])
            $('#coracao').removeClass('fa fa-heart')
            $('#coracao').addClass('fa fa-heart-o')
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

    function ajaxHelper(uri, method, data) {
        self.error('');
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
        var pesquisado = $("#searchbarall").val().toLowerCase()
        if (pesquisado.length > 0) {
            window.location.href = "teams.html?search=" + pesquisado + "&page=1";
        }
    }

    showLoading();
    $("#searchbarall").val(undefined)
    var pg = getUrlParameter('page');
    self.pesquisado = ko.observable(getUrlParameter('search'));
    console.log(pg);
    if (self.pesquisado()==undefined){
        self.searchbool=false;
        self.displayName = 'Teams List';
        if (pg == undefined){
            self.activate(1);
        }else {
            self.activate(pg);
        }
    }else{
        self.activate2(self.pesquisado(),pg)
        self.searchbool=true;
        self.displayName = 'Founded results for <b>'+ self.pesquisado() + '</b>';
    }

    self.init = function() {
        for (let k in self.metaData) {
            if (localStorage.getItem(k) != null) {
                self.metaData[k] = JSON.parse(localStorage.getItem(k))
            } else {
                self.metaData[k] = []
            }
        }

        $('.page-number').click(function(e) {
            $('.page-number').removeClass("active")
            $(this).addClass("active")
        });


    }

    self.init()

}

$(document).ready(function() {
    ko.applyBindings(new vm());

});