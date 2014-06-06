var fs = require('fs');
var bytes = require('bytes-i18n');
var FileContents = function () {};

FileContents.toolAccept = function (str,list,options) {
    if (list.length==0) return true;
    for (var nbElem in list) {
        if (options == "i") {
            if (list[nbElem] == str) return true;
        } else {
            var listElem = list[nbElem];
            if ( listElem.toLowerCase() == str.toLowerCase() ) return true;
        }
    }
    return false;
};

FileContents.toolIgnore = function (str,list,options) {
    if (list.length==0) return false;
    for (var nbElem in list) {
        if (options == "i") {
            if (list[nbElem] == str) return true;
        } else {
            var listElem = list[nbElem];
            if ( listElem.toLowerCase() == str.toLowerCase() ) return true;
        }
    }
    return false;
};

FileContents.getFilesList = function (data,files_) {

    var path = ".";
    var pathSep = "/";
    var extSep = ".";
    var extIgnore = [];
    var extAccept = [];
    var folderIgnore = [];
    var fileIgnore = [];
    var sizeFormatting = false;
    var sizeI18n = false;
    var sizeI18nData;


    if (data.path) path = data.path;
    if (data.extSep) extSep = data.extSep;

    if (data.extAccept && data.extAccept.length > 0) {
        extAccept = data.extAccept;
    } else if (data.extIgnore && data.extIgnore.length > 0) {
        extIgnore = data.extIgnore;
    }

    if (data.folderIgnore && data.folderIgnore.length > 0) folderIgnore = data.folderIgnore;
    if (data.fileIgnore && data.fileIgnore.length > 0) fileIgnore = data.fileIgnore;

    if (data.sizeFormatting) sizeFormatting = true;

    if  (
        data.sizeI18n &&
        data.sizeI18n.b &&
        data.sizeI18n.kb &&
        data.sizeI18n.mb &&
        data.sizeI18n.gb &&
        data.sizeI18n.tb
        )
    {
        sizeI18n = true;
        sizeI18nData = data.sizeI18n;
    }

    files_ = files_ || [];

    if (typeof files_ === 'undefined') files_=[];

    var files = fs.readdirSync(path);

    for(var i in files){

        if (!files.hasOwnProperty(i)) continue;
        var fullPath = path+pathSep+files[i];
        var stats = fs.statSync(fullPath);

        if (stats.isDirectory()){

            if (!FileContents.toolIgnore(files[i],folderIgnore,'i')) {
                var newData = data;
                data.path = fullPath;
                FileContents.getFilesList(newData,files_);
            }

        } else {

            var f = files[i];
            var splitFilePart = f.split(extSep);

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

            if (FileContents.toolAccept(e,extAccept) && !FileContents.toolIgnore(e,extIgnore) && !FileContents.toolIgnore(n,fileIgnore,'i')) {

                var fileSizeInBytes = stats["size"];
                var fileDisplayableSize;

                if (sizeFormatting){
                    if (sizeI18n) fileDisplayableSize = bytes(fileSizeInBytes,sizeI18nData);
                    else fileDisplayableSize = bytes(fileSizeInBytes);
                } else fileDisplayableSize = fileSizeInBytes;

                var currentFile = {"path":p,"name":n,"ext":e,"size":fileDisplayableSize};

                files_.push(currentFile);
            }
        }

    }
    return files_;
};

module.exports = FileContents;