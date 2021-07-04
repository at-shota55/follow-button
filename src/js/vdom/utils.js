//isEventAttr関数で 渡された attrs がonClickやonChengeなど先頭に on が着くかでイベントかどうか判定
export const isEventAttr = (attr) => {
    return /^on/.test(attr)
}

//文字列でなければ仮想 DOM オブジェクトとして判定する関数
export const isVNode = (node) => {
    return typeof node !== "string";
};

//patch 関数の比較変更をするときに判定する関数
export const isTextChild = (node) => {
    return (
        node &&
        node.children &&
        node.children.length > 0 &&
        typeof node.children[0] === "string"
    );
};