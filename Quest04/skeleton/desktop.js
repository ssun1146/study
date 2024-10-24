class Desktop {
	constructor(folderClass, iconClass){
		this.folder = document.querySelector(`.${folderClass}`);
		this.icon = document.querySelector(`.${iconClass}`)
	}

	/**
	 * 바탕화면에 그릴 폴더갯수, 아이콘 개수를 확인
	 * 	- 개수에 문제 없으면 createWindow() 실행
	 */
	updateWindowInfo(){
		// 입력값 정규식 확인 
		// ^ - 한줄만 체크 (여러줄 체크 시 /gm 을 맨 뒤에 붙여주는 것 같음)
		// * - 없거나 (여러개) 있거나
		// /g 를 맨 끝에 - 모두 찾는다
		// & - 특정 문자열로 끝이남
		let numberCheck = /^[0-9]*$/;
		if ( // 정규식 체크 - 숫자가 아닌 값을 입력할 때
				numberCheck.test(this.folder.value) === false || 
				numberCheck.test(this.icon.value) === false
			) {
			new uiControl().updateMsg('숫자를 입력해주세요')
			return;
		}
		if ( // 아이콘 갯수를 1~10 사이가 아닌 숫자를 입력했을 때
				this.folder.value < 1 || this.folder.value > 10 || 
				this.icon.value < 1 || this.icon.value > 10
			) {
			new uiControl().updateMsg('1 부터 10사이의 숫자를 입력해주세요.')
			return;
		}

		let newWindow = new Window(this.folder.value, this.icon.value);
		newWindow.createWindow()

		// 버튼 클릭 시 value 초기화
		this.folder.value = '';
		this.icon.value = '';
	}
}

class Icon {
	constructor(_iconcount, _wrapElement){
		this.iconCount = _iconcount;
		this.wrapperElement = _wrapElement;
	}

	/**
	 * 입력한 갯수만큼 '파일' 아이콘을 화면에 그려줌
	 * @param {String} parent - 부모 엘리먼트
	 */
	getIconList(parent) {
		let windowIconWrap = this.wrapperElement.children[1]

		for (let i = 1; i <= this.iconCount; i++){
			let iconUi = new uiControl(windowIconWrap).createIcon('icon', `파일 ${i}`)
			windowIconWrap.append(iconUi);
			
			// 드래그 & 드롭 가능하게
			new uiControl(iconUi).dragAndDrop(parent);
		}
	}
}

let isShowFolderUI = []; // 폴더 UI를 화면에 그렸으면 해당 엘리먼트를 저장하는 배열
class Folder {
	constructor(_folderCount, _wrapElement){
		this.folderCount = _folderCount;
		this.wrapperElement = _wrapElement;

		this.windowIconWrap = this.wrapperElement.children[1] // 폴더리스트 생성될 영역
	}

	/**
	 * 입력한 갯수만큼 '폴더' 아이콘을 생성해줌.
	 * @param {String} _parentElement - 부모 엘리먼트
	 */
	getFolderList(_parentElement) {
		for (let i = 1; i <= this.folderCount; i++){
			let folderUI = new uiControl(this.windowIconWrap).createIcon('folder', `폴더 ${i}`)
			this.windowIconWrap.append(folderUI);

			// 더블클릭 시 폴더 UI 나오게 - 폴더 아이콘의 z-Index는 20으로 고정되게 함.
			folderUI.addEventListener('dblclick', () => {
				folderUI.style.zIndex = 20

				if (isShowFolderUI.indexOf(folderUI) < 0) {
					this.createFolderUI(i, _parentElement);
					isShowFolderUI.push(folderUI);
				} 
			})
			
			// 드래그 & 드롭 가능하게
			new uiControl(folderUI).dragAndDrop(_parentElement);
		}
	}

	/**
	 * 폴더 아이콘 더블클릭 시 폴더 UI 보여줌.
	 * @param {Number} i - 폴더의 idx (폴더 이름 생성하기위해 필요)
	 * @param {String} _parentElement - 부모 엘리먼트
	 */
	createFolderUI(i, _parentElement) {
		let folderWindow = new uiControl(this.windowIconWrap).createWindow(`폴더 ${i}`, 'folder')
		new uiControl(folderWindow).dragAndDrop(_parentElement);
	}
}

class Window {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(_folderCount, _iconCount) {
		this.folderCount = _folderCount;
		this.iconCount = _iconCount;
	}

	/**
	 * 바탕화면 UI 생성하기 
	 * 	- 폴더, 아이콘 갯수를 받아서 아이콘 생성해줌
	 */
	createWindow() {
		let desktopEl = document.querySelector('.desktop');

		// 바탕화면 UI 그리기
		let windowElement = new uiControl(desktopEl).createWindow('바탕화면', 'window');

		// 바탕화면 내 아이콘 생성하기
		this.createWindowContent(windowElement);

		// 엘리먼트 드래그 & 드롭
		new uiControl(windowElement).dragAndDrop();
	}

	/**
	 * 부모 엘리먼트에 갯수만큼 아이콘을 그려주는 함수
	 * @param {String} _parentElement - 부모엘리먼트
	 */
	createWindowContent(_parentElement) {
		let folderList = new Folder(this.folderCount, _parentElement);
		folderList.getFolderList(_parentElement);

		let iconList = new Icon(this.iconCount, _parentElement);
		iconList.getIconList(_parentElement);
	}
}

let idNumber = 0; // 고유아이디 생성을 위한 변수
let activeWindowList = [];  // 현재 활성화 되어있는 창 리스트
let activeFolderList = [];  // 현재 활성화 되어있는 폴더창..? 리스트
let activeParent = '';	// 현재 활성화된 폴더의 바탕화면 영역
let windowPositionX = 20; // 윈도우 position X좌표 위치
let windowPositionY = 20; // 윈도우 position Y좌표 위치

class uiControl {
	constructor(element) {
		this.elementName = element;
	}

	/**
	 * 요소를 클릭했을 때, 드래그 & 드롭
	 * 	- zIndex도 같이 변경 됨 (changeZ 실행)
	 * @param {String} _parentElement - zIndex 변경 시 부모 UI도 같이 변경이 필요하면 해당 엘리먼트 전달
	 */
	dragAndDrop(_parentElement) {
		let isDragging = false;
		let offsetX = null
		let offsetY = null
		let dragArea = this.elementName.children[0] || this.elementName; // 창 영역 전체가 아니라, 아이콘 또는 상태표시줄 영역(?)을 클릭하면 드래그&드롭이 되도록 함.

		dragArea.addEventListener("mousedown", (e) => {
			isDragging = true;
			offsetX = e.clientX - this.elementName.offsetLeft;
			offsetY = e.clientY - this.elementName.offsetTop;
			
			let activeWindow = this.elementName;  // 현재 활성화된 창 (마지막으로 클릭한 창)
			this.changeZ(_parentElement, activeWindow);
			
		})

		document.addEventListener("mousemove", (e) => {
			if (isDragging) {
				this.elementName.style.position = 'absolute';
				this.elementName.style.zIndex = this.zIndexAdd; 
				this.elementName.style.left = `${e.clientX - offsetX}px`;
				this.elementName.style.top = `${e.clientY - offsetY}px`;
			}
		});
		
		document.addEventListener("mouseup", () => {
			isDragging = false;
		});
	}

	/**
	 * 현재 선택한 항목의 z-index를 가장 위로 올리고, 나머지는 아래로 배치
	 * @param {String} _parentElement 
	 */
	changeZ(_parentElement, activeWindow){
		if (activeWindow !== undefined){
			activeWindowList.forEach((element) => {
				element.style.zIndex = 20;
			})
			activeFolderList.forEach((element) => {
				element.style.zIndex = 20;
			})
			
			// 폴더가 있는 경우, 폴더의 부모 UI의 z-index도 변경시켜줌
			if (_parentElement){
				activeWindow = _parentElement
				activeWindow.style.zIndex = 30;
			} 

			activeWindow.style.zIndex = 30;
		}
	
	}

	/**
	 * 바탕화면, 폴더 UI 생성
	 * @param {String} _title - 헤더에 들어갈 타이틀 내용
	 * @param {String} _type  - 폴더인지, 바탕화면인지
	 * @returns 
	 */
	createWindow(_title, _type) {
		let parentArea = this.elementName;

		const windowElement = document.createElement('div')
		windowElement.classList.add('window')
		windowElement.id = `window-${idNumber}`
		windowElement.innerHTML = `
			<div class="window__header">${_title}
				<button class="btn-delete"></button>
			</div>
			<div class="window__content"></div>
		`
		parentArea.append(windowElement);

		// 타입이 window인 경우
		if (_type === 'window'){
			activeWindowList.push(windowElement);
		}

		// 타입이 folder인 경우
		if (_type === 'folder'){
			activeFolderList.push(windowElement);
			isShowFolderUI.push(windowElement)
		}	
		windowElement.style.left = activeWindowList.length * windowPositionX + 'px';
		windowElement.style.top = activeWindowList.length * windowPositionY + 'px';

		// windowElement 클릭시 z-index 변경
		windowElement.addEventListener('click', () => {
			this.changeZ()
		})

		// 삭제 버튼 클릭 시 삭제
		let btnDelete = document.querySelector(`#window-${idNumber} .btn-delete`)
		this.deleteWindow(btnDelete, windowElement, _type);
		
		idNumber++;
		return windowElement;
	}

	/**
	 * 폴더, 파일 아이콘을 그려주는 메소드
	 * @param {String} _className - 폴더, 윈도우 클래스명
	 * @param {String} title - 아이콘 이름
	 * @returns 
	 */
	createIcon(_className, _title){
		let parentArea = this.elementName;

		const iconUi = document.createElement('div');
		iconUi.classList.add(`${_className}`);
		iconUi.innerHTML = `
			<div class="${_className}__ico"></div>
			<div class="${_className}__name">${_title}</div>
		`
		parentArea.append(iconUi);

		return iconUi;
	}
	
	/**
	 * 닫기버튼을 클릭하면 해당 창이 삭제
	 * @param {String} _btnElement - 닫기버튼 엘리먼트
	 * @param {String} _parentElement - 닫을 부모창 엘리먼트
	 * @param {String} _type - 
	 */
	deleteWindow(_btnElement, _parentElement, _type){
		_btnElement.addEventListener('click', () => {
			_parentElement.remove()

			if (_type === 'window'){
				activeWindowList = activeWindowList.filter((element) => element !== _parentElement)
			}
			if (_type === 'folder'){
				activeFolderList = activeFolderList.filter((element) => element !== _parentElement)
				let indexNum = isShowFolderUI.indexOf(_parentElement)
				isShowFolderUI = isShowFolderUI.slice(indexNum, 2);  // isShowFolderUI array에서 폴더 UI와 폴더 아이콘 2개 삭제
			}
		})
	}

	updateMsg(msg){
		let textMsg = document.querySelector('.text_msg')
		textMsg.innerHTML = `${msg}`
	}
}
