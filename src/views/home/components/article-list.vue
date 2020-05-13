<template>
  <div class="article-list">
    <van-pull-refresh
    v-model="isPullDownLoading"
    @refresh="onRefresh"
    :success-text="refreshSuccessText"
    success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
      <article-item
      v-for="(article, index) in article"
      :key="index"
      :article="article"
      />

    <!-- <van-cell
      v-for="(article, index) in articles"
      :key="index"/>
    :title="article.title"
    /> -->
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      article: [],
      loading: false,
      finished: false,
      timestamp: null, // 刷新下一页的数据
      isPullDownLoading: false, // 下拉刷新的状态
      refreshSuccessText: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      const { data } = await getArticle({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })

      const { results } = data.data
      this.article.push(...results)

      this.loading = false

      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
      }
    },

    async onRefresh () {
      const { data } = await getArticle({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })

      const { results } = data.data
      this.article.push(...results)

      this.isPullDownLoading = false

      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
