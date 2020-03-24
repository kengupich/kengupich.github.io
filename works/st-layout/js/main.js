$(window).on('load', function() {
    var $preloader = $('#preloader'),
        $loader = $preloader.find('.loader');
    $loader.fadeOut();
    $preloader.delay(500).fadeOut('slow');
    setTimeout(function() { $("html, body").css("overflow", "visible") }, 1500);
});

$(document).ready(function() {
    const body = $("html, body"),
        search = $('.search'),
        searchInput = search.find('input'),
        searchList = $('.search-list'),
        counter = $('.counter-value'),
        logoSlider = $('.slider-logos'),
        sliderWrapper = $('.section3'),
        bigSlider = $('.big-slider'),
        status = $('.slide-counter'),
        sliderSpeed = '500', // скорость прокрутки слайдера
        upBtn = $('#up-button'),
        extSlider = $('.extension-slider');

    var flagChangeSlide = true,
        flagCounter = true;

    // скрытие всех блоков с анимацией
    $("[animation]").addClass('hidden');
    $("[slide-animation]").addClass('hidden');

    // активация окна с результатами поиска
    searchInput.on('input', () => {
        const length = searchInput.val().split(' ').join('').length;

        if (length) {
            searchList.addClass('show');
            search.addClass('active');
        } else {
            searchList.removeClass('show');
            search.removeClass('active');
        }
    });

    // малый слайдер - настройка
    extSlider.slick({
        infinite: true,
        autoplay: true,
        speed: sliderSpeed,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        dots: false,
        arrows: false,
        useTransform: true
    });

    // малый слайдер - настройка
    logoSlider.slick({
        infinite: true,
        autoplay: true,
        speed: sliderSpeed,
        slidesToShow: 5,
        slidesToScroll: 1,
        swipeToSlide: true,
        dots: false,
        arrows: false,
        useTransform: true
    });

    // большой слайдер - настройка
    bigSlider.slick({
        infinite: false,
        vertical: true,
        dots: true,
        arrows: true,
        speed: sliderSpeed,
        appendDots: $('.slide-dots'),
        appendArrows: $('.slide-arrows'),
        prevArrow: '<a href=""><img src="./img/icons/arrow-left.svg"></a>',
        nextArrow: '<a href=""><img src="./img/icons/arrow-right.svg"></a>',
        useTransform: true,
    });

    // большой слайдер - счетчик
    bigSlider.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        /*  if (i % 2 == 0) {
             sliderWrapper.addClass('bg-primary');
         } else {
             sliderWrapper.removeClass('bg-primary');
         } */
        status.html("<span class='current-slide'>" + ('00' + i).slice(-2) + "</span><span class='total-slide'>/" + ('00' + slick.slideCount).slice(-2) + "</span>");

        $(slick.$slides.get(currentSlide)).find("[slide-animation]").each(function() {
            var animate = $(this).attr('slide-animation');
            if (!$(this).hasClass(animate)) {
                $(this).addClass(animate).removeClass('hidden');
            }
        });
    });

    // большой слайдер - поэкранная прокрутка
    sliderWrapper.on('wheel', (function(event) {
        event.preventDefault();
        if (!flagChangeSlide) return;
        if (event.originalEvent.deltaY > 0) {
            if ((bigSlider.slick('slickCurrentSlide') + 1) < bigSlider.slick('getSlick').slideCount) {
                bigSlider.slick('slickNext');
                body.animate({ scrollTop: sliderWrapper.offset().top }, sliderSpeed);
            } else {
                body.animate({ scrollTop: sliderWrapper.next().offset().top }, sliderSpeed);
            }
        } else {
            if (bigSlider.slick('slickCurrentSlide') > 0) {
                bigSlider.slick('slickPrev');
                body.animate({ scrollTop: sliderWrapper.offset().top }, sliderSpeed);
            } else {
                body.animate({ scrollTop: (sliderWrapper.offset().top - $(window).height()) }, sliderSpeed);
            }
        }
        flagChangeSlide = false;
        setTimeout(function() { flagChangeSlide = true }, 500);
    }));

    // большой слайдер - автодоводка при достижении 30% видимости
    $(window).on('wheel', function() {
        var scrollTop = $(this).scrollTop(),
            scrollBot = scrollTop + $(this).height(),
            elTop = sliderWrapper.offset().top,
            elBottom = elTop + sliderWrapper.outerHeight(),
            visibleTop = elTop < scrollTop ? scrollTop : elTop,
            visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
        if ((visibleBottom - visibleTop) >= (sliderWrapper.outerHeight() * .25) &&
            (visibleBottom - visibleTop) <= (sliderWrapper.outerHeight() * .5)) {
            body.animate({ scrollTop: sliderWrapper.offset().top }, sliderSpeed);
        }
    });

    $(window).on('scroll', function() {
        var scrollTop = $(this).scrollTop(),
            scrollBot = scrollTop + $(this).height();

        // проверка текущей прокрутки экрана для отображения кнопки "вверх"
        if ($(window).scrollTop() > 300) {
            upBtn.addClass('show');
        } else {
            upBtn.removeClass('show');
        }
        // счетчик сайтов
        counter.each(function() {
            var oTop = $(this).offset().top;
            if (flagCounter && scrollBot >= oTop) {
                var $this = $(this),
                    countTo = $this.attr('data-count');
                $({
                    countNum: $this.text()
                }).animate({
                    countNum: countTo
                }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function() {
                        $this.text(Math.floor(this.countNum));
                    },
                    complete: function() {
                        $this.text(this.countNum.toLocaleString());
                        //alert('finished');
                    }
                });
                flagCounter = false;
            }
        });

        // анимирование блоков
        $("[animation]").each(function() {
            var $this = $(this),
                oTop = $this.offset().top,
                animate = $this.attr('animation');
            if (scrollBot >= oTop && !$this.hasClass(animate)) {
                $this.addClass(animate).removeClass('hidden');
            }
        });
    });

    // кнопка "вверх"
    upBtn.on('click', function(e) {
        e.preventDefault();
        body.animate({ scrollTop: 0 }, '300');
    });

    // большой слайдер - кнопка пропуска секции
    $('.area').on('click', function() {
        body.animate({ scrollTop: sliderWrapper.next().offset().top }, sliderSpeed);
    });

    // валидатор формы
    $("#callback").validate({
        rules: {
            name: {
                required: true,
                minlength: 4,
                maxlength: 16,
            },
            emailtel: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Это поле обязательно для заполнения",
                minlength: "Имя должно быть минимум 4 символа",
                maxlength: "Максимальное число символов - 16",
            },
            emailtel: {
                required: "Это поле обязательно для заполнения",
            },
        },
        submitHandler: function(form) {
            $('#callback').hide("slow", () => {
                $('#callback').html("<div class='done'>Данные успешно отправлены!</div>");
            });
            $('#callback').show("slow");
            //form.submit();
            return false; // for demo
        }
    });

    //выбираем все теги с именем  modal
    $('a[name=modal]').click(function(e) {
        e.preventDefault();
        var id = $(this).attr('href');
        $(id).fadeIn(500);
    });
    //если нажата кнопка закрытия окна
    $('.modalWrapper .close').click(function(e) {
        e.preventDefault();
        $(".content iframe").attr("src", $(".content iframe").attr("src"));
        $('.modalWrapper').fadeOut(500);
    });
    $('.modalWrapper').on('click', function(e) {
        if (e.target !== this)
            return;
        $(".content iframe").attr("src", $(".content iframe").attr("src"));
        $('.modalWrapper').fadeOut(500);
    });

    // определение браузера
    $('a[name=download]').click(function(e) {
        e.preventDefault();
        var user = detect.parse(navigator.userAgent),
            browsers = ["Firefox", "Safari", "Chrome", "Opera"];
        if (user.device.type == "Desktop") {
            if (browsers.includes(user.browser.family)) {
                var href = $(this).attr('href');
                window.open(href, '_blank').focus();
            } else {
                $(".browserName").text(user.browser.family)
                $("#incorrectBrowser").fadeIn(500);
            }
        } else {
            $("#incorrectDevice").fadeIn(500);
        }
    });
});