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

const ticketName		= addTicketForm.querySelector('#ticketName').value;
const ticketImgUrl		= addTicketForm.querySelector('#ticketImgUrl').value;
const ticketRegion		= addTicketForm.querySelector('#ticketRegion').value;
const ticketPrice		= Number(addTicketForm.querySelector('#ticketPrice').value);
const ticketNum			= Number(addTicketForm.querySelector('#ticketNum').value);
const ticketRate		= Number(addTicketForm.querySelector('#ticketRate').value);
const ticketDescription	= addTicketForm.querySelector('#ticketDescription').value;

function checkInput() {
	// 顯示必填欄位錯誤
	let formGroups = document.querySelectorAll('.form-group');
	let errorCount = 0;
	formGroups.forEach(element => {
		if ( element.firstElementChild.lastElementChild.value == '' ) {
			element.lastElementChild.style.display = 'flex';
			errorCount ++;
		} else {
			element.lastElementChild.style.display = 'none';
		}
	});
	if ( errorCount > 0 ) {
		alert('請確認輸入資料是否完整');
		return;
	}

	data.push({
		id:				data.length,
		name:			ticketName,
		imgUrl:			ticketImgUrl,
		area:			ticketRegion,
		description:	ticketDescription,
		group:			Number(ticketNum),
		price:			Number(ticketPrice),
		rate:			Number(ticketRate),
	});
	console.log(data);
}
addTicketBtn.addEventListener('click', (e) => {
	checkInput();
});

function getOption() {
	let value = document.querySelector(".regionSearch").value;
	console.log(value);
}
