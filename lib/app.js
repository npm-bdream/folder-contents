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

FileContents.getFilesList = function (data,files_,recursivePath_) {
    // Default config, done only on time in recursive function
    if ( data == undefined || data.in_function_start == undefined ) {
        if ( data == undefined ) data = {};
        if ( data.path == undefined || (typeof data.path) != "string" ) data.path = ".";
        if ( data.separator == undefined || (typeof data.separator) != "string" ) data.separator = ".";

        if ( data.recursively != true ) data.recursively = false;

        if ( data.filter == undefined || data.filter.constructor != {}.constructor ) {
            data.filter = {};
            data.filter.extensionAccept = [];
            data.filter.extensionIgnore = [];
            data.filter.folderIgnore = [];
            data.filter.fileIgnore = [];
        } else {
            if ( data.filter.extensionAccept == undefined || data.filter.extensionAccept.length < 1 ) {
                data.filter.extensionAccept = [];
                if ( data.filter.extensionIgnore == undefined || data.filter.extensionIgnore.length < 1 ) {
                    data.filter.extensionIgnore = [];
                }
            } else {
                data.filter.extensionIgnore = [];
            }
            if ( data.filter.folderIgnore == undefined || data.filter.folderIgnore.length < 1 ) data.filter.folderIgnore = [];
            if ( data.filter.fileIgnore == undefined || data.filter.fileIgnore.length < 1 ) data.filter.fileIgnore = [];
        }
        if (
            data.method != "simple" &&
            data.method != "simplePath" &&
            data.method != "simpleExtension" &&
            data.method != "complexPath"

            )
        { data.method = "simple"; }

        if ( data.recursively == false && ( data.method == "simplePath" || data.method == "complexPath" ))
        { data.method = "simple"; }

        if ( data.useFullPath == undefined || data.useFullPath!=true ) data.useFullPath = false;
        if (data.size == undefined &&
            data.size != true &&
            data.size != false &&
            (!data.size || !data.size.b || !data.size.kb || !data.size.mb || !data.size.gb || !data.size.tb)
            )
        { data.size = true; }
        if (data.date == undefined || ( data.date != false && (typeof data.date) != "string"))
        { data.date = true; }
        if ( data.size != false ) data.in_function_size = true;
        if ( data.date != false ) data.in_function_date = true;

        if (data.method == "simple" && data.recursively == true ) {
            files_ = files_ || [];
            if (typeof files_ === 'undefined') files_ = [];
        } else {
            files_ = files_ || {};
            if (typeof files_ === 'undefined') files_ = {};
        }

        if (data.useBasePath != false) data.useBasePath = true;

        if (data.useBasePath == false) {
            data.in_function_basePath = data.path;
            data.path = '';
        }
        else data.in_function_basePath = '';

        data.in_function_start = true;
    }



    var currentWorkDir;
    if (recursivePath_) currentWorkDir = recursivePath_;
    else currentWorkDir = data.path;

    var files = fs.readdirSync(data.in_function_basePath+currentWorkDir);

    for(var i in files){

        if (!files.hasOwnProperty(i)) continue;

        var fullPath = currentWorkDir+FileContents.pathSep+files[i];

        var splitFullPath;
        if (data.method == "complexPath") {
            splitFullPath= fullPath.split(FileContents.pathSep);
        }

        var stats = fs.statSync(data.in_function_basePath+fullPath);

        if (stats.isDirectory()){

            if (!FileContents.toolIgnore(files[i],data.filter.folderIgnore,'i')) {
                if (data.recursively == true) FileContents.getFilesList(data,files_,fullPath);
                else {
                    if (!files_[".folders"]) files_[".folders"] = [];
                    files_[".folders"].push(files[i]);
                }
            }

        } else {

            var f = files[i];
            var splitFilePart = f.split(data.separator);

            var p;
            if (currentWorkDir != '') p = currentWorkDir;
            else p = FileContents.pathSep;
            var n = "";
            var e = "";

            var length = splitFilePart.length;

            if ( length == 1 ) {
                n = f;
            } else {
                e = splitFilePart[length-1];
                var fLength = f.length;
                var eLength = e.length;
                var separatorLength = data.separator.length;
                n = f.slice(0,fLength-eLength-separatorLength);
            }

            if (FileContents.toolAccept(e,data.filter.extensionAccept) && !FileContents.toolIgnore(e,data.filter.extensionIgnore) && !FileContents.toolIgnore(n,data.filter.fileIgnore,'i')) {

                var currentFile = {"path":p,"name":n,"ext":e};
                if (data.useFullPath) currentFile.fpath = fullPath;
                if (data.in_function_size) {

                    if ( data.size == true ) currentFile.size = stats["size"];
                    else currentFile.size = bytes(stats["size"],data.size);
                }
                if (data.in_function_date) {
                    if (data.date == true) {
                        currentFile.atime = stats.atime.getTime();
                        currentFile.mtime = stats.mtime.getTime();
                        currentFile.ctime = stats.ctime.getTime();
                    } else {
                        currentFile.atime = dateFormat(stats.atime.getTime(),data.date);
                        currentFile.mtime = dateFormat(stats.mtime.getTime(),data.date);
                        currentFile.ctime = dateFormat(stats.ctime.getTime(),data.date);
                    }
                }
                if (data.method == "complexPath") {
                    var previousDir = false;
                    for (var j=0;j<splitFullPath.length-1;j++){
                        if (previousDir) {
                            if (!previousDir[splitFullPath[j]]) {
                                previousDir[splitFullPath[j]] = {};
                            }
                            previousDir = previousDir[splitFullPath[j]];
                        }
                        else {
                            var key = splitFullPath[j];
                            if (key == '') key = '/';
                            if  (!files_[key]) {
                                files_[key] = {};
                            }
                            previousDir=files_[key];
                        }
                    }
                    if(!previousDir['.files']) previousDir['.files'] = [];
                    previousDir['.files'].push(currentFile);
                } else if (data.method == "simple") {
                    if (data.recursively == true) files_.push(currentFile);
                    else {
                        if (!files_['.files']) files_['.files'] = [];
                        files_['.files'].push(currentFile);
                    }
                } else if (data.method == "simpleExtension") {
                    if (!files_[e]) files_[e] = [];
                    files_[e].push(currentFile);
                } else if (data.method == "simplePath") {
                    if (!files_[p]) files_[p] = [];
                    files_[p].push(currentFile);
                }
            }
        }
    }
    return files_;
};

module.exports = FileContents.getFilesList;