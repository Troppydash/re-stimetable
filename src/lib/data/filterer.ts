import {TimetableDay} from "@/lib/data/timetable";
import parser from 'js-sql-parser';

type Filter = (data: TimetableDay[]) => TimetableDay[];
export class DataFilterer {
    public getFilter(query: string): Filter {
        const ast = parser.parse(query);
        return (data: TimetableDay[]) => {
            if (ast.value.type !== 'Select')
                return [];

            const table = ast.value.from.value;
            if (table.length !== 1 || table[0].value.value.value !== 'timetable')
                return [];

            // const newData: WebTimetableData = [];
            // for (const day of data) {
            //     for (const period of data) {
            //
            //     }
            // }

            return data;
        };
    }
}
