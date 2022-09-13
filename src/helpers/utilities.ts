export const addHours = (numOfHours: number, date = new Date()) => { date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000); return date; }

export const uniqueId = () => {
    return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
}

export const convertDateInTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });