(function($) {
    // register namespace
    $.extend(true, window, {
        "DirigibleDemo": {
            "AjaxUtils": {
                "FileSystemSafeGet": FileSystemSafeGet
            }
        }
    });


    function FileSystemSafeGet(url, type, successCallback) {
        function onSuccess(data) {
            if (type == "json") {
                successCallback(JSON.parse(data.responseText));
            } else {
                successCallback(data.responseText);
            }
        }

        $.ajax({
            url: url,
            dataType: type,
            statusCode: {
                200: onSuccess,
                0: onSuccess
            }
        });
    }


})(jQuery);
