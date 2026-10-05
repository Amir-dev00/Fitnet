/** ONLY illustrative locations: these are not verified gyms or Fitnet partners.
 * Add real venues here using verified latitude/longitude, then set isDemo:false.
 * Basemap bounds: longitude 51.20–51.60, latitude 35.60–35.83.
 */
export type Venue = {
 id:string; number:string; name:string; neighborhood:string;
 facilities:readonly string[]; entryWindow:string; credits:string;
 availability:"موجود"|"محدود"|"تکمیل"; status:"available"|"limited"|"full";
 eligibility:string; longitude:number; latitude:number; isDemo:boolean;
};
export const DEMO_VENUES: readonly Venue[] = [
 {id:"sample-1",number:"۱",name:"باشگاه نمونه ۱",neighborhood:"موقعیت نمایشی در تهران",facilities:["بدنسازی","کمد","دوش"],entryWindow:"۱۶:۰۰ تا ۲۰:۰۰",credits:"۸",availability:"موجود",status:"available",eligibility:"ویژهٔ آقایان",longitude:51.405,latitude:35.720,isDemo:true},
 {id:"sample-2",number:"۲",name:"باشگاه نمونه ۲",neighborhood:"موقعیت نمایشی در تهران",facilities:["تمرین هوازی","کمد","دوش"],entryWindow:"۱۰:۰۰ تا ۱۴:۰۰",credits:"۶",availability:"محدود",status:"limited",eligibility:"ویژهٔ آقایان",longitude:51.345,latitude:35.737,isDemo:true},
 {id:"sample-3",number:"۳",name:"باشگاه نمونه ۳",neighborhood:"موقعیت نمایشی در تهران",facilities:["تمرین قدرتی","کمد","پارکینگ"],entryWindow:"۱۸:۰۰ تا ۲۲:۰۰",credits:"۱۰",availability:"تکمیل",status:"full",eligibility:"ویژهٔ آقایان",longitude:51.467,latitude:35.742,isDemo:true},
];
