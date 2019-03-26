// 裝置準備完成
function onDeviceReady() {
    console.log("onDeviceReady 裝置準備完成!");
}

function onLoad() {
    console.log("啟動 onLoad");
    document.addEventListener("deviceready", onDeviceReady, false);

    $(document).on("pageshow", "#login", function () {
    });

    $(document).on('pagecreate', '#page_second', function () {
        var catagory_array = [];
        // window.localStorage.removeItem('catagory_array');
        if (!(window.localStorage.getItem('catagory_array') === null)) {
            catagory_array = JSON.parse(window.localStorage.getItem('catagory_array'));
            for (var index in catagory_array) {
                $('#listview').append('<li><a href="#" class="catagory" onclick="catagoryOnClick(' + String(catagory_array[index]) + ')">' + catagory_array[index] + '</a></li>').listview('refresh');
            }
        }

        // $('a.catagory').click(function () {
        // var context = $(this).data('context');
        // console.log(context);
        // });

        $("#add_confirm").click(function () {
            var type = $("#cloth_type").val();
            console.log(type);
            $('#listview').append('<li><a href="#" class="catagory" onclick="catagoryOnClick(' + String(type) + ')">' + type + '</a></li>').listview('refresh');
            if (window.localStorage.getItem('catagory_array') === null) {
                catagory_array = [type];
            } else {
                catagory_array = JSON.parse(window.localStorage.getItem('catagory_array'));
                catagory_array.push(type);
            }
            window.localStorage.setItem("catagory_array", JSON.stringify(catagory_array));

        });
    });

}

function catagoryOnClick(catagory) {
    // var context = $(this).data('context');
    console.log(catagory);
}

