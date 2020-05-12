<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <!-- 表单提交的时候会触发这个 onSubmit 事件 -->
    <!-- 只有表单验证成功才会出发这个事件 -->
    <van-form
    @submit="onLogin"
    validate-first
    ref="login-form"
    :show-error="false"
    :show-error-message="false"
    @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="iconfont toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="iconfont toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        name="code"
        :rules="formRules.code"
      >
        <template #button>
           <van-count-down
          :time="1000 * 60"
          format="ss s"
          center
          v-if="isCountDownShow"
          @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-btn"
            size="mini"
            round
            center
            :loading="isSendSmsLoading"
            @click.prevent="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
       <div class="login-btn-wrap">
      <van-button
        class="login-btn"
        type="info"
        block
        >登录</van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 表单验证规则
      formRules: {
        mobile: [
          { required: true, message: '请填写用户名' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 控制倒计时的显示状态
      isSendSmsLoading: false // 发送验证码按钮的loading状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 登录信息
    async onLogin () {
      Toast.loading({
        message: '登录中...', // 提示文本
        forbidClick: true, // 背景点击禁止
        duration: 0
      })
      try {
        const { data } = await login(this.user)
        Toast.success('登陆成功')
        this.$store.commit('setUser', data.data)
        // 登录成功，跳转到原来的页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          Toast.fail('登陆失败，手机号或验证码错误')
        }
      }
    },
    // 表单验证规则提示信息
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    // 验证码
    async onSendSms () {
      try {
        await this.$refs['login-form'].validate('mobile')
        // 点击后的loading状态
        this.isSendSmsLoading = true

        const res = await sendSms(this.user.mobile)
        console.log(res)
        // 倒计时处理
        this.isCountDownShow = true
      } catch (err) {
        let message = ''
        if (err && err.response && err.response.status === 429) {
          message = '请勿频繁发送'
        } else if (err.name === 'mobile') {
          message = err.message
        } else {
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message,
          position: 'top'
        })
      }
      // 无论请求成功还是失败都要关闭发送按钮的 loading
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
