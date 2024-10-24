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
		
		this.gameResult = document.querySelector('.gamer__result');
		this.isGameOver = false

		// 1~25까지 숫자 array - string으로 형변환 후 array에 저장
		this.numberArray = Array(25).fill().map((v, i) => (i + 1).toString()); 
	}
	
	/**
	 * 입력완료 버튼을 눌렀을때 
	 * 		- 게임이 시작중이면 메시지 띄우기
	 * 		- 사용자와 컴퓨터의 빙고 Array와 빙고UI를 만들어줌.
	 * 		- 사용자가 빙고UI의 각 버튼을 클릭할 경우, bingoGameStart() 메소드 시작
	 * @param {Boolean} _isRandom - 사용자가 랜덤빙고를 선택했는지 체크하는 항목
	 * @returns 
	 */
	createBingoGame(_isRandom){
		// 게임 초기화 추가하기 + 빙고 칸 비우기
		this.isGameOver = false
		this.showMessage('')
		
		// 게임이 시작 되었을 경우
		if (this.userBingo[0] !== undefined) {
			this.showMessage('게임이 진행중입니다!')
			return;
		}
		
		// 사용자가 랜덤 빙고를 선택하지 않았을 경우 
		if (_isRandom === false) { 
			this.saveUserArray() // - 사용자가 입력한 빙고판 저장
			this.checkUserArray(); // 사용자가 입력한 빙고판에 문제가 없는지 체크

			// 사용자가 입력한 빙고판에 문제가 있으면 - 사용자 빙고 클리어 / 이후 함수 진행하지 않음.
			if (this.checkUserBingo === false) {  
				this.userBingo = [];  
				return;
			}
		} else {
			// 랜덤으로 빙고 UI 만들어줌.
			this.createBingo(this.userBingoElement, this.userBingo)
		}

		this.createBingo(this.computerBingoElement, this.computerBingo)
		// this.createBingo('', this.computerBingo) // 컴퓨터 화면이 필요 없어지면 부모 엘리먼트 삭제
		this.showMessage('게임을 시작합니다!')

		// 선공 체크
		this.checkFirstGamer();

		// 빙고 한칸 클릭 시 게임 동작 
		this.userBingoCol = document.querySelectorAll('.board-user .col')
		this.userBingoCol.forEach((col) => {
			col.setAttribute('readonly', true)  // 게임 시작을 누른 후 수정할 수 없게 함.
			col.addEventListener('click', (e) => {
				this.bingoGameStart(e.target.value, 'user');
			})
		})
	}

	/**
	 * 사용자 입력란에 있는 값 array에 저장하기
	 * 		- 사용자 빙고 UI에 입력된 value값을 this.userBingo에 저장
	 * 		- String으로 저장됨
	 */
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

	/**
	 * 사용자가 입력한 빙고칸 검사
	 * 		- 숫자가 아닌경우, 빈칸이 있을경우, 1~25 이외의 숫자를 입력했을 경우, 중복되는 숫자가 있을 경우
	 * 		- 문제가 있을경우 this.checkUserBingo - false로 변경 
	 * 		- 문제가 있을경우, 상황에 맞는 메시지 출력
	 * @returns 
	 */
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

		// 사용자용 - 클릭방지 모달 만들기
		let modalBg = document.createElement('div')
		modalBg.classList.add('modal__none')
		this.userBingoElement.append(modalBg)

		// 아무 문제 없으면 true
		this.checkUserBingo = true;
	}
	
	/**
	 * 랜덤 빙고판 만들기 - 1~25까지 숫자를 랜덤으로 배치해서 화면에 그려줌
	 * @param {String} _bingoElement - 빙고판 UI wrapper 엘리먼트
	 * @param {Array} _bingoArray - 1~25까지 숫자를 랜덤으로 배치할 빙고판 (userBingo or ComputerBingo)
	 */
	createBingo(_bingoElement, _bingoArray) {
		let tempArray = this.numberArray.slice();
		let bingoArray = tempArray.sort(() => Math.random() - 0.5);

		// 1~25까지 숫자를 이중배열에 저장
		for (let j = 0; j < 5; j++){
			let bingoRow = bingoArray.splice(0, 5);
			_bingoArray.push(bingoRow)
		}

		// 부모 엘리먼트가 지정되지 않았을 경우 return;
		if (_bingoElement === ''){
			return; 
		}
		
		// 위에서 저장한 가지고 빙고 화면 그리기 - params로 받아온 부모 엘리먼트에 넣어줌.
		let parentElement = _bingoElement
		
		let wrapperElement = []
		_bingoArray.forEach((row) => {
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
		
		// 클릭방지용 모달 추가
		let modalBg = document.createElement('div')
		modalBg.classList.add('modal__none')
		parentElement.append(modalBg)

		// 컴퓨터 빙고는 클릭 못하게 방지 +_+
		if (_bingoElement === this.computerBingoElement){ 
			this.isShowComputer = true; // 컴퓨터 빙고판 보이는지 체크
		}
		// 사용자 빙고는 클릭 가능 
		if (_bingoElement === this.userBingoElement){
			modalBg.style.display = 'none';
		}
	}
	
	/**
	 * 입력값 체크
	 * 		- 사용자가 입력한 값 체크하고 1초 후에 컴퓨터가 선택한 숫자를 체크함.
	 * 		- isGameOver = false 일때만 컴퓨터가 선택한 숫자를 체크
	 * @param {String} _selectedValue - 사용자가 선택한 숫자
	 * @param {String} _gamer - 현재 게임중인 게이머
	 */
	bingoGameStart(_selectedValue, _gamer) {
		// 사용자가 입력한 값을 숫자로 변경
		let userValue = _selectedValue
		let userBingoModal = document.querySelector('.board-user .modal__none')
		
		if (_gamer !== 'computer'){
			// 사용자가 입력한 값 확인, 화면에 표시, 컴퓨터 값을 받을때까지 입력 방지
			this.checkBingoNumber(userValue, `사용자: ${userValue} || 컴퓨터의 선택을 기다려주세요.`)
		}

		// 사용자 빙고 클릭방지.
		userBingoModal.style.display = 'block';

		// 게임이 종료하면 사용자는 입력 자체가 막히는데, 컴퓨터는 아래 함수를 실행하니까 조건 추가....
		if (this.isGameOver === false){
			// 사용자가 입력 한 후 1초 후에 컴퓨터가 부른값 표시, 확인 
			setTimeout(() => {
				userBingoModal.style.display = 'none';
				let computerValue = this.getComputerValue()
				this.checkBingoNumber(computerValue, `컴퓨터: ${computerValue} || 다음 숫자를 선택해주세요.`)
			}, 1000)
		}
	}

	/**
	 * 선공체크하기 
	 *  - 사용자가 선택한 값에 따라 선공
	 */
	checkFirstGamer(){
		// 화면에 UI 띄우기
		let firstGamerUI = document.querySelector('.gamer');
		firstGamerUI.style.display = 'block';

		// 게임순서 1, 2 를 랜덤으로 섞어서 버튼 UI에 추가해주기
		let gameOrder = ['1', '2'];
		gameOrder.sort(() => Math.random() - 0.5);

		let gamerBtnUI = document.querySelector('.gamer__btn');
		gamerBtnUI.innerHTML = `
			<button class="gamer-${gameOrder[0]}">${gameOrder[0]}</button>
			<button class="gamer-${gameOrder[0]}">${gameOrder[1]}</button>
		`

		let gamerBtn = document.querySelectorAll('.gamer__btn button');
		let firstGamer = ''

		// 선택한 항목을 보여주고, 사용자가 1을 선택했을경우 사용자가 선플레이어
		gamerBtn.forEach((button) => {
			button.addEventListener('click', () => {
				button.classList.add('btn-select');
				firstGamer = button.innerHTML === '1' ? 'user' : 'computer'

				this.gameResult.innerHTML = `
					<p>${button.innerHTML} 번을 선택하셨습니다. </p>
					<p>선공: ${firstGamer}</p>
					<button class="gamer__done">확인</button>
				`
				let gamerDone = document.querySelector('.gamer__done')
				gamerDone.addEventListener('click', () => {
					firstGamerUI.style.display = 'none';

					if (firstGamer === 'computer'){
						this.showMessage('컴퓨터의 선택을 기다리는중입니다')
					
						setTimeout(() => {
							this.bingoGameStart('', firstGamer);
						}, 1000)
					}
					if (firstGamer === 'user'){
						this.showMessage('번호를 선택해주세요.')
					}
				})
			})
		})
	}

	/**
	 * 빙고 값 확인 
	 * 		- 확인된 번호는 0으로 변경 
	 * 		- this.updateBingoBoard() 함수는 색상을 변경해줌.
	 * @param {Number} _selectedValue - 입력값 
	 * @param {String} _message - 화면에 띄울 메시지
	 */
	checkBingoNumber(_selectedValue, _message){
		for (let i = 0 ; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				if (this.userBingo[i][j].toString() === _selectedValue.toString()){
					this.userBingo[i][j] = 0
					this.updateBingoBoard(this.userBingoElement, i, j);
				}
				if (this.computerBingo[i][j].toString() == _selectedValue.toString()){
					this.computerBingo[i][j] = 0

					// 컴퓨터 빙고판이 화면에 보여졌을때만 update 실행
					if (this.isShowComputer === true){ 
						this.updateBingoBoard(this.computerBingoElement, i, j);
					}
				}
				this.showMessage(_message);
			}
		}
		// _selectedValue 값 제외하기
		this.numberArray = this.numberArray.filter((e) => e !== _selectedValue)
		
		// 빙고 줄 수 확인하기
		this.checkBingoLine('나+_+', this.userBingo)
		this.checkBingoLine('컴퓨터', this.computerBingo)
	}

	/**
	 * 선택한 숫자를 화면에 업데이트
	 * @param {String} _parentElement - 부모 엘리먼트 
	 * @param {Number} _bingoRow - 빙고 row 번호
	 * @param {Number} _bingoCol - 빙고 col 번호
	 */
	updateBingoBoard(_parentElement, _bingoRow, _bingoCol){
		let parentElement = _parentElement
		let bingoRow = parentElement.children[_bingoRow];
		let bingoCol = bingoRow.children[_bingoCol]
		bingoCol.classList.add('col__select')
	}

	/**
	 * 줄 수 체크하기 
	 * 		- 가로, 세로, 대각선이 전부 0일 때 카운트 증가
	 * 		- 5개가 되면 승리 +_+
	 * @param {String} _player - 현재 게임중인 플레이어
	 * @param {Array} _bingoArray - 현재 게임중인 플레이어의 빙고판
	 */
	checkBingoLine(_player, _bingoArray){
		let horCountArray = [];
		let verCountArray = [];
		let bingoLineCount = 0;  // 5개 이상이면 승리
		
		// 가로로 같을때
		_bingoArray.forEach((row) => {
			let horCount = 0;
			row.forEach((col) => {
				if (col === 0) horCount++;
			})
			horCountArray.push(horCount)
			if (horCount === 5) bingoLineCount++;
		})

		// 세로로 같을때
		for (let i = 0; i < _bingoArray.length; i++){
			let verCount = 0;
			for (let j = 0; j < _bingoArray.length; j++){
				if (_bingoArray[j][i] === 0) verCount++;
			}
			verCountArray.push(verCount)
			if (verCount === 5) bingoLineCount++;
		}

		// 대각선이 전부 같을 때
		let tlToBrCount = 0; // 왼위 -> 오아 방향 대각선 카운트
		let trToBlCount = 0; // 오위 -> 왼아 방향 대각선 카운트
		for (let i = 0; i < _bingoArray.length; i++){
			
			// 대각선 방향 카운트
			if (_bingoArray[i][i] === 0) tlToBrCount++;
			if (_bingoArray[i][4 - i] === 0) trToBlCount++;

			// 대각선 각 방향 전부 체크되면 빙고 줄 수 증가
			if (tlToBrCount === 5) bingoLineCount++
			if (trToBlCount === 5) bingoLineCount++
		}

		// 줄 수가 5개가 되면 gameOver! 
		if (bingoLineCount === 5) {
			this.gameOver(_player)
		}

		// 컴퓨터가 부르는 값을 정하기 위한 카운트 Obj
		let result = {
			verCount: verCountArray,
			horCount: horCountArray
		}
		return result; 
	}
	
	/**
	 * 컴퓨터가 부르는 값 확인하기
	 * @returns { String } computerValue
	 */
	getComputerValue(){
		let computerValue; // 컴퓨터가 부르는 값
		let computerNumberArray = [] // 컴퓨터가 가질 수 있는 값

		// 컴퓨터 빙고 가운데 숫자가 안불러져있으면 그거 부르기.
		if (this.computerBingo[2][2] !== 0) {
			computerValue = this.computerBingo[2][2];
			return computerValue;
		}

		// ====== 컴퓨터가 랜덤으로 숫자 부르게
		// 컴퓨터 줄 수 체크 후 한 어레이에 담기
		let countResult = this.checkBingoLine('', this.computerBingo)
		let countList = countResult.horCount.concat(countResult.verCount) // idx가 4이하면 horizonCount, idx가 4보다 크면 verticalCount

		// 내림차순 정렬 후 0보다 크고, 5보다 작은 숫자만 남겨두기
		let largeNumberList = countList.slice().sort((a, b) => (b - a))
		largeNumberList = largeNumberList.filter((number) => number < 5 && number > 0)  // TODO: filter 대신 shift 사용했을때 원본 array 변화있었는지 확인할것.

		// largeNumberList가 있을경우
		if (largeNumberList.length > 0){
			let largeNumber = largeNumberList[0]

			// largeNumber와 일치하는 숫자가 있는지 countList에서 비교해서 idx를 저장
			let largeIndex = countList.indexOf(largeNumber)
			
			if (largeIndex > 4) {  // largeIndex가 4보다 크면 세로줄에서 확인 - 해당줄에 있는 숫자리스트 중 0을 제외한 숫자를 array에 담는다.
				for (let i = 0; i < 5; i++){
					let verticalIdx = largeIndex - 5;
					if (this.computerBingo[i][verticalIdx] !== 0){
						computerNumberArray.push(this.computerBingo[i][verticalIdx])	
					}
				}
			} else { // 가로줄에서 확인 - 해당줄에 있는 숫자리스트 중 0을 제외한 숫자를 array에 담는다.
				this.computerBingo[largeIndex].forEach((number) => {
					if (number !== 0){
						computerNumberArray.push(number)
					}
				})
			}
		} else {
			// largeNumberList가 없으면 랜덤숫자
			computerNumberArray = this.numberArray.slice();
		}
		computerValue = computerNumberArray.sort(() => 0.5 - Math.random())[0]
		return computerValue;
	}


	/**
	 * 게임종료
	 * @param {String} _player 
	 */
	gameOver(_player){
		this.isGameOver = true;

		this.showMessage(`게임이 종료되었습니다. :: ${_player} 승리!`)
		this.numberArray = Array(25).fill().map((v, i) => i + 1); 

		// 빙고판 리셋
		this.userBingo = []
		this.computerBingo = []

		// 빙고판 클릭 방지
		let userModal = document.querySelector('.board-user .modal__none')
		userModal.style.display = 'block';

		// 게임 다시시작 버튼 추가
		let reGameBtn = document.createElement('button')
		let bottomElement = document.querySelector('.bottom');
		reGameBtn.innerHTML = '다시시작'
		bottomElement.append(reGameBtn);

		reGameBtn.addEventListener('click', () => {
			this.clearBingoElement();	
			reGameBtn.remove();
		})

		this.gameResult.innerHTML = '';
	}

	clearBingoElement(){
		// 컴퓨터 빙고판 아예 비우기
		this.computerBingoElement.innerHTML = '';

		// 사용자 빙고판은 input만 남기고 내용 비우기
		let parentElement = this.userBingoElement
		
		let wrapperElement = []
		for (let i = 0; i < 5; i++) {
			let rowElement = []
			rowElement.push('<div class="row">');

			for (let j = 0; j < 5; j++){
				rowElement.push(`
					<input type="text" class="col" value="" />
				`)
			}
			rowElement.push('</div>')
			wrapperElement.push(rowElement.join(''))
		}
		parentElement.innerHTML = wrapperElement.join('')
	}

	// 메시지 그려야징
	showMessage(message){
		this.messageElement.innerHTML = `${message}`
	}
}