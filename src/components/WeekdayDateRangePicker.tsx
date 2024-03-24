import React, { useState } from 'react';

// Helper function to check if a given date is a weekend (Saturday or Sunday)
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// Component
const DateRangePicker: React.FC = () => {
  // State to store the selected start and end dates
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [weekendDates, setWeekendDates] = useState<Date[]>([]);
  const [selectedRange, setSelectedRange] = useState<any[]>([]);

  // Function to calculate weekend dates within the selected date range
  const calculateWeekendDates = (start: Date, end: Date): Date[] => {
    const weekends: Date[] = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      if (isWeekend(currentDate)) {
        weekends.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
    return weekends;
  };

  // Function to handle date selection
  const handleDateSelect = (date: Date) => {
    // Check if the selected date is a weekday (not a weekend)
    if (!isWeekend(date)) {
      // If start date is not selected yet, set it
      if (!startDate) {
        setStartDate(date);
      }
      // If start date is already selected but end date is not, set end date
      else if (startDate && !endDate) {
        setEndDate(date);
      }
      // If both start and end dates are selected, reset to select new range
      else {
        setStartDate(date);
        setEndDate(null);
      }
    }
  };

  // Function to handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    if (startDate && endDate) {
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);
      newStartDate.setFullYear(year);
      newEndDate.setFullYear(year);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      setWeekendDates(calculateWeekendDates(newStartDate, newEndDate));
    } else if (startDate) {
      const newStartDate = new Date(startDate);
      newStartDate.setFullYear(year);
      setStartDate(newStartDate);
      setWeekendDates([]);
    }
  };

  // Function to handle month change
  const handleMonthChange = (month: number) => {
    if (startDate && endDate) {
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);
      newStartDate.setMonth(month);
      newEndDate.setMonth(month);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      setWeekendDates(calculateWeekendDates(newStartDate, newEndDate));
    } else if (startDate) {
      const newStartDate = new Date(startDate);
      newStartDate.setMonth(month);
      setStartDate(newStartDate);
      setWeekendDates([]);
    }
  };

  const handlePredefinedRange = (range: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range + 1);
    setStartDate(startDate);
    setEndDate(endDate);
    setSelectedRange([startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)]);
    setWeekendDates(calculateWeekendDates(startDate, endDate));
  };


  // Function to handle change in date range
  const handleChange = () => {
    if (startDate && endDate) {
      // Calculate the weekend dates within the selected date range
      const weekendsWithinRange = calculateWeekendDates(startDate, endDate);
      
      // Format the selected date range
      const dateRange = [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)];
      
      // Return an array containing the date range as the first element 
      // and an array of weekend dates within that range as the second element
      return [dateRange, weekendsWithinRange.map(date => date.toISOString().slice(0, 10))];
    }
    return [];
  };

  // Generate options for the year select dropdown
  const yearOptions: number[] = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear - 10; year <= currentYear + 10; year++) {
    yearOptions.push(year);
  }

  return (
    <div className="date-range-picker-container">
      <div>
        Year:
        <select onChange={(e) => handleYearChange(e)} value={selectedYear}>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div>
        Month:
        <select onChange={(e) => handleMonthChange(parseInt(e.target.value))} value={startDate ? startDate.getMonth() : ''}>
          <option value={0}>January</option>
          <option value={1}>February</option>
          <option value={2}>March</option>
          <option value={3}>April</option>
          <option value={4}>May</option>
          <option value={5}>June</option>
          <option value={6}>July</option>
          <option value={7}>August</option>
          <option value={8}>September</option>
          <option value={9}>October</option>
          <option value={10}>November</option>
          <option value={11}>December</option>
        </select>
      </div>
      <div>
        Start Date:
        <input
          type="date"
          value={startDate ? startDate.toISOString().slice(0, 10) : ''}
          onChange={(e) => handleDateSelect(new Date(e.target.value))}
        />
      </div>
      <div>
        End Date:
        <input
          type="date"
          value={endDate ? endDate.toISOString().slice(0, 10) : ''}
          onChange={(e) => handleDateSelect(new Date(e.target.value))}
        />
      </div>
      <div>
        Predefined Ranges:
        <button onClick={() => handlePredefinedRange(7)}>Last 7 Days</button>
        <button onClick={() => handlePredefinedRange(30)}>Last 30 Days</button>
      </div>
      <div>
        {startDate && endDate && (
          <p>
            Selected Date Range: {startDate.toISOString().slice(0, 10)} to {endDate.toISOString().slice(0, 10)}
          </p>
        )}
        {weekendDates.length > 0 && (
          <p>Weekend Dates: {weekendDates.map((date) => date.toISOString().slice(0, 10)).join(', ')}</p>
        )}
      </div>
      <div>
        {/* Call handleChange function to return selected date range and weekend dates */}
        <button onClick={handleChange}>Get Selected Range</button>
      </div>
    </div>
  );
};

export default DateRangePicker;
