<template>
    <div class="cartcontrol">
        <transition>
            <div class="cart-decrease icon-remove_circle_outline" v-if="food.count > 0" @click.stop.prevent="decreaseCart">
                <!-- <span class="inner icon-remove_circle_outline"></span> -->
            </div>
        </transition>
        <div class="cart-count" v-if="food.count > 0" >{{ food.count }}</div>
         <!--点击加号按钮，触发事件addCart，将事件对象作为参数传递-->
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)" ></div>
    </div>
</template>

<script>

import Vue from "vue";

export default {
    props: {
        food:{
            type:Object
        }
    },
    methods: {
        addCart(event){
            if (!event._constructed) return // 检测事件派发是否来自于better-scroll
            if(!this.food.count){
                // 当给一个观测对象添加一个它不存在的属性的时候，直接赋值是不可以的，需要使用Vue.set设置这个属性
                Vue.set(this.food,'count',1)
            }else{
                this.food.count++;
            }
                this.$emit('cart-add',event.target)// 向父组件触发一个自定义的cart-add事件，同时将事件对象传递给父组件
        },
        decreaseCart(){
            if(this.food.count){
                this.food.count--;
            }
        }
    }
}
</script>

<style lang="stylus" scoped>

    .cartcontrol{
        font-size :0;
        .cart-decrease{
            display : inline-block;
            padding:6px;
            line-height :24px;
            font-size :24px;
            color : rgb(0,160,220);
            &.v-enter-active,&.v-leave-active{
                transition : all 0.4s linear; 
                opacity :1;
                transform :translate3d(0,0,0) rotate(0);
            }
            &.v-enter,&.v-leave-to{
                opacity :0;
                transform :translate3d(24px,0,0) rotate(180deg);
            }
        }
        .cart-count{
            display : inline-block;
            vertical-align :top;
            width :12px;
            padding-top:6px;
            line-height :24px;
            text-align :center;
            font-size :10px;
            color :rgb(147,153,159)
        }
        .cart-add{
            display : inline-block;
            padding:6px;
            line-height :24px;
            font-size :24px
            color : rgb(0,160,220)
        }
    }

</style>
