function onEntry(entry) {
  entry.forEach(change => {
    if (change.isIntersecting) {
      change.target.classList.add('element-show');
    }
  });
}
  
let options = {
    threshold: [0.5] };
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.element-animation');
  
for (let elm of elements) {
    observer.observe(elm);
}

//animated widget
window.addEventListener('scroll', function() {
  var widgets = document.querySelectorAll('.animated-widget');

  widgets.forEach(function(widget) {
      var position = widget.getBoundingClientRect();
      var windowHeight = window.innerHeight;

      // Проверяем, виден ли виджет на странице
      if (position.top < windowHeight) {
          if (widget.classList.contains('from-bottom')) {
              widget.classList.add('show-bottom');
          } else if (widget.classList.contains('from-left')) {
              widget.classList.add('show-left');
          } else if (widget.classList.contains('from-right')) {
              widget.classList.add('show-right');
          }
      }
  });
});
// Скрипты для карты номера во вкладку Номера:
// Функция для определения типа устройства (мобильное или не мобильное)
function isMobileDevice() {
  return window.matchMedia('(max-width: 1024px)').matches;
}
  
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.personal-carousel').forEach(carousel => {
      const slides = carousel.querySelectorAll('img');
      const indicators = carousel.querySelectorAll('.personal-indicator');
      let currentIndex = 0;
  
      const updateSlides = (index) => {
        slides.forEach((slide, i) => {
          slide.style.opacity = i === index ? 1 : 0;
        });
        indicators.forEach((indicator, i) => {
          indicator.classList.toggle('active', i === index);
        });
        currentIndex = index;
      };
  
      // Обработка событий для компьютеров
      if (!isMobileDevice()) {
        carousel.addEventListener('mousemove', (event) => {
          const rect = carousel.getBoundingClientRect();
          const xPos = event.clientX - rect.left;
          const width = rect.width;
  
          if (xPos >= 0 && xPos <= width) {
            const slideIndex = Math.floor((xPos / width) * slides.length);
            updateSlides(slideIndex);
          }
        });
      } else {
        let touchStartX = 0;
        let touchEndX = 0;
  
        carousel.addEventListener('touchstart', (event) => {
          touchStartX = event.changedTouches[0].screenX;
        });
  
        carousel.addEventListener('touchend', (event) => {
          touchEndX = event.changedTouches[0].screenX;
          handleGesture();
        });
  
        const handleGesture = () => {
          if (touchEndX < touchStartX) {
            currentIndex = (currentIndex + 1) % slides.length;
          }
          if (touchEndX > touchStartX) {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          }
          updateSlides(currentIndex);
        };
      }
  
      indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
          updateSlides(i);
        });
      });
    });
  });

// Посмотреть ещё для описания номеров
function customShowMore() {
  var description = document.getElementById("roomDescriptionText");
  description.style.webkitLineClamp = "unset";
  var showMoreBtn = document.getElementById("customShowMoreBtn");
  showMoreBtn.style.display = "none";
  var showLessBtn = document.getElementById("customShowLessBtn");
  showLessBtn.style.display = "inline";
}
  
function customShowLess() {
  var description = document.getElementById("roomDescriptionText");
  description.style.webkitLineClamp = "3";
  var showMoreBtn = document.getElementById("customShowMoreBtn");
  showMoreBtn.style.display = "inline";
  var showLessBtn = document.getElementById("customShowLessBtn");
  showLessBtn.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
  var description = document.getElementById("roomDescriptionText");
  if (description && description.textContent.length <= 200) {
    var showMoreBtn = document.getElementById("customShowMoreBtn");
    var showLessBtn = document.getElementById("customShowLessBtn");

    if (showMoreBtn) showMoreBtn.style.display = "none";
    if (showLessBtn) showLessBtn.style.display = "none";
  }
});

// Функция для инициализации карусели
$(document).ready(function(){
  $('.carousel').carousel({
    interval: 9000,
    pause: 'hover'
  });
});

// booking.js часть для переноса  данных для бронирования на часть с бронированием дата заезда выезда и количество человек
$(document).ready(function() {
    const currentYear = new Date().getFullYear();
    const minDate = new Date(currentYear, 4, 1);
    const maxDate = new Date(currentYear, 9, 31);

    function getTomorrow() {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }

    const today = new Date();
    const tomorrow = getTomorrow();
    const todayStr = today.toLocaleDateString('ru-RU');
    const tomorrowStr = tomorrow.toLocaleDateString('ru-RU');

    const datePickers = [
        { checkin: "#checkin", checkout: "#checkout", guests: "#guests", guestPicker: "#guestPicker", form: "#bookingForm", submitBtn: "#submitBtn", adultsInput: "#adultsInput", increaseBtn: "#increaseAdults", decreaseBtn: "#decreaseAdults", closeGuestPicker: "#closeGuestPicker" },
        { checkin: "#checkinAlt", checkout: "#checkoutAlt", guests: "#guestsAlt", guestPicker: "#guestPickerAlt", form: "#bookingFormAlt", submitBtn: "#submitBtnAlt", adultsInput: "#adultsInputAlt", increaseBtn: "#increaseAdultsAlt", decreaseBtn: "#decreaseAdultsAlt", closeGuestPicker: "#closeGuestPickerAlt" }
    ];

    datePickers.forEach((picker) => {
        if (picker.checkin === "#checkinAlt") {
            $(picker.checkin).val(todayStr);
            $(picker.checkout).val(tomorrowStr);
        }
    // Функция для определения количества месяцев для отображения
    function getShowMonths() {
        return window.matchMedia('(max-width: 767px)').matches ? 1 : 2;
    }

    // Настройки календаря даты заезда
    flatpickr(picker.checkin, {
        dateFormat: "d.m.Y",
        locale: "ru",
        minDate: "today",
        maxDate: maxDate,
        mode: "single",
        defaultDate: picker.checkin === "#checkinAlt" ? today : undefined,
        disable: [
            function(date) {
                return (date.getMonth() < 4 || date.getMonth() > 9);
            }
        ],
        onClose: function(selectedDates) {
            if (selectedDates.length > 0) {
                const minCheckoutDate = new Date(selectedDates[0]);
                minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
                checkoutCalendar.set("minDate", minCheckoutDate);
                $(picker.checkout).val(minCheckoutDate.toLocaleDateString('ru-RU'));
                checkoutCalendar.open(); // Автоматически открываем календарь даты выезда
            }
        },
        showMonths: getShowMonths()
    });

    // Настройки календаря даты выезда
    const checkoutCalendar = flatpickr(picker.checkout, {
        dateFormat: "d.m.Y",
        locale: "ru",
        minDate: getTomorrow(),
        maxDate: maxDate,
        mode: "single",
        defaultDate: picker.checkin === "#checkinAlt" ? tomorrow : undefined,
        disable: [
            function(date) {
                return (date.getMonth() < 4 || date.getMonth() > 9);
            }
        ],
        showMonths: getShowMonths()
    });

    // Обновление количества месяцев при изменении размера экрана
    window.addEventListener('resize', function() {
        const newShowMonths = getShowMonths();
        picker.checkin._flatpickr.set("showMonths", newShowMonths);
        checkoutCalendar.set("showMonths", newShowMonths);
    });

      $(picker.guests).click(function(e) {
            e.preventDefault();
            var position = $(this).offset();
            $(picker.guestPicker).css({
                top: position.top + $(this).outerHeight(),
                left: position.left,
                display: 'block'
            });
        });

        $(picker.increaseBtn).click(function() {
            let currentVal = parseInt($(picker.adultsInput).val());
            if (currentVal < 8) {
                $(picker.adultsInput).val(currentVal + 1);
                updateGuestsInput(picker);
            }
        });

        $(picker.decreaseBtn).click(function() {
            let currentVal = parseInt($(picker.adultsInput).val());
            if (currentVal > 2) {
                $(picker.adultsInput).val(currentVal - 1);
                updateGuestsInput(picker);
            }
        });

        $(picker.closeGuestPicker).click(function() {
            $(picker.guestPicker).hide();
        });

        function updateGuestsInput(picker) {
            let adults = $(picker.adultsInput).val();
            $(picker.guests).val(adults + ' взрослых');
        }

        updateGuestsInput(picker); // Initial update to set the correct value

        // Handle form submission
        $(picker.form).submit(function(e) {
            const checkin = $(picker.checkin).val() || new Date().toLocaleDateString('ru-RU');
            const checkout = $(picker.checkout).val() || getTomorrow().toLocaleDateString('ru-RU');
            const guests = $(picker.guests).val().split(' ')[0] || '2';

            $(picker.guests).val(guests); // Set the guests input value to only the number
        });
    });

    $(document).click(function(event) {
        datePickers.forEach((picker) => {
            if (!$(event.target).closest(picker.guestPicker + ', ' + picker.guests).length) {
                $(picker.guestPicker).hide();
            }
        });
    });

    // Показать и скрыть полное описание
    $('#customShowMoreBtn').click(function() {
        document.getElementById("customRoomDescription").style.height = "auto";
        $(this).hide();
        $('#customShowLessBtn').show();
    });

    $('#customShowLessBtn').click(function() {
        document.getElementById("customRoomDescription").style.height = "150px";
        $(this).hide();
        $('#customShowMoreBtn').show();
    });
});

// Js для карусели отзывов на index.html
$(document).ready(function() {
    $('#customers-testimonials').owlCarousel({
        loop: true,
        center: true,
        items: 3,
        margin: 0,
        autoplay: true,
        autoplayTimeout: 15000,
        smartSpeed: 1000,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1170: {
                items: 3
            }
        }
    });
});

// Отключение вертикального положения на телефонах:
// screen.orientation.lock('landscape');