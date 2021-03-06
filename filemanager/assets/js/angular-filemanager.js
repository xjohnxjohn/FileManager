! function(e, n, t) {
    "use strict";
    n.module("FileManagerApp", ["pascalprecht.translate", "ngCookies"]);
    t(e.document).on("shown.bs.modal", ".modal", function() {
        setTimeout(function() {
            t("[autofocus]", this).focus()
        }.bind(this), 100)
    }), t(e.document).on("click", function() {
        t("#context-menu").hide()
    }), t(e.document).on("contextmenu", ".main-navigation .table-files td:first-child, .iconset a.thumbnail", function(e) {
        t("#context-menu").hide().css({
            left: e.pageX,
            top: e.pageY
        }).show(), e.preventDefault()
    })
}(window, angular, jQuery), 
function(e) {
    "use strict";
    var n = e.module("FileManagerApp");
    n.directive("angularFilemanager", ["$parse", "fileManagerConfig", function(e, n) {
        return {
            restrict: "EA",
            templateUrl: n.tplPath + "/main.html"
        }
    }]), n.directive("ngFile", ["$parse", function(e) {
        return {
            restrict: "A",
            link: function(n, t, r) {
                var a = e(r.ngFile),
                    i = a.assign;
                t.bind("change", function() {
                    n.$apply(function() {
                        i(n, t[0].files)
                    })
                })
            }
        }
    }]), n.directive("ngRightClick", ["$parse", function(e) {
        return function(n, t, r) {
            var a = e(r.ngRightClick);
            t.bind("contextmenu", function(e) {
                n.$apply(function() {
                    e.preventDefault(), a(n, {
                        $event: e
                    })
                })
            })
        }
    }])
}(angular),
function(e, n, t) {
    "use strict";
    n.module("FileManagerApp").controller("FileManagerCtrl", ["$scope", "$translate", "$cookies", "fileManagerConfig", "item", "fileNavigator", "fileUploader", function(n, r, a, i, o, s, l) {
        n.config = i, n.appName = i.appName, n.orderProp = ["model.type", "model.name"], n.query = "", n.temp = new o, n.fileNavigator = new s, n.fileUploader = l, n.uploadFileList = [], n.viewTemplate = a.viewTemplate || "main-table.html", n.setTemplate = function(e) {
            n.viewTemplate = a.viewTemplate = e
        }, n.changeLanguage = function(e) {
            return e ? r.use(a.language = e) : void r.use(a.language || i.defaultLang)
        }, n.touch = function(e) {
            e = e instanceof o ? e : new o, e.revert && e.revert(), n.temp = e
        }, n.smartClick = function(e) {
            return e.isFolder() ? n.fileNavigator.folderClick(e) : e.isImage() ? e.preview() : e.isEditable() ? (e.getContent(), n.touch(e), n.modal("edit")) : void 0
        }, n.modal = function(e, n) {
            t("#" + e).modal(n ? "hide" : "show")
        }, n.isInThisPath = function(e) {
            var t = n.fileNavigator.currentPath.join("/");
            return -1 !== t.indexOf(e)
        }, n.edit = function(e) {
            e.edit().then(function() {
                n.modal("edit", !0)
            })
        }, n.changePermissions = function(e) {
            e.changePermissions().then(function() {
                n.modal("changepermissions", !0)
            })
        }, n.copy = function(e) {
            var t = e.tempModel.path.join() === e.model.path.join();
            return t && n.fileNavigator.fileNameExists(e.tempModel.name) ? (e.error = r.instant("error_invalid_filename"), !1) : void e.copy().then(function() {
                n.fileNavigator.refresh(), n.modal("copy", !0)
            })
        }, n.compress = function(e) {
            e.compress().then(function() {
                return n.fileNavigator.refresh(), n.config.compressAsync ? void(e.asyncSuccess = !0) : n.modal("compress", !0)
            }, function() {
                e.asyncSuccess = !1
            })
        }, n.extract = function(e) {
            e.extract().then(function() {
                return n.fileNavigator.refresh(), n.config.extractAsync ? void(e.asyncSuccess = !0) : n.modal("extract", !0)
            }, function() {
                e.asyncSuccess = !1
            })
        }, n.remove = function(e) {
            e.remove().then(function() {
                n.fileNavigator.refresh(), n.modal("delete", !0)
            })
        }, n.rename = function(e) {
            var t = e.tempModel.path.join() === e.model.path.join();
            return t && n.fileNavigator.fileNameExists(e.tempModel.name) ? (e.error = r.instant("error_invalid_filename"), !1) : void e.rename().then(function() {
                n.fileNavigator.refresh(), n.modal("rename", !0)
            })
        }, n.createFolder = function(e) {
            var t = e.tempModel.name && e.tempModel.name.trim();
            return e.tempModel.type = "dir", e.tempModel.path = n.fileNavigator.currentPath, !t || n.fileNavigator.fileNameExists(t) ? (n.temp.error = r.instant("error_invalid_filename"), !1) : void e.createFolder().then(function() {
                n.fileNavigator.refresh(), n.modal("newfolder", !0)
            })
        }, n.uploadFiles = function() {
            n.fileUploader.upload(n.uploadFileList, n.fileNavigator.currentPath).then(function() {
                n.fileNavigator.refresh(), n.modal("uploadfile", !0)
            }, function(e) {
                var t = e.result && e.result.error || r.instant("error_uploading_files");
                n.temp.error = t
            })
        }, n.getQueryParam = function(n) {
            var t;
            return e.location.search.substr(1).split("&").forEach(function(e) {
                return n === e.split("=")[0] ? (t = e.split("=")[1], !1) : void 0
            }), t
        }, n.changeLanguage(n.getQueryParam("lang")), n.isWindows = "Windows" === n.getQueryParam("server"), n.fileNavigator.refresh()
    }])
}(window, angular, jQuery),
function(e, n) {
    "use strict";
    e.module("FileManagerApp").controller("ModalFileManagerCtrl", ["$scope", "$rootScope", "fileNavigator", function(e, t, r) {
        e.orderProp = ["model.type", "model.name"], e.fileNavigator = new r, t.select = function(e, t) {
            t.tempModel.path = e.model.fullPath().split("/"), n("#selector").modal("hide")
        }, t.openNavigator = function(t) {
            e.fileNavigator.currentPath = t.model.path.slice(), e.fileNavigator.refresh(), n("#selector").modal("show")
        }
    }])
}(angular, jQuery),
function(e) {
    "use strict";
    e.module("FileManagerApp").service("chmod", function() {
        var e = function(e) {
            if (this.owner = this.getRwxObj(), this.group = this.getRwxObj(), this.others = this.getRwxObj(), e) {
                var n = isNaN(e) ? this.convertfromCode(e) : this.convertfromOctal(e);
                if (!n) throw new Error("Invalid chmod input data");
                this.owner = n.owner, this.group = n.group, this.others = n.others
            }
        };
        return e.prototype.toOctal = function(e, n) {
            var t = ["owner", "group", "others"],
                r = [];
            for (var a in t) {
                var i = t[a];
                r[a] = this[i].read && this.octalValues.read || 0, r[a] += this[i].write && this.octalValues.write || 0, r[a] += this[i].exec && this.octalValues.exec || 0
            }
            return (e || "") + r.join("") + (n || "")
        }, e.prototype.toCode = function(e, n) {
            var t = ["owner", "group", "others"],
                r = [];
            for (var a in t) {
                var i = t[a];
                r[a] = this[i].read && this.codeValues.read || "-", r[a] += this[i].write && this.codeValues.write || "-", r[a] += this[i].exec && this.codeValues.exec || "-"
            }
            return (e || "") + r.join("") + (n || "")
        }, e.prototype.getRwxObj = function() {
            return {
                read: !1,
                write: !1,
                exec: !1
            }
        }, e.prototype.octalValues = {
            read: 4,
            write: 2,
            exec: 1
        }, e.prototype.codeValues = {
            read: "r",
            write: "w",
            exec: "x"
        }, e.prototype.convertfromCode = function(e) {
            if (e = ("" + e).replace(/\s/g, ""), e = 10 === e.length ? e.substr(1) : e, /^[-rwx]{9}$/.test(e)) {
                var n = [],
                    t = e.match(/.{1,3}/g);
                for (var r in t) {
                    var a = this.getRwxObj();
                    a.read = /r/.test(t[r]), a.write = /w/.test(t[r]), a.exec = /x/.test(t[r]), n.push(a)
                }
                return {
                    owner: n[0],
                    group: n[1],
                    others: n[2]
                }
            }
        }, e.prototype.convertfromOctal = function(e) {
            if (e = ("" + e).replace(/\s/g, ""), e = 4 === e.length ? e.substr(1) : e, /^[0-7]{3}$/.test(e)) {
                var n = [],
                    t = e.match(/.{1}/g);
                for (var r in t) {
                    var a = this.getRwxObj();
                    a.read = /[4567]/.test(t[r]), a.write = /[2367]/.test(t[r]), a.exec = /[1357]/.test(t[r]), n.push(a)
                }
                return {
                    owner: n[0],
                    group: n[1],
                    others: n[2]
                }
            }
        }, e
    })
}(angular),
function(e, n, t) {
    "use strict";
    n.module("FileManagerApp").factory("item", ["$http", "$q", "$translate", "fileManagerConfig", "chmod", function(r, a, i, o, s) {
        var l = function(e, t) {
            function r(e) {
                var n = (e || "").toString().split(/[- :]/);
                return new Date(n[0], n[1] - 1, n[2], n[3], n[4], n[5])
            }
            var a = {
                name: e && e.name || "",
                path: t || [],
                type: e && e.type || "file",
                size: e && e.size || 0,
                date: r(e && e.date),
                perms: new s(e && e.rights),
                content: e && e.content || "",
                recursive: !1,
                sizeKb: function() {
                    return Math.round(this.size / 1024, 1)
                },
                fullPath: function() {
                    return ("/" + this.path.join("/") + "/" + this.name).replace(/\/\//, "/")
                }
            };
            this.error = "", this.inprocess = !1, this.model = n.copy(a), this.tempModel = n.copy(a)
        };
        return l.prototype.update = function() {
            n.extend(this.model, n.copy(this.tempModel))
        }, l.prototype.revert = function() {
            n.extend(this.tempModel, n.copy(this.model)), this.error = ""
        }, l.prototype.deferredHandler = function(e, n, t) {
            return e.result && e.result.error && (this.error = e.result.error), !this.error && e.error && (this.error = e.error.message), !this.error && t && (this.error = t), this.error ? n.reject(e) : (this.update(), n.resolve(e))
        }, l.prototype.createFolder = function() {
            var e = this,
                n = a.defer(),
                t = {
                    params: {
                        mode: "addfolder",
                        path: e.tempModel.path.join("/"),
                        name: e.tempModel.name
                    }
                };
            return e.inprocess = !0, e.error = "", r.post(o.createFolderUrl, t).success(function(t) {
                e.deferredHandler(t, n)
            }).error(function(t) {
                e.deferredHandler(t, n, i.instant("error_creating_folder"))
            })["finally"](function(n) {
                e.inprocess = !1
            }), n.promise
        }, l.prototype.rename = function() {
            var e = this,
                n = a.defer(),
                t = {
                    params: {
                        mode: "rename",
                        path: e.model.fullPath(),
                        newPath: e.tempModel.fullPath()
                    }
                };
            return e.inprocess = !0, e.error = "", r.post(o.renameUrl, t).success(function(t) {
                e.deferredHandler(t, n)
            }).error(function(t) {
                e.deferredHandler(t, n, i.instant("error_renaming"))
            })["finally"](function() {
                e.inprocess = !1
            }), n.promise
        }, l.prototype.copy = function() {
            var e = this,
                n = a.defer(),
                t = {
                    params: {
                        mode: "copy",
                        path: e.model.fullPath(),
                        newPath: e.tempModel.fullPath()
                    }
                };
            return e.inprocess = !0, e.error = "", r.post(o.copyUrl, t).success(function(t) {
                e.deferredHandler(t, n)
            }).error(function(t) {
                e.deferredHandler(t, n, i.instant("error_copying"))
            })["finally"](function() {
                e.inprocess = !1
            }), n.promise
        }, l.prototype.compress = function() {
            var e = this,
                n = a.defer(),
                t = {
                    params: {
                        mode: "compress",
                        path: e.model.fullPath(),
                        destination: e.tempModel.fullPath()
                    }
                };
            return e.inprocess = !0, e.error = "", r.post(o.compressUrl, t).success(function(t) {
                e.deferredHandler(t, n)
            }).error(function(t) {
                e.deferredHandler(t, n, i.instant("error_compressing"))
            })["finally"](function() {
                e.inprocess = !1
            }), n.promise
        }, l.prototype.extract = function() {
            var e = this,
                n = a.defer(),
                t = {
                    params: {
                        mode: "extract",
                        path: e.model.fullPath(),
                        sourceFile: e.model.fullPath(),
                        destination: e.tempModel.fullPath()
                    }
                };
            return e.inprocess = !0, e.error = "", r.post(o.extractUrl, t).success(function(t) {
                e.deferredHandler(t, n)
            }).error(function(t) {
                e.deferredHandler(t, n, i.instant("error_extracting"))
            })["finally"](function() {
                e.inprocess = !1
            }), n.promise
        }, l.prototype.download = function(n) {
            var r = this,
                a = {
                    mode: "download",
                    preview: n,
                    path: r.model.fullPath()
                },
                i = [o.downloadFileUrl, t.param(a)].join("?");
            "dir" !== r.model.type && e.open(i, "_blank", "")
        }, l.prototype.preview = function() {
            var e = this;
            return e.download(!0)
        }, l.prototype.getContent = function() {
            var e = this,
                n = a.defer(),
                t = {
                    params: {
                        mode: "editfile",
                        path: e.tempModel.fullPath()
                    }
                };
            return e.inprocess = !0, e.error = "", r.post(o.getContentUrl, t).success(function(t) {
                e.tempModel.content = e.model.content = t.result, e.deferredHandler(t, n)
            }).error(function(t) {
                e.deferredHandler(t, n, i.instant("error_getting_content"))
            })["finally"](function() {
                e.inprocess = !1
            }), n.promise
        }, l.prototype.remove = function() {
            var e = this,
                n = a.defer(),
                t = {
                    params: {
                        mode: "delete",
                        path: e.tempModel.fullPath()
                    }
                };
            return e.inprocess = !0, e.error = "", r.post(o.removeUrl, t).success(function(t) {
                e.deferredHandler(t, n)
            }).error(function(t) {
                e.deferredHandler(t, n, i.instant("error_deleting"))
            })["finally"](function() {
                e.inprocess = !1
            }), n.promise
        }, l.prototype.edit = function() {
            var e = this,
                n = a.defer(),
                t = {
                    params: {
                        mode: "savefile",
                        content: e.tempModel.content,
                        path: e.tempModel.fullPath()
                    }
                };
            return e.inprocess = !0, e.error = "", r.post(o.editUrl, t).success(function(t) {
                e.deferredHandler(t, n)
            }).error(function(t) {
                e.deferredHandler(t, n, i.instant("error_modifying"))
            })["finally"](function() {
                e.inprocess = !1
            }), n.promise
        }, l.prototype.changePermissions = function() {
            var e = this,
                n = a.defer(),
                t = {
                    params: {
                        mode: "changepermissions",
                        path: e.tempModel.fullPath(),
                        perms: e.tempModel.perms.toOctal(),
                        permsCode: e.tempModel.perms.toCode(),
                        recursive: e.tempModel.recursive
                    }
                };
            return e.inprocess = !0, e.error = "", r.post(o.permissionsUrl, t).success(function(t) {
                e.deferredHandler(t, n)
            }).error(function(t) {
                e.deferredHandler(t, n, i.instant("error_changing_perms"))
            })["finally"](function() {
                e.inprocess = !1
            }), n.promise
        }, l.prototype.isFolder = function() {
            return "dir" === this.model.type
        }, l.prototype.isEditable = function() {
            return !this.isFolder() && o.isEditableFilePattern.test(this.model.name)
        }, l.prototype.isImage = function() {
            return o.isImageFilePattern.test(this.model.name)
        }, l.prototype.isCompressible = function() {
            return this.isFolder()
        }, l.prototype.isExtractable = function() {
            return !this.isFolder() && o.isExtractableFilePattern.test(this.model.name)
        }, l
    }])
}(window, angular, jQuery),
function(e) {
    "use strict";
    var n = e.module("FileManagerApp");
    n.filter("strLimit", ["$filter", function(e) {
        return function(n, t) {
            return n.length <= t ? n : e("limitTo")(n, t) + "..."
        }
    }]), n.filter("formatDate", ["$filter", function(e) {
        return function(e, n) {
            return e instanceof Date ? e.toISOString().substring(0, 19).replace("T", " ") : (e.toLocaleString || e.toString).apply(e)
        }
    }])
}(angular),
function(e) {
    "use strict";
    e.module("FileManagerApp").provider("fileManagerConfig", function() {
        var n = {
            appName: "https://github.com/joni2back/angular-filemanager",
            defaultLang: "en",
            listUrl: "bridges/php/handler.php",
            uploadUrl: "bridges/php/handler.php",
            renameUrl: "bridges/php/handler.php",
            copyUrl: "bridges/php/handler.php",
            removeUrl: "bridges/php/handler.php",
            editUrl: "bridges/php/handler.php",
            getContentUrl: "bridges/php/handler.php",
            createFolderUrl: "bridges/php/handler.php",
            downloadFileUrl: "bridges/php/handler.php",
            compressUrl: "bridges/php/handler.php",
            extractUrl: "bridges/php/handler.php",
            permissionsUrl: "bridges/php/handler.php",
            sidebar: !0,
            breadcrumb: !0,
            allowedActions: {
                rename: !0,
                copy: !0,
                edit: !0,
                changePermissions: !0,
                compress: !0,
                compressChooseName: !0,
                extract: !0,
                download: !0,
                preview: !0,
                remove: !0
            },
            enablePermissionsRecursive: !0,
            compressAsync: !0,
            extractAsync: !0,
            isEditableFilePattern: /\.(txt|html?|aspx?|ini|pl|py|md|css|js|log|htaccess|htpasswd|json|sql|xml|xslt?|sh|rb|as|bat|cmd|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb)$/i,
            isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
            isExtractableFilePattern: /\.(gz|tar|rar|g?zip)$/i,
            tplPath: "src/templates"
        };
        return {
            $get: function() {
                return n
            },
            set: function(t) {
                e.extend(n, t)
            }
        }
    })
}(angular),
function(e) {
    "use strict";
    e.module("FileManagerApp").config(["$translateProvider", function(e) {
        e.translations("en", {
            filemanager: "File Manager",
            language: "Language",
            english: "English",
            spanish: "Spanish",
            portuguese: "Portuguese",
            french: "French",
            confirm: "Confirm",
            cancel: "Cancel",
            close: "Close",
            upload_file: "Upload file",
            files_will_uploaded_to: "Files will be uploaded to",
            uploading: "Uploading",
            permissions: "Permissions",
            select_destination_folder: "Select the destination folder",
            source: "Source",
            destination: "Destination",
            copy_file: "Copy file",
            sure_to_delete: "Are you sure to delete",
            change_name_move: "Change name / move",
            enter_new_name_for: "Enter new name for",
            extract_item: "Extract item",
            extraction_started: "Extraction started in a background process",
            compression_started: "Compression started in a background process",
            enter_folder_name_for_extraction: "Enter the folder name for the extraction of",
            enter_folder_name_for_compression: "Enter the folder name for the compression of",
            toggle_fullscreen: "Toggle fullscreen",
            edit_file: "Edit file",
            file_content: "File content",
            loading: "Loading",
            search: "Search",
            create_folder: "Create folder",
            create: "Create",
            folder_name: "Folder name",
            upload: "Upload",
            change_permissions: "Change permissions",
            change: "Change",
            details: "Details",
            icons: "Icons",
            list: "List",
            name: "Name",
            size: "Size",
            actions: "Actions",
            date: "Date",
            no_files_in_folder: "No files in this folder",
            no_folders_in_folder: "This folder not contains children folders",
            select_this: "Select this",
            go_back: "Go back",
            wait: "Wait",
            move: "Move",
            download: "Download",
            view_item: "View item",
            remove: "Delete",
            edit: "Edit",
            copy: "Copy",
            rename: "Rename",
            extract: "Extract",
            compress: "Compress",
            error_invalid_filename: "Invalid filename or already exists, specify another name",
            error_modifying: "An error occurred modifying the file",
            error_deleting: "An error occurred deleting the file or folder",
            error_renaming: "An error occurred renaming the file",
            error_copying: "An error occurred copying the file",
            error_compressing: "An error occurred compressing the file or folder",
            error_extracting: "An error occurred extracting the file",
            error_creating_folder: "An error occurred creating the folder",
            error_getting_content: "An error occurred getting the content of the file",
            error_changing_perms: "An error occurred changing the permissions of the file",
            error_uploading_files: "An error occurred uploading files",
            sure_to_start_compression_with: "Are you sure to compress",
            owner: "Owner",
            group: "Group",
            others: "Others",
            read: "Read",
            write: "Write",
            exec: "Exec",
            original: "Original",
            changes: "Changes",
            recursive: "Recursive"
        }), e.translations("pt", {
            filemanager: "Gerenciador de arquivos",
            language: "Língua",
            english: "Inglês",
            spanish: "Espanhol",
            portuguese: "Portugues",
            french: "Francês",
            confirm: "Confirmar",
            cancel: "Cancelar",
            close: "Fechar",
            upload_file: "Carregar arquivo",
            files_will_uploaded_to: "Os arquivos serão enviados para",
            uploading: "Carregar",
            permissions: "Autorizações",
            select_destination_folder: "Selecione a pasta de destino",
            source: "Origem",
            destination: "Destino",
            copy_file: "Copiar arquivo",
            sure_to_delete: "Tem certeza de que deseja apagar",
            change_name_move: "Renomear / mudança",
            enter_new_name_for: "Digite o novo nome para",
            extract_item: "Extrair arquivo",
            extraction_started: "A extração começou em um processo em segundo plano",
            compression_started: "A compressão começou em um processo em segundo plano",
            enter_folder_name_for_extraction: "Digite o nome da pasta para a extração de",
            enter_folder_name_for_compression: "Digite o nome da pasta para Compressão",
            toggle_fullscreen: "Ativar/desativar tela cheia",
            edit_file: "Editar arquivo",
            file_content: "Conteúdo do arquivo",
            loading: "Carregando",
            search: "Localizar",
            create_folder: "Criar Pasta",
            create: "Criar",
            folder_name: "Nome da pasta",
            upload: "Fazer",
            change_permissions: "Alterar permissões",
            change: "Alterar",
            details: "Detalhes",
            icons: "Icones",
            list: "Lista",
            name: "Nome",
            size: "Tamanho",
            actions: "Ações",
            date: "Data",
            no_files_in_folder: "Não há arquivos nesta pasta",
            no_folders_in_folder: "Esta pasta não contém subpastas",
            select_this: "Selecione esta",
            go_back: "Voltar",
            wait: "Espere",
            move: "Mover",
            download: "Baixar",
            view_item: "Veja o arquivo",
            remove: "Excluir",
            edit: "Editar",
            copy: "Copiar",
            rename: "Renomear",
            extract: "Extrair",
            compress: "Comprimir",
            error_invalid_filename: "Nome do arquivo inválido ou nome de arquivo já existe, especifique outro nome",
            error_modifying: "Ocorreu um erro ao modificar o arquivo",
            error_deleting: "Ocorreu um erro ao excluir o arquivo ou pasta",
            error_renaming: "Ocorreu um erro ao mudar o nome do arquivo",
            error_copying: "Ocorreu um erro ao copiar o arquivo",
            error_compressing: "Ocorreu um erro ao comprimir o arquivo ou pasta",
            error_extracting: "Ocorreu um erro ao extrair o arquivo",
            error_creating_folder: "Ocorreu um erro ao criar a pasta",
            error_getting_content: "Ocorreu um erro ao obter o conteúdo do arquivo",
            error_changing_perms: "Ocorreu um erro ao alterar as permissões do arquivo",
            error_uploading_files: "Ocorreu um erro upload de arquivos",
            sure_to_start_compression_with: "Tem certeza que deseja comprimir",
            owner: "Proprietário",
            group: "Grupo",
            others: "Outros",
            read: "Leitura",
            write: "Escrita ",
            exec: "Execução",
            original: "Original",
            changes: "Mudanças",
            recursive: "Recursiva"
        }), e.translations("es", {
            filemanager: "Administrador de archivos",
            language: "Idioma",
            english: "Ingles",
            spanish: "Español",
            portuguese: "Portugues",
            french: "Francés",
            confirm: "Confirmar",
            cancel: "Cancelar",
            close: "Cerrar",
            upload_file: "Subir archivo",
            files_will_uploaded_to: "Los archivos seran subidos a",
            uploading: "Subiendo",
            permissions: "Permisos",
            select_destination_folder: "Seleccione la carpeta de destino",
            source: "Origen",
            destination: "Destino",
            copy_file: "Copiar archivo",
            sure_to_delete: "Esta seguro que desea eliminar",
            change_name_move: "Renombrar / mover",
            enter_new_name_for: "Ingrese el nuevo nombre para",
            extract_item: "Extraer archivo",
            extraction_started: "La extraccion ha comenzado en un proceso de segundo plano",
            compression_started: "La compresion ha comenzado en un proceso de segundo plano",
            enter_folder_name_for_extraction: "Ingrese el nombre de la carpeta para la extraccion de",
            enter_folder_name_for_compression: "Ingrese el nombre de la carpeta para la compresion de",
            toggle_fullscreen: "Activar/Desactivar pantalla completa",
            edit_file: "Editar archivo",
            file_content: "Contenido del archivo",
            loading: "Cargando",
            search: "Buscar",
            create_folder: "Crear carpeta",
            create: "Crear",
            folder_name: "Nombre de la carpeta",
            upload: "Subir",
            change_permissions: "Cambiar permisos",
            change: "Cambiar",
            details: "Detalles",
            icons: "Iconos",
            list: "Lista",
            name: "Nombre",
            size: "Tamaño",
            actions: "Acciones",
            date: "Fecha",
            no_files_in_folder: "No hay archivos en esta carpeta",
            no_folders_in_folder: "Esta carpeta no contiene sub-carpetas",
            select_this: "Seleccionar esta",
            go_back: "Volver",
            wait: "Espere",
            move: "Mover",
            download: "Descargar",
            view_item: "Ver archivo",
            remove: "Eliminar",
            edit: "Editar",
            copy: "Copiar",
            rename: "Renombrar",
            extract: "Extraer",
            compress: "Comprimir",
            error_invalid_filename: "El nombre del archivo es invalido o ya existe",
            error_modifying: "Ocurrio un error al intentar modificar el archivo",
            error_deleting: "Ocurrio un error al intentar eliminar el archivo",
            error_renaming: "Ocurrio un error al intentar renombrar el archivo",
            error_copying: "Ocurrio un error al intentar copiar el archivo",
            error_compressing: "Ocurrio un error al intentar comprimir el archivo",
            error_extracting: "Ocurrio un error al intentar extraer el archivo",
            error_creating_folder: "Ocurrio un error al intentar crear la carpeta",
            error_getting_content: "Ocurrio un error al obtener el contenido del archivo",
            error_changing_perms: "Ocurrio un error al cambiar los permisos del archivo",
            error_uploading_files: "Ocurrio un error al subir archivos",
            sure_to_start_compression_with: "Esta seguro que desea comprimir",
            owner: "Propietario",
            group: "Grupo",
            others: "Otros",
            read: "Lectura",
            write: "Escritura",
            exec: "Ejecucion",
            original: "Original",
            changes: "Cambios",
            recursive: "Recursivo"
        }), e.translations("fr", {
            filemanager: "Gestionnaire de fichier",
            language: "Langue",
            english: "Anglais",
            spanish: "Espagnol",
            portuguese: "Portugais",
            french: "Français",
            confirm: "Confirmer",
            cancel: "Annuler",
            close: "Fermer",
            upload_file: "Uploader un fichier",
            files_will_uploaded_to: "Les fichiers seront uploadé dans",
            uploading: "Upload en cours",
            permissions: "Permissions",
            select_destination_folder: "Sélectionné le dossier de destination",
            source: "Source",
            destination: "Destination",
            copy_file: "Copier le fichier",
            sure_to_delete: "Êtes-vous sûr de vouloir supprimer",
            change_name_move: "Renommer / Déplacer",
            enter_new_name_for: "Entrer le nouveau nom pour",
            extract_item: "Extraires les éléments",
            extraction_started: "L'extraction a démarré en tâche de fond",
            compression_started: "La compression a démarré en tâche de fond",
            enter_folder_name_for_extraction: "Entrer le nom du dossier pour l'extraction de",
            enter_folder_name_for_compression: "Entrer le nom du dossier pour la compression de",
            toggle_fullscreen: "Basculer en plein écran",
            edit_file: "Éditer le fichier",
            file_content: "Contenu du fichier",
            loading: "Chargement en cours",
            search: "Recherche",
            create_folder: "Créer un dossier",
            create: "Créer",
            folder_name: "Nom du dossier",
            upload: "Upload",
            change_permissions: "Changer les permissions",
            change: "Changer",
            details: "Details",
            icons: "Icons",
            list: "Liste",
            name: "Nom",
            size: "Taille",
            actions: "Actions",
            date: "Date",
            no_files_in_folder: "Aucun fichier dans ce dossier",
            no_folders_in_folder: "Ce dossier ne contiens pas de dossier",
            select_this: "Sélectionner",
            go_back: "Retour",
            wait: "Patienter",
            move: "Déplacer",
            download: "Télécharger",
            view_item: "Voir l'élément",
            remove: "Supprimer",
            edit: "Éditer",
            copy: "Copier",
            rename: "Renommer",
            extract: "Extraire",
            compress: "Compresser",
            error_invalid_filename: "Nom de fichier invalide ou déjà existant, merci de spécifier un autre nom",
            error_modifying: "Une erreur est survenue pendant la modification du fichier",
            error_deleting: "Une erreur est survenue pendant la suppression du fichier ou du dossier",
            error_renaming: "Une erreur est survenue pendant le renommage du fichier",
            error_copying: "Une erreur est survenue pendant la copie du fichier",
            error_compressing: "Une erreur est survenue pendant la compression du fichier ou du dossier",
            error_extracting: "Une erreur est survenue pendant l'extraction du fichier",
            error_creating_folder: "Une erreur est survenue pendant la création du dossier",
            error_getting_content: "Une erreur est survenue pendant la récupération du contenu du fichier",
            error_changing_perms: "Une erreur est survenue pendant le changement des permissions du fichier",
            error_uploading_files: "Une erreur est survenue pendant l'upload des fichiers",
            sure_to_start_compression_with: "Êtes-vous sûre de vouloir compresser",
            owner: "Propriétaire",
            group: "Groupe",
            others: "Autres",
            read: "Lecture",
            write: "Écriture",
            exec: "Éxécution",
            original: "Original",
            changes: "Modifications",
            recursive: "Récursif"
        })
    }])
}(angular),
function(e) {
    "use strict";
    e.module("FileManagerApp").service("fileNavigator", ["$http", "$q", "fileManagerConfig", "item", function(e, n, t, r) {
        e.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        var a = function() {
            this.requesting = !1, this.fileList = [], this.currentPath = [], this.history = [], this.error = ""
        };
        return a.prototype.deferredHandler = function(e, n, t) {
            return "object" != typeof e && (this.error = "Bridge response error, please check the docs."), !this.error && e.result && e.result.error && (this.error = e.result.error), !this.error && e.error && (this.error = e.error.message), !this.error && t && (this.error = t), this.error ? n.reject(e) : n.resolve(e)
        }, a.prototype.list = function() {
            var r = this,
                a = n.defer(),
                i = r.currentPath.join("/"),
                o = {
                    params: {
                        mode: "list",
                        onlyFolders: !1,
                        path: "/" + i
                    }
                };
            return r.requesting = !0, r.fileList = [], r.error = "", e.post(t.listUrl, o).success(function(e) {
                r.deferredHandler(e, a)
            }).error(function(e) {
                r.deferredHandler(e, a, "Unknown error listing, check the response")
            })["finally"](function(e) {
                r.requesting = !1
            }), a.promise
        }, a.prototype.refresh = function() {
            var e = this,
                n = e.currentPath.join("/");
            return e.list().then(function(t) {
                e.fileList = (t.result || []).map(function(n) {
                    return new r(n, e.currentPath)
                }), e.buildTree(n)
            })
        }, a.prototype.buildTree = function(e) {
            function n(e, t, r) {
                var a = r ? r + "/" + t.model.name : t.model.name;
                if (e.name.trim() && 0 !== r.trim().indexOf(e.name) && (e.nodes = []), e.name !== r)
                    for (var i in e.nodes) n(e.nodes[i], t, r);
                else {
                    for (var o in e.nodes)
                        if (e.nodes[o].name === a) return;
                    e.nodes.push({
                        item: t,
                        name: a,
                        nodes: []
                    })
                }
                e.nodes = e.nodes.sort(function(e, n) {
                    return e.name < n.name ? -1 : e.name === n.name ? 0 : 1
                })
            }
            var t = this;
            !t.history.length && t.history.push({
                name: e,
                nodes: []
            });
            for (var r in t.fileList) {
                var a = t.fileList[r];
                a.isFolder() && n(t.history[0], a, e)
            }
        }, a.prototype.folderClick = function(e) {
            var n = this;
            n.currentPath = [], e && e.isFolder() && (n.currentPath = e.model.fullPath().split("/").splice(1)), n.refresh()
        }, a.prototype.upDir = function() {
            var e = this;
            e.currentPath[0] && (e.currentPath = e.currentPath.slice(0, -1), e.refresh())
        }, a.prototype.goTo = function(e) {
            var n = this;
            n.currentPath = n.currentPath.slice(0, e + 1), n.refresh()
        }, a.prototype.fileNameExists = function(e) {
            var n = this;
            for (var t in n.fileList)
                if (t = n.fileList[t], e.trim && t.model.name.trim() === e.trim()) return !0
        }, a.prototype.listHasFolders = function() {
            var e = this;
            for (var n in e.fileList)
                if ("dir" === e.fileList[n].model.type) return !0
        }, a
    }])
}(angular),
function(e, n) {
    "use strict";
    n.module("FileManagerApp").service("fileUploader", ["$http", "$q", "fileManagerConfig", function(t, r, a) {
        function i(e, n, t) {
            return e.result && e.result.error ? n.reject(e) : e.error ? n.reject(e) : t ? n.reject(t) : void n.resolve(e)
        }
        this.requesting = !1, this.upload = function(o, s) {
            if (!e.FormData) throw new Error("Unsupported browser version");
            var l = this,
                d = new e.FormData,
                c = r.defer();
            d.append("destination", "/" + s.join("/"));
            for (var m = 0; m < o.length; m++) {
                var p = o.item(m);
                p instanceof e.File && d.append("file-" + m, p)
            }
            return l.requesting = !0, t.post(a.uploadUrl, d, {
                transformRequest: n.identity,
                headers: {
                    "Content-Type": void 0
                }
            }).success(function(e) {
                i(e, c)
            }).error(function(e) {
                i(e, c, "Unknown error uploading files")
            })["finally"](function(e) {
                l.requesting = !1
            }), c.promise
        }
    }])
}(window, angular), angular.module("FileManagerApp").run(["$templateCache", function(e) {
    e.put("src/templates/current-folder-breadcrumb.html", '<ol class="breadcrumb mb0">\n    <li>\n        <a href="" ng-click="fileNavigator.goTo(-1)">\n            <i class="glyphicon glyphicon-folder-open mr2"></i>\n        </a>\n    </li>\n    <li ng-repeat="(key, dir) in fileNavigator.currentPath track by key" ng-class="{\'active\':$last}" class="animated fast fadeIn">\n        <a href="" ng-show="!$last" ng-click="fileNavigator.goTo(key)">\n            <i class="glyphicon glyphicon-folder-open mr2"></i> {{dir}}\n        </a>\n        <span ng-show="$last"><i class="glyphicon glyphicon-folder-open mr2"></i>  {{dir}}</span>\n    </li>\n    <li><button class="btn btn-primary btn-xs" ng-click="fileNavigator.upDir()">&crarr;</button></li>\n</ol>'), e.put("src/templates/item-context-menu.html", '<div id="context-menu" class="dropdown clearfix animated fast fadeIn">\n    <ul class="dropdown-menu dropdown-right-click" role="menu" aria-labelledby="dropdownMenu" style="">\n        <li ng-show="config.allowedActions.rename"><a href="" tabindex="-1" data-toggle="modal" data-target="#rename"><i class="glyphicon glyphicon-edit"></i> {{\'rename\' | translate}}</a></li>\n        <li ng-show="config.allowedActions.copy && !temp.isFolder()"><a href="" tabindex="-1" data-toggle="modal" data-target="#copy"><i class="glyphicon glyphicon-log-out"></i> {{\'copy\' | translate}}</a></li>\n        <li ng-show="config.allowedActions.edit && temp.isEditable()"><a href="" tabindex="-1" data-toggle="modal" data-target="#edit" ng-click="temp.getContent();"><i class="glyphicon glyphicon-pencil"></i> {{\'edit\' | translate}}</a></li>\n        <li ng-show="config.allowedActions.changePermissions"><a href="" tabindex="-1" data-toggle="modal" data-target="#changepermissions"><i class="glyphicon glyphicon-lock"></i> {{\'permissions\' | translate}}</a></li>\n        <li ng-show="config.allowedActions.compress && temp.isCompressible()"><a href="" tabindex="-1" data-toggle="modal" data-target="#compress"><i class="glyphicon glyphicon-compressed"></i> {{\'compress\' | translate}}</a></li>\n        <li ng-show="config.allowedActions.extract && temp.isExtractable()"><a href="" tabindex="-1" data-toggle="modal" data-target="#extract" ng-click="temp.tempModel.name=\'\'"><i class="glyphicon glyphicon-export"></i> {{\'extract\' | translate}}</a></li>\n        <li ng-show="config.allowedActions.download && !temp.isFolder()"><a href="" tabindex="-1" ng-click="temp.download()"><i class="glyphicon glyphicon-download"></i> {{\'download\' | translate}}</a></li>\n        <li ng-show="config.allowedActions.preview && temp.isImage()"><a href="" tabindex="-1" ng-click="temp.preview()"><i class="glyphicon glyphicon-picture"></i> {{\'view_item\' | translate}}</a></li>\n        <li class="divider"></li>\n        <li ng-show="config.allowedActions.remove"><a href="" tabindex="-1" data-toggle="modal" data-target="#delete"><i class="glyphicon glyphicon-trash"></i> {{\'remove\' | translate}}</a></li>\n    </ul>\n</div>'), e.put("src/templates/item-toolbar.html", '<div ng-show="!item.inprocess">\n    <button class="btn btn-sm btn-default" data-toggle="modal" data-target="#rename" ng-show="config.allowedActions.rename" ng-click="touch(item)" title="{{\'rename\' | translate}}">\n        <i class="glyphicon glyphicon-edit"></i>\n    </button>\n    <button class="btn btn-sm btn-default" data-toggle="modal" data-target="#copy" ng-show="config.allowedActions.copy && !item.isFolder()" ng-click="touch(item)" title="{{\'copy\' | translate}}">\n        <i class="glyphicon glyphicon-log-out"></i>\n    </button>\n    <button class="btn btn-sm btn-default" data-toggle="modal" data-target="#edit" ng-show="config.allowedActions.edit && item.isEditable()" ng-click="item.getContent(); touch(item)" title="{{\'edit\' | translate}}">\n        <i class="glyphicon glyphicon-pencil"></i>\n    </button>\n    <button class="btn btn-sm btn-default" data-toggle="modal" data-target="#changepermissions" ng-show="config.allowedActions.changePermissions" ng-click="touch(item)" title="{{\'permissions\' | translate}}">\n        <i class="glyphicon glyphicon-lock"></i>\n    </button>\n    <button class="btn btn-sm btn-default" data-toggle="modal" data-target="#compress" ng-show="config.allowedActions.compress && item.isCompressible()" ng-click="touch(item)" title="{{\'compress\' | translate}}">\n        <i class="glyphicon glyphicon-compressed"></i>\n    </button>\n    <button class="btn btn-sm btn-default" data-toggle="modal" data-target="#extract" ng-show="config.allowedActions.extract && item.isExtractable()" ng-click="touch(item); item.tempModel.name=\'\'" title="{{\'extract\' | translate}}">\n        <i class="glyphicon glyphicon-export"></i>\n    </button>\n    <button class="btn btn-sm btn-default" ng-show="config.allowedActions.download && !item.isFolder()" ng-click="item.download()" title="{{\'download\' | translate}}">\n        <i class="glyphicon glyphicon-cloud-download"></i>\n    </button>\n    <button class="btn btn-sm btn-default" ng-show="config.allowedActions.preview && item.isImage()" ng-click="item.preview()" title="{{\'view_item\' | translate}}">\n        <i class="glyphicon glyphicon-picture"></i>\n    </button>\n    <button class="btn btn-sm btn-danger" data-toggle="modal" data-target="#delete" ng-show="config.allowedActions.remove" ng-click="touch(item)" title="{{\'remove\' | translate}}">\n        <i class="glyphicon glyphicon-trash"></i>\n    </button>\n</div>\n<div ng-show="item.inprocess">\n    <button class="btn btn-sm" style="visibility: hidden">&nbsp;</button><span class="label label-warning">{{"wait" | translate}} ...</span>\n</div>'),
        e.put("src/templates/main-icons.html", '<div class="iconset clearfix">\n    <div class="col-120" ng-repeat="item in fileNavigator.fileList | filter: query | orderBy: orderProp" ng-show="!fileNavigator.requesting && !fileNavigator.error">\n        <a href="" class="thumbnail text-center" ng-click="smartClick(item)" ng-right-click="touch(item)" title="{{item.model.name}} ({{item.model.sizeKb()}}kb)">\n            <div class="item-icon">\n                <i class="glyphicon glyphicon-folder-open" ng-show="item.model.type === \'dir\'"></i>\n                <i class="glyphicon glyphicon-file" ng-show="item.model.type === \'file\'"></i>\n            </div>\n            {{item.model.name | strLimit : 11 }}\n        </a>\n    </div>\n\n    <div ng-show="fileNavigator.requesting">\n        <div ng-include="config.tplPath + \'/spinner.html\'"></div>\n    </div>\n\n    <div class="alert alert-warning" ng-show="!fileNavigator.requesting && fileNavigator.fileList.length < 1 && !fileNavigator.error">\n        {{"no_files_in_folder" | translate}}...\n    </div>\n    \n    <div class="alert alert-danger" ng-show="!fileNavigator.requesting && fileNavigator.error">\n        {{ fileNavigator.error }}\n    </div>\n</div>'), e.put("src/templates/main-table-modal.html", '<table class="table table-condensed table-modal-condensed mb0">\n    <thead>\n        <tr>\n            <th>{{"name" | translate}}</th>\n            <th class="text-right"></th>\n        </tr>\n    </thead>\n    <tbody class="file-item">\n        <tr ng-show="fileNavigator.requesting">\n            <td colspan="2">\n                <div ng-include="config.tplPath + \'/spinner.html\'"></div>\n            </td>\n        </tr>\n        <tr ng-show="!fileNavigator.requesting && !fileNavigator.listHasFolders() && !fileNavigator.error">\n            <td colspan="2">\n                {{"no_folders_in_folder" | translate}}...\n            </td>\n            <td class="text-right">\n                <button class="btn btn-sm btn-default" ng-click="fileNavigator.upDir()">{{"go_back" | translate}}</button>\n            </td>\n        </tr>\n        <tr ng-show="!fileNavigator.requesting && fileNavigator.error">\n            <td colspan="2">\n                {{ fileNavigator.error }}\n            </td>\n        </tr>\n        <tr ng-repeat="item in fileNavigator.fileList | orderBy: orderProp" ng-show="!fileNavigator.requesting && item.model.type === \'dir\'">\n            <td>\n                <a href="" ng-click="fileNavigator.folderClick(item)" title="{{item.model.name}} ({{item.model.sizeKb()}}kb)">\n                    <i class="glyphicon glyphicon-folder-close"></i>\n                    {{item.model.name | strLimit : 32}}\n                </a>\n            </td>\n            <td class="text-right">\n                <button class="btn btn-sm btn-default" ng-click="select(item, temp)">\n                    <i class="glyphicon glyphicon-hand-up"></i> {{"select_this" | translate}}\n                </button>\n            </td>\n        </tr>\n    </tbody>\n</table>'), e.put("src/templates/main-table.html", '<table class="table mb0 table-files">\n    <thead>\n        <tr>\n            <th>{{"name" | translate}}</th>\n            <th class="hidden-xs">{{"size" | translate}}</th>\n            <th class="hidden-sm hidden-xs">{{"date" | translate}}</th>\n            <th class="hidden-sm hidden-xs">{{"permissions" | translate}}</th>\n            <th class="text-right"></th>\n        </tr>\n    </thead>\n    <tbody class="file-item">\n        <tr ng-show="fileNavigator.requesting">\n            <td colspan="5">\n                <div ng-include="config.tplPath + \'/spinner.html\'"></div>\n            </td>\n        </tr>\n        <tr ng-show="!fileNavigator.requesting && fileNavigator.fileList.length < 1 && !fileNavigator.error">\n            <td colspan="5">\n                {{"no_files_in_folder" | translate}}...\n            </td>\n        </tr>\n        <tr ng-show="!fileNavigator.requesting && fileNavigator.error">\n            <td colspan="5">\n                {{ fileNavigator.error }}\n            </td>\n        </tr>\n        <tr ng-repeat="item in fileNavigator.fileList | filter: query | orderBy: orderProp" ng-show="!fileNavigator.requesting">\n            <td ng-right-click="touch(item)">\n                <a href="" ng-click="smartClick(item)" title="{{item.model.name}} ({{item.model.sizeKb()}}kb)">\n                    <i class="glyphicon glyphicon-folder-close" ng-show="item.model.type === \'dir\'"></i>\n                    <i class="glyphicon glyphicon-file" ng-show="item.model.type === \'file\'"></i>\n                    {{item.model.name | strLimit : 64}}\n                </a>\n            </td>\n            <td class="hidden-xs">\n                {{item.model.sizeKb()}}kb\n            </td>\n            <td class="hidden-sm hidden-xs">\n                {{item.model.date | formatDate }}\n            </td>\n            <td class="hidden-sm hidden-xs">\n                {{item.model.perms.toCode(item.model.type === \'dir\'?\'d\':\'-\')}}\n            </td>\n            <td class="text-right">\n                <div ng-include="config.tplPath + \'/item-toolbar.html\'"></div>\n            </td>\n        </tr>\n    </tbody>\n</table>'), e.put("src/templates/main.html", '<div ng-controller="FileManagerCtrl">\n    <div ng-include="config.tplPath + \'/navbar.html\'"></div>\n\n    <div class="container-fluid">\n        <div class="row">\n\n            <div class="col-sm-3 col-md-2 sidebar file-tree animated slow fadeIn" ng-include="config.tplPath + \'/sidebar.html\'" ng-show="config.sidebar && fileNavigator.history[0]"></div>\n            <div class="main" ng-class="config.sidebar && fileNavigator.history[0] && \'col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2\'">\n                <div ng-include="config.tplPath + \'/current-folder-breadcrumb.html\'" ng-show="config.breadcrumb"></div>\n                <div ng-include="config.tplPath + \'/\' + viewTemplate" class="main-navigation clearfix"></div>\n            </div>\n        </div>\n    </div>\n\n    <div ng-include="config.tplPath + \'/modals.html\'"></div>\n    <div ng-include="config.tplPath + \'/item-context-menu.html\'"></div>\n</div>'), e.put("src/templates/modals.html", '<div class="modal animated fadeIn" id="delete">\n  <div class="modal-dialog">\n    <div class="modal-content">\n    <form ng-submit="remove(temp)">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal">\n            <span aria-hidden="true">&times;</span>\n            <span class="sr-only">{{"close" | translate}}</span>\n        </button>\n        <h4 class="modal-title">{{"confirm" | translate}}</h4>\n      </div>\n      <div class="modal-body">\n        {{\'sure_to_delete\' | translate}} <b>{{temp.model.name}}</b> ?\n        <div ng-include data-src="\'error-bar\'" class="clearfix"></div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"cancel" | translate}}</button>\n        <button type="submit" class="btn btn-primary" ng-disabled="temp.inprocess" autofocus="autofocus">{{"remove" | translate}}</button>\n      </div>\n      </form>\n    </div>\n  </div>\n</div>\n\n<div class="modal animated fadeIn" id="rename">\n  <div class="modal-dialog">\n    <div class="modal-content">\n        <form ng-submit="rename(temp)">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal">\n                  <span aria-hidden="true">&times;</span>\n                  <span class="sr-only">{{"close" | translate}}</span>\n              </button>\n              <h4 class="modal-title">{{\'change_name_move\' | translate}}</h4>\n            </div>\n            <div class="modal-body">\n              <label class="radio">{{\'enter_new_name_for\' | translate}} <b>{{temp.model.name}}</b></label>\n              <input class="form-control" ng-model="temp.tempModel.name" autofocus="autofocus">\n\n              <div ng-include data-src="\'path-selector\'" class="clearfix"></div>\n              <div ng-include data-src="\'error-bar\'" class="clearfix"></div>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"cancel" | translate}}</button>\n              <button type="submit" class="btn btn-primary" ng-disabled="temp.inprocess">{{\'rename\' | translate}}</button>\n            </div>\n        </form>\n    </div>\n  </div>\n</div>\n\n<div class="modal animated fadeIn" id="copy">\n  <div class="modal-dialog">\n    <div class="modal-content">\n        <form ng-submit="copy(temp)">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal">\n                  <span aria-hidden="true">&times;</span>\n                  <span class="sr-only">{{"close" | translate}}</span>\n              </button>\n              <h4 class="modal-title">{{\'copy_file\' | translate}}</h4>\n            </div>\n            <div class="modal-body">\n              <label class="radio">{{\'enter_new_name_for\' | translate}} <b>{{temp.model.name}}</b></label>\n              <input class="form-control" ng-model="temp.tempModel.name" autofocus="autofocus">\n\n              <div ng-include data-src="\'path-selector\'" class="clearfix"></div>\n              <div ng-include data-src="\'error-bar\'" class="clearfix"></div>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"cancel" | translate}}</button>\n              <button type="submit" class="btn btn-primary" ng-disabled="temp.inprocess">Copy</button>\n            </div>\n        </form>\n    </div>\n  </div>\n</div>\n\n<div class="modal animated fadeIn" id="compress">\n  <div class="modal-dialog">\n    <div class="modal-content">\n        <form ng-submit="compress(temp)">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal">\n                  <span aria-hidden="true">&times;</span>\n                  <span class="sr-only">{{"close" | translate}}</span>\n              </button>\n              <h4 class="modal-title">{{\'compress\' | translate}}</h4>\n            </div>\n            <div class="modal-body">\n              <div ng-show="temp.asyncSuccess">\n                  <div class="label label-success error-msg">{{\'compression_started\' | translate}}</div>\n              </div>\n              <div ng-hide="temp.asyncSuccess">\n                  <div ng-hide="config.allowedActions.compressChooseName">\n                    {{\'sure_to_start_compression_with\' | translate}} <b>{{temp.model.name}}</b> ?\n                  </div>\n                  <div ng-show="config.allowedActions.compressChooseName">\n                    <label class="radio">{{\'enter_folder_name_for_compression\' | translate}} <b>{{fileNavigator.currentPath.join(\'/\')}}/{{temp.model.name}}</b></label>\n                    <input class="form-control" ng-model="temp.tempModel.name" autofocus="autofocus">\n                  </div>\n              </div>\n\n              <div ng-include data-src="\'error-bar\'" class="clearfix"></div>\n            </div>\n            <div class="modal-footer">\n              <div ng-show="temp.asyncSuccess">\n                  <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"close" | translate}}</button>\n              </div>\n              <div ng-hide="temp.asyncSuccess">\n                  <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"cancel" | translate}}</button>\n                  <button type="submit" class="btn btn-primary" ng-disabled="temp.inprocess">{{\'compress\' | translate}}</button>\n              </div>\n            </div>\n        </form>\n    </div>\n  </div>\n</div>\n\n<div class="modal animated fadeIn" id="extract" ng-init="temp.emptyName()">\n  <div class="modal-dialog">\n    <div class="modal-content">\n        <form ng-submit="extract(temp)">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal">\n                  <span aria-hidden="true">&times;</span>\n                  <span class="sr-only">{{"close" | translate}}</span>\n              </button>\n              <h4 class="modal-title">{{\'extract_item\' | translate}}</h4>\n            </div>\n            <div class="modal-body">\n              <div ng-show="temp.asyncSuccess">\n                  <div class="label label-success error-msg">{{\'extraction_started\' | translate}}</div>\n              </div>\n              <div ng-hide="temp.asyncSuccess">\n                  <label class="radio">{{\'enter_folder_name_for_extraction\' | translate}} <b>{{temp.model.name}}</b></label>\n                  <input class="form-control" ng-model="temp.tempModel.name" autofocus="autofocus">\n                  <div ng-include data-src="\'path-selector\'" class="clearfix"></div>\n              </div>\n              <div ng-include data-src="\'error-bar\'" class="clearfix"></div>\n            </div>\n            <div class="modal-footer">\n              <div ng-show="temp.asyncSuccess">\n                  <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"close" | translate}}</button>\n              </div>\n              <div ng-hide="temp.asyncSuccess">\n                  <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"cancel" | translate}}</button>\n                  <button type="submit" class="btn btn-primary" ng-disabled="temp.inprocess">{{\'extract\' | translate}}</button>\n              </div>\n            </div>\n        </form>\n    </div>\n  </div>\n</div>\n\n<div class="modal animated fadeIn" id="edit" ng-class="{\'modal-fullscreen\': fullscreen}">\n  <div class="modal-dialog modal-lg">\n    <div class="modal-content">\n        <form ng-submit="edit(temp)">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal">\n                  <span aria-hidden="true">&times;</span>\n                  <span class="sr-only">{{"close" | translate}}</span>\n              </button>\n              <button type="button" class="close mr5" ng-click="fullscreen=!fullscreen">\n                  <span>&loz;</span>\n                  <span class="sr-only">{{\'toggle_fullscreen\' | translate}}</span>\n              </button>\n              <h4 class="modal-title">{{\'edit_file\' | translate}}</h4>\n            </div>\n            <div class="modal-body">\n                <label class="radio">{{\'file_content\' | translate}}</label>\n                <span class="label label-warning" ng-show="temp.inprocess">{{\'loading\' | translate}} ...</span>\n                <textarea class="form-control code" ng-model="temp.tempModel.content" ng-show="!temp.inprocess" autofocus="autofocus"></textarea>\n                <div ng-include data-src="\'error-bar\'" class="clearfix"></div>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"cancel" | translate}}</button>\n              <button type="submit" class="btn btn-primary" ng-disabled="temp.inprocess">{{\'edit\' | translate}}</button>\n            </div>\n        </form>\n    </div>\n  </div>\n</div>\n\n<div class="modal animated fadeIn" id="newfolder">\n  <div class="modal-dialog">\n    <div class="modal-content">\n        <form ng-submit="createFolder(temp)">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal">\n                  <span aria-hidden="true">&times;</span>\n                  <span class="sr-only">{{"close" | translate}}</span>\n              </button>\n              <h4 class="modal-title">{{\'create_folder\' | translate}}</h4>\n            </div>\n            <div class="modal-body">\n              <label class="radio">{{\'folder_name\' | translate}}</label>\n              <input class="form-control" ng-model="temp.tempModel.name" autofocus="autofocus">\n              <div ng-include data-src="\'error-bar\'" class="clearfix"></div>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"cancel" | translate}}</button>\n              <button type="submit" class="btn btn-primary" ng-disabled="temp.inprocess">{{\'create\' | translate}}</button>\n            </div>\n        </form>\n    </div>\n  </div>\n</div>\n\n<div class="modal animated fadeIn" id="uploadfile">\n  <div class="modal-dialog">\n    <div class="modal-content">\n        <form ng-submit="uploadFiles()">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal">\n                  <span aria-hidden="true">&times;</span>\n                  <span class="sr-only">{{"close" | translate}}</span>\n              </button>\n              <h4 class="modal-title">{{"upload_file" | translate}}</h4>\n            </div>\n            <div class="modal-body">\n              <label class="radio">{{"files_will_uploaded_to" | translate}} <b>{{fileNavigator.currentPath.join(\'/\')}}</b></label>\n              <input type="file" class="form-control" ng-file="$parent.uploadFileList" autofocus="autofocus" multiple="multiple"/>\n              <div ng-include data-src="\'error-bar\'" class="clearfix"></div>\n            </div>\n            <div class="modal-footer">\n              <div ng-show="!fileUploader.requesting">\n                  <!--<button type="button" class="btn btn-default" data-dismiss="modal">{{"cancel" | translate}}</button> -->\n                  <button id="uploadBtn" type="submit" class="btn btn-primary" ng-disabled="!uploadFileList.length || fileUploader.requesting">{{\'upload\' | translate}}</button>\n              </div>\n              <div ng-show="fileUploader.requesting">\n                  <span class="label label-warning">{{"uploading" | translate}} ...</span>\n              </div>\n            </div>\n        </form>\n    </div>\n  </div>\n</div>\n\n<div class="modal animated fadeIn" id="changepermissions">\n  <div class="modal-dialog">\n    <div class="modal-content">\n        <form ng-submit="changePermissions(temp)">\n            <div class="modal-header">\n              <button type="button" class="close" data-dismiss="modal">\n                  <span aria-hidden="true">&times;</span>\n                  <span class="sr-only">{{"close" | translate}}</span>\n              </button>\n              <h4 class="modal-title">{{\'change_permissions\' | translate}}</h4>\n            </div>\n            <div class="modal-body">\n              <table class="table mb0">\n                  <thead>\n                      <tr>\n                          <th>{{\'permissions\' | translate}}</th>\n                          <th class="col-xs-1 text-center">{{\'exec\' | translate}}</th>\n                          <th class="col-xs-1 text-center">{{\'read\' | translate}}</th>\n                          <th class="col-xs-1 text-center">{{\'write\' | translate}}</th>\n                      </tr>\n                  </thead>\n                  <tbody>\n                      <tr ng-repeat="(permTypeKey, permTypeValue) in temp.tempModel.perms">\n                          <td>{{permTypeKey | translate}}</td>\n                          <td ng-repeat="(permKey, permValue) in permTypeValue" class="col-xs-1 text-center" ng-click="main()">\n                              <label class="col-xs-12">\n                                <input type="checkbox" ng-model="temp.tempModel.perms[permTypeKey][permKey]">\n                              </label>\n                          </td>\n                      </tr>\n                </tbody>\n              </table>\n              <div class="checkbox" ng-show="config.enablePermissionsRecursive && temp.model.type === \'dir\'">\n                <label>\n                  <input type="checkbox" ng-model="temp.tempModel.recursive"> {{\'recursive\' | translate}}\n                </label>\n              </div>\n              <div class="clearfix mt10">\n                  <span class="label label-primary pull-left">\n                    {{\'original\' | translate}}: {{temp.model.perms.toCode(temp.model.type === \'dir\'?\'d\':\'-\')}} ({{temp.model.perms.toOctal()}})\n                  </span>\n                  <span class="label label-primary pull-right">\n                    {{\'changes\' | translate}}: {{temp.tempModel.perms.toCode(temp.model.type === \'dir\'?\'d\':\'-\')}} ({{temp.tempModel.perms.toOctal()}})\n                  </span>\n              </div>\n              <div ng-include data-src="\'error-bar\'" class="clearfix"></div>\n            </div>\n            <div class="modal-footer">\n              <button type="button" class="btn btn-default" data-dismiss="modal">{{"cancel" | translate}}</button>\n              <button type="submit" class="btn btn-primary" ng-disabled="">{{\'change\' | translate}}</button>\n            </div>\n        </form>\n    </div>\n  </div>\n</div>\n\n<div class="modal animated fadeIn" id="selector" ng-controller="ModalFileManagerCtrl">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal">\n            <span aria-hidden="true">&times;</span>\n            <span class="sr-only">{{"close" | translate}}</span>\n        </button>\n        <h4 class="modal-title">{{"select_destination_folder" | translate}}</h4>\n      </div>\n      <div class="modal-body">\n        <div>\n            <div ng-include="config.tplPath + \'/current-folder-breadcrumb.html\'"></div>\n            <div ng-include="config.tplPath + \'/main-table-modal.html\'"></div>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal" ng-disabled="temp.inprocess">{{"close" | translate}}</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<script type="text/ng-template" id="path-selector">\n  <div class="panel panel-primary mt10 mb0">\n    <div class="panel-body">\n        <div class="detail-sources">\n          <code class="mr5"><b>{{"source" | translate}}:</b> {{temp.model.fullPath()}}</code>\n        </div>\n        <div class="detail-sources">\n          <code class="mr5"><b>{{"destination" | translate}}:</b>{{temp.tempModel.fullPath()}}</code>\n          <a href="" class="label label-primary" ng-click="openNavigator(temp)">{{\'change\' | translate}}</a>\n        </div>\n    </div>\n  </div>\n</script>\n<script type="text/ng-template" id="error-bar">\n    <div class="label label-danger error-msg pull-left animated fadeIn" ng-show="temp.error">\n      <i class="glyphicon glyphicon-remove-circle"></i>\n      <span>{{temp.error}}</span>\n    </div>\n</script>'), e.put("src/templates/navbar.html", '<nav class="navbar navbar-inverse navbar-fixed-top">\n  <div class="container-fluid">\n    <div class="navbar-header">\n      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">\n        <span class="sr-only">Toggle</span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n        <span class="icon-bar"></span>\n      </button>\n      <a class="navbar-brand hidden-xs" href="" ng-click="fileNavigator.goTo(-1)">{{appName}}</a>\n    </div>\n    <div id="navbar" class="navbar-collapse collapse">\n      <div class="navbar-form navbar-right">\n        <input type="text" class="form-control input-sm hide" placeholder="{{\'search\' | translate}}..." ng-model="$parent.query">\n        <button class="btn btn-default btn-sm" data-toggle="modal" data-target="#newfolder" ng-click="touch()">\n            <i class="glyphicon glyphicon-plus"></i> {{"create_folder" | translate}}\n        </button>\n        <button class="btn btn-default btn-sm" data-toggle="modal" data-target="#uploadfile" ng-click="touch()">\n            <i class="glyphicon glyphicon-upload"></i> {{"upload_file" | translate}}\n        </button>\n\n        <button class="btn btn-default btn-sm dropdown-toggle" type="button" id="dropDownMenuLang" data-toggle="dropdown" aria-expanded="true">\n            <i class="glyphicon glyphicon-globe"></i> {{"language" | translate}} <span class="caret"></span>\n        </button>\n        <ul class="dropdown-menu" role="menu" aria-labelledby="dropDownMenuLang">\n          <li role="presentation"><a role="menuitem" tabindex="-1" href="" ng-click="changeLanguage(\'en\')">{{"english" | translate}}</a></li>\n          <li role="presentation"><a role="menuitem" tabindex="-1" href="" ng-click="changeLanguage(\'es\')">{{"spanish" | translate}}</a></li>\n          <li role="presentation"><a role="menuitem" tabindex="-1" href="" ng-click="changeLanguage(\'pt\')">{{"portuguese" | translate}}</a></li>\n          <li role="presentation"><a role="menuitem" tabindex="-1" href="" ng-click="changeLanguage(\'fr\')">{{"french" | translate}}</a></li>\n        </ul>\n\n        <button class="btn btn-default btn-sm" ng-click="$parent.setTemplate(\'main-icons.html\')" ng-show="$parent.viewTemplate !== \'main-icons.html\'" title="{{\'icons\' | translate}}">\n            <i class="glyphicon glyphicon-th-large"></i>\n        </button>\n        <button class="btn btn-default btn-sm" ng-click="$parent.setTemplate(\'main-table.html\')" ng-show="$parent.viewTemplate !== \'main-table.html\'" title="{{\'list\' | translate}}">\n            <i class="glyphicon glyphicon-th-list"></i>\n        </button>\n\n      </div>\n    </div>\n  </div>\n</nav>'), e.put("src/templates/sidebar.html", '<ul class="nav nav-sidebar file-tree-root">\n    <li ng-repeat="item in fileNavigator.history" ng-include="\'folder-branch-item\'" ng-class="{\'active\': item.name == fileNavigator.currentPath.join(\'/\')}"></li>\n</ul>\n\n<script type="text/ng-template" id="folder-branch-item">\n    <a href="" ng-click="fileNavigator.folderClick(item.item)" class="animated fast fadeInDown">\n        <i class="glyphicon glyphicon-folder-close mr2" ng-hide="isInThisPath(item.name)"></i>\n        <i class="glyphicon glyphicon-folder-open mr2"  ng-show="isInThisPath(item.name)"></i>\n        {{ (item.name.split(\'/\').pop() || \'/\') | strLimit : 24 }}\n    </a>\n    <ul class="nav nav-sidebar">\n        <li ng-repeat="item in item.nodes" ng-include="\'folder-branch-item\'" ng-class="{\'active\': item.name == fileNavigator.currentPath.join(\'/\')}"></li>\n    </ul>\n</script>'), e.put("src/templates/spinner.html", '<div class="spinner-container col-xs-12">\n    <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\n       <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>\n    </svg>\n</div>')
}]);