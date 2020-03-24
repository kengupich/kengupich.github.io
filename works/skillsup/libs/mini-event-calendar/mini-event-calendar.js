(function( $ ) {
	var calenderTpl = `
		<div id="calTitle">
			<button type="button" class="month-mover prev">
				<i><span class="iconify ctrlbuttons prev"" data-icon="entypo:chevron-small-left" data-inline="false"></span></i>
			</button>
			<h3 class="gray m-0" id="monthYear"></h3>
			<button type="button" class="month-mover next">
				<i><span class="iconify ctrlbuttons next"" data-icon="entypo:chevron-small-right" data-inline="false"></span></i>
			</button>
		</div>
		<div>
			<div id="calThead"></div>
			<div id="calTbody"></div>
		</div>
		<div id="calTFooter">
			<h3 id="eventTitle">События отсутствуют.</h3>
			<a href="javascript:void(0);" id="calLink"></a>
		</div>
	`;
	var weekDaysFromSunday = '<div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>';
	var weekDaysFromMonday = '<div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div><b>Сб</b></div><div><b>Вс</b></div>';
	var weekDaysFromMondayArray = [
		'<div class="currentWeekDay">Пн</div>',
		'<div class="currentWeekDay">Вт</div>',
		'<div class="currentWeekDay">Ср</div>',
		'<div class="currentWeekDay">Чт</div>',
		'<div class="currentWeekDay">Пт</div>',
		'<div class="currentWeekDay"><b>Сб</b></div>',
		'<div class="currentWeekDay"><b>Вс</b></div>'
	];
	var shortMonths = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль","Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    $.fn.miniEventCalendar = $.fn.MEC = function(options) {
    	var settings = $.extend({
			calendar_link : "",
    		events: [],
			from_monday: false,
			onMonthChanged: null
        }, options );

		var miniCalendar = this;

        miniCalendar.addClass('mini-cal').html(calenderTpl);

		var thead = miniCalendar.find("#calThead");
		var tbody = miniCalendar.find("#calTbody");
		var calTitle = miniCalendar.find("#monthYear");
		var calFooter = miniCalendar.find("#calTFooter");
        var eventTitle = miniCalendar.find("#eventTitle");
		var eventsLink = miniCalendar.find("#calLink");

		var today = new Date();
		var curMonth = today.getMonth();
		var curYear = today.getFullYear();

		if(settings.from_monday)
			thead.html(weekDaysFromMonday);
		else
			thead.html(weekDaysFromSunday);

		if(!settings.calendar_link.length && !settings.events.length)
			calFooter.css("display", "none");

		miniCalendar.find(".month-mover").each(function(){
			var mover = $(this);
			mover.bind("click", function(e){
				e.preventDefault();
				if(mover.hasClass("next"))
					viewNextMonth();
				else
					viewPrevMonth();
			});
		});

		miniCalendar.on("click touchstart", ".a-date", function(e){
			
			//e.preventDefault(); 
			$(".a-date").removeClass('focused');
		    if(!$(this).hasClass('blurred')){
				showEvent($(this).data('event'));
				$(this).focus();
				$(this).addClass('focused');
			}
			
		});

		function populateCalendar(month, year, onInit) {
			tbody.html("");
			calTitle.text(shortMonths[month] + ", " + year);

			curMonth = month;
			curYear = year;

			var ldate = new Date(year, month);
			var dt = new Date(ldate);
			var weekDay = dt.getDay();
			
			if(settings.from_monday)
				weekDay = dt.getDay() > 0 ? dt.getDay() - 1 : 6;
			
			if(ldate.getDate() === 1)
				tbody.append(lastDaysOfPrevMonth(weekDay));

			while (ldate.getMonth() === month) {
     			dt = new Date(ldate);

     			var isToday = areSameDate(ldate, new Date());
     			var event = null;
     			var eventIndex = settings.events.findIndex(function(ev) {
		     		return areSameDate(dt, new Date(ev.date));
		     	});

		        if(eventIndex != -1){
		        	event = settings.events[eventIndex];

		        	if(onInit && isToday)
		        		showEvent(event);
		        }

     			tbody.append(dateTpl(false, ldate.getDate(), isToday, event, onInit && isToday));

     			ldate.setDate(ldate.getDate() + 1);

     			var bufferDays = 43 - miniCalendar.find(".a-date").length;

		        if(ldate.getMonth() != month){
		        	for(var i = 1; i < bufferDays; i++){
						tbody.append(dateTpl(true, i));
					}
				}
			}
			 
			if(settings.onMonthChanged){
				settings.onMonthChanged(month, year);
			}
			
			$(".a-date:not(.blurred)").each(function(){
				var thisWeekDay = weekDay + (parseInt($(this).find("span").text(), 10)),
					thisDateFull = ("0" + (thisWeekDay-weekDay)).slice(-2) + "-" + ("0" + ldate.getMonth()).slice(-2) + "-" + ldate.getFullYear();
				thisWeekDay = thisWeekDay % 7;
				if(thisWeekDay == 0) thisWeekDay = 7;

				$(this)
					.attr("data-weekday", thisWeekDay - 1)
					.attr("data-tag", thisDateFull)
					.prepend(weekDaysFromMondayArray[thisWeekDay - 1]);
			})

 		}

 		function lastDaysOfPrevMonth(day){
 			if(curMonth > 0){
				var monthIdx = curMonth - 1;
				var yearIdx = curYear;
			}
			else{
     			if(curMonth < 11){
     				var monthIdx = 0;
     				var yearIdx = curYear + 1;
     			}else{
     				var monthIdx = 11;
     				var yearIdx = curYear - 1;
     			}
     		}
     		
     		var prevMonth = getMonthDays(monthIdx, yearIdx);
     		var lastDays = "";
        	for (var i = day; i > 0; i--)
     			lastDays += dateTpl(true, prevMonth[prevMonth.length - i]);

        	return lastDays;
 		}

		function dateTpl(blurred, date, isToday, event, isSelected){
			var tpl = "<div class='a-date blurred'><span>"+date+"</span></div>";

			if(!blurred){
				var hasEvent = event && event !== null;
		        var cls = isToday ? "current " : "";
		        cls += hasEvent && isSelected ? "chip-item-active " : "";
		        cls += hasEvent ? "event " : "";
		        
		        var tpl ="<button type='button' class='a-date "+cls+"' data-event='"+JSON.stringify(event)+"'><div class='a-date-wrapper'><span>"+date+"</span></div></button>";
			}

			return tpl;
		}

		function showEvent(event){
			if(event && event !== null && event !== undefined){
				eventTitle.text(event.title);
				eventsLink.text("Подробнее");
				eventsLink.attr("href", event.link);
			}else{
				eventTitle.text("Мероприятий нет");
				eventsLink.text(""); //все события
				eventsLink.attr("href", settings.calendar_link);
			}
		}

		function viewNextMonth(){
			var nextMonth = curMonth < 11 ? curMonth + 1 : 0;
			var nextYear = curMonth < 11 ? curYear : curYear + 1;

			populateCalendar(nextMonth, nextYear);
			
		}

		function viewPrevMonth(){
			var prevMonth = curMonth > 0 ? curMonth - 1 : 11;
			var prevYear = curMonth > 0 ? curYear : curYear - 1;
			
			populateCalendar(prevMonth, prevYear);
		}

		function areSameDate(d1, d2) {
			return d1.getFullYear() == d2.getFullYear()
		        && d1.getMonth() == d2.getMonth()
		        && d1.getDate() == d2.getDate();
		}

		function getMonthDays(month, year) {
			var date = new Date(year, month, 1);
			var days = [];
			while (date.getMonth() === month) {
				days.push(date.getDate());
				date.setDate(date.getDate() + 1);
			}
			return days;
		}

		populateCalendar(curMonth, curYear, true);

        return miniCalendar;
	};
	

}( jQuery ));