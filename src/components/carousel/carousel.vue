<template>
  <div class="slider" ref="slider">
    <div class="slider-items" ref="sliderItems">
      <slot></slot>
    </div>
    <div class="dot">
      <span v-for="(item,index) in dots" :class="{active:currentPage===index}"></span>
    </div>
    <div class="carousel-cover" ref="carouselCover"></div>
  </div>
</template>

<script>
import BScroll from "better-scroll"

export default {
  name: "slider",
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPage: 0,
      scroll: '',
      coverHeight: ''
    }
  },
  watch: {
    scroll() {
      if (this.scroll < this.coverHeight)
        var coverOpc = (this.coverHeight - this.scroll) / this.coverHeight
      $('.carousel-cover').css('opacity', 1 - coverOpc)
    }
  },
  mounted() {
    setTimeout(() => {
      this._setWidth()
      this._initDots()
      this._initSlider()
      this._setHeight()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    window.addEventListener('scroll', function () {
      this.scroll = $(window).scrollTop()
    }.bind(this))
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setWidth(true)
      this.slider.refresh()
      this._setHeight()
    })
  },
  activated() {
    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated() {
    clearTimeout(this.timmer)
  },
  beforeDestroy() {
    clearTimeout(this.timmer)
  },
  methods: {
    _setWidth(isResize) {
      this.children = this.$refs.sliderItems.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderItems.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        momentum: false,
        snap: {
          loop: this.loop,
          speed: 400,
          threshold: 0.3
        }
      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPage = pageIndex
        if (this.autoPlay) {
          this._play()
        }
      })
      this.slider.on('beforeScroll', () => {
        if (this.autoPlay) {
          clearTimeout(this.timmer)
        }
      })
    },
    _play() {
      clearTimeout(this.timmer)
      this.timmer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    },
    _setHeight() {
      this.coverHeight = this.$refs.slider.offsetHeight
      $('.carousel-cover').css('height', this.coverHeight)
    }
  }
}
</script>
<style lang="less" scoped>
.carousel-cover {
  width: 100%;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 0;
  z-index: 98;
}
.slider {
  min-height: 1px;
  .slider-items {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .sliderlist {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        width: 100%;
        display: block;
        text-decoration: none;
        img {
          width: 100%;
          display: block;
        }
      }
    }
  }
  .dot {
    width: 100%;
    height: 8px;
    position: absolute;
    bottom: 15px;
    text-align: center;
    span {
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background-color: #aaa;
      margin: 0 4px;
    }
    .active {
      background-color: #fff;
    }
  }
}
</style>
