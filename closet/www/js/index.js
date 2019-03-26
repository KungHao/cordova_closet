// 裝置準備完成
function onDeviceReady() {
    console.log("onDeviceReady 裝置準備完成!");
}

function onLoad() {
    console.log("啟動 onLoad");
    document.addEventListener("deviceready", onDeviceReady, false);

    $(document).on("pagecreate", "#login", function () {


    });

    $(document).on('pagecreate', '#page_second', function () {
        var catagory_array = [];
        $("#add_confirm").click(function () {
            var type = $("#cloth_type").val();
            console.log(type);
            if (window.localStorage.getItem('catagory_array') === null) {
                catagory_array = [type];
            } else {
                catagory_array = JSON.parse(window.localStorage.getItem('catagory_array'));
                catagory_array.push(type);
            }
            window.localStorage.setItem("catagory_array", JSON.stringify(catagory_array));

        });

        $('#show_dialog').click(function () {
            $.mobile.changePage('#add_catagory', { transition: 'pop', role: 'dialog' });
        });
    });

    $(document).on('pageshow', '#page_second', function () {
        var catagory_array = [],
            listview_html = '';
        // window.localStorage.removeItem('catagory_array');
        if (!(window.localStorage.getItem('catagory_array') === null)) {
            catagory_array = JSON.parse(window.localStorage.getItem('catagory_array'));
            for (var index in catagory_array) {
                listview_html += '<li><a href="#" class="catagory" data-split-icon="delete" data-content="' + catagory_array[index] + '">' + catagory_array[index] + '</a><a href="#" class="delete">Delete</a></li>';
            }
            $('#listview').html(listview_html).listview('refresh');
        }

        $('a.catagory').click(function () {
            var content = $(this).data('content');
            console.log(content);
        });

    });
}


