class bingoGame {
	constructor(boardClass, inputClass, messageClass){
		this.boardElement = document.querySelector(`.${boardClass}`)
		this.inputElement = document.querySelector(`.${inputClass}`)
		this.messageElement = document.querySelector(`.${messageClass}`)

		this.userBingo = []
		this.computerBingo = []
	}

	// 빙고 화면에 그리기 -> 나, 컴퓨터 빙고 array 만들기 1~25까지 숫자 랜덤으로 배치 후 5개씩 끊어서 빙고 array 생성
	createBingoArray() {
		let bingo = []

		for (let i = 0; i < 2; i++) {
			let tempArray = Array(25).fill().map((v, i) => i + 1);
			let bingoArray = tempArray.sort(() => Math.random() - 0.5);
			let bingoTable = []

			for (let j = 0; j < 5; j++){
				let bingoRow = bingoArray.splice(0, 5);
				bingoTable.push(bingoRow)
			}
			bingo.push(bingoTable)
		}
		this.userBingo = [...bingo[0]]
		this.computerBingo = [...bingo[1]]
	}

	// 내꺼 배열 가지고 화면에 그려주기
	createBingoGame() {
		this.createBingoArray();
		let wrapperElement = []
		this.userBingo.forEach((row) => {
			let rowElement = []
			rowElement.push('<div class="row">');
			row.forEach((col) => {
				rowElement.push(`
					<div class="col">${col}</div>
				`)
			})
			rowElement.push('</div>')
			wrapperElement.push(rowElement.join(''))
		})
		this.boardElement.innerHTML = wrapperElement.join('')
	}

	// 입력값 체크하기
	checkUserInput() {
		let userValue = this.inputElement.value;
		if (userValue === '') {
			this.showMessage('값을 입력해주세요')
			return;
		}
		if (isNaN(userValue) || userValue < 1 || userValue > 25) {
			this.showMessage('1부터 25 사이의 숫자를 입력해주세요')
			return; 
		}

		if (this.userBingo[0] === undefined) {
			this.showMessage('게임 시작!')
			return;
		}



		this.showMessage(userValue);
		console.log('?');
	}

	// 메시지 그려야징
	showMessage(message){
		this.messageElement.innerHTML = `${message}`
	}
}