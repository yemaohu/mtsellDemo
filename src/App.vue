<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>
<script>

import {urlParse} from "../src/common/js/util"
import header from "./components/Header/header";
import axios from "axios";
const ERR_OK = 0;

export default {
  data () {
    return {
      seller:{
        id:(() => {//立即执行函数，取urlParse中的id
          let queryParam = urlParse();//解析urlParse,吧id传给seller，seller取到
          return queryParam.id;//取到以后发送请求时，需带上api
        })()
      }
    }
  },
  created () {
    this._getSeller()
  },
  methods: {
    _getSeller(){
      axios.get('api/seller?id='+this.seller.id).then((response) => {
            // console.log(response)
            // console.log(response.data.data)
        if(response.data.errno === ERR_OK){
          // this.seller = response.data.data
          this.seller = Object.assign({},this.seller,response.data.data)//ES6语法Object.assign()赋值
          //assign（{},this.seller,res.data）
          // 返回三个参数，第一个是最终返回的数据用空的{},第二个key，第三个value
          // 用assign方法，可以为obj添加属性，为id赋值否则会被丢弃。
          // console.log(this.seller.id)
          // console.log(this.seller)
        }
      })
      .catch((error) => {
        console.log(error);
        
      })
    }
  },
  components: {
    "v-header": header
  }
};
</script>

<style lang="stylus" scoped>

@import url("../static/css/reset");
@import "./common/stylus/mixin";
.tab 
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  border-1px(rgba(7,17,27,0.1))
.tab-item 
  flex: 1
  text-align: center
.tab .tab-item > a
  display :block
  font-size :14px
  color:rgb(77,85,93)

.tab .tab-item .router-link-active
  color:rgb(240,20,20)


</style>
