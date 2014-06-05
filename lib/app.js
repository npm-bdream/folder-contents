var fs = require('fs');

var FileContents = function () {};

FileContents.toolAccept = function (str,list) {
    if (list.length==0) return true;
    for (var nbElem in list) {
        if (list[nbElem] == str) return true;
    }
    return false;
};

FileContents.toolIgnore = function (str,list) {
    if (list.length==0) return false;
    for (var nbElem in list) {
        if (list[nbElem] == str) return true;
    }
    return false;
};

FileContents.getFilesList = function (data,files_){

    var path = ".";
    var pathSep = "/";
    var extSep = ".";
    var extIgnore = [];
    var extAccept = [];
    var folderIgnore = [];
    var fileIgnore = [];

    if (data.path) path = data.path;
    if (data.extSep) extSep = data.extSep;

    if ( data.extAccept && data.extAccept.length>0 ){
        extAccept = data.extAccept;
    } else if (data.extIgnore && data.extIgnore.length>0) {
        extIgnore = data.extIgnore;
    }

    if ( data.folderIgnore && data.folderIgnore.length>0 ) folderIgnore = data.folderIgnore;
    if ( data.fileIgnore && data.fileIgnore.length>0 ) fileIgnore = data.fileIgnore;

    files_ = files_ || [];

    if (typeof files_ === 'undefined') files_=[];

    var files = fs.readdirSync(path);

    for(var i in files){

        if (!files.hasOwnProperty(i)) continue;

        var fullPath = path+pathSep+files[i];

        if (fs.statSync(fullPath).isDirectory()){

            if (!FileContents.toolIgnore(files[i],folderIgnore)) {
                var newData = data;
                data.path = fullPath;
                FileContents.getFilesList(newData,files_);
            }

        } else {

            var f = files[i];
            var splitFilePart = f.split(extSep);
            //console.log(f.length);

            var p = path+pathSep;
            var n = "";
            var e = "";

            var length = splitFilePart.length;

            if ( length == 1 ) {
                n = f;
            } else {
                e = splitFilePart[length-1];
                var fLength = f.length;
                var eLength = e.length;
                var extSepLength = extSep.length;
                n = f.slice(0,fLength-eLength-extSepLength);
            }

            var currentFile = {"path":p,"name":n,"ext":e};

            if (FileContents.toolAccept(e,extAccept) && !FileContents.toolIgnore(e,extIgnore) && !FileContents.toolIgnore(n,fileIgnore)) {
                console.log(fullPath);

                /* todo
                    fs.stat(fullPath, function (err, stats) {

                        console.log(stats.size);
                    });
                */
                
                files_.push(currentFile);
            }
        }

    }
    return files_;
};

module.exports = FileContents;
