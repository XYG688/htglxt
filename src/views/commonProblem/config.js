/**
 * 配置文件
 */

export const queryLists = [
    {
        name: 'title',
        type: 'input',
        label: '标题',
        placeholder: '请输入标题'
    },
    {
        name: 'content',
        type: 'input',
        label: '内容',
        placeholder: '请输入内容'
    },
    {
        name: 'user',
        type: 'input',
        label: '创建人',
        placeholder: '请输入创建人'
    },
    {
        name: 'sqwg',
        type: 'selectGrid',
        label: '社区/网格',
        placeholder: '请输入手机号码'
    },
    {
        name: 'fbsj',
        type: 'date',
        label: '发布时间',
        placeholder: '请选择发布时间'
    },
]

export const tableData = {
    listsData: [
        {
            name: '党员1',
            phone: '111222345',
            sqwg: '网格数据',
            zt: '已回复',
            sfpj: '已评价',
            pjnrcx: '评价内容',
            zxsj: '咨询时间呀',
        },
        {
            name: '党员2',
            phone: '111222345',
            sqwg: '网格数据',
            zt: '已回复',
            sfpj: '已评价',
            pjnrcx: '评价内容',
            zxsj: '咨询时间呀',
        },
        {
            name: '党员3',
            phone: '13500135217',
            sfzh: '187647399510090999',
            dylx: '下岗失业职工党员',
            djzt: '停止党籍',
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
            key: 'user',
            label: '创建人',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'sqwg',
            label: '社区/网格',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'fbsj',
            label: '发布时间',
            width: '',
            minWidth: '136',
            align: '', // 对齐方式
        },
        {
            key: 'doed',
            label: '操作',
            width: '130',
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