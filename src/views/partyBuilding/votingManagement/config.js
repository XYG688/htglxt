/**
 * 配置文件
 */

export const queryLists = [
    {
        name: 'name',
        type: 'input',
        label: '姓名',
        placeholder: '请输入姓名'
    },
    {
        name: 'phone',
        type: 'input',
        label: '手机号码',
        placeholder: '请输入手机号码'
    },
    {
        name: 'title',
        type: 'input',
        label: '标题',
        placeholder: '请输入标题'
    },
    {
        name: 'communityGrid',
        type: 'selectGrid',
        label: '社区/网格',
        placeholder: '请输入手机号码'
    },
    {
        name: 'startDate',
        type: 'date',
        label: '开始时间',
        placeholder: '请选择开始时间'
    },
    {
        name: 'endDate',
        type: 'date',
        label: '结束时间',
        placeholder: '请选择结束时间'
    },
    {
        name: 'problemType',
        type: 'select',
        label: '问题类型',
        placeholder: '请选择问题类型',
        options: [
            {
                label: '问题类型1',
                value: '问题类型1'
            }, 
            {
                label: '问题类型2',
                value: '问题类型2'
            }
        ]
    }
]

export const tableData = {
    listsData: [
        {
            name: '张三',
            phone: '111222345',
            sqwg: '网格数据',
            zt: '已回复',
            sfpj: '已评价',
            pjnrcx: '评价内容',
            zxsj: '咨询时间呀',
        },
        {
            name: '李四',
            phone: '111222345',
            sqwg: '网格数据',
            zt: '已回复',
            sfpj: '已评价',
            pjnrcx: '评价内容',
            zxsj: '咨询时间呀',
        },
    ],
    table_index: 'true', // 是否展示序号
    header: [
        {
            key: 'title',
            label: '标题',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'content',
            label: '内容',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'name',
            label: '姓名',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'phone',
            label: '手机号码',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'sqwg',
            label: '社区网格',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'zt',
            label: '状态',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'pjs',
            label: '评价数',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'sfgk',
            label: '是否公开',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'fksj',
            label: '反馈时间',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'doed',
            label: '操作',
            width: '180',
            align: 'center', // 对齐方式
            fixed: 'right'
        }
    ],
    pageData: {
        pageSizes: [10, 20, 30, 50],
        pageSize: 10,
        total: 0,
        currentPage: 1 // 当前页码
    }
}