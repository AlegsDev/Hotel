$(document).ready(function() {
    const currentYear = new Date().getFullYear();
    const minDate = new Date(currentYear, 4, 1);
    const maxDate = new Date(currentYear, 9, 31);

    function getShowMonths() {
        return window.matchMedia('(max-width: 767px)').matches ? 1 : 2;
    }

    const checkinCalendar = flatpickr("#checkin", {
        dateFormat: "d.m.Y",
        locale: "ru",
        minDate: "today",
        maxDate: maxDate,
        onClose: function(selectedDates) {
            if (selectedDates.length > 0) {
                const minCheckoutDate = new Date(selectedDates[0]);
                minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
                checkoutCalendar.set("minDate", minCheckoutDate);
                checkoutCalendar.setDate(minCheckoutDate); // Установить дату выселения на следующий день после заселения
                checkoutCalendar.open(); // Автоматически открываем календарь даты выезда
            }
        },
        showMonths: getShowMonths()
    });

    const checkoutCalendar = flatpickr("#checkout", {
        dateFormat: "d.m.Y",
        locale: "ru",
        minDate: "today",
        maxDate: maxDate,
        onOpen: function(selectedDates, dateStr, instance) {
            const checkinDate = checkinCalendar.selectedDates[0];
            if (checkinDate) {
                const minCheckoutDate = new Date(checkinDate);
                minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
                instance.set("minDate", minCheckoutDate);
            }
        },
        showMonths: getShowMonths()
    });

    $(window).on('load', function() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('checkin') && params.has('checkout')) {
            const checkinDate = params.get('checkin');
            const checkoutDate = params.get('checkout');
            $("#checkin").val(checkinDate);
            $("#checkout").val(checkoutDate);
            checkinCalendar.setDate(checkinDate);
            checkoutCalendar.setDate(checkoutDate);
        }
    });

    function calculateCost(guests, days) {
        const prices = {
            '2x': 6000,
            '3x': 6500,
            '4x': 7000,
            'lux': 7500,
            '2room': 8500
        };
        let rooms = [];
        let totalCost = 0;

        if (guests == 2) {
            rooms.push({name: '2x', price: prices['2x']});
            rooms.push({name: 'lux', price: prices['lux']});
        } else if (guests == 3) {
            rooms.push({name: '3x', price: prices['3x']});
            rooms.push({name: 'lux', price: prices['lux']});
            rooms.push({name: '2x', price: prices['2x'] + 1500});
        } else if (guests == 4) {
            rooms.push({name: '4x', price: prices['4x']});
            rooms.push({name: 'lux', price: prices['lux']});
            rooms.push({name: '3x', price: prices['3x'] + 1500});
            rooms.push({name: '2room', price: prices['2room']});
        } else if (guests == 5) {
            rooms.push({name: '4x', price: prices['4x'] + 1500});
            rooms.push({name: 'lux', price: prices['lux'] + 1500});
            rooms.push({name: '2room', price: prices['2room'] + 1500});
        } else if (guests == 6) {
            rooms.push({name: '2room', price: prices['2room'] + 3000});
            rooms.push({name: 'lux', price: prices['lux'] + 3000});
        } else if (guests > 6 && guests <= 8) {
            rooms.push({name: '2room', price: prices['2room'] + 1500 * (guests - 4)});
        }

        rooms.forEach(room => {
            totalCost += room.price * days;
        });

        return {rooms, totalCost};
    }

    function calculateDays(checkin, checkout) {
        const checkinDate = new Date(checkin.split('.').reverse().join('-'));
        const checkoutDate = new Date(checkout.split('.').reverse().join('-'));
        const diffTime = Math.abs(checkoutDate - checkinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    function updateResults() {
        const checkin = $('#checkin').val() || new Date().toLocaleDateString('ru-RU');
        const checkout = $('#checkout').val() || getTomorrow().toLocaleDateString('ru-RU');
        const guests = parseInt($('#guests').val().split(' ')[0]);
        const days = calculateDays(checkin, checkout);
        const {rooms, totalCost} = calculateCost(guests, days);

        $('.room-card').hide().removeClass('animate__animated animate__fadeIn');
        rooms.forEach(room => {
            const roomCard = $('.room-card[data-room-type=' + room.name + ']');
            roomCard.find('.room-price').html('<b>Общая стоимость: ' + room.price * days + ' ₽</b>');
            roomCard.find('.room-details').html('<small class="text-muted">' + days + ' ' + getNightsText(days) + ', ' + guests + ' ' + getGuestsText(guests) + '</small>');
            roomCard.show().addClass('animate__animated animate__fadeIn');
        });
    }

    function getNightsText(days) {
        return days === 1 ? 'ночь' : (days > 1 && days < 5 ? 'ночи' : 'ночей');
    }

    function getGuestsText(guests) {
        return guests === 1 ? 'гость' : (guests > 1 && guests < 5 ? 'гостя' : 'гостей');
    }

    $(document).click(function(event) {
        if (!$(event.target).closest('#guestPicker, #guests').length) {
            $('#guestPicker').hide();
        }
    });

    $('#calculateBtn').click(function(e) {
        updateResults();
        e.preventDefault();
    });

    $(window).on('load', function() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('checkin') && params.has('checkout') && params.has('guests')) {
            $('#checkin').val(params.get('checkin'));
            $('#checkout').val(params.get('checkout'));
            $('#guests').val(params.get('guests') + ' взрослых');
            updateResults();
        }
    });

    function getTomorrow() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
    }
  });