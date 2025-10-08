import {type Product} from "../types";  // Using path alias '@/' for 'src/'

export const products: Product[] = [
    {
        imgSrc: "/intensive_repair.jpg",
        title: "INTENSIVE REPAIR",
        description: "شامپو و نرم‌کننده مناسب موهای خشک و آسیب‌دیده‌دارای تکنولوژی ترمیم هدفمند \n" +
            "تا 90%  جلوگیری از آسیب مو و ترمیم موهای آسیب‌دیده‌ حاوی گلوکونولاکتون",
        hoverTitle: "مناسب موهای خشک و آسیب‌دیده",
        hoverDesc: "با تکنولوژی ترمیم هدفمند به بازسازی موها از ساقه مو کمک کرده تا در بلندمدت جلوه‌ای سلامت و پرنشاط داشته باشند.",
        hoverTextColor: "#113274"
    },
    {
        imgSrc: "/daily_moisture.jpg",
        title: "DAILY MOISTURE",
        description: "شامپو و نرم‌کننده‌ای مناسب انواع موها‌دارای کمپلکس pro-Moisture\n" +
            "رطوبت رسانی به پوست سر، احیا رطوبت ساقه‌ی مو‌ حاوی گلیسیرین",
        hoverTitle: "مناسب انواع موها",
        hoverDesc: "معجون مرطوب‌کننده حرفه‌ای pro-Moisture که مو را از درون ساقه سرشار می‌سازد و آن را مرطوب و مقاوم می‌کند تا جلوه پرنشاط موها را در بلندمدت نگه دارد.",
        hoverTextColor: "#008999"
    },
    {
        imgSrc: "/color_vibrancy.jpg",
        title: "COLOR VIBRANCY",
        description: "شامپو و نرم‌کننده‌ای مناسب موهای رنگ شده‌دارای تکنولوژی تثبیت رنگ \n" +
            "تا 90% جلوگیری از آسیب مو ناشی از رنگ شدگی مو ‌حاوی لایزین",
        hoverTitle: "مناسب موهای رنگ شده",
        hoverDesc: "دارای تکنولوژی تثبیت رنگ از موهای آسیب‌دیده و رنگ‌شده مراقبت می‌کند و سرزندگی و درخشش را به موها باز می‌گرداند.",
        hoverTextColor: "#D95D7E"
    },
    {
        imgSrc: "/hair_fail_rescue.jpg",
        title: "HAIR FALL RESCUE",
        description: "شامپوی موهای ضعیف و شکننده‌با قدرت ترمیم موها در بلند مدت\n" +
            "تا 4 برابر ساقه‌ی موهایی قوی‌تر ‌حاوی سرامید",
        hoverTitle: "مناسب موهای ضعیف و شکننده",
        hoverDesc: "با قدرت ترمیم موها در بلند مدت، تارهای مو را عمیقا مستحکم می‌سازد و مقاومتشان را در برابر موخوره افزایش می‌دهد. این شامپو با تقویت مو  ریزش ساقه را متوقف می‌کند.",
        hoverTextColor: "#0F852F"
    },
    {
        imgSrc: "/purifying.jpg",
        title: "PURIFYING",
        description: "شامپوی مناسب موهای چرب‌دارای تکنولوژی هیدرالیفت \n" +
            "احیای تمیزی پوست و مو سر تشکیل شده از 90% مواد طبیعی",
        hoverTitle: "مناسب موهای چرب",
        hoverDesc: "با تکنولوژی هیدرالیفت به موهای شما کمک می‌کند تا تعادل طبیعی را حفظ کنند. پس از هربار استفاده از این شامپو موهای شما سبک نرم و زیبا خواهندبود.",
        hoverTextColor: "#EA8A07"
    },
    {
        imgSrc: "/shea_butter_&_warm_vanilla_scent.jpg",
        title: "SHEA BUTTER & WARM VANILLA SCENT",
        description: "غنی شده به شی باتر و رایحه وانیل گرم",
        hoverTitle: "",
        hoverDesc: "این محصول، با ترکیب شی باتر و رایحه دل‌انگیز وانیل، ابری از کف کرمی و غنی می‌آفریند که دستان شما را نوازش کرده و لطافتی بی‌مثال به آن‌ها می‌بخشد.",
        hoverTextColor: "#9E553A"
    },
    {
        imgSrc: "/deeply_nourishing.jpg",
        title: "DEEPLY NOURISHING",
        description: "رطوبت‌رسان عمیق",
        hoverTitle: "مناسب موهای سست و شکننده",
        hoverDesc: "با فرمولاسیون لطیف و ملایم، غنی‌شده به یک‌چهارم کرم مرطوب‌کننده که با هر بار شست‌وشو دستان شما را نرم و لطیف می‌کند.",
        hoverTextColor: "#07255B"
    },
    {
        imgSrc: "/cucumber_&_green_tea_scent.jpg",
        title: "CUCUMBER & GREEN TEA SCENT",
        description: "غنی‌شده با رایحه خنک خیار و چای سبز",
        hoverTitle: "مناسب موهای آسیب دیده",
        hoverDesc: "این محصول با ترکیبی دلنشین از خیار و چای سبز، حس تازگی و سرزندگی را به دستان شما هدیه می‌دهد. به گونه‌ای که دستانتان نرم و لطیف می‌شود.",
        hoverTextColor: "#4A992C"
    },
    {
        imgSrc: "/deeply_nourishing_xl.jpg",
        title: "DEEPLY NOURISHING",
        description: "رطوبت‌رسان عمیق",
        hoverTitle: "رطوبت‌رسان عمیق",
        hoverDesc: "با فرمولاسیون لطیف و ملایم، غنی‌شده به یک‌چهارم کرم مرطوب‌کننده که با هر بار شست‌وشو دستان شما را نرم و لطیف می‌کند.",
        hoverTextColor: "#07255B"
    },
];