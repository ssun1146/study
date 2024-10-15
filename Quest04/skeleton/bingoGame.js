class bingoGame {
	constructor(boardClass, inputClass, messageClass){
		this.boardElement = document.querySelector(`.${boardClass}`)
		this.inputElement = document.querySelector(`.${inputClass}`)
		this.messageElement = document.querySelector(`.${messageClass}`)

		this.userBingo = []
		this.computerBingo = []

		// 1~25까지 숫자 array
		this.numberArray = Array(25).fill().map((v, i) => i + 1); 
	}

	// 빙고 화면에 그리기 -> 나, 컴퓨터 빙고 array 만들기 1~25까지 숫자 랜덤으로 배치 후 5개씩 끊어서 빙고 array 생성
	createBingoArray() {
		let bingo = []

		for (let i = 0; i < 2; i++) {
			let tempArray = this.numberArray.slice();
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
	checkValue() {
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
			this.showMessage('게임 시작!을 눌러주세요')
			return;
		}

		// 사용자가 입력한 값 확인, 화면에 표시, 컴퓨터 값을 받을때까지 입력 방지
		this.checkBingoNumber(userValue, `사용자: ${userValue} || 컴퓨터의 선택을 기다려주세요.`)
		this.inputElement.value = '';
		this.inputElement.setAttribute('disabled', true);

		// 사용자가 입력 한 후 3초 후에 컴퓨터가 부른값 표시, 확인 
		// 콘솔에 찍힌 값 이상한데 승리조건 체크할때 확인하기
		setTimeout(() => {
			this.inputElement.removeAttribute('disabled');
			let computerValue = this.getComputerValue()
			this.checkBingoNumber(computerValue, `컴퓨터: ${computerValue} || 다음 숫자를 입력해주세요.`)
		}, 3000)
	}

	// 빙고 값 확인 -> 확인된 번호는 0으로 변경 / 화면에 표시 
	checkBingoNumber(value, message){
		for (let i = 0 ; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				if (this.userBingo[i][j].toString() === value.toString()){
					this.userBingo[i][j] = 0
					this.updateBingoBoard(i, j);
					console.info('user', this.userBingo)
				}
				if (this.computerBingo[i][j].toString() === value.toString()){
					this.computerBingo[i][j] = 0
					console.info('computer', this.computerBingo)
				}
				this.showMessage(message);
			}
		}
		// 빙고 줄 수 확인하기
		// this.checkBingoLine()
		
		// value 값 제외하기
		this.numberArray = this.numberArray.filter((e) => e != value)
	}

	// 컴퓨터가 부르는 값 -> 현재 가능한 숫자중에 랜덤값 리턴
	getComputerValue(){
		let computerNumberArray = this.numberArray.slice();
		let computerValue = computerNumberArray.sort(() => 0.5 - Math.random())[0]
		return computerValue;

		// 조건 -> numberArray에 있는 숫자임(ㅇㅋㅇㅋ)
		// 마지막으로 보내준 userValue랑..? 같은 [i][]를 갖거나 같은 [][i]를 가짐
		// 그런 숫자가 없으면 랜덤
	}

	// 화면에 값 변경해주기.
	updateBingoBoard(row, col){
		let bingoRow = document.getElementsByClassName('row')[row];
		let bingoCol = bingoRow.children[col]
		bingoCol.classList.add('col__select')
	}

	// 줄 수 체크하기
	// -> 승리조건 체크? ( 가로로 전부 같거나 / 세로로 전부 같거나 / 대각선이 전부 체크되었거나 )
	// 승리조건으로 체크.
	checkBingoLine(){
		let bingoRowCount = 0;  // 5개 이상이면 승리
		
		// 가로로 같을때
		this.userBingo.forEach((row) => {
			let colCount = 0;
			
			row.forEach((col) => {
				if (col === 0) colCount++;
			})
			if (colCount === 5) bingoRowCount++;
		})

		// 세로로 같을때
		for (let i = 0; i < this.userBingo.length; i++){
			let rowCount = 0;
			for (let j = 0; j < this.userBingo.length; j++){
				// console.log(`row[${j}][${i}]`, this.userBingo[j][i])
				if (this.userBingo[j][i] === 0) rowCount++;
			}
			if (rowCount === 5) bingoRowCount++;
		}

		// 대각선

	}


	// 메시지 그려야징
	showMessage(message){
		this.messageElement.innerHTML = `${message}`
	}
}