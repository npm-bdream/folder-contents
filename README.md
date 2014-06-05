[![NPM](https://nodei.co/npm/folder-contents.png?downloads=true&stars=true)](https://nodei.co/npm/folder-contents/)

**folder-contents**
===================

Get list of files recursively in the specified folder with options

**Usage**
=========

    var fcs = require('folder-contents');

    var options = {
        "path":"./test",
        "extSep":".",
        "extIgnore":[],
        "extAccept":[],
        "folderIgnore":[],
        "fileIgnore":[]
    };
    var jsonFileList = fcs.getFilesList(options);
    console.log(jsonFileList);

defaults :
* `path` : **'.'** (folder where we want to list files . is equal to ./ )
* `extSep` : **'.'** (extention separator 'toto.jpg')
* `extIgnore` : **[]** (list of extentions to ignore ['jpg',...] )
* `extAccept` : **[]** (list of extentions to accept ['mkv',...] )
* `folderIgnore` : **[]** (list of folder to ignore ['.svn',...] )
* `fileIgnore` : **[]** (list of file to ignore ['toto',...] for 'toto.jpg' )

If `extAccept` is used, `extIgnore` content is ignored.

Result exemple :

    [
        { path: './test/', name: '', ext: 'htaccess' },
        { path: './test/', name: 'noext', ext: '' },
        { path: './test/', name: 'toto', ext: 'jpg' },
        { path: './test/subfolder/', name: 'film.vo.team-yo', ext: 'mkv' }
    ]

**NOTE : Package in work**
