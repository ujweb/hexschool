const travelApi = 'https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json?token=AAQWFQDSNRRXC6FBW7PDSETBOESVW';
let data = [];
// let variant = {
//     male: 0,
//     female: 0,
// }

axios.get(travelApi)
.then(response => {
	data = response.data;

    // 撈出公司資訊
    let companyData = []
    data.forEach(item => {
        companyData.push(item.company)
    })
    // 抓取產業資訊 => 薪資滿意度、產業滿意度
    let industryData = []
    data.forEach(item => {
        let industryName = item.company.industry
        if (!industryData.some(el => el.industryName === industryName)) {
            console.log(industryName);
        };
    })
})
.catch((error) => {
	alert('資料讀取錯誤，請稍後再試');
	console.error(error);
});

