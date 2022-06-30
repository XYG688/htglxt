/**
 * 配置文件
 */

export const dyxx = {
    name: '',
    sex: '',
    sfzh: '',
    phone: '',
    sqwg: '',
    szdzb: '',
    dylx: '',
    djzt: '',
    rdzzrq: '',
    zwzsdyrq: '',
    cjsj: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
}

export const dylxLists = [
    {
        label: '在职党员',
        value: '在职党员'
    }, 
    {
        label: '流动党员',
        value: '流动党员'
    },
    {
        label: '年老体弱党员',
        value: '年老体弱党员'
    },
    {
        label: '离退休职工党员',
        value: '离退休职工党员'
    },
    {
        label: '下岗失业职工党员',
        value: '下岗失业职工党员'
    }
]
export const djztLists = [
    {
        label: '刚入党',
        value: '刚入党'
    }, 
    {
        label: '转正',
        value: '转正'
    },
    {
        label: '出党',
        value: '出党'
    },
    {
        label: '停止党籍',
        value: '停止党籍'
    },
    {
        label: '死亡',
        value: '死亡'
    },
]

export const queryLists = [
    {
        name: 'name',
        type: 'input',
        label: '姓名',
        placeholder: '请输入姓名'
    },
    {
        name: 'sfzh',
        type: 'input',
        label: '身份证号',
        placeholder: '请输入身份证号'
    },
    {
        name: 'phone',
        type: 'input',
        label: '手机号码',
        placeholder: '请输入手机号码'
    },
    {
        name: 'problemType',
        type: 'select',
        label: '党员类型',
        placeholder: '请选择党员类型',
        options: dylxLists
    },
    {
        name: 'szdzb',
        type: 'input',
        label: '所在支部',
        placeholder: '请输入所在党支部'
    },
    {
        name: 'sqwg',
        type: 'selectGrid',
        label: '社区/网格',
        placeholder: '请输入手机号码'
    },
    {
        name: 'startDate',
        type: 'date',
        label: '入党日期',
        placeholder: '请选择入党组织日期'
    },
    {
        name: 'endDate',
        type: 'date',
        label: '转正日期',
        placeholder: '请选择转为正式党员日期'
    },
    {
        name: 'problemType',
        type: 'select',
        label: '党籍状态',
        placeholder: '请选择党籍状态',
        options: djztLists
    }
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
            key: 'name',
            label: '姓名',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'sex',
            label: '性别',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'sfzh',
            label: '身份证号',
            width: '',
            minWidth: '164',
            align: '', // 对齐方式
        },
        {
            key: 'phone',
            label: '手机号码',
            width: '',
            minWidth: '106',
            align: '', // 对齐方式
        },
        {
            key: 'sqwg',
            label: '社区/网格',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'dylx',
            label: '党员类型',
            width: '',
            minWidth: '136',
            align: '', // 对齐方式
        },
        {
            key: 'djzt',
            label: '党籍状态',
            width: '',
            align: '', // 对齐方式
        },
        {
            key: 'szdzb',
            label: '所在党支部',
            width: '',
            minWidth: '90',
            align: '', // 对齐方式
        },
        {
            key: 'rdzzrq',
            label: '入党组织日期',
            width: '',
            minWidth: '100',
            align: '', // 对齐方式
        },
        {
            key: 'zwzsdyrq',
            label: '转为正式党员日期',
            width: '',
            minWidth: '140',
            align: '', // 对齐方式
        },
        {
            key: 'cjsj',
            label: '创建时间',
            width: '',
            width: '90',
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