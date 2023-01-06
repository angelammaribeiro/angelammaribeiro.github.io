var vm = function() {
    var self = this

    self.metaData = {
        favs: [],
        teams: [],
        races: [],
    }

    self.favsData = ko.observableArray()
    self.teamsData = ko.observableArray()
    self.racesData = ko.observableArray()

    self.updateLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
        console.log(data)
    }


    self.loadData = function(array) {
        let temp = []
        for (e in array) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/Formula1/api/Drivers/Driver?id=" + array[e],
                async: false,
                success: function(data) {
                    temp.push(data)
                        /* console.log(data) */
                }
            });
        }
        return temp
    }

    self.loadData1 = function(array) {
        let temp = []
        for (e in array) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/Formula1/api/Constructors/Constructor?id=" + array[e],
                async: false,
                success: function(data) {
                    temp.push(data)
                        console.log(data)
                }
            });
        }
        return temp
    }

    self.loadData2 = function(array) {
        let temp = []
        for (e in array) {
            $.ajax({
                type: "GET",
                url: "http://192.168.160.58/Formula1/api/Races/Race?id=" + array[e],
                async: false,
                success: function(data) {
                    temp.push(data)
                }
            });
        }
        return temp
    }


    self.updateMetaData = function(id, name) {
        if (self.metaData[name].includes(String(id)) == false) {
            self.metaData[name].push(String(id))
            self.updateLocalStorage(name, self.metaData[name])
        } else {
            //Remover
            self.metaData[name].splice(self.metaData[name].indexOf(String(id)), 1)
            self.updateLocalStorage(name, self.metaData[name])
        }
        self.favsData(self.loadData(self.metaData.favs))
        self.teamsData(self.loadData1(self.metaData.teams))
        self.racesData(self.loadData2(self.metaData.races))
    }


    self.init = function() {
        for (let k in self.metaData) {
            if (localStorage.getItem(k) != null) {
                self.metaData[k] = JSON.parse(localStorage.getItem(k))
            } else {
                self.metaData[k] = []
            }
        }
        self.favsData(self.loadData(self.metaData.favs))
        self.teamsData(self.loadData1(self.metaData.teams))
        self.racesData(self.loadData2(self.metaData.races))
        console.log(self.metaData.races)
    }
    self.init()
}

$(document).ready(function() {
    console.log("ready!");
    ko.applyBindings(new vm());
});