var fileInput = document.getElementById('myfile');
var fReader = new FileReader();

function LoadIndex() {
    file = document.getElementById('repoURL').value
    if (file.indexOf('https://')<0) {file = 'https://' + file}
    //file = 'https://raw.githubusercontent.com/michaeldowd2/Wikiart_tSNE/master/index'
    //file = 'https://bitbucket.org/shaventiger/websuits/raw/06afafb05a2e0f6ea052cf006e3e627f78e2b255/Website/index'
    var oReq = new XMLHttpRequest();
    oReq.open("GET", file, true);
    oReq.responseType = "blob";

    oReq.onload = function(oEvent) {
        var blob = oReq.response;
        console.log('received blob')
        fReader.readAsArrayBuffer(blob);
        fReader.addEventListener("loadend", function(e)
        {
            console.log('loaded blob')
            arr = new Uint8Array(e.target.result);
            var asciiDec = new TextDecoder("ascii");
            var s = 0
            var e = 4
            var ind = {}
            ind['signature']=asciiDec.decode(arr.slice(s,e))
            ind['version']=intFromBytes(arr.slice(s=s+4,e=e+4))
            ind['entries']=intFromBytes(arr.slice(s=s+4,e=e+4))
            document.getElementById('debugResultBox').innerHTML = 'Git Index Version: ' + ind['version'] + '<ul>'
            //console.log(ind)
            var entries= []
            for (n = 0; n < ind['entries']; n++) {
            	var entry = {}
                entry["entry"] = n + 1
                len=intFromBytes(arr.slice(s=s+64,e=e+62))
                entry["name"] =asciiDec.decode(arr.slice(s=s+2,e=e+len))
                mod = e%8
                if ((8-mod) <= mod) { pad = 8-mod }
                else { pad = -mod }
                s=e+pad
                e=s+4
                //console.log(entry)
                document.getElementById('debugResultBox').innerHTML += '<li>'+entry["name"]+'</li>'
                entries.push(entry["name"])
            }
            ind["entries"]=entries
            document.getElementById('debugResultBox').innerHTML += '</ul>'
            document.getElementById('debugResultBox').innerHTML += window.location.href
            //console.log(ind)
        });
    };
    console.log('Sending Request to: ' + file)
    oReq.send();
}

function intFromBytes( x ){
    var val = 0;
    for (var i = 0; i < x.length; ++i) {        
        val += x[i];        
        if (i < x.length-1) {
            val = val << 8;
        }
    }
    return val;
}
    