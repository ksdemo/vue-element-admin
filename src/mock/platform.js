import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    clientName: '@cname',
    cmsClientId: Mock.Random.natural( 100, 10000 ),
    clientTag: '@word',
    description: '@csentence',
    createTime: +Mock.Random.date('T'),
    updateTime: +Mock.Random.date('T'),
    'clientState|1': [0, 1] // 0冻结, 1正常
  }))
}

export default {
  getList: config => {
    const { clientName, pageNo = 1, pageSize = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (clientName && item.clientName.indexOf(clientName) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))

    return {
      code: 0,
      msg: '',
      totalPages: Math.ceil(mockList.length/pageSize),
      totalCount: mockList.length,
      pageSize: pageSize,
      pageNo: pageNo,
      data: pageList
    }
  },
  getDetail: () => ({
    clientName: '@cname',
    cmsClientId: Mock.Random.natural( 100, 10000 ),
    clientTag: '@word',
    description: '@csentence',
    createTime: +Mock.Random.date('T'),
    updateTime: +Mock.Random.date('T'),
    'clientState|1': [0, 1] // 0冻结, 1正常
  })
}
