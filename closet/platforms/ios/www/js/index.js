// 裝置準備完成
function onDeviceReady() {
    console.log("onDeviceReady 裝置準備完成!");
}

function onLoad() {
    console.log("啟動 onLoad");
    document.addEventListener("deviceready", onDeviceReady, false);

    // <!--************************** 登入頁面 ********************************-->
    $(document).on("pagecreate", "#login", function () { });

    // <!--************************** 分類頁面 ********************************-->
    $(document).on("pagecreate", "#main", function () {
        var catagory_array = [];
        $("#add_confirm").click(function () {
            var type = $("#cloth_type").val();
            console.log(type);
            if (window.localStorage.getItem("catagory_array") === null) {
                catagory_array = [type];
            } else {
                catagory_array = JSON.parse(
                    window.localStorage.getItem("catagory_array")
                );
                catagory_array.push(type);
            }
            window.localStorage.setItem(
                "catagory_array",
                JSON.stringify(catagory_array)
            );
        });

        $("#show_dialog").click(function () {
            $.mobile.changePage("#add_catagory", { transition: "pop", role: "dialog" });
            // navigator.notification.prompt(
            //   'Please enter your name',  // message
            //   function (index) {
            //     console.log(index);
            //     $("#main").trigger("pageshow");
            //   },                  // callback to invoke
            //   'Registration',            // title
            //   ['Ok', 'Exit']              // buttonLabels
            // );
        });
    });

    $(document).on("pageshow", "#main", function () {
        var catagory_array = [],
            listview_html = "";
        if (!(window.localStorage.getItem("catagory_array") === null)) {
            catagory_array = JSON.parse(
                window.localStorage.getItem("catagory_array")
            );
            for (var index in catagory_array) {
                listview_html +=
                    '<li><a href="#" class="catagory" data-content="' +
                    catagory_array[index] +
                    '">' +
                    catagory_array[index] +
                    '</a><a href="#" class="delete" data-content="' +
                    catagory_array[index] +
                    '">Delete</a></li>';
            }
            $("#listview").html(listview_html).listview("refresh");
        }

        $("a.catagory").click(function () {
            var content = $(this).data("content");
            console.log(content);
            $.mobile.changePage("#edit_catagory", { transition: "slide" });
            window.localStorage.setItem("header_catagory", content);
        });

        $("a.delete").click(function () {
            var content = $(this).data("content");
            navigator.notification.confirm(
                "您確定要刪除 " + content + " 的相簿？",
                function (buttonindex) {
                    if (buttonindex === 2) {
                        catagory_array = JSON.parse(
                            window.localStorage.getItem("catagory_array")
                        );
                        remove(catagory_array, content);
                        window.localStorage.setItem(
                            "catagory_array",
                            JSON.stringify(catagory_array)
                        );
                        $("#main").trigger("pageshow");
                    }
                },
                "刪除提示",
                ["保留", "刪除"]
            );
        });
    });



    // <!--************************** 進入分類頁面相簿 ********************************-->
    $(document).on("pagecreate", "#edit_catagory", function () {
        $('#camera_photo').click(function () {
            navigator.notification.confirm(
                "請選擇要使用相機還是相簿",
                function (buttonindex) {
                    if (buttonindex === 1) {
                        getPictureByCamera();
                    } else {
                        getPictureFromGallery();
                    }
                },
                "Import From",
                ["相機", "相簿"]
            );
        });
    });

    $(document).on("pageshow", "#edit_catagory", function () {
        if (window.localStorage.getItem("header_catagory") !== null) {
            var header = window.localStorage.getItem("header_catagory");
        }

        $('#header_catagory').text(header);
    });

}

// 刪除陣列元素
function remove(array, element) {
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

var listview_html = '',
    selectedimguri = null;

// 開啟相機拍照
function getPictureByCamera(imgname) {
    var options = {
        quality: 50,
        // destinationType: Camera.DestinationType.FILE_URI,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        // EncodingType:Camera.EncodingType.JPEG,
        targetHeight: 100,
        targetWidth: 100,
        saveToPhotoAlbum: false  //改儲存照片在相簿，預設存在 cache
    };
    console.log("Ready to 開啟相機");
    navigator.camera.getPicture(
        function (imageURI) {

            movePic(imageURI);

            listview_html += '<a href="#' + imageURI + '" data-rel="popup" data-position-to="window" data-transition="fade">' +
                '<img class="popphoto" src="' + imageURI + '" alt="photo" style="width:33%"></a>' +
                '<div data-role="popup" id="' + imageURI + '" data-corners="false">' +
                '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>' +
                '<img class="popphoto" src="' + imageURI + '" style="max-height:512px;" alt="photo"></div>';
            $("#photo_listview").html(listview_html);
            // photo.style.display = 'block';
            // photo.src = imageURI;
            // selectedimguri = imageURI;
        },
        function (error) {
            navigator.notification.alert('拍照作業並未完成！', null, '拍照確認', '確認');
            selectedimguri = 'null';
            console.log(error);
        },
        options
    );

    function movePic(file) {
        window.resolveLocalFileSystemURL(file, resolveOnSuccess, resOnError);
    }

    function resolveOnSuccess(entry) {
        var d = new Date();
        var n = d.getTime();
        //new file name
        var newFileName = n + ".jpg";
        var myFolderApp = "MyAppFolder";

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
            //The folder is created if doesn't exist
            fileSys.root.getDirectory(myFolderApp,
                { create: true, exclusive: false },
                function (directory) {
                    entry.moveTo(directory, newFileName, successMove, resOnError);
                },
                resOnError);
        },
            resOnError);
    }

    function successMove(entry) {
        console.log('success');
        //I do my insert with "entry.fullPath" as for the path
    }

    function resOnError(error) {
        alert(error);
    }
}

// 搜尋相簿
function getPictureFromGallery(imgname) {
    console.log("Ready to 開啟相簿 " + imgname);
    navigator.camera.getPicture(
        function (imageURI) {   // success get image from photolibrary
            var photo = $("#photo_listview");
            listview_html += '<a href="#" class="catagory" data-content=""></a><img src="' + imageURI + '" alt="Paris, France" style="width:30%">'
            $("#photo_listview").html(listview_html).listview("refresh");
            // photo.style.display = 'block';
            // photo.src = imageURI;
            // selectedimguri = imageURI;
        },
        function () {
            if (isios) {
                window.alert('您並未自相簿中取得照片！');
            } else {
                navigator.notification.alert('您並未自相簿中取得照片！', null, '相簿確認', '確認');
            }
            selectedimguri = 'null';
        },
        {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            //allowEdit: true,
            targetHeight: 640,
            targetWidth: 640,
            saveToPhotoAlbum: true  //改儲存照片在相簿，預設存在 cache
        }
    );
}
