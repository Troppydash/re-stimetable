export type TimetableData = TimetableDay[];
interface TimetableDay {
    Date: string;
    DateFormatted: string;
    weekDay: string;
    periodData: PeriodData[];
}

interface PeriodData {
    PeriodID: string;
    FromTime: string;
    ToTime: string;
    Heading: string;
    AdditionalData: AdditionalData;
}

interface AdditionalData {
    Abbrev: string;
    Desc: string;
    Period: string;
    Room: string;
    Teacher: string;
    Year: string
}
