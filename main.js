let wordLength = 0;
let textBox = [];
let pointer = 0;
let rightAns = "";
let _wordlib = [];
let playerAns = "";
let tryTime = 0;
let errorTimeout;
let _quickInput = [];
window.addEventListener("keydown", keyboardListener);
function keyboardListener(e) {
    let e_key = e.key.toLowerCase();
    if (e_key.length == 1 && e_key >= "a" && e_key <= "z") {
        input(e_key);
    }
    if (e.key == 'Backspace') {
        backspace();
    }
    if (e.key == 'Enter') {
        Enter();
    }
    if (e.key == 'ArrowRight') {
        pointerChange(pointer + 1);
    }
    if (e.key == "ArrowLeft") {
        pointerChange(pointer - 1);
    }
}
function init() {
    lengthChange();
    let keyboard = document.querySelectorAll(".keys");
    let keyclick = function () { input(this.id) };
    for (let i of keyboard) {
        i.addEventListener("click", keyclick);
    }
    document.getElementById('backspace').removeEventListener('click', keyclick);
    document.getElementById("backspace").addEventListener('click', backspace);
    document.getElementById('enter').removeEventListener('click', keyclick);
    document.getElementById("enter").addEventListener('click', Enter);
}
function lengthChange() {

    wordLength = Math.floor(Number(document.getElementById("length").value));
    if (isNaN(wordLength)) {
        wordLength = 5;
        document.getElementById("length").value = 5;
    }
    if (wordLength < 3) {
        wordLength = 3;
        document.getElementById("length").value = 3;
    }
    if (wordLength > 15) {
        wordLength = 15;
        document.getElementById("length").value = 15;
    }
    //处理字符大小
    let letterSize = "", fontSize = "";
    if (wordLength <= 6) {
        letterSize = "80px";
        fontSize = "60px";
    }
    else {
        letterSize = Math.floor(600 / (Number(wordLength))).toString() + "px";
        fontSize = Math.floor(600 / (Number(wordLength)) * 0.8).toString() + "px";
    }
    let _root = document.documentElement;
    _root.style.setProperty("--letter-size", letterSize);
    _root.style.setProperty("--font-size", fontSize);
    //表格宽度
    _root.style.setProperty("--wordLength", wordLength);
    //新建并安置字母元素
    //删去旧元素
    let container = document.getElementById("letterContainer");
    container.innerHTML = "";
    //新建新元素
    for (let i = 0; i < wordLength; i++) {
        let _letter = document.createElement("span");
        _letter.className = "letters";
        _letter.id = i;
        _letter.addEventListener("click", function () { pointerChange(this.id) });
        container.appendChild(_letter);
    }
    //刷新文本框列表,快捷填入列表
    textBox = [];
    _quickInput = [];
    for (let i = 0; i < wordLength; i++) {
        textBox.push("");
        _quickInput.push("");
    }
    //刷新指针
    pointerChange(0);
    tryTime = 0
    restart();
}
function pointerChange(e) {
    console.log(e);
    if (e < 0) { e = 0 }
    if (e >= wordLength) { e = wordLength - 1 }
    let t = Number(e);
    pointer = t;
    let _letters = document.querySelectorAll(".letters");
    for (i of _letters) {
        i.setAttribute('isFocus', "null");
    }
    document.getElementById(e).setAttribute('isFocus', "true");
}
function input(e) {
    textBox[pointer] = e;
    if (pointer == 0) {
        e = e.toUpperCase();
    }
    document.getElementById(pointer.toString()).innerHTML = e;
    pointerChange(pointer + 1);
}
function backspace() {
    let t = document.getElementById(pointer.toString()).innerHTML;
    if (!t) {
        pointerChange(pointer - 1);
    }
    document.getElementById(pointer.toString()).innerHTML = "";
    textBox[pointer] = "";
    pointerChange(pointer);
}
function restart() {
    _wordlib = wordlib[wordLength - 3];
    rightAns = _wordlib[Math.floor(Math.random() * _wordlib.length)];
    let keyboard = document.querySelectorAll(".keys");
    let _letters = document.querySelectorAll(".letters");
    for (let i of keyboard) {
        i.style.backgroundColor = "white";
        i.style.color = "black";
    }
    textBox = [];
    for (let i = 0; i < wordLength; i++) {
        _letters[i].innerHTML = "";
        _letters[i].style.backgroundColor = "grey";
        textBox.push("");
    }

    document.getElementById("results-table").innerHTML = "";
    tryTime = 0;
    document.getElementById("tryTimes").innerHTML = "尝试次数：0";
    document.getElementById("correctAnswer").innerHTML = "正确答案：";
    pointerChange(0);
}
function showAns() {
    document.getElementById('correctAnswer').innerHTML = "正确答案：" + rightAns.toString();
}
function Enter() {
    if (document.getElementById("errors").firstChild) {
        document.getElementById("errors").removeChild(document.getElementById("errors").firstChild);
    }
    document.activeElement.blur();
    console.log("enter");
    playerAns = textBox.join("").toLowerCase();
    //有效性验证
    let _isAWord = false;
    console.log(playerAns);
    for (i of wordlib) {
        if (i.includes(playerAns)) {
            _isAWord = true;
            break;
        }
    }
    if (wordLength <= 6) {
        if (!textBox.every(i => i != "")) {
            return 0;
        }
    }
    else if (textBox.every(i => i == "")) {
        return 0;
    }
    if (!_isAWord) {
        let _error = document.createElement("span");
        _error.id = "error";
        _error.innerHTML = "*词库中不存在该词";
        _error.className = "error";
        if (errorTimeout) {
            clearTimeout(errorTimeout);
            errorTimeout = null;
        }
        errorTimeout = window.setTimeout(() => {
            if (_error.parentNode) {
                _error.parentNode.removeChild(_error);
                console.log("timeout")
            }
        }, 3000);
        document.getElementById("errors").appendChild(_error);
        let _letterContainer = document.getElementById("letterContainer");
        _letterContainer.style.animationName = 'none';
        void _letterContainer.offsetWidth;
        _letterContainer.style.animationName = "error";
        return 0;
    }
    //核对并呈现
    check();
}
function check() {
    let rightAns_json = rightAns.split("");
    let result_color = [];
    console.log("check");
    for (let i = 0; i < wordLength; i++) {
        if (textBox[i] == rightAns_json[i]) {
            result_color.push("green");
            document.getElementById(textBox[i]).style.backgroundColor = "green";
            document.getElementById(textBox[i]).style.color = "white";
            _quickInput[i] = textBox[i];
        }
        else if (rightAns_json.includes(textBox[i])) {
            result_color.push("#f3ac09");
            console.log(window.getComputedStyle(document.getElementById(textBox[i])));
            if (window.getComputedStyle(document.getElementById(textBox[i])).backgroundColor != "rgb(0, 128, 0)") {
                document.getElementById(textBox[i]).style.backgroundColor = "#f3ac09";
            }
            document.getElementById(textBox[i]).style.color = "white";
        }
        else {
            result_color.push("grey");
            if (textBox[i]) {//监测该字符非空
                document.getElementById(textBox[i]).style.backgroundColor = "grey";
                document.getElementById(textBox[i]).style.color = "white";
            }
        }
    }
    //结果显示
    let _tr = document.createElement("tr");
    _tr.className = "resultTr";
    let _td = document.createElement("td");
    _td.className = "resultTd";
    for (let i = 0; i < wordLength; i++) {
        let _span = document.createElement("span");
        _span.style.backgroundColor = result_color[i];
        _span.className = "resultSpan";
        _span.innerHTML = textBox[i];
        _td.appendChild(_span);
    }
    _tr.appendChild(_td);
    document.getElementById("results-table").appendChild(_tr);
    _tr.scrollIntoView();
    let t = true;//正确校验符
    for (let i of result_color) {
        if (i !== "green") {//完全正确
            t = false;
            break;
        }
    }
    if (t) {
        let _letters = document.querySelectorAll(".letters");
        for (let i of _letters) {
            i.style.backgroundColor = "green";
        }
    }
    else {
        //清空上一轮数据
        let _letters = document.querySelectorAll(".letters");
        for (let i = 0; i < wordLength; i++) {
            _letters[i].innerHTML = "";
            textBox[i] = "";
            pointerChange(0);
        }
    }
    tryTime++;
    document.getElementById("tryTimes").innerHTML = "尝试次数：" + tryTime;
}
function quickInput() {
    for (let i = 0; i < wordLength; i++) {
        if (_quickInput[i] !== "") {
            document.getElementById(i.toString()).innerHTML = _quickInput[i];
            textBox[i] = _quickInput[i];
        }
    }
}