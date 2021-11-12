"use strict";

let data = [
	{
		id: 0,
		name: '肥宅心碎賞櫻3日',
		imgUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80',
		area: '高雄',
		description: '賞櫻花最佳去處。肥宅不得不去的超讚景點！',
		group: 87,
		price: 1400,
		rate: 10
	},
	{
		id: 1,
		name: '貓空纜車雙程票',
		imgUrl: 'https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
		area: '台北',
		description: '乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感',
		group: 99,
		price: 240,
		rate: 2
	},
	{
		id: 2,
		name: '台中谷關溫泉會1日',
		imgUrl: 'https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
		area: '台中',
		description: '全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。',
		group: 20,
		price: 1765,
		rate: 7
	}
];

const addTicketForm = document.querySelector('.addTicket-form');
const addTicketBtn = document.querySelector('.addTicket-btn');
const regionSearch = document.querySelector(".regionSearch");

function addTicket() {
	// let ticketName			= document.querySelector('#ticketName').value;
	// let ticketImgUrl		= document.querySelector('#ticketImgUrl').value;
	// let ticketRegion		= document.querySelector('#ticketRegion').value;
	// let ticketPrice			= Number(document.querySelector('#ticketPrice').value);
	// let ticketNum			= Number(document.querySelector('#ticketNum').value);
	// let ticketRate			= Number(document.querySelector('#ticketRate').value);
	// let ticketDescription	= document.querySelector('#ticketDescription').value;

	// addTicketForm.forEach(element => {
	// 	console.log(element);
	// });
	for (let idx = 0; idx < addTicketForm.length; idx++) {
		if ( addTicketForm[idx].value === '' ) {
			console.log('請確認資訊是否輸入完全');
			return;
		}
		if ( addTicketForm[1].value.slice(0, 7) !== "http://" && addTicketForm[1].value.slice(0, 8) !== "https://" ) {
			console.log('請輸入正確網址');
			return;
		} else if ( addTicketForm[5].value < 1 || addTicketForm[5].value > 10 ) {
			console.log('套票星級為1~10');
			return;
		} else if ( addTicketForm[6].value.length > 100 ) {
			console.log('限 100 字');
			return;
		}
	}

	data.push({
		id:				data.length,
		name:			addTicketForm[1],
		imgUrl:			addTicketForm[2],
		area:			addTicketForm[3],
		description:	addTicketForm[7],
		group:			Number(addTicketForm[4]),
		price:			Number(addTicketForm[5]),
		rate:			Number(addTicketForm[6]),
	});

	renderData(data);
}

function renderData(data) {
	let structure = '';
	data.forEach(item => {
		console.log(item);
	});
}

addTicketBtn.addEventListener('click', (e) => {
	if (e.target.value !== "新增套票") {
		return
	}
	addTicket();
});

regionSearch.addEventListener("change", function () {
	console.log(regionSearch.value);
	if (regionSearch.value === "全部地區") {
		renderData(data);
		return;
	} else {
		const newData = data.filter(function (item) {
			return item["area"] == regionSearch.value;
		});
		renderData(newData);
	}
});  
