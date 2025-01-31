export const PORT=4000
export const LOCATION:any=[
    {Logincheck:`https://sitesellinghub.com:${PORT}/api/customers/checkLogin`},
    {readItem:`https://sitesellinghub.com:${PORT}/api/items`},
    {updateItem:`https://sitesellinghub.com:${PORT}/api/items/`},
    {readPlate:`https://sitesellinghub.com:${PORT}/api/plate`},
    {readPlate_name:`https://sitesellinghub.com:${PORT}/api/plate/plate_on/`},
    {readKitchen:`https://sitesellinghub.com:${PORT}/api/kitchens`},
    {outAmount:`https://sitesellinghub.com:${PORT}/api/plate/outAmount/`},
    {readPlateOut:`https://sitesellinghub.com:${PORT}/api/plate/watchPlateOut/`},
    {inserIncome:`https://sitesellinghub.com:${PORT}/api/income/`},
    {outcome:`https://sitesellinghub.com:${PORT}/api/outcome/`},
    {difference:`https://sitesellinghub.com:${PORT}/api/difference/`},
    {differenceDaily:`https://sitesellinghub.com:${PORT}/api/difference/daily/`}
]

export interface incomeData{
    item_id:number;
    item_name:string;
    date_in:string;
    kitchen_name:string;
    kitchen_id:string;
    amount:number;
    token:string;
}