export class OpenHours {
        constructor(
                public mo?: Day,
                public tu?: Day,
                public we?: Day,
                public th?: Day,
                public fr?: Day,
                public sa?: Day,
                public su?: Day,

        ) {}
}


export class Day {
        constructor(
                public open?: any,
                public from?: string,
                public to?: string
        ) {}
}

