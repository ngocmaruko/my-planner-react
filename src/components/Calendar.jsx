import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ onDateClick }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());

  // Get the total days in the current month
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  useEffect(() => {
    setSelectedDate(currentDate.getDate()); // Update selectedDate on component mount
  }, [currentDate]);

  const handleDateClick = (day) => {
    setSelectedDate(day); // Update the selected date state
    onDateClick(day); // Call the passed in callback function
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderDayLabels = () => {
    return days.map(day => (
      <div key={day} className="day-label">{day}</div>
    ));
  };

  const renderDates = () => {
    const dateButtons = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday, etc.

    // Find the date of the first Sunday before the first day of the month
    const firstSunday = new Date(firstDayOfMonth);
    firstSunday.setDate(firstSunday.getDate() - startingDay);

    // Calculate the total number of cells needed (weeks * 7)
    const totalCells = Math.ceil((totalDaysInMonth + startingDay) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const date = new Date(firstSunday);
      date.setDate(firstSunday.getDate() + i);
      const formattedDate = date.getDate();
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isCurrentDay =
        selectedDate === formattedDate &&
        currentDate.getMonth() === currentMonth &&
        currentDate.getFullYear() === currentYear;
      const isSpecialDay = [5, 10, 15].includes(formattedDate); // Example array of special days

      dateButtons.push(
        <div
          key={`${date.getMonth()}-${formattedDate}`}
          className={`day ${isCurrentDay ? 'current-day' : ''} ${isSpecialDay ? 'special-day' : ''} ${!isCurrentMonth ? 'other-month-day' : ''}`}
          onClick={() => handleDateClick(formattedDate)}
        >
          <div className="date-label">{formattedDate}</div>
        </div>
      );
    }

    return dateButtons;
  };

  return (
    <div className="calendar">
      <div className="header">
        <button className="nav-button" onClick={handlePreviousMonth}>&#9664;</button>
        <h3>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</h3>
        <button className="nav-button" onClick={handleNextMonth}>&#9654;</button>
      </div>
      <div className="days">{renderDayLabels()}</div>
      <div className="days">{renderDates()}</div>
    </div>
  );
};

export default Calendar;
