var storeImg = null; // 儲存相片URI
var catagory_header = null; // 分類相簿header


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
        });
    });

    $(document).on("pageshow", "#main", function () {
        var catagory_array = [],
            listview_html = "";
        if (window.localStorage.getItem("catagory_array") !== null) {
            catagory_array = JSON.parse(window.localStorage.getItem("catagory_array"));
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
            catagory_header = content;
        });

        $("a.delete").click(function () {
            var content = $(this).data("content");
            navigator.notification.confirm(
                "您確定要刪除 " + content + " 的相簿？",
                function (buttonindex) {
                    if (buttonindex === 2) {
                        catagory_array = JSON.parse(window.localStorage.getItem("catagory_array"));
                        remove(catagory_array, content);
                        window.localStorage.setItem("catagory_array", JSON.stringify(catagory_array));
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
        // window.localStorage.removeItem("短袖");
        var srcType = {
            camera: Camera.PictureSourceType.CAMERA,
            photoLibrary: Camera.PictureSourceType.PHOTOLIBRARY
        }

        $('#camera_photo').click(function () {
            navigator.notification.confirm(
                "請選擇要使用相機還是相簿",
                function (buttonindex) {
                    var options = null;
                    if (buttonindex === 1) {
                        options = setOptions(srcType.camera);
                    } else {
                        options = setOptions(srcType.photoLibrary);
                    }
                    getPictureByOptions(options);
                },
                "Import From",
                ["相機", "相簿"]
            );
        });
    });

    $(document).on("pageshow", "#edit_catagory", function () {
        var storeImg_array = [],
            imageList = "",
            popupList = "";
        if (catagory_header !== null) {
            $('#header_catagory').text(catagory_header);
        }

        if (window.localStorage.getItem(catagory_header) !== null) {
            storeImg_array = JSON.parse(window.localStorage.getItem(catagory_header));
            for (var index in storeImg_array) {
                imageList += '<a href="#' + index + '" data-content="' + index +
                    '" class="popup" data-rel="popup" data-position-to="window" data-transition="fade">' +
                    '<img id="photo" class="popphoto" src="' + storeImg_array[index] + '" alt="photo" style="width:33%"></a>';
                popupList += '<div data-role="popup" class="popup_photo" id="' + index +
                    '" data-corners="false"><a href="#" data-rel="back"' +
                    'class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>' +
                    '<img class="popphoto" src="' + storeImg_array[index] + '" style="max-height:auto;" alt="popupPhoto">' +
                    '</div>';
            }
            // $("#photo_popup").html(popupList);
            $("#photo_show").html(imageList);
        } else {
            $("#photo_show").html("");
            // $("#photo_popup").html("");
        }

        // $('a.popup').click(function () {
        //     var content = $(this).data("content");
        //     console.log(content);
        //     var popupImgHtml = "";
        //     popupImgHtml = '<a href="#" data-rel="back"' +
        //         'class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a><img id="' + content +
        //         '" class="popphoto" src="' + content + '" style="max-height:auto;" alt="popupPhoto>';
        //     $('#popupNYC').append(popupImgHtml);
        // });

    });

}

// 刪除陣列元素
function remove(array, element) {
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

/** parm srcType:sourceType can be Camera or PhotoLibrary
    return options **/
function setOptions(srcType) {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: srcType,
        EncodingType: Camera.EncodingType.JPEG,
        allowEdit: false,
        // targetHeight: 100,
        // targetWidth: 100,
        // saveToPhotoAlbum: true  //改儲存照片在相簿，預設存在 cache
    }
    return options;
}


// 開啟相機拍照
function getPictureByOptions(options) {
    var storeImg_array = [];
    console.log("Ready to 開啟相機");
    navigator.camera.getPicture(
        function (imageURI) {

            testStoreImg = imageURI;
            // $('#photo').attr("src", imageURI);

            if (window.localStorage.getItem(catagory_header) === null) {
                storeImg_array = [imageURI];
            } else {
                storeImg_array = JSON.parse(window.localStorage.getItem(catagory_header));
                storeImg_array.push(imageURI);
            }
            window.localStorage.setItem(catagory_header, JSON.stringify(storeImg_array));
            $('#edit_catagory').trigger('pageshow');

        },
        function (error) {
            navigator.notification.alert(error, null, '取得照片失敗', '確認');
            console.log(error);
        },
        options
    );
}

