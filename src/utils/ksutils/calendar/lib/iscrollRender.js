import iScroll from './iscroll.js';
export default {
  scroller: null,
  panelIndex: 0,
  y: 0,
  init: function() {
    this.calScrollHeight();
    this.renderScrollWithIscroll();
  },
  renderUI: function() {
    this.calScrollHeight();
    setTimeout(
      () => {
        this.removeUI();
        this.renderScrollWithIscroll()
      }, 
    100);
  },
  removeUI: function() {
    this.y = this.scroller.y || 0
    this.scroller && this.scroller.destroy();
  },
  calScrollHeight: function() { //计算滚动区域的高度
    var doc = document;
    var cal = doc.getElementById('vueCalendarTemplate').clientHeight,
      ele1 = doc.getElementById('topHeight1').clientHeight,
      ele2 = doc.getElementById('topHeight2').clientHeight,
      ele3 = doc.getElementById('fixedBarEle').clientHeight,
      height = cal - ele1 - ele2;
    doc.getElementById('scrollPanelWrapper').style.height = height + 'px';
  },

  renderScrollWithIscroll: function() { //滚动使用iScroll渲染
    var self = this
    var months = document.getElementsByClassName('month-panel').length;
    var panelHeightArray = [];
    var i
    for (i = 0; i < months; i++) {
      panelHeightArray.push(document.getElementsByClassName('month-panel')[i].clientHeight);
    }

    var panelAbsPosi = [];
    var tmpArr = [];

    for (i = 0; i < panelHeightArray.length; i++) {
      tmpArr.push(panelHeightArray[i])
      panelAbsPosi[i] = tmpArr.reduce(function(a, b) {
        return a + b;
      });
    }

    this.scroller = new iScroll('scrollPanelWrapper', {
      zoom: false,
      snap: false,
      y: this.y,
      onScrollMove: function(event) {
        self.scrollWithIscroll(panelAbsPosi, this);
      }
    });
  },
  scrollWithIscroll(panelAbsPosi, scrollObj) {
    var y = Math.abs(scrollObj && scrollObj.y || 0);
    var monthPanel = document.getElementsByClassName('month-panel');
    var fixedBar = document.getElementById('fixedBarEle');
    if (scrollObj.y > 0) {
      fixedBar.style.opacity = 0;
    } else {
      fixedBar.style.opacity = 1;
    }
    var fixedBarHeight = fixedBar.clientHeight;
    for (var i = 0; i < panelAbsPosi.length; i++) {
      if (y > panelAbsPosi[i] - fixedBarHeight && y < panelAbsPosi[i + 1] - fixedBarHeight) {
        var heightDiffer = panelAbsPosi[i] - fixedBarHeight;
        if (y > heightDiffer && y - heightDiffer <= fixedBarHeight) {
          fixedBar.style.WebkitTransform = 'translate(0,' + (panelAbsPosi[i] - fixedBarHeight - y) + 'px)';
          fixedBar.style.transform = 'translate(0,' + (panelAbsPosi[i] - fixedBarHeight - y) + 'px)';
          this.panelIndex = i;
        } else if (y - heightDiffer > fixedBarHeight) {
          fixedBar.style.WebkitTransform = '';
          fixedBar.style.transform = '';
          this.panelIndex = i + 1;
        }
      }
      if (y < panelAbsPosi[0] - fixedBarHeight) {
        this.panelIndex = 0;
      }
      var con = monthPanel[this.panelIndex].getElementsByClassName('month-bar')[0].innerHTML;
      fixedBar.innerHTML = con;
    }
  }
}