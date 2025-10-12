export type ShampooDescription = {
    title: string;
    text: string;
    color: string;
};

export type ShampooVariant = {
    image: string;
    descriptions: ShampooDescription[];
};

/**
 * All possible shampoo categories
 */
export type ShampooCategory =
    | "color_vibrancy"
    | "daily_moisture"
    | "hair_fall_rescue"
    | "intensive_repair"
    | "purifying";

/**
 * Each category has variants (like default, daily_moisture, hair_fall_rescue, etc.)
 */
export type ShampooVariants = {
    [key in ShampooCategory]?: ShampooVariant;
} & {
    default: ShampooVariant;
};

/**
 * The entire shampoo dataset
 */
export type ShampooData = {
    [key in ShampooCategory]: ShampooVariants;
};

export const SHAMPOO_DATA: ShampooData = {
    color_vibrancy: {
        default: {
            image: "color_vibrancy-T.webp",
            descriptions: [
                {
                    title: "موهای رنگ شده",
                    text: "شامپو و نرم‌کننده‌ای برای موهای رنگ شده تا 90% جلوگیری از آسیب مو ناشی از رنگ شدگی مو حاوی لایزین",
                    color: "#D95D7E",
                },
            ],
        },
        daily_moisture: {
            image: "color_vibrancy_daily_moisture.webp",
            descriptions: [
                {
                    title: "موهای رنگ شده",
                    text: "شامپو و نرم‌کننده‌ای برای موهای رنگ شده تا 90% جلوگیری از آسیب مو ناشی از رنگ شدگی مو حاوی لایزین",
                    color: "#D95D7E",
                },
                {
                    title: "رطوبت رسانی",
                    text: "شامپو و نرم‌کننده‌ای مناسب انواع موها رطوبت رسانی به پوست سر، احیا رطوبت ساقه ی مو حاوی گلیسیرین",
                    color: "#008999",
                },
            ],
        },
        hair_fall_rescue: {
            image: "color_vibrancy_hair_fall_rescue.webp",
            descriptions: [
                {
                    title: "موهای رنگ شده",
                    text: "شامپو و نرم‌کننده‌ای برای موهای رنگ شده تا 90% جلوگیری از آسیب مو ناشی از رنگ شدگی مو حاوی لایزین",
                    color: "#D95D7E",
                },
                {
                    title: "تقویت مو",
                    text: "شامپوی موهای ضعیف و شکننده تا 4 برابر ساقه‌ی موهایی قوی تر حاوی سرامید",
                    color: "#0F852F",
                },
            ],
        },
        intensive_repair: {
            image: "color_vibrancy_intensive_repair.webp",
            descriptions: [
                {
                    title: "موهای رنگ شده",
                    text: "شامپو و نرم‌کننده‌ای برای موهای رنگ شده تا 90% جلوگیری از آسیب مو ناشی از رنگ شدگی مو حاوی لایزین",
                    color: "#D95D7E",
                },
                {
                    title: "ترمیم مو",
                    text: "شامپو و نرم‌کننده مناسب موهای خشک و آسیب دیده تا 90% جلوگیری از آسیب مو و ترمیم موهای آسیب دیده حاوی گلوکونولاکتون",
                    color: "#113274",
                },
            ],
        },
        purifying: {
            image: "color_vibrancy_purifying.webp",
            descriptions: [
                {
                    title: "موهای رنگ شده",
                    text: "شامپو و نرم‌کننده‌ای برای موهای رنگ شده تا 90% جلوگیری از آسیب مو ناشی از رنگ شدگی مو حاوی لایزین",
                    color: "#D95D7E",
                },
                {
                    title: "پاکسازی",
                    text: "شامپوی موهای چرب احیای تمیزی پوست و مو سر تشکیل شده از 90% مواد طبیعی",
                    color: "#EA8A07",
                },
            ],
        },
    },

    daily_moisture: {
        default: {
            image: "daily_moisture-T.webp",
            descriptions: [
                {
                    title: "رطوبت رسانی",
                    text: "شامپو و نرم‌کننده‌ای مناسب انواع موها رطوبت رسانی به پوست سر، احیا رطوبت ساقه ی مو حاوی گلیسیرین",
                    color: "#008999",
                },
            ],
        },
        hair_fall_rescue: {
            image: "daily_moisture_hair_fall_rescue.webp",
            descriptions: [
                {
                    title: "رطوبت رسانی",
                    text: "شامپو و نرم‌کننده‌ای مناسب انواع موها رطوبت رسانی به پوست سر، احیا رطوبت ساقه ی مو حاوی گلیسیرین",
                    color: "#008999",
                },
                {
                    title: "تقویت مو",
                    text: "شامپوی موهای ضعیف و شکننده تا 4 برابر ساقه‌ی موهایی قوی تر حاوی سرامید",
                    color: "#0F852F",
                },
            ],
        },
        intensive_repair: {
            image: "daily_moisture_intensive_repair.webp",
            descriptions: [
                {
                    title: "رطوبت رسانی",
                    text: "شامپو و نرم‌کننده‌ای مناسب انواع موها رطوبت رسانی به پوست سر، احیا رطوبت ساقه ی مو حاوی گلیسیرین",
                    color: "#008999",
                },
                {
                    title: "ترمیم مو",
                    text: "شامپو و نرم‌کننده مناسب موهای خشک و آسیب دیده تا 90% جلوگیری از آسیب مو و ترمیم موهای آسیب دیده حاوی گلوکونولاکتون",
                    color: "#113274",
                },
            ],
        },
        purifying: {
            image: "daily_moisture_purifying.webp",
            descriptions: [
                {
                    title: "رطوبت رسانی",
                    text: "شامپو و نرم‌کننده‌ای مناسب انواع موها رطوبت رسانی به پوست سر، احیا رطوبت ساقه ی مو حاوی گلیسیرین",
                    color: "#008999",
                },
                {
                    title: "پاکسازی",
                    text: "شامپوی موهای چرب احیای تمیزی پوست و مو سر تشکیل شده از 90% مواد طبیعی",
                    color: "#EA8A07",
                },
            ],
        },
    },

    hair_fall_rescue: {
        default: {
            image: "hair_fall_rescue-T.webp",
            descriptions: [
                {
                    title: "تقویت مو",
                    text: "شامپوی موهای ضعیف و شکننده تا 4 برابر ساقه‌ی موهایی قوی تر حاوی سرامید",
                    color: "#0F852F",
                },
            ],
        },
        daily_moisture: {
            image: "hair_fall_rescue_daily_moisture.webp",
            descriptions: [
                {
                    title: "تقویت مو",
                    text: "شامپوی موهای ضعیف و شکننده تا 4 برابر ساقه‌ی موهایی قوی تر حاوی سرامید",
                    color: "#0F852F",
                },
                {
                    title: "رطوبت رسانی",
                    text: "شامپو و نرم‌کننده‌ای مناسب انواع موها رطوبت رسانی به پوست سر، احیا رطوبت ساقه ی مو حاوی گلیسیرین",
                    color: "#008999",
                },
            ],
        },
        intensive_repair: {
            image: "hair_fall_rescue_intensive_repair.webp",
            descriptions: [
                {
                    title: "تقویت مو",
                    text: "شامپوی موهای ضعیف و شکننده تا 4 برابر ساقه‌ی موهایی قوی تر حاوی سرامید",
                    color: "#0F852F",
                },
                {
                    title: "ترمیم مو",
                    text: "شامپو و نرم‌کننده مناسب موهای خشک و آسیب دیده تا 90% جلوگیری از آسیب مو و ترمیم موهای آسیب دیده حاوی گلوکونولاکتون",
                    color: "#113274",
                },
            ],
        },
        purifying: {
            image: "hair_fall_rescue_purifying.webp",
            descriptions: [
                {
                    title: "تقویت مو",
                    text: "شامپوی موهای ضعیف و شکننده تا 4 برابر ساقه‌ی موهایی قوی تر حاوی سرامید",
                    color: "#0F852F",
                },
                {
                    title: "پاکسازی",
                    text: "شامپوی موهای چرب احیای تمیزی پوست و مو سر تشکیل شده از 90% مواد طبیعی",
                    color: "#EA8A07",
                },
            ],
        },
    },

    intensive_repair: {
        default: {
            image: "intensive_repair-T.webp",
            descriptions: [
                {
                    title: "ترمیم مو",
                    text: "شامپو و نرم‌کننده مناسب موهای خشک و آسیب دیده تا 90% جلوگیری از آسیب مو و ترمیم موهای آسیب دیده حاوی گلوکونولاکتون",
                    color: "#113274",
                },
            ],
        },
        daily_moisture: {
            image: "intensive_repair_daily_moisture.webp",
            descriptions: [
                {
                    title: "ترمیم مو",
                    text: "شامپو و نرم‌کننده مناسب موهای خشک و آسیب دیده تا 90% جلوگیری از آسیب مو و ترمیم موهای آسیب دیده حاوی گلوکونولاکتون",
                    color: "#113274",
                },
                {
                    title: "رطوبت رسانی",
                    text: "شامپو و نرم‌کننده‌ای مناسب انواع موها رطوبت رسانی به پوست سر، احیا رطوبت ساقه ی مو حاوی گلیسیرین",
                    color: "#008999",
                },
            ],
        },
        hair_fall_rescue: {
            image: "intensive_repair_hair_fall_rescue.webp",
            descriptions: [
                {
                    title: "ترمیم مو",
                    text: "شامپو و نرم‌کننده مناسب موهای خشک و آسیب دیده تا 90% جلوگیری از آسیب مو و ترمیم موهای آسیب دیده حاوی گلوکونولاکتون",
                    color: "#113274",
                },
                {
                    title: "تقویت مو",
                    text: "شامپوی موهای ضعیف و شکننده تا 4 برابر ساقه‌ی موهایی قوی تر حاوی سرامید",
                    color: "#0F852F",
                },
            ],
        },
        purifying: {
            image: "intensive_repair_purifying.webp",
            descriptions: [
                {
                    title: "ترمیم مو",
                    text: "شامپو و نرم‌کننده مناسب موهای خشک و آسیب دیده تا 90% جلوگیری از آسیب مو و ترمیم موهای آسیب دیده حاوی گلوکونولاکتون",
                    color: "#113274",
                },
                {
                    title: "پاکسازی",
                    text: "شامپوی موهای چرب احیای تمیزی پوست و مو سر تشکیل شده از 90% مواد طبیعی",
                    color: "#EA8A07",
                },
            ],
        },
    },

    purifying: {
        default: {
            image: "purifying-T.webp",
            descriptions: [
                {
                    title: "پاکسازی",
                    text: "شامپوی موهای چرب احیای تمیزی پوست و مو سر تشکیل شده از 90% مواد طبیعی",
                    color: "#EA8A07",
                },
            ],
        },
        daily_moisture: {
            image: "purifying_daily_moisture.webp",
            descriptions: [
                {
                    title: "پاکسازی",
                    text: "شامپوی موهای چرب احیای تمیزی پوست و مو سر تشکیل شده از 90% مواد طبیعی",
                    color: "#EA8A07",
                },
                {
                    title: "رطوبت رسانی",
                    text: "شامپو و نرم‌کننده‌ای مناسب انواع موها رطوبت رسانی به پوست سر، احیا رطوبت ساقه ی مو حاوی گلیسیرین",
                    color: "#008999",
                },
            ],
        },
        hair_fall_rescue: {
            image: "purifying_hair_fall_rescue.webp",
            descriptions: [
                {
                    title: "پاکسازی",
                    text: "شامپوی موهای چرب احیای تمیزی پوست و مو سر تشکیل شده از 90% مواد طبیعی",
                    color: "#EA8A07",
                },
                {
                    title: "تقویت مو",
                    text: "شامپوی موهای ضعیف و شکننده تا 4 برابر ساقه‌ی موهایی قوی تر حاوی سرامید",
                    color: "#0F852F",
                },
            ],
        },
        intensive_repair: {
            image: "purifying_intensive_repair.webp",
            descriptions: [
                {
                    title: "پاکسازی",
                    text: "شامپوی موهای چرب احیای تمیزی پوست و مو سر تشکیل شده از 90% مواد طبیعی",
                    color: "#EA8A07",
                },
                {
                    title: "ترمیم مو",
                    text: "شامپو و نرم‌کننده مناسب موهای خشک و آسیب دیده تا 90% جلوگیری از آسیب مو و ترمیم موهای آسیب دیده حاوی گلوکونولاکتون",
                    color: "#113274",
                },
            ],
        },
    },
} as const;