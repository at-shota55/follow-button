import { render } from "./render";
import { isEventAttr, isTextChild, isVNode } from "./utils";

//前と今を比較している関数
const hasChanged = (oldNode, newNode) => {
    if (typeof oldNode !== typeof newNode) {
        return "TYPE";
    }

    if (isTextChild(oldNode) && isTextChild(newNode)) {
        if (oldNode.children[0] !== newNode.children[0]) {
            return "TEXT";
        }
    }

    if (isVNode(oldNode) && isVNode(newNode)) {
        if (oldNode.tagName !== newNode.tagName) {
            return "NODE";
        }

        if (JSON.stringify(oldNode.attrs) !== JSON.stringify(newNode.attrs)) {
            return "ATTR";
        } 
    }

    return "NONE";
};

const updateAttrs = (target, oldAttrs, newAttrs) => {
    for (const attr in oldAttrs) {
        if (!isEventAttr(attr)) {
            target.removeAttribute(attr);
        }
    }

    for (const attr in newAttrs) {
        if (!isEventAttr(attr)) {
            target.setAttribute(attr, newAttrs[attr]);
        }
    }
};

//parent: 基本となる要素,newNode: 新しい仮想 DOM のオブジェクト,oldNode: 以前の仮想 DOM のオブジェクト,index: 配列である children の何番目か
export const patch = (parent, newNode, oldNode, index = 0) => { 
    if (!oldNode) { //最初の描画時
        parent.appendChild(render(newNode));
    }
    const childNode = parent.childNodes[index];

    if (!newNode) {
        parent.removeChild(childNode);
    }

    //差分を検知
    const type = hasChanged(oldNode, newNode);

    switch (type) {
        //hasChanged 関数から返却された値がTYPE,TEXT,NODEの場合
        case "TYPE":
        case "TEXT":
        case "NODE":
        parent.replaceChild(render(newNode), childNode);
        return;

        //hasChanged 関数から返却された値がATTRの場合
        case "ATTR":
        updateAttrs(childNode, oldNode.attrs, newNode.attrs);
        return;
    }

    if (newNode.tagName) {
        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for (let i = 0; i < newLength || i < oldLength; i++) {
            patch(childNode, newNode.children[i], oldNode.children[i], i);
        }
    }
};