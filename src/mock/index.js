import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
// 平台
import platformAPI from './platform'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

//系统管理

//平台管理
Mock.mock(/\/system\/configs\/platform\/platformList/, 'get', platformAPI.getPlatformList)
Mock.mock(/\/system\/configs\/platform\/authAccountList/, 'get', platformAPI.getAuthAccountList)

export default Mock
