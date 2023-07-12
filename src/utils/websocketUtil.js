//创立连接  127.0.0.1本地host
let websocket = null;
export function inintWebSocket() {
//判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        //连接WebSocket节点
        websocket = new WebSocket(`ws://127.0.0.1:8083/webSocket`);
        console.log(websocket);
        // websocket = new WebSocket(`ws://${host}/socket/webSocket/${name}`);
    } else {
        alert('浏览器不支持webSocket');
    }
//连接成功建立的回调方法
    websocket.onopen = function () {
        console.log("建立连接成功 ...");
    };

//接收到消息的回调方法
    websocket.onmessage = function (event) {
        //例子
        if (!event) {
            console.log(event);
            return event;
        }
    };

//连接关闭的回调方法
    websocket.onclose = function (event) {
        console.log(event);
        console.log("连接关闭!");
    };

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        websocket.close();
    };
//连接发生错误的回调方法
    websocket.onerror = function () {
        console.log("报错了!")
    };
    //往后端发送信息
    return websocket;
}
//向后端传送数据
export function sendInfo(message){
    if (websocket) {
        websocket.send(message);
    }
    else {
        console.log('websocket未建立连接');
    }
}

export function closeConnection(){
    if (websocket) {
        websocket.onclose();
        return null;
    }

}

