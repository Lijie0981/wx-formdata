// 配置文档：https://cn.eslint.org/docs/user-guide/configuring
module.exports = {
    // 定义环境，一个环境定义了一组预定义的全局变量
    env: {
        browser: true,
        es2020: true,
    },
    // 可以被基础配置中的已启用的规则继承
    extends: [
        'eslint:recommended', // eslint自带配置
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    // 解析器选项
    parserOptions: {
        ecmaVersion: 11, // 想要使用的 ECMAScript 版本
        parser: '@typescript-eslint/parser', // 解析ts
        sourceType: 'module', // ECMAScript 模块
    },
    // 使用插件，使其可以再extends中引用
    plugins: [
        '@typescript-eslint',
    ],
    // 可忽略的全局变量
    globals: {
        wx: true,
    },
    // 自定义的规则
    rules: {
        // 此规则旨在通过确保块语句用大括号括起来来防止错误并提高代码的清晰度。当遇到省略大括号的块时，它将发出警告
        curly: 0,
        // 判断逻辑的个数
        complexity: ['error', 25],
        // https://eslint.org/docs/rules/no-extra-parens
        'no-extra-parens': 0,
        // 此规则强制运算符使用一致的换行符样式
        'operator-linebreak': 0,
        // 此规则要求所有立即调用的函数表达式都用括号括起来
        'wrap-iife': ['error', 'inside'],
        // 函数参数数量的限制
        'max-params': 0,
        // promise中是否禁用async
        'no-async-promise-executor': 0,
        // switch是否需要设置块{}
        'no-lone-blocks': 0,
        // 是否允许只有一个if的情况
        'no-lonely-if': 0,
        // 是否返回的值可以是一个表达式
        'no-return-assign': 0,
        // 是否允许@ts-ignore
        '@typescript-eslint/ban-ts-comment': 0,
        // 是否允许创建空的箭头函数
        '@typescript-eslint/no-empty-function': 0,
        // 是否允许this生命给局部变量
        '@typescript-eslint/no-this-alias': 0,
        // 函数必须要有返回类型
        '@typescript-eslint/explicit-module-boundary-types': 0,
    },
    overrides: [
        // ts文件的额外校验配置
        {
            files: ['**/*.ts'],
            rules: {
                'no-undef': 0,
            },
        },
    ],
};
