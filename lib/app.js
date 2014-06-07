var fs = require('fs'),
    bytes = require('bytes-i18n'),
    dateFormat = require('dateformat'),
    FileContents = function () {};

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

FileContents.pathSep = "/";

FileContents.getFilesList = function (data,files_) {
    // Default config, done only on time in recursive function
    if (!data.start) {
        if (!data.path) data.path = ".";
        if (!data.extSep) data.extSep = ".";

        if (!data.extAccept || !(data.extAccept.length > 0)) {
            data.extAccept = [];
            if (!data.extIgnore || !(data.extIgnore.length > 0)) {
                data.extIgnore = [];
            }
        } else {
            data.extIgnore = [];
        }

        if (!data.folderIgnore || !(data.folderIgnore.length > 0)) data.folderIgnore = [];
        if (!data.fileIgnore || !(data.fileIgnore.length > 0)) data.fileIgnore = [];

        if (!data.sizeFormatting) data.sizeFormatting = false;

        if (
            data.resultJsonStruct != "list" &&
            data.resultJsonStruct != "path" &&
            data.resultJsonStruct != "ext"
            ) data.resultJsonStruct = "list";

        if (
            !data.sizeI18n || !data.sizeI18n.b || !data.sizeI18n.kb || !data.sizeI18n.mb || !data.sizeI18n.gb || !data.sizeI18n.tb
            ) {
            data.sizeI18n = false;
        }

        if (!data.fullPath) data.fullPath = false;
        if (!data.dates) data.dates = false;

        data.start = true;
    }

    if (data.resultJsonStruct == "path" || data.resultJsonStruct == "ext") {
        files_ = files_ || {};
        if (typeof files_ === 'undefined') files_ = {};
    } else if (data.resultJsonStruct == "list") {
        files_ = files_ || [];
        if (typeof files_ === 'undefined') files_ = [];
    }
    var files = fs.readdirSync(data.path);

    for(var i in files){

        if (!files.hasOwnProperty(i)) continue;
        var fullPath = data.path+FileContents.pathSep+files[i];
        var splitFullPath;
        if (data.resultJsonStruct == "path") {
            splitFullPath= fullPath.split(FileContents.pathSep);
        }
        var stats = fs.statSync(fullPath);

        if (stats.isDirectory()){

            if (!FileContents.toolIgnore(files[i],data.folderIgnore,'i')) {
                var newData = data;
                data.path = fullPath;
                FileContents.getFilesList(newData,files_);
            }

        } else {

            var f = files[i];
            var splitFilePart = f.split(data.extSep);

            var p = data.path+FileContents.pathSep;
            var n = "";
            var e = "";

            var length = splitFilePart.length;

            if ( length == 1 ) {
                n = f;
            } else {
                e = splitFilePart[length-1];
                var fLength = f.length;
                var eLength = e.length;
                var extSepLength = data.extSep.length;
                n = f.slice(0,fLength-eLength-extSepLength);
            }

            if (FileContents.toolAccept(e,data.extAccept) && !FileContents.toolIgnore(e,data.extIgnore) && !FileContents.toolIgnore(n,data.fileIgnore,'i')) {

                var fileSizeInBytes = stats["size"];
                var fileDisplayableSize;

                if (data.sizeFormatting){
                    if (data.sizeI18n) fileDisplayableSize = bytes(fileSizeInBytes,data.sizeI18n);
                    else fileDisplayableSize = bytes(fileSizeInBytes);
                } else fileDisplayableSize = fileSizeInBytes;

                var currentFile = {"path":p,"name":n,"ext":e,"size":fileDisplayableSize};
                if (data.fullPath) currentFile.fpath = fullPath;
                if (data.dates) {
                    if (data.dateFormat) {
                        currentFile.atime = dateFormat(stats.atime.getTime(),data.dateFormat);
                        currentFile.mtime = dateFormat(stats.mtime.getTime(),data.dateFormat);
                        currentFile.ctime = dateFormat(stats.ctime.getTime(),data.dateFormat);
                    } else {
                        currentFile.atime = stats.atime.getTime();
                        currentFile.mtime = stats.mtime.getTime();
                        currentFile.ctime = stats.ctime.getTime();
                    }
                }


                if (data.resultJsonStruct == "path") {
                    var previousDir = false;
                    for (var j=0;j<splitFullPath.length-1;j++){
                        if (previousDir) {
                            if (!previousDir[splitFullPath[j]]) {
                                previousDir[splitFullPath[j]] = {};
                            }
                            previousDir = previousDir[splitFullPath[j]];
                        }
                        else {
                            if  (!files_[splitFullPath[j]]) {
                                files_[splitFullPath[j]] = {};
                            }
                            previousDir=files_[splitFullPath[j]];
                        }
                    }
                    if(!previousDir['files']) previousDir['files'] = [];
                    previousDir['files'].push(currentFile);
                } else if (data.resultJsonStruct == "list") {
                    files_.push(currentFile);
                } else if (data.resultJsonStruct == "ext") {
                    if (!files_[e]) files_[e] = [];
                    files_[e].push(currentFile);
                }
            }
        }

    }
    return files_;
};

module.exports = FileContents;