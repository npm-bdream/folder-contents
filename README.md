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
        { path: './test/', name: '', ext: 'htaccess', size:'850' },
        { path: './test/', name: 'noext', ext: '', size:'1642' },
        { path: './test/', name: 'toto', ext: 'jpg', size:'3145728' },
        { path: './test/subfolder/', name: 'film.vo.team-yo', ext: 'mkv', size:'734003200'}
    ]

Where :

* `path` : parent folder of file.
* `name` : file name (without extention).
* `ext` : file extention.
* `size` : file size in byte.

**NOTE : Package in work**

Versions
=========

**v 0.0.6 - 2014/06/06**

* sire is now displayable, using package bytes-i18n

**v 0.0.5 - 2014/06/05**

* Add size in result.