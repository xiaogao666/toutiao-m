<template>
  <div class="home-container">
        <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar" >
    <van-button
    slot="title"
    icon="search"
    type="info"
    round
    class="search-btn"
    >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <van-tabs
    v-model="active"
    class="channel-tabs"
    >
      <van-tab
      class="tab-item"
      :title="channel.name"
      v-for="channel in channels"
      :key="channel.id"
      >
      <article-list :channel= "channel" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [] // 频道列表
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      const { data } = await getUserChannels()
      this.channels = data.data.channels
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    border: none;
    background-color: #5babfb;
    .van-button__text {
      font-size: 14px;
    }
    .van-icon {
      font-size: 16px;
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
      bottom: 18px;
    }
  }
}
</style>
