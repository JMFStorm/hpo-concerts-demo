export const sortConcertsByDate = (a, b, isDescending = false) => {
  const aDate = Date.parse(a.date);
  const bDate = Date.parse(b.date);
  if (aDate === bDate) {
    return 0;
  }
  let mult = isDescending ? -1 : 1;
  return aDate < bDate ? -1 * mult : 1 * mult;
};

export const parsePgDateToString = (pgDate) => {
  const regex = /\d{4}-\d{2}-\d{2}/;
  if (!pgDate.match(regex)) {
    console.log(`Cannot parse '${pgDate}' from date to display string`);
    return pgDate;
  }
  const year = pgDate.substring(0, 4);
  let month = pgDate.substring(5, 7);
  let day = pgDate.substring(8, 10);

  if (month.match(/0\d/)) {
    month = month.substring(1, 2);
  }
  if (day.match(/0\d/)) {
    day = day.substring(1, 2);
  }

  const displayString = `${day}.${month}.${year}`;
  return displayString;
};

export const parsePgTimeToString = (pgTime) => {
  const regex = /\d{2}:\d{2}:\d{2}/;
  if (!pgTime.match(regex)) {
    console.log(`Cannot parse '${pgTime}' from date to display string`);
    return pgTime;
  }
  const hour = pgTime.substring(0, 2);
  const minute = pgTime.substring(3, 5);

  const displayString = `${hour}:${minute}`;
  return displayString;
};

export const sortSymphoniesByName = (a, b) => {
  const regEx = /^"+/;
  let aName = a.name.toLowerCase();
  let bName = b.name.toLowerCase();
  if (aName.match(regEx)) {
    aName = aName.replace(regEx, "");
  }
  if (bName.match(regEx)) {
    bName = bName.replace(regEx, "");
  }
  if (aName < bName) {
    return -1;
  } else if (aName > bName) {
    return 1;
  }
  return 0;
};
