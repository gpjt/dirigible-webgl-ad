(function($) {
    // register namespace
    $.extend(true, window, {
        "DirigibleDemo": {
            "AjaxUtils": {
                "FileSystemSafeGet": FileSystemSafeGet
            }
        }
    });


    function FileSystemSafeGet(url, type, success) {
        $.ajax({
            url: url,
            dataType: type,
            statusCode: {
                200: success,
                0: success
            }
        });
    }


})(jQuery);
