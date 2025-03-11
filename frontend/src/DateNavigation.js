import React from 'react';

const DateNavigation = ({
  currentDate,
  displayDate,
  lastDate,
  goToPreviousDay,
  goToNextDay,
  renderDateLabel,
}) => (
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
);

export default DateNavigation;
