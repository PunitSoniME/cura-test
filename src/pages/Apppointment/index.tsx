import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { LeftArrow, RightArrow } from '../../components/Arrow';
import { addHours, uniqueId, convertDateInTime } from '../../helpers/utilities';
import { Dates, TimeSlots } from './IAppointment';

import './Appointment.scss';

export default function Appointment() {

    const [dates, setDates] = useState<Dates[]>([]);
    const [times, setTimes] = useState<TimeSlots[]>([]);

    const [activeTime, setActiveTime] = useState(null);
    const [activeDate, setActiveDate] = useState(-1);

    useEffect(() => {
        axios
            .get("https://cura-front-end-test.herokuapp.com/")
            .then(({ data }) => {

                let { schedule }: { schedule: Dates[] } = JSON.parse(data);

                const modifiedDates = [...schedule.map((m: Dates) => {

                    let timeslots: any = {};

                    m.available.forEach((f: TimeSlots) => {
                        const availableTimeslotsKeyPairs = prepareTimeSlots(f);
                        timeslots = { ...timeslots, ...availableTimeslotsKeyPairs };
                    })

                    m.unavailable.forEach((ff: TimeSlots) => {
                        const from = generateTime(ff.from_unix);
                        const to = generateTime(ff.to_unix);

                        timeslots[`${from}-${to}`] = {
                            ...ff,
                            from: from,
                            to: to,
                            id: uniqueId(),
                            isAvailable: "no"
                        }
                    })

                    let timeslotArray: TimeSlots[] = [];

                    Object.keys(timeslots).forEach((key: string) => {
                        timeslotArray.push(timeslots[key]);
                    })

                    return {
                        ...m,
                        timeSlots: timeslotArray.sort((a: TimeSlots, b: TimeSlots) => { return a.from_unix - b.from_unix })
                    }
                })];

                setDates([...modifiedDates]);
            })
    }, []);

    const prepareTimeSlots = (timeslot: TimeSlots) => {
        let timeslots: any = {};

        const endTime = generateTime(timeslot.to_unix);

        let startDate = new Date(timeslot.from_unix * 1000);

        let startDateFromToString = convertDateInTime(startDate);

        do {
            const startDateToToString = convertDateInTime(addHours(1, startDate));

            timeslots[`${startDateFromToString}-${startDateToToString}`] = {
                ...timeslot,
                from: startDateFromToString,
                to: startDateToToString,
                id: uniqueId(),
                isAvailable: "yes"
            }

            startDateFromToString = convertDateInTime(startDate);

        } while (startDateFromToString !== endTime);

        return timeslots;
    }

    const generateTime = (unixTimestamp: number) => {
        var date = new Date(unixTimestamp * 1000);
        return convertDateInTime(date);
    }

    return (
        <div className="appointment">

            <div className="flex appintment_container">
                <h3 className="header">Schedule Appointment</h3>
                <div className="content">
                    <div className="flex fees_main space_between">
                        <span className="fees">Fees</span>
                        <span className="amount">85$</span>
                    </div>
                    <hr className="horizontal_line" />

                    <div className="schedule">Schedule</div>

                    <ScrollMenu
                        LeftArrow={LeftArrow}
                        RightArrow={RightArrow}
                    >
                        {
                            dates.length === 0 ? [1, 2, 3, 4, 5].map((m: number) => (
                                <div
                                    role="button"
                                    key={m}
                                    className="flex skeleton"
                                    style={{
                                        margin: "0 5px",
                                        userSelect: "none",
                                        borderRadius: 10
                                    }}
                                >
                                    <div className="date_inner">
                                        <div className="day skeleton"></div>
                                        <div className="date_number skeleton"></div>
                                    </div>
                                </div>
                            )) : dates.map((m, index) => (
                                <div
                                    role="button"
                                    id={`id-${index}`}
                                    key={index}
                                    className={`flex ${index === 0 ? "disabled_date" : " cursor-pointer date"}`}
                                    onClick={() => {
                                        if (index !== 0) {
                                            setTimes(dates[index].timeSlots);
                                            setActiveDate(index);
                                        }
                                    }}
                                    style={{
                                        margin: "0 5px",
                                        userSelect: "none"
                                    }}
                                >
                                    <div className={`date_inner ${index === activeDate ? "active_date_time" : ""}`}>
                                        <div className="day">{m.availability.day.substring(0, 3)}</div>
                                        <div className="date_number">{m.availability.date.substring(0, 2)}</div>
                                    </div>
                                </div>
                            ))
                        }

                    </ScrollMenu>

                    {activeDate !== -1 ? <div className="choose_time">Choose Time</div> : ""}

                    <div className="time_slots">
                        {
                            times.map((m: any) => (
                                <div
                                    role="button"
                                    key={m.id}
                                    style={{
                                        userSelect: "none"
                                    }}
                                    onClick={() => {
                                        if (m.isAvailable === "yes" && m.id !== activeTime)
                                            setActiveTime(m.id);
                                    }}
                                    className={`time ${m.isAvailable === "no" ? "disabled_time" : (m.id === activeTime ? "active_date_time" : "cursor-pointer")}`}>
                                    {m.from}
                                </div>
                            ))
                        }
                    </div>

                </div>

                <button
                    type="button"
                    disabled={activeTime === null || activeDate === -1}
                    className="book_appointment_button"
                >
                    Book Appointment
                </button>

            </div>
        </div>
    )
}
