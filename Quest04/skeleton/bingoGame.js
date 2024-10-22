class bingoGame {
	constructor(isRandom){
		this.messageElement = document.querySelector(`.bingo__message`)
		this.userBingoElement = document.querySelector('.board-user'); // 사용자 빙고 UI
		this.computerBingoElement = document.querySelector('.board-computer'); // 컴퓨터 빙고 UI
		this.userBingoCol = ''; // 사용자 빙고 Input 한 칸
		
		this.isRandomBingo = isRandom; // 사용자가 랜덤 보드판을 가질지 아닐지
		this.checkUserBingo = true;   // 사용자 빙고판에 문제가 없는지 (문제 없으면 true, 있으면 false)
		this.userBingo = []	// 사용자 빙고판
		this.computerBingo = [] // 컴퓨터 빙고판
		this.isShowComputer = false; // 컴퓨터 빙고판 보이는지
		
		this.checkComputerIdx = [] 

		this.isGameOver = false

		// 1~25까지 숫자 array - string으로 형변환 후 array에 저장
		this.numberArray = Array(25).fill().map((v, i) => (i + 1).toString()); 
	}
	
	// 게임시작 버튼 - 사용자용 input array에 저장하기, 컴퓨터용 array 생성하기, 컴퓨터용 화면 그리기
	// (사용자용 input array - 중복 숫자 없어야 함. 1~25이외의 숫자가 있으면 안됨)
	// 컴퓨터용 화면은 toggle로 보일지 말지 선택하게 (기본값은 보이게 하기)
	createBingoGame(isRandom){
		
		// 게임 초기화 추가하기 + 빙고 칸 비우기
		this.isGameOver = false
		this.showMessage('')
		
		// 게임이 시작 되었을 경우
		if (this.userBingo[0] !== undefined) {
			this.showMessage('게임이 진행중입니다!')
			return;
		}
		
		// 사용자가 랜덤 빙고를 선택하지 않았을 경우 
		if (isRandom === false) { 
			this.saveUserArray() // - 사용자가 입력한 빙고판 저장
			this.checkUserArray(); // 사용자가 입력한 빙고판에 문제가 없는지 체크

			// 사용자가 입력한 빙고판에 문제가 있으면 - 사용자 빙고 클리어 / 이후 함수 진행하지 않음.
			if (this.checkUserBingo === false) {  
				this.userBingo = [];  
				console.log(this.userBingo, '비워졌나')
				return;
			}
		} else {
			this.createBingo(this.userBingoElement, this.userBingo)
		}

		// 컴퓨터 화면이 필요없어지면 주석 + HTML 삭제
		this.createBingo(this.computerBingoElement, this.computerBingo)
		this.showMessage('게임을 시작합니다!')

		// 빙고 한칸 클릭 시 게임 동작 
		this.userBingoCol = document.querySelectorAll('.board-user .col')
		this.userBingoCol.forEach((col) => {
			col.setAttribute('readonly', true)  // 게임 시작을 누른 후 수정할 수 없게 함.
			col.addEventListener('click', (e) => {
				this.bingoGameStart(e.target.value);
			})
		})
	}

	// 사용자 입력란에 있는 값 array에 저장하기
	saveUserArray(){
		let userBingoRow = this.userBingoElement.children;
		for (let i = 0; i < 5; i++){
			let row = userBingoRow[i]
			let rowValue = []
			for (let j = 0; j < 5; j++){
				rowValue.push(row.children[j].value)
			}
			this.userBingo.push(rowValue)
		}
	}

	// 사용자가 입력한 빙고칸 검사하기
	checkUserArray() {	
		let tempArray = []
		for (let i = 0 ; i < 5; i++){
			for (let j = 0; j < 5; j++){
				tempArray.push(this.userBingo[i][j])
			}
		}

		for (let i = 0; i < tempArray.length; i++){
			let checkNumber = tempArray[i]

			if (checkNumber === NaN || isNaN(checkNumber)){ // 숫자가 아닌 값이 왔을 때
				this.showMessage('모든 칸에 숫자를 입력해주세요.')
				this.checkUserBingo = false
				return; 
			}
			if (checkNumber === '' || checkNumber === undefined) { // 빈칸이 있을 때
				this.showMessage('빈칸을 확인해주세요.')
				this.checkUserBingo = false
				return;
			} 
			if (checkNumber < 1 || checkNumber > 25) { // 1~25 이외의 숫자를 만들었을 때
				this.showMessage('1~25 사이의 숫자를 입력해주세요.')
				this.checkUserBingo = false
				return;
			}

			// tempArray에서 중복되는 숫자가 있는지 체크
			let dupliArray = tempArray.slice();
			dupliArray.splice(i, 1); 

			for (let j = 0; j < dupliArray.length; j++){
				if (checkNumber === dupliArray[j]) {
					this.showMessage('중복된 숫자가 없는지 확인해주세요.')
					this.checkUserBingo = false
					return;
				}
			}
		}

		// 아무 문제 없으면 true
		this.checkUserBingo = true;
	}
	
	/**
	 * 랜덤 빙고판 만들기 - 1~25까지 숫자를 랜덤으로 배치해서 화면에 그려줌
	 * @param {String} element - 빙고판 UI wrapper 엘리먼트
	 * @param {Array} array - 1~25까지 숫자를 랜덤으로 배치할 빙고판 (userBingo or ComputerBingo)
	 */
	createBingo(element, array) {
		let tempArray = this.numberArray.slice();
		let bingoArray = tempArray.sort(() => Math.random() - 0.5);

		// 1~25까지 숫자를 이중배열에 저장
		for (let j = 0; j < 5; j++){
			let bingoRow = bingoArray.splice(0, 5);
			array.push(bingoRow)
		}

		// 위에서 저장한 가지고 빙고 화면 그리기 - params로 받아온 부모 엘리먼트에 넣어줌.
		let parentElement = element
		
		let wrapperElement = []
		array.forEach((row) => {
			let rowElement = []
			rowElement.push('<div class="row">');
			row.forEach((col) => {
				rowElement.push(`
					<input type="text" class="col" value="${col}" readonly />
				`)
			})
			rowElement.push('</div>')
			wrapperElement.push(rowElement.join(''))
		})
		parentElement.innerHTML = wrapperElement.join('')
		
		// 컴퓨터 빙고는 클릭 못하게 방지 +_+
		if (element === this.computerBingoElement){ 
			this.isShowComputer = true; // 컴퓨터 빙고판 보이는지 체크

			let modalBg = document.createElement('div')
			modalBg.classList.add('modal__none')
			parentElement.append(modalBg)
		}
	}


	
	/**
	 * 입력값 체크 한 후 화면에 표시하기
	 */
	bingoGameStart(value) {
		// 사용자가 입력한 값을 숫자로 변경
		let userValue = value
		
		// 사용자가 입력한 값 확인, 화면에 표시, 컴퓨터 값을 받을때까지 입력 방지
		this.checkBingoNumber(userValue, `사용자: ${userValue} || 컴퓨터의 선택을 기다려주세요.`)

		// 게임이 종료하면 사용자는 입력 자체가 막히는데, 컴퓨터는 아래 함수를 실행하니까 조건 추가....
		if (this.isGameOver === false){
			// 사용자가 입력 한 후 1초 후에 컴퓨터가 부른값 표시, 확인 
			setTimeout(() => {
				let computerValue = this.getComputerValue()
				this.checkBingoNumber(computerValue, `컴퓨터: ${computerValue} || 다음 숫자를 선택해주세요.`)
			}, 1000)
		}
	}

	/**
	 * 빙고 값 확인 -> 확인된 번호는 0으로 변경 / 화면은 색상만 변경되게 
	 * @param {Number} value 
	 * @param {String} message 
	 */
	checkBingoNumber(value, message){
		
		for (let i = 0 ; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				if (this.userBingo[i][j] === value){
					this.userBingo[i][j] = 0
					this.updateBingoBoard(this.userBingoElement, i, j);
				}
				if (this.computerBingo[i][j] == value){
					this.checkComputerIdx = [] // 컴퓨터 빙고판에서는 어떤 idx를 갖는지 체크
					this.computerBingo[i][j] = 0
					this.checkComputerIdx.push(i, j)

					// 컴퓨터 빙고판이 화면에 보여졌을때만 update 실행
					if (this.isShowComputer === true){ 
						this.updateBingoBoard(this.computerBingoElement, i, j);
					}
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

	/**
	 * 화면에 값 변경해주기
	 * @param {String} element - 부모 엘리먼트 
	 * @param {Number} row - 빙고 row 번호
	 * @param {Number} col - 빙고 col 번호
	 */
	updateBingoBoard(element, row, col){
		let parentElement = element
		let bingoRow = parentElement.children[row];
		let bingoCol = bingoRow.children[col]
		bingoCol.classList.add('col__select')
	}

	/**
	 * 줄 수 체크하기 -> 승리조건 체크 - 가로 전부 0 or 세로 전부 0 or 대각선이 전부 0 
	 * @param {String} player - 현재 게임중인 플레이어
	 * @param {Array} bingoArray - 현재 게임중인 플레이어의 빙고판
	 */
	checkBingoLine(player, bingoArray){
		// let horCountArray = [];
		// let verCountArray = [];
		let bingoLineCount = 0;  // 5개 이상이면 승리
		
		// 가로로 같을때
		bingoArray.forEach((row) => {
			let horCount = 0;
			row.forEach((col) => {
				if (col === 0) horCount++;
			})
			// horCountArray.push(horCount)
			if (horCount === 5) bingoLineCount++;
		})

		// 세로로 같을때
		for (let i = 0; i < bingoArray.length; i++){
			let verCount = 0;
			for (let j = 0; j < bingoArray.length; j++){
				if (bingoArray[j][i] === 0) verCount++;
			}
			// verCountArray.push(verCount)
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

		// 방법 1:: 컴퓨터 승률 너무 떨어져서 주석처리 
		// let result = {
		// 	verCount: verCountArray,
		// 	horCount: horCountArray,
		// 	tlToBrCount: [tlToBrCount],
		// 	trToBlCount: [trToBlCount]
		// }
		// return result; 
	}

	
	/**
	 * 컴퓨터가 부르는 값 확인하기
	 * @returns computerValues 
	 */
	getComputerValue(){
		let computerValue; // 컴퓨터가 부르는 값
		let computerNumberArray = [] // 컴퓨터가 가질 수 있는 값


		// 방법 1:: 컴퓨터 승률 너무 떨어져서 주석처리 
		// let returnLine = '';
		// let returnNum = 0;

		// // 각 줄에 0이 몇개씩 있는지 체크한 후 한 어레이에 담기 -> 내림차순 정렬 후 0번 추출
		// let countResult = this.checkBingoLine('', this.computerBingo)
		// let countList = countResult.horCount.concat(countResult.verCount)
		// countList.push(countResult.tlToBrCount, countResult.trToBlCount);
		// countList.sort((a, b)=>(b - a)); // 내림차순 정렬

		// // 가장 큰 값을 가지고 있는 항목(가로, 세로, 대각선)의 n번째 줄 찾기
		// Object.keys(countResult).forEach((countArray) => {
		// 	let checkCount = countResult[countArray].findIndex((count) => count === countList[0])
		// 	if (checkCount < 0) {
		// 		return;
		// 	}
		// 	if (checkCount >= 0 && checkCount < 5) {
		// 		console.log('checkcount', checkCount)
		// 		returnLine = countArray.toString();
		// 		returnNum = checkCount;
		// 		return false;
		// 	}
		// })

		// if (returnLine === 'horCount') { // 컴퓨터 배열의 가로 줄에서 찾을 경우.
		// 	let horNumber = this.computerBingo[returnNum].slice();
		// 	let value = horNumber.filter((value) => {
		// 		return value !== 0
		// 	})
		// 	console.log(value)
		// 	computerValue = value[0]

		// } else if (returnLine === 'verCount') { // 컴퓨터 배열의 세로줄에서 찾을 경우.
		// 		let verNumber = []
		// 		for (let i = 0; i < 5; i++) { 
		// 			verNumber.push(this.computerBingo[i][returnNum])
		// 		}
		// 		let value = verNumber.filter((value) => {
		// 			return value !== 0
		// 		})
		// 		console.log(value)
		// 		computerValue = value[0]
		// } else { // 둘 다 아니면 랜덤숫자
		// 	console.log(returnLine, returnNum)
		// 	let computerNumberArray = this.numberArray.slice();
		// 	computerValue = computerNumberArray.sort(() => 0.5 - Math.random())[0]
		// }
		// return computerValue;

		// if (computerNumberArray.length > 0) {
		// 	computerValue = computerNumberArray[Math.floor(Math.random() * computerNumberArray.length)]
		// } else {
			computerNumberArray = this.numberArray.slice();
			computerValue = computerNumberArray.sort(() => 0.5 - Math.random())[0]
		// }

		return computerValue;
	}


	/**
	 * 게임종료
	 * @param {String} player 
	 */
	gameOver(player){
		this.isGameOver = true;

		this.showMessage(`게임이 종료되었습니다. :: ${player} 승리!`)
		this.numberArray = Array(25).fill().map((v, i) => i + 1); 

		// 빙고판 리셋
		this.userBingo = []
		this.computerBingo = []
	}




	// 메시지 그려야징
	showMessage(message){
		this.messageElement.innerHTML = `${message}`
	}
}