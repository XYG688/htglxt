/**
 * 配置文件
 */

export const queryLists = [
    {
        name: 'publisher',
        type: 'input',
        label: '姓名',
        placeholder: '请输入姓名'
    },
    {
        name: 'publisherPhone',
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
        name: 'content',
        type: 'input',
        label: '内容',
        placeholder: '请输入内容'
    },
    {
        name: 'companyName',
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
        name: 'problemReactionType',
        type: 'select',
        label: '问题类型',
        placeholder: '请选择问题类型',
        options: []
    }
]

export const tableData = {
    listsData: [],
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
            key: 'publisher',
            label: '姓名',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'publisherPhone',
            label: '手机号码',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'companyName',
            label: '社区网格',
            width: '',
            minWidth: '140',
            align: '', // 对齐方式
        },
        {
            key: 'replyStatus',
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
            key: 'openStatue',
            label: '是否公开',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'createTime',
            label: '反馈时间',
            width: '',
            minWidth: '140',
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