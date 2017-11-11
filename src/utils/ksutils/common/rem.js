export default function(pxToRem, disignWidth) {
    var html = document.documentElement
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
    // 1rem 对应 多少px
    pxToRem = pxToRem || 40
    // 设计图宽度
    disignWidth = disignWidth || 320
    var recalc = function() {
        var clientWidth = html.clientWidth;
        if (!clientWidth) return;
        html.style.fontSize = pxToRem * (clientWidth / disignWidth) + 'px';
    };
    if (!document.addEventListener) return;
    recalc();
    window.addEventListener(resizeEvt, recalc, false);
    document.addEventListener('DOMContentLoaded', recalc, false)
}