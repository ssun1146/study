class Desktop {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(folderClass, iconClass){
		this.folder = document.querySelector(`.${folderClass}`);
		this.icon = document.querySelector(`.${iconClass}`)
	}

	/**
	 * 바탕화면에 그릴 폴더갯수, 아이콘 개수를 확인
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
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(count, element){
		this.iconCount = count;
		this.wrapperElement = element;
	}

	getIconList() {
		let windowIconWrap = this.wrapperElement.children[1]

		for (let i = 1; i <= this.iconCount; i++){
			let iconUi = new uiControl(windowIconWrap).createIcon('icon', `파일 ${i}`)
			windowIconWrap.append(iconUi);
			
			// 드래그 & 드롭 가능하게
			new uiControl(iconUi).dragAndDrop();
		}
	}
}

class Folder {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(count, element){
		this.folderCount = count;
		this.wrapperElement = element;
	}

	getFolderList() {
		let windowIconWrap = this.wrapperElement.children[1]

		for (let i = 1; i <= this.folderCount; i++){
			let folderUI = new uiControl(windowIconWrap).createIcon('folder', `폴더 ${i}`)
			windowIconWrap.append(folderUI);

			// 더블클릭 시 폴더 UI 나오게 
			folderUI.addEventListener('dblclick', () => {
				this.createFolderUI(i);
			})
			
			// 드래그 & 드롭 가능하게
			new uiControl(folderUI).dragAndDrop();
		}
	}
	createFolderUI(i) {
		let folderWindow = new uiControl(this.wrapperElement).createWindow(`폴더 ${i}`)
		new uiControl(folderWindow).dragAndDrop();
	}
}

class Window {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(folderCount, iconCount) {
		this.folderCount = folderCount;
		this.iconCount = iconCount;
	}

	createWindow() {
		let desktopEl = document.querySelector('.desktop');

		// 바탕화면 UI 그리기
		let windowElement = new uiControl(desktopEl).createWindow('바탕화면');

		// 바탕화면 내 아이콘 생성하기
		this.createWindowContent(windowElement);

		// 엘리먼트 드래그 & 드롭..?
		new uiControl(windowElement).dragAndDrop();
	}

	createWindowContent(element) {
		let folderList = new Folder(this.folderCount, element);
		folderList.getFolderList();

		let iconList = new Icon(this.iconCount, element);
		iconList.getIconList();
	}
}

class uiControl {
	constructor(element) {
		this.elementName = element;
		this.zIndexAdd = 20;
	}

	dragAndDrop() {
		let isDragging = false;
		let offsetX = null
		let offsetY = null
		let dragArea = this.elementName.children[0] || this.elementName; // 창 영역 전체가 아니라, 아이콘 또는 상태표시줄 영역(?)을 클릭하면 드래그&드롭이 되도록 함.

		dragArea.addEventListener("mousedown", (e) => {
			isDragging = true;
			offsetX = e.clientX - this.elementName.offsetLeft;
			offsetY = e.clientY - this.elementName.offsetTop;
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

		this.zIndexAdd += 10
	}

	createWindow(title) {
		let parentArea = this.elementName;

		const windowElement = document.createElement('div')
		windowElement.classList.add('window')
		windowElement.innerHTML = `
			<div class="window__header">${title}
				<button class="btn-delete"></button>
			</div>
			<div class="window__content"></div>
		`
		parentArea.append(windowElement);

		// 삭제 버튼 클릭 시 삭제
		let btnDelete = windowElement.children[0].children[0]
		this.deleteWindow(btnDelete, windowElement);

		return windowElement;
	}

	createIcon(className, title){
		let parentArea = this.elementName;

		const iconUi = document.createElement('div');
		iconUi.classList.add(`${className}`);
		iconUi.innerHTML = `
			<div class="${className}__ico"></div>
			<div class="${className}__name">${title}</div>
		`
		parentArea.append(iconUi);

		return iconUi;
	}
	
	deleteWindow(btnElement, parentElement){
		btnElement.addEventListener('click', () => {
			parentElement.remove()
		})
	}

	updateMsg(msg){
		let textMsg = document.querySelector('.text_msg')
		textMsg.innerHTML = `${msg}`
	}
}
