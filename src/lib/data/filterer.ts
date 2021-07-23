import {EMPTY_PERIOD, TimetableDay} from "@/lib/data/timetable";
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

            let currentPeriod: any;

            function traverse(node: any): boolean | any {
                switch (node.type) {
                    case 'AndExpression': {
                        const left = traverse(node.left);
                        const right = traverse(node.right);
                        return left && right;
                    }
                    case 'OrExpression': {
                        const left = traverse(node.left);
                        const right = traverse(node.right);
                        return left || right;
                    }
                    case 'NotExpression': {
                        const value = traverse(node.value);
                        return !value;
                    }
                    case 'ComparisonBooleanPrimary': {
                        const left = traverse(node.left);
                        const right = traverse(node.right);
                        switch (node.operator) {
                            case '<':
                                return left < right;
                            case '>':
                                return right > left;
                            case '=':
                                return left == right;
                        }
                        break;
                    }
                    case 'Identifier': {
                        const value = currentPeriod[node.value];
                        if (value === undefined)
                            throw new Error('unknown identifier: ' + node.value);
                        return value;
                    }
                    case 'Number': {
                        return +node.value;
                    }
                    case 'String': {
                        return node.value.substring(1, node.value.length - 1);
                    }
                    case 'Boolean': {
                        return node.value === 'TRUE';
                    }
                    case 'InExpressionListPredicate': {
                        const value = traverse(node.left);
                        const list = traverse(node.right);
                        return list.includes(value);
                    }
                    case 'ExpressionList': {
                        return node.value.map((obj: any) => traverse(obj));
                    }
                }
                return true;
            }

            let newData: TimetableDay[] = [];
            if (ast.value.where) {
                for (const day of data) {
                    const remain = [];
                    let any = false;
                    for (const period of day) {
                        currentPeriod = period;
                        const keep = traverse(ast.value.where);
                        if (keep) {
                            any = true;
                            remain.push(period);
                        } else {
                            remain.push({...EMPTY_PERIOD, Date: period.Date, PeriodID: period.PeriodID});
                        }
                    }
                    if (any) {
                        newData.push(remain);
                    }
                }
            } else {
                newData = data;
            }

            return newData;
        };
    }
}
