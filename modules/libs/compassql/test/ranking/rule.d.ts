export interface RuleSet<T> {
    name: string;
    rules: Rule<T>[];
}
export interface Rule<T> {
    name: string;
    items: (T | T[])[];
}
export declare function testRuleSet(ruleSet: RuleSet<any>, getScore: {
    (_: any): number;
}, stringify?: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (string | number)[], space?: string | number): string;
}): void;
