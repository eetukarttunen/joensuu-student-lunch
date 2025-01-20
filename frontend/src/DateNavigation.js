import React from 'react';
import './DateNavigation.css';

const DateNavigation = ({ displayDate, currentDate, lastDate, goToPreviousDay, goToNextDay, renderDateLabel }) => {
  return (
    <div className="page-settings">
      <div className="date-navigation">
        <button
          className={`arrow arrow-left-blue ${displayDate === currentDate ? 'arrow-disabled' : ''}`}
          onClick={goToPreviousDay}
          disabled={displayDate === currentDate}
        >
          ←
        </button>
        <span className="date">{renderDateLabel()}</span>
        <button
          className={`arrow arrow-right-blue ${new Date(displayDate) >= new Date(lastDate) ? 'arrow-disabled' : ''}`}
          onClick={goToNextDay}
          disabled={new Date(displayDate) >= new Date(lastDate)}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default DateNavigation;
