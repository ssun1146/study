class Desktop {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	constructor(folderClass, iconClass){
		this.folder = document.querySelector(`.${folderClass}`);
		this.icon = document.querySelector(`.${iconClass}`)
	}

	updateWindowInfo(){
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

		for (let i = 0; i < this.iconCount; i++){
			const iconUi = document.createElement('div');
			iconUi.classList.add('icon');
			iconUi.innerHTML = `
				<div class="icon__ico"></div>
				<div class="icon__name">파일${i + 1}</div>
			`
			windowIconWrap.append(iconUi);
			
			// 드래그 & 드롭 가능하게
			new DragAndDrop(iconUi).dragAndDrop();
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
		// 부모의 자손한테 갈 수 있게 이동시켜줘야함.
		let windowIconWrap = this.wrapperElement.children[1]

		for (let i = 0; i < this.folderCount; i++){
			const folderUI = document.createElement('div');
			folderUI.classList.add('folder');
			folderUI.innerHTML = `
				<div class="folder__ico"></div>
				<div class="folder__name">폴더${i + 1}</div>
			`
			windowIconWrap.append(folderUI);

			// 더블클릭 시 폴더 UI 나오게 
			folderUI.addEventListener('dblclick', () => {
				this.createFolderUI(i);
			})
			
			// 드래그 & 드롭 가능하게
			new DragAndDrop(folderUI).dragAndDrop();
		}
	}
	createFolderUI(i) {
		const folderWindow = document.createElement('div');
		folderWindow.classList.add('folder__wrap')
		folderWindow.innerHTML = `
			<div class="folder__header">폴더${i + 1}</div>
			<div class="folder__content">
				이 폴더는 비어 있습니다
			</div>
		`
		this.wrapperElement.append(folderWindow)
		new DragAndDrop(folderWindow).dragAndDrop();
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
		const windowElement = document.createElement('div');
		windowElement.classList.add('window');
		windowElement.innerHTML = `
			<div class="window__header">바탕화면</div>
			<div class="window__content"></div>
		`
		desktopEl.append(windowElement);
		this.createWindowContent(windowElement);

		// 엘리먼트 드래그 & 드롭..?
		new DragAndDrop(windowElement).dragAndDrop();
	}

	createWindowContent(element) {
		let folderList = new Folder(this.folderCount, element);
		folderList.getFolderList();

		let iconList = new Icon(this.iconCount, element);
		iconList.getIconList();
	}
}

class DragAndDrop {
	constructor(element) {
		this.elementName = element;
	}

	dragAndDrop() {
		let isDragging = false;
		let offsetX = null
		let offsetY = null
		let dragArea = this.elementName.children[0] || this.elementName;

		// 창 영역 전체가 아니라, 아이콘 또는 상태표시줄 영역(?)을 클릭하면 드래그&드롭이 되도록 함.
		dragArea.addEventListener("mousedown", (e) => {
			isDragging = true;
			offsetX = e.clientX - this.elementName.offsetLeft;
			offsetY = e.clientY - this.elementName.offsetTop;
		})

		document.addEventListener("mousemove", (e) => {
			if (isDragging) {
				this.elementName.style.position = 'absolute';
				this.elementName.style.zIndex = '20'; // 클릭한 요소가 가장 위에 보일 수 있게 z-index 수정(..? 다른 방법 읎나)
				this.elementName.style.left = `${e.clientX - offsetX}px`;
				this.elementName.style.top = `${e.clientY - offsetY}px`;
			}
		});
		
		document.addEventListener("mouseup", () => {
			this.elementName.style.zIndex = '10';
			isDragging = false;
		});
	}
}
