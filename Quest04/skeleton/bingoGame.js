class bingoGame {
	constructor(boardClass, inputClass, messageClass){
		this.boardElement = document.querySelector(`.${boardClass}`)
		this.inputElement = document.querySelector(`.${inputClass}`)
		this.messageElement = document.querySelector(`.${messageClass}`)

		this.userBingo = []
		this.computerBingo = []
		
		this.isGameOver = false

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

	// 게임 시작 버튼을 눌렀을 때
	createBingoGame() {
		// 게임이 시작 되었을 경우
		if (this.userBingo[0] !== undefined) {
			this.showMessage('게임이 진행중입니다!')
			return;
		}

		// 메시지 영역 비우기, 빙고 array 생성해주기, 입력창 입력가능하게 하기
		this.showMessage(' ')
		this.createBingoArray();
		this.inputElement.removeAttribute('disabled');

		// 내꺼 화면그리기
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

	// TODO: 유효성 검사하기
	// 입력값 체크하기
	checkValue() {
		let userValue = parseInt(this.inputElement.value);
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
		// 입력한 숫자가 this.numberArray안에 없을 때
		if (this.numberArray.includes(userValue) === false) {
			this.showMessage('이미 선택된 숫자입니다. 다른 숫자를 입력해주세요')
			return;
		}

		// 사용자가 입력한 값 확인, 화면에 표시, 컴퓨터 값을 받을때까지 입력 방지
		this.checkBingoNumber(userValue, `사용자: ${userValue} || 컴퓨터의 선택을 기다려주세요.`)
		this.inputElement.value = '';
		this.inputElement.setAttribute('disabled', true);

		// 게임이 종료하면 사용자는 입력 자체가 막히는데, 컴퓨터는 아래 함수를 실행하니까 조건 추가....
		if (this.isGameOver === false){
			// 사용자가 입력 한 후 3초 후에 컴퓨터가 부른값 표시, 확인 
			setTimeout(() => {
				this.inputElement.removeAttribute('disabled');
				let computerValue = this.getComputerValue()
				this.checkBingoNumber(computerValue, `컴퓨터: ${computerValue} || 다음 숫자를 입력해주세요.`)
			}, 3000)
		}
	}

	// 빙고 값 확인 -> 확인된 번호는 0으로 변경 / 화면은 색상만 변경되게 
	checkBingoNumber(value, message){
		for (let i = 0 ; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				if (this.userBingo[i][j] === value){
					this.userBingo[i][j] = 0
					this.updateBingoBoard(i, j);
				}
				if (this.computerBingo[i][j] === value){
					this.computerBingo[i][j] = 0
				}
				this.showMessage(message);
			}
		}
		// value 값 제외하기
		this.numberArray = this.numberArray.filter((e) => e !== value)
		
		// 빙고 줄 수 확인하기
		this.checkBingoLine('나+_+', this.userBingo)
		this.checkBingoLine('컴퓨터', this.computerBingo)
	}

	// 컴퓨터가 부르는 값 -> 현재 가능한 숫자중에 랜덤값 리턴
	getComputerValue(){
		console.log(this.numberArray)
		let computerNumberArray = this.numberArray.slice();
		let computerValue = computerNumberArray.sort(() => 0.5 - Math.random())[0]
		console.log(typeof(computerValue))
		return computerValue;
	}

	// 화면에 값 변경해주기.
	updateBingoBoard(row, col){
		let bingoRow = document.getElementsByClassName('row')[row];
		let bingoCol = bingoRow.children[col]
		bingoCol.classList.add('col__select')
	}

	// 줄 수 체크하기 -> 승리조건 체크 - 가로 전부 0 or 세로 전부 0 or 대각선이 전부 0 
	checkBingoLine(player, bingoArray){
		let bingoLineCount = 0;  // 5개 이상이면 승리
		
		// 가로로 같을때
		bingoArray.forEach((row) => {
			let horCount = 0;
			row.forEach((col) => {
				if (col === 0) horCount++;
			})
			if (horCount === 5) bingoLineCount++;
		})

		// 세로로 같을때
		for (let i = 0; i < bingoArray.length; i++){
			let verCount = 0;
			for (let j = 0; j < bingoArray.length; j++){
				if (bingoArray[j][i] === 0) verCount++;
			}
			if (verCount === 5) bingoLineCount++;
		}

		// 대각선이 전부 같을 때
		let tlToBrCount = 0; // 왼위 -> 오아 방향 대각선 카운트
		let trToBlCount = 0; // 오위 -> 왼아 방향 대각선 카운트
		for (let i = 0; i < bingoArray.length; i++){
			
			// 대각선 방향 카운트
			if (bingoArray[i][i] === 0) tlToBrCount++;
			if (bingoArray[i][4 - i] === 0) trToBlCount++;

			// 대각선 각 방향 전부 체크되면 빙고 줄 수 증가
			if (tlToBrCount === 5) bingoLineCount++
			if (trToBlCount === 5) bingoLineCount++
		}

		// 줄 수가 5개가 되면 gameOver! 
		if (bingoLineCount === 5) {
			this.gameOver(player)
		}
	}

	// 게임종료
	gameOver(player){
		this.isGameOver = true;

		this.showMessage(`게임이 종료되었습니다. :: ${player} 승리!`)
		this.inputElement.setAttribute('disabled', true); // 입력방지

		// 빙고판 리셋
		this.userBingo = []
		this.computerBingo = []
	}

	// 메시지 그려야징
	showMessage(message){
		this.messageElement.innerHTML = `${message}`
	}
}