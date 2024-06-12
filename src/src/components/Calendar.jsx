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

 const renderDays = () => {
  const dayButtons = [];
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const specialDays = [5, 10, 15]; // Example array of special days

  for (let i = 0; i < totalDaysInMonth; i++) {
    const date = new Date(firstDayOfMonth);
    date.setDate(firstDayOfMonth.getDate() + i);
    const day = days[date.getDay()];
    const formattedDate = date.getDate();
    const isCurrentDay = selectedDate === formattedDate && currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentYear;
    const isSpecialDay = specialDays.includes(formattedDate); // Check if the date is a special day

    dayButtons.push(
      <div
        key={formattedDate}
        className={`day ${isCurrentDay ? 'current-day' : ''} ${isSpecialDay ? 'special-day' : ''}`}
        onClick={() => handleDateClick(formattedDate)}
      >
        <div className="day-label">{day}</div>
        <div className="date-label">{formattedDate}</div>
      </div>
    );
  }
  return dayButtons;
};


  return (
    <div className="calendar">
      <div className="header">
        <button className="nav-button" onClick={handlePreviousMonth}>&#9664;</button>
        <h3>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</h3>
        <button className="nav-button" onClick={handleNextMonth}>&#9654;</button>
      </div>
      <div className="days">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
