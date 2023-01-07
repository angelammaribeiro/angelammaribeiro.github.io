var vm = function() {
    showLoading()
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Formula1/api/Statistics/CChampions');
    self.all=ko.observableArray()
    $.getJSON(self.baseUri(), function(data) {
        self.all(data)
        console.log(self.all())
    })
    hideLoading()
    
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

$(document).ready(function() {
    ko.applyBindings(new vm());
});