import { isEventAttr } from './utils';

const setAttrs = (target, attrs) => {
    for (const attr in attrs) {
        if (isEventAttr(attr)) { //もしonが付いたら
            target.addEventListener(attr.slice(2), attrs[attr]); //ex. onClick => Clickがattrsに入る
        } else {
            target.setAttribute(attr, attrs[attr]);
        }
    }
};

function renderElement({ tagName, attrs, children }) {
    const $el = document.createElement(tagName);
    
    //リアル DOM 要素 $elに class や id、type などの属性を付与
    setAttrs($el,attrs);
    

    for (const child of children) { //children 要素があるならば一つ一つを要素 $el に appendChildする
        $el.appendChild(render(child));
    }

    return $el
}

export function render(vNode) {
    if (typeof vNode === "string") { //渡された要素が文字列かどうか
        return document.createTextNode(vNode);
    }
    return renderElement(vNode);　//文字列でなければrenderElement 関数が呼ばれる
}