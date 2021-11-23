const frontend_data = 'https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json?token=AAQWFQDSNRRXC6FBW7PDSETBOESVW';
let data = [];
let piecework = [];
let gender = {
	'男性': 0,
	'女性': 0
}

function obj2ary(obj) {
	return Object.keys(obj).map((key) => [key, obj[key]]);
}

axios.get(frontend_data)
.then(response => {
	data = response.data;

	// 1. 長條圖: 接案公司的薪資滿意度
	let salaryObj = {};
	let salaryAry = ['分數'];
	data.forEach(item => {
		if ( item.company.industry === '接案公司' ) {
			if ( salaryObj[item.company.salary_score] === undefined ) {
				salaryObj[item.company.salary_score] = 0;
			}
			salaryObj[item.company.salary_score]++;
		}
	})
	obj2ary(salaryObj).forEach(item => {
		salaryAry.push(item[1])
	})
	c3.generate({
		bindto: '#chart-piecework',
		data: {
			type: 'bar',
			columns: [salaryAry],
			colors: {
				'分數': '#aea3cd'
			}
		},
		axis: {
			x: {
				type: 'category',
				categories: salaryObj
			},
			y: {
				label: '滿意度'
			},
		},
	})

	// 2. 長條圖: 抓取博弈、電商公司兩個產業滿意度的平均分數
	let industryData = [];
	data.forEach((item, idx) => {
		if (item.company.industry.includes('博奕') || item.company.industry.includes('博弈')) {
			if(industryData['博弈'] === undefined) {
				industryData['博弈'] = []
			}
			industryData['博弈'].push(item.company.score)
		}
		if (item.company.industry.includes('電商') || item.company.industry.includes('電子商務')) {
			if(industryData['電商'] === undefined) {
				industryData['電商'] = []
			}
			industryData['電商'].push(item.company.score)
		}
	})
	let industryScore = {
		'博弈': 0,
		'電商': 0
	}
	Object.keys(industryData).forEach(element => {
		let avgScore = 0;
		industryData[element].forEach(item => {
			avgScore += Number(item);
		});
		industryScore[element] = Math.round(avgScore / (industryData[element].length) * 100) / 100;
	});
	c3.generate({
		bindto: '#chart-game-ecommerce',
		data: {
			type: 'bar',
			columns: obj2ary(industryScore),
			colors: {
				博弈: '#f5df4e',
				電商: '#949398'
			},
		},
	})

	// 3. 圓餅圖: 撈取男性跟女性比例有多少
	data.forEach(item => {
		if ( item.gender === '男性' ) {
			gender.男性 ++;
		} else {
			gender.女性 ++;
		}
	})
	c3.generate({
		bindto: '#chart-gender',
		data: {
			type: 'pie',
			columns: obj2ary(gender),
			colors: {
				男性: '#8aacd3',
				女性: '#f3a1bd'
			},
		},
	})

	// 4. 圓餅圖: 顯示薪水區間分佈
	let salaryDistributionObj = {};
	data.forEach(item => {
		if ( salaryDistributionObj[item.company.salary] === undefined ) {
			salaryDistributionObj[item.company.salary] = 0;
		}
		salaryDistributionObj[item.company.salary]++;
	})
	console.log(obj2ary(salaryDistributionObj));
	c3.generate({
		bindto: '#chart-salary-distribution',
		data: {
			type: 'pie',
			columns: obj2ary(salaryDistributionObj),
		},
		color: {
			pattern: ['#c1beb6', '#aea3cd', '#f3a1bd', '#f5df4e', '#949398', '#8aacd3', '#01559a', '#019db1', '#d25c78', '#f1ede9', '#924684', '#5960a0', '#998354']
		}
	})
})
.catch((error) => {
	alert('資料讀取錯誤，請稍後再試');
	console.error(error);
});
