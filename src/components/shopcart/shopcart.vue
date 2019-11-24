<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-if="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">{{totalPrice}}元</div>
          <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click.stop.prevent="pay" >{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
          <transition @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show" :css="false">
              <!--外层盒子-->
              <div class="inner inner-hook"></div>
              <!--内层盒子-->
            </div>
          </transition>
        </div>
      </div>
      <transition>
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty" >清空</span>
          </div>
          <div class="list-content" ref="listContent" >
            <ul>
              <li class="food border-1px" v-for="(food,index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition><div class="list-mask" v-show="listShow" @click="hideList" ></div></transition>
  </div>
</template>

<script>
import cartcontrol from "../cartcontrol/cartcontrol";
import BScroll from "better-scroll";

export default {
  data() {
    return {
      // 使用balls存放5个小球，这些小球的默认状态都是不显示的
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [], // 用dropBalls来存放掉落的小球
      fold: true //折叠
    };
  },
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            price: 12,
            count: 2
          }
        ];
      }
    }
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元`;
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false; //不做切换
      } else {
        let show = !this.fold;
        if(show){
          this.$nextTick(() =>{
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.listContent,{
              click:true
            })
            }else{
              this.scroll.refresh();
            }
          })
        }
        return show;
      }
    }
  },
  methods: {
    empty(){
      this.selectFoods.forEach((food) => {
        food.count = 0;
      })
    },
    pay(){
      if(this.totalPrice < this.minPrice){
        return
      }else{
        window.alert(`支付${this.totalPrice}元`)
      }
    },
    hideList(){
      this.fold = true;
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      } else {
        this.fold = !this.fold;
      }
    },
    // 当触发drop方法时小球开始掉落
    drop(el) {
        // console.log(el);
      for (let i = 0; i < this.balls.length; i++) {
        // 遍历这5个小球
        let ball = this.balls[i];
        if (!ball.show) {
          // 当小球显示状态为隐藏时
          ball.show = true; // 将这个小球的显示状态设置为true
          ball.el = el; // 将cartControl传过来的对象挂载到ball的el属性上
          this.dropBalls.push(ball); // 将这个小球放入到dropBalls数组中
          return;
        }
      }
    },
    beforeDrop(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect(); // getBoundingClientRect()获取小球相对于视窗的位置，屏幕左上角坐标为0，0
          let x = rect.left - 32; // 小球x方向位移= 小球距离屏幕左侧的距离-外层盒子距离水平的距离
          let y = -(window.innerHeight - rect.top - 22); // 负数，因为是从左上角向下
          el.style.display = "";
          el.style.webkitTransform = `translate3d(0,${y}px,0)`; // 设置外层盒子，即小球垂直方向的位移
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`; // 设置内层盒子，即小球水平方向的距离
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    dropping(el, done) {
      /* eslint-disable no-unused-vars */
      // 触发浏览器重绘
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        // 让动画效果异步执行,提高性能
        el.style.webkitTransform = "translate3d(0,0,0)"; // 设置小球掉落后最终的位置
        el.style.transform = "translate3d(0,0,0)";
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.webkitTransform = "translate3d(0,0,0)";
        inner.style.transform = "translate3d(0,0,0)";
        el.addEventListener("transitionend", done); // Vue为了知道过渡的完成，必须设置相应的事件监听器。它可以是transitionend或 animationend
      });
    },
    afterDrop(el) {
      let ball = this.dropBalls.shift(); // 完成一次动画就删除一个dropBalls的小球
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    }
  },
  components: {
    cartcontrol
  }
};
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/mixin';

ul,h1 {
  padding: 0;
  margin:0;
}

.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
  font-size: 0;

  .content {
    display: flex;
    background-color: #141d27;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        position: relative;
        vertical-align: top;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        background-color: #141d27;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background-color: #2b343c;

          &.highlight {
            background-color: rgb(0, 160, 220);
          }

          .icon-shopping_cart {
            line-height: 44px;
            font-size: 24px;
            color: #80858a;

            &.highlight {
              color: #fff;
            }
          }
        }

        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #FFF;
          background-color: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4); // 阴影
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;

        &.highlight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
      }
    }

    .content-right {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;

        &.not-enough {
          background-color: #2b333b;
        }

        &.enough {
          background-color: #00b43c;
          color: #FFF;
        }
      }
    }
  }

  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: rgb(0, 160, 220);
        transition: all 0.4s linear;
      }
    }
  }

  .shopcart-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0); // 整个列表相对于当前自身的高度做一个偏移

    &.v-enter-active, &.v-leave-active {
      transition: all 0.5s;
      transform: translate3d(0, -100%, 0); // 每个表项相对于当前自身的高度做一个偏移
    }

    &.v-enter, &.v-leave-to {
      transition: all 0.5s;
      transform: translate3d(0, 0, 0);
    }

    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background-color: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .list-content {
      padding: 0 18px;
      max-height: 218px;
      overflow: hidden;
      background-color: #FFF;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        border-1px(rgba(7, 17, 27, 0.1));

        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
}
.list-mask{
  position :fixed;
  left:0;
  top:0;
  width:100%;
  height:100%;
  z-index:40;
  backdrop-filter :blur(10px)
  background-color :rgba(7,17,27,0.6)
  &.v-enter-active, &.v-leave-active{
    transition: all 0.5s;
    opacity :1;
  }
  &.v-enter, &.v-leave-to{
    transition: all 0.5s;
    opacity :0;
    background-color :rgba(7,17,27,0)
  }
}
</style>

