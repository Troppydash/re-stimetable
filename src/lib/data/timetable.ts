export type TimetableData = TimetableDay[];
export interface TimetableDay {
    Date: string;
    DateFormatted: string;
    DayName: string;
    periodData: PeriodData[];
}

export interface PeriodData {
    PeriodID: string;
    FromTime: string;
    ToTime: string;
    Heading: string;
    teacherTimeTable: AdditionalData;
}

export interface AdditionalData {
    Abbrev: string;
    Desc: string;
    Period: string;
    Room: string;
    Teacher: string;
    Year: string
}

export function EncodePeriod({period, day}: {period: PeriodData, day: TimetableDay}): string {
    return `${day.Date}|${period.PeriodID}|${period.teacherTimeTable?.Room ?? 'ERR'}`;
}

export function DecodePeriod(encoded: string): {date: string, periodID: string, room: string} {
    const [date, periodID, room] = encoded.split('|');
    return {
        date,
        periodID,
        room
    };
}
