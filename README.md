[![NPM](https://nodei.co/npm/folder-contents.png?downloads=true&stars=true)](https://nodei.co/npm/folder-contents/)

**folder-contents**
===================

List the contents of a folder recursively or not. Use the options.

**Usage**
=========

With options

    var folderContents = require('folder-contents');

    var options = {
        "path":".",
        "separator":".",
        "recursively":false,
        "method":"simple",
        "useBasePath":true,
        "filter":{
            "extensionIgnore":[],
            "extensionAccept":[],
            "folderIgnore":[],
            "fileIgnore":[]
        },
        "date":true, // See doc for patterns and i18n
        "size":true, // See doc for patterns and i18n
        "useFullPath":false
    };
    var jsonResult = folderContents(options);
    // console.log(jsonResult);
    // console.log(JSON.stringify(jsonResult));

Without options

    var folderContents = require('folder-contents');
    // console.log(folderContents());

Details for options
------------------

**`path` :** *( string )* 

* default path is **`./`** (don't add last **`/`** if you use this option).

**`separator` :** *( string )*

* default extension separator is **`.`**

**`recursively` :** *( bool )*

* default to **`false`**. If set at **`true`** list recursively files for all subsolder levels.

**`method` :** *( string )*
    
* `simple` : return simple json list with files. (is default)
* `simpleExtension` : return simple json object with list(s) of file(s) by extension.
* `simplePath` : return simple json object with list(s) of file(s) by folder.
* `complexPath` : return complex json structure based on path (More operations).

**`useBasePath` :** *( bool )*

* default to **`true`**. If set at **`false`**, base path is not returned in result.
* for example if you list **`./test`** as root folder, **`./test`** will not appear in file **`"path"`** and **`"fpath"`** values

**`filter.extensionIgnore`** : *( JSON.[ ] )* 

* List of extension *( string )* to ignore.
* IS CASE INSENSITIVE.
* If **`filter.extensionAccept`** is used, **`filter.extensionIgnore`** is ignored ;p

**`filter.extensionAccept`** : *( JSON.[ ] )* 

* List of extension *( string )* to accept.
* IS CASE INSENSITIVE.

**`filter.folderIgnore`** *( JSON.[ ] )* 

* List of folder name *( string )* to ignore.
* Is case sensitive.

**`filter.fileIgnore`** *( JSON.[ ] )*

* List of file name *( string )* to ignore. 
* Is case sensitive.
* Add names without extensions.

**`date :`** *( bool | string )*

* Default date value is **`true`**. Return timestamp for `atime`,`ctime` and `mtime` in json result.
* If you don't want dates in json result, set this value to **`false`**.
* If you want formated dates set a string (See [npm dateformat package][1] for patterns).
Exemple date string format : **`"yyyy/mm/dd - HH:MM:ss"`**
For `atime`,`ctime` and `mtime` please see : [Linux info page][2]

**`size :`** *( bool | JSON.{ } )*

* default size value is `true`, return size in byte for each files.
* If you don't want size in json result, set this value to **`false`**.
* If you want formated size use this json object :
    
        {
           "b":"b or B or o(for french) or what you want ...",
           "kb":"kb",
           "mb":"mb",
           "gb":"gb",
           "tb":"tb"
        }

* see [npm bytes-i18n package][3]

**`useFullPath` :** *( bool )* 

* default to false, if set to true `fpath` value is added for each files.

**Examples**
=========

For examples I use these files and my js app is in **`./`** folder :
    
    ./test/.htaccess
    ./test/photo.JPG
    ./test/subfolder/film.mkv

Examples for basic config
-------------------------

**Example A1 : default result for `simple methode`** (not recursive)

In this exemple, options are sames because we don't use recursivity

* default methode is `simple` 
* `complexPath` is set to `simple` when `recursively` is not defined or false.
* `simplePath` is set to `simple` when `recursively` is not defined or false.

        var folderContents = require('folder-contents');
        
        var options = {
            "path":"./test"
        };
        
        options = {
            "path":"./test",
            "method":"simple"
        };
        
        options = {
            "path":"./test",
            "method":"simplePath"
        };
        
        options = {
            "path":"./test",
            "method":"complexPath"
        };
        
        var result = folderContents(options);
        console.log(JSON.stringify(result));
        
        // Log result :
        {
            ".files": [
                {
                    "path": "./test",
                    "name": "",
                    "ext": "htaccess",
                    "size": 421,
                    "atime": 1402061211000,
                    "mtime": 1402061211000,
                    "ctime": 1402061200000
                },
                {
                    "path": "./test",
                    "name": "photo",
                    "ext": "JPG",
                    "size": 2760113,
                    "atime": 1402061374000,
                    "mtime": 1216722663000,
                    "ctime": 1402061374000
                }
            ],
            ".folders": [
                "subfolder"
            ]
        }
    
**Example A2 : default result for `simpleExtension methode`** (not recursive)
    
    var folderContents = require('folder-contents');
    
    options = {
        "path":"./test",
        "method":"simpleExtension"
    };
    
    var result = folderContents(options);
    console.log(JSON.stringify(result));
    
    {
        "htaccess": [
            {
                "path": "./test",
                "name": "",
                "ext": "htaccess",
                "size": 421,
                "atime": 1402061211000,
                "mtime": 1402061211000,
                "ctime": 1402061200000
            }
        ],
        "JPG": [
            {
                "path": "./test",
                "name": "photo",
                "ext": "JPG",
                "size": 2760113,
                "atime": 1402061374000,
                "mtime": 1216722663000,
                "ctime": 1402061374000
            }
        ],
        ".folders": [
            "subfolder"
        ]
    }


Examples for recursive config
-----------------------------



**Example B1 : default result for `simple methode`**

    var folderContents = require('folder-contents');

    var options = {
        "path":"./test",
        "recursively":true
    };
    
    var result = folderContents(options);
    console.log(JSON.stringify(result));
    
    // Log result :
    [
        {
            "path": "./test",
            "name": "",
            "ext": "htaccess",
            "size": 421,
            "atime": 1402061211000,
            "mtime": 1402061211000,
            "ctime": 1402061200000
        },
        {
            "path": "./test",
            "name": "photo",
            "ext": "JPG",
            "size": 2760113,
            "atime": 1402061374000,
            "mtime": 1216722663000,
            "ctime": 1402061374000
        },
        {
            "path": "./test/subfolder",
            "name": "film",
            "ext": "mkv",
            "size": 703836104,
            "atime": 1402061717000,
            "mtime": 1369822031000,
            "ctime": 1402061717000
        }
    ]

**Example B2 : default result for `simpleExtension methode`**

    var folderContents = require('folder-contents');

    var options = {
        "path":"./test",
        "method":"simpleExtension",
        "recursively":true
    };
    
    var result = folderContents(options);
    console.log(JSON.stringify(result));
    
    // Log result :
    {
        "htaccess": [
            {
                "path": "./test",
                "name": "",
                "ext": "htaccess",
                "size": 421,
                "atime": 1402061211000,
                "mtime": 1402061211000,
                "ctime": 1402061200000
            }
        ],
        "JPG": [
            {
                "path": "./test",
                "name": "photo",
                "ext": "JPG",
                "size": 2760113,
                "atime": 1402061374000,
                "mtime": 1216722663000,
                "ctime": 1402061374000
            }
        ],
        "mkv": [
            {
                "path": "./test/subfolder",
                "name": "film",
                "ext": "mkv",
                "size": 703836104,
                "atime": 1402061717000,
                "mtime": 1369822031000,
                "ctime": 1402061717000
            }
        ]
    }

**Example B3 : default result for `simplePath methode`**

    var folderContents = require('folder-contents');

    var options = {
        "path":"./test",
        "method":"simplePath",
        "recursively":true
    };
    
    var result = folderContents(options);
    console.log(JSON.stringify(result));
    
    // Log result :
    {
        "./test/": [
            {
                "path": "./test",
                "name": "",
                "ext": "htaccess",
                "size": 421,
                "atime": 1402061211000,
                "mtime": 1402061211000,
                "ctime": 1402061200000
            },
            {
                "path": "./test",
                "name": "photo",
                "ext": "JPG",
                "size": 2760113,
                "atime": 1402061374000,
                "mtime": 1216722663000,
                "ctime": 1402061374000
            }
        ],
        "./test/subfolder/": [
            {
                "path": "./test/subfolder",
                "name": "film",
                "ext": "mkv",
                "size": 703836104,
                "atime": 1402061717000,
                "mtime": 1369822031000,
                "ctime": 1402061717000
            }
        ]
    }

**Example B4 : default result for `complexPath methode`**

    var folderContents = require('folder-contents');

    var options = {
        "path":"./test",
        "method":"complexPath",
        "recursively":true
    };
    
    var result = folderContents(options);
    console.log(JSON.stringify(result));
    
    // Log result :
    {
        ".": {
            "test": {
                ".files": [
                    {
                        "path": "./test",
                        "name": "",
                        "ext": "htaccess",
                        "size": 421,
                        "atime": 1402061211000,
                        "mtime": 1402061211000,
                        "ctime": 1402061200000
                    },
                    {
                        "path": "./test",
                        "name": "photo",
                        "ext": "JPG",
                        "size": 2760113,
                        "atime": 1402061374000,
                        "mtime": 1216722663000,
                        "ctime": 1402061374000
                    }
                ],
                "subfolder": {
                    ".files": [
                        {
                            "path": "./test/subfolder",
                            "name": "film",
                            "ext": "mkv",
                            "size": 703836104,
                            "atime": 1402061717000,
                            "mtime": 1369822031000,
                            "ctime": 1402061717000
                        }
                    ]
                }
            }
        }
    }

Now you can find **`./test`** files like this :
    
    result['.']['test']['.files']
    
Use folder **`./test/subfolder`** :

    result['.']['test']['subfolder']

And **`./test/subfolder`** file(s) :

    result['.']['test']['subfolder']['.files']


Examples for dates / size / filter and fpath
-----------------------------

**Example C1 : use `filter.extensionIgnore` and `useFullPath`**

You can see fpath value in json result and `jpg` file in no longer returned.

    var folderContents = require('folder-contents');
    
    var options = {
        "path":"./test",
        "filter":{
            "extensionIgnore":['jpg']
        },
        "useFullPath": true
    };
    
    var result = folderContents(options);
    console.log(JSON.stringify(result));
    
    // Log result :
    {
    ".files": [
        {
            "path": "./test",
            "name": "",
            "ext": "htaccess",
            "fpath": "./test/.htaccess",
            "size": 421,
            "atime": 1402061211000,
            "mtime": 1402061211000,
            "ctime": 1402061200000
        }
    ],
    ".folders": [
        "subfolder"
    ]
}

**Example C2 : use `size` and `date` to false**

Case for minimum informations

    var folderContents = require('folder-contents');
    
    var options = {
        "path":"./test",
        "date":false,
        "size": false
    };
    
    var result = folderContents(options);
    console.log(JSON.stringify(result));
    
    // Log result :
    {
        ".files": [
            {
                "path": "./test",
                "name": "",
                "ext": "htaccess"
            },
            {
                "path": "./test",
                "name": "photo",
                "ext": "JPG"
            }
        ],
        ".folders": [
            "subfolder"
        ]
    }
    
**Example C3 : use patterns/format for `date` and `size`**
    
    var folderContents = require('folder-contents');
    
    var options = {
        "path":"./test",
        "date":"yyyy/mm/dd - HH:MM:ss",
        "size":{
            "b":" B...",
            "kb":" kB...",
            "mb":" mB...",
            "gb":" gB...",
            "tb":" tB..."
        }
    };

    var result = folderContents(options);
    console.log(JSON.stringify(result));

    // Log result :
    {
        ".files": [
            {
                "path": "./test",
                "name": "",
                "ext": "htaccess",
                "size": "421 B...",
                "atime": "2014/06/06 - 15:26:51",
                "mtime": "2014/06/06 - 15:26:51",
                "ctime": "2014/06/06 - 15:26:40"
            },
            {
                "path": "./test",
                "name": "photo",
                "ext": "JPG",
                "size": "2.63 mB...",
                "atime": "2014/06/06 - 15:29:34",
                "mtime": "2008/07/22 - 12:31:03",
                "ctime": "2014/06/06 - 15:29:34"
            }
        ],
        ".folders": [
            "subfolder"
        ]
    }

**Example C4 : set **`useBasePath`** to false

        var folderContents = require('folder-contents');

        var options = {
            "path":"./test",
            "useBasePath":false,
            "recursively":true
        };

        var result = folderContents(options);
        console.log(JSON.stringify(result));

        // Log result :
        [
            {
                "path": "/",
                "name": "",
                "ext": "htaccess",
                "size": 421,
                "atime": 1402061211000,
                "mtime": 1402061211000,
                "ctime": 1402061200000
            },
            {
                "path": "/",
                "name": "photo",
                "ext": "JPG",
                "size": 2760113,
                "atime": 1402061374000,
                "mtime": 1216722663000,
                "ctime": 1402061374000
            },
            {
                "path": "/subfolder",
                "name": "film",
                "ext": "mkv",
                "size": 703836104,
                "atime": 1402061717000,
                "mtime": 1369822031000,
                "ctime": 1402061717000
            }
        ]

Versions
=========

**v 1.1.0 - 2014/06/18**

I am working on my other project (folder-to-ui),and I use this package.
So I found improvements that are not backward compatible.

* In listed files, I change **`"path"`** value content for json result.
    * I don't add end **`/`** so **`./test/`** will now **`./test`** in json result
* It is now possible to set **`useBasePath`** option to false
    * if **`useBasePath`** set to false, **`path`** and **`fpath`** will change in json result
    * **`path`** for **`./test`** will be **`/`** if root folder is `./test`
    * **`path`** for **`./test/subfolder`** will be **`/subfolder`** if root folder is `./test`
    * As you can see if listed file is in root folder I add **`/`**. Only case with end **`/`**
    * For this option you can see Examples B1 and C4 to compare differences.

**v 1.0.0 - 2014/06/10**

* Lot of fixs, changes and optimizations since 0.1.0 version. 
* Please read documentation
* Add option `recursively`. Default is false !!!
* Fix very hot bug in option path copy in recursive function...
* In conclusion this version will suit many uses.

**v 0.1.0 - 2014/06/08**

* Add file dates : atime, ctime, mtime (timestamp).
* Date added if `dates` option is enabled.
* Date is formatted if `dateFormat` option is configured.
* Add file full path : fpath, enabled if `fullPath` option is enabled.

**v 0.0.9 - 2014/06/07**

* Add resultJsonStruct option.
* Optimizing options initialization.

**v 0.0.8 - 2014/06/06**

* Add byte unit translation.
* `extIgnore` is now case insensitive.
* `extAccept` is now case insensitive.

**v 0.0.6 - 2014/06/06**

* Size is now displayable, using package bytes-i18n

**v 0.0.5 - 2014/06/05**

* Add size in result.


  [1]: https://www.npmjs.org/package/dateformat
  [2]: http://www.linux-faqs.info/general/difference-between-mtime-ctime-and-atime
  [3]: https://www.npmjs.org/package/bytes-i18n