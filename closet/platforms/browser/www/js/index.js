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
      $("#listview")
        .html(listview_html)
        .listview("refresh");
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

// 開啟相機拍照
function getPictureByCamera(imgname) {
  console.log("Ready to 開啟相機");
  navigator.camera.getPicture(
      function (imageURI) {
          var photo = document.getElementById(imgname);
          photo.style.display = 'block';
          photo.src = imageURI;
          selectedimguri = imageURI;
      },
      function () {
          navigator.notification.alert('拍照作業並未完成！', null, '拍照確認', '確認');
          selectedimguri = 'null';
      },
      {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          //allowEdit: true,
          targetHeight: 640,
          targetWidth: 640,
          saveToPhotoAlbum: true  //改儲存照片在相簿，預設存在 cache
      }
  );
}
