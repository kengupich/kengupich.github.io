$(document).ready(function() {
    function toggleDropdown(e) {
        const _d = $(e.target).closest('.dropdown'),
            _m = $('.dropdown-menu', _d);
        setTimeout(function() {
            const shouldOpen = e.type !== 'click' && _d.is(':hover');
            _m.toggleClass('show', shouldOpen);
            _d.toggleClass('show', shouldOpen);
            $('[data-toggle="dropdown"]', _d).attr('aria-expanded', shouldOpen);
        }, e.type === 'mouseleave' ? 50 : 0);
    }

    $('body')
        .on('mouseenter mouseleave', '.dropdown', toggleDropdown)
        .on('click', '.dropdown-menu a', toggleDropdown);

    $('.navbar-toggler').click(function() {
        if (!$.parseJSON($(this).attr("aria-expanded"))) {
            $('body').addClass('no-scroll');
        } else {
            $('body').removeClass('no-scroll');
        }
    });
    $('.latest-news-wrapper').slick({
        dots: false,
        arrows: false,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        
        responsive: [
            {
                breakpoint: 992,
                settings: {
                        slidesToShow: 3,
                }
            },
            {
                breakpoint: 762,
                settings: {
                        slidesToShow: 2,
                    variableWidth: true,
                    arrows: false,
                }
            },
            {
              breakpoint: 500,
              settings: {
                slidesToShow: 1,
                variableWidth: false,
              }
            }
        ]
    });

    $('.courses-wrapper').slick({
        dots: false,
        prevArrow: '<i><span class="iconify ctrlbuttons prev"" data-icon="entypo:chevron-small-left" data-inline="false"></span></i>',
        nextArrow: '<i><span class="iconify ctrlbuttons next"" data-icon="entypo:chevron-small-right" data-inline="false"></span></i>',
        appendArrows: $('.courses-arrows'),
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        responsive: [
            {
                breakpoint: 1172,
                settings: {
                        slidesToShow: 3,
                }
            },
            {
                breakpoint: 762,
                settings: {
                        slidesToShow: 2,
                    variableWidth: true,
                    arrows: false,
                }
            },
            {
                breakpoint: 500,
                settings: {
                  slidesToShow: 1,
                  variableWidth: false,
                  arrows: false,
                }
              }
        ]
    });

    $('#filter-controls').slick({
        dots: false,
        arrow: false,
        infinite: false,
        
        variableWidth: true,
        slidesToShow: 10,
        responsive: [
            {
                breakpoint: 1172,
                settings: {
                        slidesToShow: 5,
                        arrows: false,
                }
            },
            {
                breakpoint: 762,
                settings: {
                    slidesToShow: 2,
                    arrows: false,
                }
            }
        ]
    });

    $('#myList').lingGalleryFilter({
        tagContainer: $('#filter-controls')
    });

    $('.header-panel-search-link').on('click', function(event){
        event.preventDefault();
        $('.search-overlay').addClass("d-block");
        $(this).addClass("search-overlay-icon");
        $('body').addClass('search no-scroll')
        $('.search-overlay-input').focus()
            //.css("top", $(this).position().top  + 60);
    });

    $('.search-close').on('click', function(){
        
        $('.search-overlay').removeClass("d-block");
        $('.header-panel-search-link').removeClass("search-overlay-icon");
        $('body').removeClass('search no-scroll')
    });

    $(".search-overlay-input").bind("change keyup input click", function() {
        var hint1, hint2;
        if(this.value.length >= 2){
            hint1 = this.value;
            $.ajax({
                type: 'get',
                crossDomain: true,
                //dataType: 'jsonp',
                url: "http://6235c466.ngrok.io/umbraco/api/livesearch/get?q=" + this.value, //Путь к обработчику
                
                //response: 'text',
                success: function(data){
                    $(".search-overlay-results").empty();
                    //Выводим полученые данные в списке
                    $.each(data.Results, function(i, item) {
                        hint2 = data.Results[i].Criteria.replace(hint1, '');
                        $(".search-overlay-results").append('<li><a href="search-page.html?q=' + data.Results[i].Criteria + '">' + hint1 + '<span class="marked">' + hint2 + '</span></a></li>').fadeIn();
                    });
                },
                error: function(){
                    console.log('error!');
                    $(".search-overlay-results-nofound").show("slow");
                  }
            })
        }
    });

    $("search-overlay-results").hover(function(){
        $(".search-overlay-input").blur(); //Убираем фокус с input
    })
        
    //При выборе результата поиска, прячем список и заносим выбранный результат в input
    $("search-overlay-results").on("click", "li", function(){
        s_user = $(this).text();
        //$(".search-overlay-input").val(s_user).attr('disabled', 'disabled'); //деактивируем input, если нужно
        $("search-overlay-results").fadeOut();
    })

    $(window).scroll(function(){
        var y = $(this).scrollTop();
        if (y > 100) {
            $('.navbuttons-wrapper').fadeIn().css("display", "inline-block");
        } else {
            $('.navbuttons-wrapper').fadeOut();
        }
    });


    $('.navbuttons-up').on('click', function(e){
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
    $('.navbuttons-back').on('click', function(e){
        e.preventDefault();
        window.history.back();
    });

    $('.newsletter-form').validate({
        rules: {
            first: {
                required: true
            },
            second: {
                required: true
            }
        },
        messages: {},
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function() { 
            $('.successTxt').text("Спасибо, вы подписались на нашу рассылку!");
            window.setTimeout(function(){ $('.successTxt').fadeOut("slow"); }, 1500);
        }
    });

    $(function(){
        var mn = $('header'),
            hdr = mn.outerHeight(),
            bit = $(".header-nav-wrapper").outerHeight();
         $(window).scroll(function() {
           var scroll = getCurrentScroll();
             if ( scroll >= hdr ) { 
                  $('.header-nav-wrapper').addClass('shrink');
                  $('.navbar').css('margin-top', bit);
               }
               else {
                   $('.header-nav-wrapper').removeClass('shrink');
                   $('.navbar').attr('style', '');
               }
         });
       function getCurrentScroll() {
           return window.pageYOffset || document.documentElement.scrollTop;
           }
       });
    $('.info-slider').slick({
        dots: false,
        prevArrow: '<i><span class="iconify ctrlbuttons prev"" data-icon="entypo:chevron-small-left" data-inline="false"></span></i>',
        nextArrow: '<i><span class="iconify ctrlbuttons next"" data-icon="entypo:chevron-small-right" data-inline="false"></span></i>',
        appendArrows: $('.info-slider-arrows'),
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToSwipe: 1,
        asNavFor: '.info-slider-desc',
    });

    $('.info-slider-desc').slick({
        dots: false,
        arrows: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToSwipe: 1,
        draggable: false, 
        asNavFor: '.info-slider',
    });

    var sampleEvents = [],
        from, f;

    $('#todayEvents').find('[data-category]').each(function(){
        from =$(this).attr('data-category').split("-")
        f = new Date(from[2], from[1] - 1, from[0])
        sampleEvents.push({date: f})
    })

    $("#calendar").MEC({
        events: sampleEvents,
        from_monday: true
    });

    if($("#calTbody").length){
        $("#calTbody").animate({scrollLeft: $('.current').position().left - $("#calTbody").width()/2 + $(".a-date").width()/2}, 500);
    }

   $('#todayEvents').lingGalleryFilter({
        tagContainer: $('#calendar')
    }) 
    
    $(".month-mover").on("click", function() {
        $('#todayEvents').lingGalleryFilter({
            tagContainer: $('#calendar')
        })
    });

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }
    var query = getUrlVars()["search"];
    
    $("#input-placeholder").attr("value", query);

    $(window).on("resize change load hashchange", function(){
        var wWidth = $(window).width(),
            edgesNum = wWidth >= 500 ? 1 : 0,
            pageNum = null,
            hrefText = "#page-",
            regex = new RegExp(hrefText + '(\\d*)', 'gi'),
            parts = window.location.href.replace(regex, function(m,key,value) {
                pageNum = key;
            });

        if(wWidth <= 768){
            $("#calTbody").on('mousewheel DOMMouseScroll', function(event){
                var delta = Math.max(-1, Math.min(1, (event.originalEvent.wheelDelta || -event.originalEvent.detail)));
                $(this).scrollLeft( $(this).scrollLeft() - ( delta * 30 ) );
                event.preventDefault();
            });
        }
        // Пагинатор
        $(function() {
            $(".pagination").pagination({
                items: 100, // сколько блоков всего
                itemsOnPage: 10, // сколько блоков выводится на одной странице
                displayedPages: 3,
                edges: edgesNum,
                currentPage: pageNum,
                hrefTextPrefix: hrefText,
                prevText: '<i><span class="iconify ctrlbuttons prev"" data-icon="entypo:chevron-small-left" data-inline="false"></span></i>',
                nextText: '<i><span class="iconify ctrlbuttons next"" data-icon="entypo:chevron-small-right" data-inline="false"></span></i>',
            });
        });

       
    });

    $(".navbar-nav").on("resize click touchmove scroll mousewheel", function(e){
        var y = $(".navbar-nav").position().top;
        console.log(y)
        if(y <= 0){
            //console.log("ALARM!!!!")
            $(".header-panel, .header-info, .navbar-toggler").addClass("d-none")
        } else {
            $(".header-panel, .header-info, .navbar-toggler").removeClass("d-none")
        }

    })

    var results_count = $(".search-results-item").length;
    $(".search-results-count").text("Найдено " + results_count + " результатов");

    $(".certificate-icon").bind("change keyup input click", function() {
        $.ajax({
            type: 'get',
            crossDomain: true,
            url: "http://6235c466.ngrok.io/umbraco/api/livesearch/get?q=" + this.value, //Путь к обработчику
            //response: 'text',
            success: function(data){

            },
            error: function(){
                $(".certificate-input").addClass("error");
                $(".certificate-hint").text("Сертификат с таким номером не найден, проверьте номер").addClass("error");
                $("img, .certificate-desc").addClass("certificate-opacity");
            }
        })
        
    });

    $(".form-input").on('keyup blur', function(){
        if( $(this).val() != "") {
            $(this).addClass("no-empty")
        } else {
            $(this).removeClass("no-empty")
        }  
    })

    $(".modal-desc").text($(".page-title").text())

    $("#frmDemo").submit(function(e) {
        e.preventDefault();
        var name = $("#name").val();
        var comment = $("#comment").val();
        
        if(name == "" || comment == "" ) {
            $("#error_message").show().html("All Fields are Required");
        } else {
            $("#error_message").html("").hide();
            $.ajax({
                type: "POST",
                url: "post-form.php",
                data: "name="+name+"&comment="+comment,
                success: function(data){
                    $('#success_message').fadeIn().html(data);
                    setTimeout(function() {
                        $('#success_message').fadeOut("slow");
                    }, 2000 );
    
                }
            });
        }
    })

   /*  $("input[type='tel']").on("focus", function(){
        $(this).val("+380");
    }) */


    jQuery.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[А-яёA-zєїі'\s]+$/iu.test(value);
      }, "Допускаются только буквенные символы."); 

    $(".modal-content").validate({
        rules: {
            name: {
                required: true,
                minlength: 2,
                maxlength: 200,
                lettersonly: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                digits: true,
                minlength:10, 
                maxlength:12

                
            }
          },
        messages: {
        },
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).html(error)
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function() {
            $(".modal-title, .modal-desc, .modal-body, .modal-footer").hide();
            $(".modal-title-hide, .modal-desc-hide").show();
        }
    });

});