$(document).ready(function(){
    $(".input-group-text").click(function(){
        var pesquisado=$("#barraProcura").val().toLowerCase();
        if (pesquisado.length>0) window.location.href="searchall.html?search=" + pesquisado;
        return false
    })

    var names=[]
    var dates= []
    var url=[]
    var favracesID= eval(localStorage.getItem("races"))
    if (favracesID!=undefined){
        for (id of favracesID){
            $.get("http://192.168.160.58/Formula1/api/Races/Race?id="+ id, function(data,status){
                console.log(data)
                dates.push(data.Date.slice(0,10))
                url.push([data.RaceId])
                names.push([data.Name])
            })
            sleep(200)
        }
    }
    


    $('a[tabindex="0"]').click(function(){
/*         console.log("entrou") */
        $("#datepicker").datepicker(
            {
                yearRange: "1950:2022",
                changeYear:true,
                dateFormat: "yy-mm-dd",
                beforeShowDay: function (date) {
                    if (dates!=[]){
                        var mes =date.getMonth();
                        var dia = date.getDate()
                        if (String(mes).length<2) var fulldate = date.getFullYear() + "-0" + (mes+1)
                        else var fulldate = date.getFullYear() + "-" + (mes+1)
                        if (String(dia).length<2) fulldate += '-0' + dia
                        else fulldate += '-' + dia
                        if (dates.includes(fulldate)==true) {
                            return [true, 'highlight', String(names[dates.indexOf(fulldate)])];
                        }
                        return [false, ''];
                    }
                },
                onSelect: function(date){
                    window.location.href="./raceDetails.html?id="+ url[dates.indexOf(date)]
                }
            }
        
        );
        
        $("#datepicker").datepicker('show')
    })
    
    

})

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}
