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
