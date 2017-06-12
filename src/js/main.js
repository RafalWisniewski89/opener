var PROJECT = PROJECT || {};

PROJECT.init = function () {
    $.browserDetection(true);
    PROJECT.mobile.init();
    PROJECT.goto.init();
    PROJECT.modals.init();
    PROJECT.goToNextField.init();
    PROJECT.orphans.init();
};

PROJECT.mobile = {
    isMobile: false,
    init: function () {
        this.md = new MobileDetect(window.navigator.userAgent);
        this.isMobile = (this.md.mobile() !== null);
    }
};

PROJECT.goto = {
    $body: $("html, body"),
    init: function () {
        var that = this;        

        if ($("body").hasClass("Chrome") || $("body").hasClass("Opera")) {
            that.$body = $("body");
        }

        $(".js-goto").on("click", function (e) {
            
            LECH.mobileNav.isOpened = false;
            $(".js-nav").removeClass("opened");

            that.$body.stop().animate({
                scrollTop: $($(this).attr("href")).offset().top
            }, 1000, 'swing');
        });
    }        
};

PROJECT.modals = {
    $body: $("body"),
    init: function () {
        var that = this;

        that.$body.on("click", ".js-modal-close, .js-overlay", function (e) {
            that.modalClose(e, $(this));
        });
        if ($(".js-modal").is(":visible")) {
            that.$body.addClass("scroll-lock")
        }
    },
    modalOpen: function () {
        // this.$body.addClass("scroll-lock")
    },
    modalClose: function (event, object) {
        event.preventDefault();
        object.closest(".js-modal").fadeOut(100);
        this.$body.removeClass("scroll-lock");        
    }
}

PROJECT.goToNextField = {
    init: function () {
        $(".js-inp-field input").focus(function () {
            $(this).val("")
        })
        $(".js-inp-field input").keydown( function (e) {
            e.stopImmediatePropagation();
            var $this = $(this),
                kCode = e.keyCode || e.which,
                inpQty = $this.parents(".js-inp-fields-wrapper").find(".js-inp-field").length;

            if ($this.attr("type") === "number") {
                if ((kCode < 48 || kCode > 57) && kCode != 229 && kCode != 8 && kCode != 13 && (kCode < 96 || kCode > 105)) {    
                    $this.val("")
                    return false;           
                }
            }

            if (kCode == 8) {
                if (!$this.val()){
                    $this.parent().prev().find("input").val("").focus();
                }
            } else {
                if ($this.val()) {                     
                    $this.parent().next().find("input").val("").focus();   

                    if ($this.parent().index() + 1 != inpQty) {
                        $this.parent().next().find("input").focus();    
                    } else {
                        $this.blur();
                    }
                }
            }   
        });
    },
}

PROJECT.orphans = {
    init: function () {
        $(".js-orphans").each(function () {
            $(this).html($(this).html().replace(/(\s[iuawzo]|do|się)(\s)/ig,'$1&nbsp;'));
        }); 
    }    
};

$(document).ready(function () {
    PROJECT.init();    
});