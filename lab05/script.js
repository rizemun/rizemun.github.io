const canvas = document.getElementById("canvas");         //холст
const ctx = canvas.getContext('2d');                      //для рисования на холсте
const webList=document.getElementById("list");            //поле куда будет писаться список верiин

//функция задает размеры холсту, красит его,
// создает обработчики для кнопок управления
(function init(w,h){
    canvas.width=w;
    canvas.height=h;
    ctx.fillStyle = "#c8ffdd";
    ctx.fillRect(0,0,w,h);
    //Обработчик для кнопки Добавить
    document.getElementById("pushBut").addEventListener("click",function(){
        let x = document.getElementById("x").value;     //берем x
        let y = document.getElementById("y").value;     //берем y
        if(polygon.pushPoint(x,y)===0) {                //добавляем новую точку в массив
            webList.innerHTML = polygon.forWeb();       //отображаем список точек
        }
        //отрисовка контура фигуры составленной по заданным точкам средствами javascript
        ctx.fillStyle = "#c8ffdd";                      //задаем цвет
        resetCanvas();                                  //закрашиваем фон
        //polygon.draw();
    });
    canvas.addEventListener("mousemove",function(e){
        mouse.x=e.clientX;//записываем x
        mouse.y=e.clientY;//записываем y
    });
})(600,600);//размеры холста

//функция очищающая холст
let resetCanvas = function(){
    ctx.fillRect(0,0,canvas.width,canvas.height);
};



//объект хранящий в себе все данные о многоугольнике
let polygon = new function(){
    this.list = [];         //введенные координаты(константы)
    this.resultList = [];   //вычисляемые координаты

    //метод добавляющий точку в многоугольник
    this.pushPoint = function(pointX,pointY) {
        if (pointX === "" || pointY === "") return 1;//если одно из полей пусто - не добавлять
        this.list.push({
            x: pointX,
            y: pointY
        });
        return 0;
    };

    //метод возвращающий html од для отображения
    this.forWeb = function(){
        let result = "";
        for(let i=0;i<this.list.length;i++){
            result+="P"+(i+1)+" ( "+this.list[i].x+" ; "+this.list[i].y+" )<br>";
        }
        return result;
    };

    //отображение многугольника по координатам лежащим в resultList
    this.drawResult = function(){
        if(this.resultList.length<2)return;
        ctx.strokeStyle = "purple";
        ctx.beginPath();
        ctx.moveTo(this.resultList[0].x,this.resultList[0].y);
        for(let i=1;i<this.resultList.length;i++){
            ctx.lineTo(this.resultList[i].x,this.resultList[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    };

    //метод, проверяющий видимость вершины
    this.isVisible = function(point,side){
        switch(side){
            case "LEFT":
                if(point.x>=cutWindow.x) return true;
                break;
            case "RIGHT":
                if(point.x<=cutWindow.x+cutWindow.width) return true;
                break;
            case "TOP":
                if(point.y>=cutWindow.y) return true;
                break;
            case "BOTTOM":
                if(point.y<=cutWindow.y+cutWindow.height) return true;
                break;
        }
        return false;
    };

    //метод вычисляющий координаты точки пересечения отрезка и границы секущего окна
    this.intersection = function(pointA,pointB,  side){
        let cutWLeft = Number(cutWindow.x);
        let cutWRight = Number(cutWindow.x+cutWindow.width);
        let cutWTop = Number(cutWindow.y);
        let cutWBottom = Number(cutWindow.y+cutWindow.height);
        switch(side){
            case "LEFT":
                return {
                    x: cutWLeft,
                    y: ((pointB.y - pointA.y) * cutWLeft + (pointB.x * pointA.y - pointA.x * pointB.y)) / (pointB.x - pointA.x)
                };
                break;
            case "RIGHT":
                return {
                    x: cutWRight,
                    y: ((pointB.y - pointA.y) * cutWRight + (pointB.x * pointA.y - pointA.x * pointB.y)) / (pointB.x - pointA.x)
                };
                break;
            case "TOP":
                return {
                    x: ((pointB.x - pointA.x) * cutWTop + (pointA.x * pointB.y - pointB.x * pointA.y)) / (pointB.y - pointA.y),
                    y: cutWTop
                };
                break;
            case "BOTTOM":
                return {
                    x: ((pointB.x - pointA.x) * cutWBottom + (pointA.x * pointB.y - pointB.x * pointA.y)) / (pointB.y - pointA.y),
                    y: cutWBottom
                };
                break;
        }
    };

    //метод вычислющий координты того, что будет отображено
    this.calcCut = function(){
        if(this.list.length<2)return;   //если меньше двух вершин - на выход
        let temp = this.list;   //временный массив для хранения промежуточных координат
        let first, second;  //флаги видимости дл вершин при обходе
        let sides = ["LEFT", "RIGHT","TOP", "BOTTOM"];  //флаги определяющие с какой стороной работаем
        for(let k=0;k<4;k++) {  //для каждой стороны секущего окна
            this.resultList=[]; //обнуляем
            if(temp.length===0)return;  //если массив вершин пустой то отображать ничего не надо, выходим из метода
            if (this.isVisible(temp[0], sides[k])) {    //если первая вершина видима
                this.resultList.push(temp[0]);  //добавляем ее в массив результата
                first = true;   //и отмечаем ее как видимую
            }
            else {
                first = false;  //иначе отмечаем как невидимую
            }

            for (let i = 1; i < temp.length; i++) { //для каждой последующей вершины
                second = this.isVisible(temp[i], sides[k]); //рассчитываем ее видимость
                if ((first) && (second)) {  // полная видимость
                    this.resultList.push(temp[i]);  //добавляем в массив видимых
                    first = second; //переходим в следующую вершину
                }
                else if ((!first) && (second)) {    // выход из области видимлсти
                    //заносятся координаты пересечения
                    this.resultList.push(this.intersection(temp[i], temp[i - 1], sides[k]));
                    this.resultList.push(temp[i]);  //добавляем в массив видимых
                    first = second; //переходим в следующую вершину
                }
                else if ((first) && (!second)) {    // вход в область видимости
                    //заносятся координаты пересечения
                    this.resultList.push(this.intersection(temp[i], temp[i - 1], sides[k]));
                    first = second; //переходим в следующую вершину
                }
                else if ((!first) && (!second)) {   // полная невидимость
                    first = second; //переходим в следующую вершину
                }
            }
            //теперь то же самое но для линии соединяющей первую и последнюю точки многоугольника
            second = this.isVisible(temp[0], sides[k]);
            if ((first) && (second)) {  // полная видимость
            }
            else if ((!first) && (second)) {    // выход из области видимлсти
                this.resultList.push(this.intersection(temp[temp.length - 1], temp[0], sides[k]));
            }
            else if ((first) && (!second)) {    // вход в область видимости
                this.resultList.push(this.intersection(temp[temp.length - 1], temp[0], sides[k]));
            }
            else if ((!first) && (!second)) {   // полная невидимость
            }

            temp = this.resultList; //записываем промежуточный результат, после обработки стороны
        }
    };
};


//секущее окно
let cutWindow = new function(){
    this.width=200; //ширина окна
    this.height=150;    //высота окна
    this.x=200;
    this.y=300;

    //метод отрисовки окна
    this.draw=function(){
        ctx.strokeStyle="black";
        ctx.strokeRect(this.x,this.y,this.width,this.height);
    };
    //зацикленный метод вычисляющий отсечение для всех линий
    this.calculateCut=function(){
        resetCanvas();  //очистка холста
        cutWindow.x=mouse.x-cutWindow.width/2-canvas.offsetLeft;    //x
        cutWindow.y=mouse.y-cutWindow.height/2-canvas.offsetTop;    //y
        cutWindow.draw();   //отрисовка окна
        polygon.calcCut();  //вычисление координат
        polygon.drawResult();   //отрисовка по вычесленным координатам
        setTimeout(cutWindow.calculateCut,1000/60);//60 раз в секунду
    };
};

//объект мышки
let mouse = new function(){
    this.x=0;
    this.y=0;
};




//вызов метода расчетов
cutWindow.calculateCut();
































