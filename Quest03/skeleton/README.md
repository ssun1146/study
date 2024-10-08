## Checklist

* 자바스크립트는 버전별로 어떻게 변화하고 발전해 왔을까요?
  * 자바스크립트의 버전들을 가리키는 ES5, ES6, ES2016, ES2017 등은 무엇을 이야기할까요?
    > 자바스크립트의 기능이 확장되면서 기능 확장단위를 구분하기 위해 붙여진 버전 명칭.
    
    > ES1(1997년 6월) — ES2(1998년 6월) — ES3(1999년 12월) — ES4(Abandoned) — ES5(2009년 12월) — ES6 / ES2015 — ES7 / ES2016(2016년 6월) — ES8 / ES2017(2017년 6월) — ES9 / ES2018(2018년 6월)
    

  * 자바스크립트의 표준은 어떻게 제정될까요?
    > ES의 의미는 Ecma Script 의 약자. Ecma는 European Computer Manufacturers Association 의 줄임말.
    > 유럽 컴퓨터 생산자 연합 - 컴퓨터 시스템을 표준화하기 위해 세워진 유럽 표준화 기구
    > 브라우저에 따라 웹페이지가 정상 동작하지 않는 크로스 브라우징 이슈가 발생함. 이에, 모든 브라우저에서 동일하게 동작하는 표준화된 자바스크립트에 대한 필요성이 제기됨.
    > ECMA 인터네셔널에 자바스크립트의 표준화를 요청.
    > Javascript의 표준 사양을 개발하고 이를 ECMAScript라 명명 - 이후 JS는 ECMAScript를 표준으로 삼고, 웹 브라우저 / 서버 / 모바일 웹 등 JS가 사용되는 모든 곳에서 ECMAScript의 사양을 따르도록 발전.

---
* 자바스크립트의 문법은 다른 언어들과 비교해 어떤 특징이 있을까요?
  > - node 환경, 브라우저 환경에서 사용 가능한 언어.
  > - 함수형 프로그래밍 가능 
  > - 인터프리터 언어 : (인터프리터 언어이지만,) 웹 브라우저 대부분에는 JIT 컴파일러가 내장되어있음.
  > - 동적 타입 언어 : 변수 타입이 없기 때문에, 프로그램 실행 도중 변수에 저장되는 데이터 타입이 동적으로 바뀔 수 있다.
  > - 싱글스레드 : 동기적 언어
  > - non-blocking 언어: 싱글스레드이지만, (setTimeout, async await 등으로) 비동기적으로 언어를 처리할 수 있음.

  * 자바스크립트에서 반복문을 돌리는 방법은 어떤 것들이 있을까요?
    1. for 문
    > for(let i = 0; i<10; i++){
	  >    console.log(i);
    > }
    
    2. do...while문
    > do
    >  문장
    > while (조건문);

    3. while 문
    > while (조건문)
    >   문장

    4. for...in 문
    
    5. for...of 문

    6. forEach
    > const array = ['1번', '2번', '3번'];
    >
    > array.forEach((element)=>{
    >   console.log(element);
    > })


---
* 자바스크립트를 통해 DOM 객체에 CSS Class를 주거나 없애려면 어떻게 해야 하나요?
  1. setAttribute로 추가하기
  > element.setAttribute("class", "foo");

  2. classList로 추가하기
  > document.getElementById('ex').classList.add('bar');

  3. classList로 삭제하기
  > document.getElementById('ex').classList.remove('foo');

  4. class Toggle
  > document.getElementById('ex').classList.toggle('foo');

  5. 클래스 리스트 확인하기
  > document.getElementById('ex').classList.contains(className);


  * IE9나 그 이전의 옛날 브라우저들에서는 어떻게 해야 하나요?
  1. className으로 추가하기
  > document.getElementById('ex').className = 'foo';


---
* 자바스크립트의 변수가 유효한 범위는 어떻게 결정되나요?
> 함수내에 선언되는 지역변수 / 함수 영역 밖에 선언되는 전역 변수로 나뉜다.
  * `var`과 `let`으로 변수를 정의하는 방법들은 어떻게 다르게 동작하나요?
  > var 키워드는 변수를 중복해서 선언할 수 있기 때문에 의도하지 않은 값을 반환할 수 있다는 문제점이 있다.
  > let, const는 변수를 재선언 할 수 없다. 재할당 가능: let / 변하지 않는 상수 값: const
  > (하지만 예외적으로 콘솔모드에서는 let 변수를 재선언 할 수 있다.)
  > var 키워드는 함수 레벨 스코프를 따르기 때문에 함수 외부에서 선언한 변수는 모두 전역변수로 취급된다.
  > let, const 키워드로 선언한 변수는 모두 코드 블록(함수, if, for, while, try/catch문 등)을 지역 스코프로 인정하는 블록 레벨 스코프를 따른다.


---
* 자바스크립트의 익명 함수는 무엇인가요?
> 함수의 이름이 존재하지 않는 함수. 재사용하지 않고, 한번만 사용하기 위해 담는 함수이다.
> 불필요한 메모리를 차지 하지 않는다
> 변수에 담는 함수이기 때문에 변수 선언부만 호이스팅이 된다.
  
  * 자바스크립트의 Arrow function은 무엇일까요?
  > ES6 문법에서 새로 생긴 함수생성하는 방식 function 키워드를 사용하는것 보다 간단하게 함수를 만들 수 있다.
  > this를 정의하지 않고 사용해도 됨 (화살표 함수에서 this는 window가 아니라 바깥 함수)
  > this의 뜻이 달라지는 것 처럼 일반 function과 용도가 완전 같지 않기 때문에 일반 function을 항상 대체할 수 있는 방법은 아님. 



## Advanced
* Quest 03-1의 코드를 더 구조화하고, 중복을 제거하고, 각각의 코드 블록이 한 가지 일을 전문적으로 잘하게 하려면 어떻게 해야 할까요? 

* Quest 03-2의 스켈레톤 코드에서 `let` 대신 `var`로 바뀐다면 어떤 식으로 구현할 수 있을까요? 
