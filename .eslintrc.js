module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    jest: true
  },
  globals: {
    window: true
  },
  extends: ['airbnb'],
  rules: {
    // Need to be enabled later
    'no-console': 'off',
    'no-continue': 'off',
    'no-new': 'off',
    'no-restricted-syntax': 'off',
    'no-unneeded-ternary': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true
      }
    ],
    'import/prefer-default-export': 'off',
    'react/jsx-fragments': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react/no-array-index-key': 'off',
    'react/no-danger': 'off',
    'react/no-deprecated': 'off',
    'react/no-string-refs': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unused-state': 'off',
    'react/prefer-stateless-function': 'off',
    'react/sort-comp': 'off',
    'react/react-in-jsx-scope': 'off',

    // Turning off few recommended rules
    'arrow-body-style': 'off',
    camelcase: 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'func-names': 'off',
    'global-require': 'off',
    'guard-for-in': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'one-var': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-const': 'off',
    'prefer-object-spread': 'off',
    'prefer-rest-params': 'off',
    strict: 'off',
    'vars-on-top': 'off',
    yoda: 'off',

    'import/extensions': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/no-useless-path-segments': 'off',

    'react/destructuring-assignment': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-no-bind': 'off',
    'react/no-did-update-set-state': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',

    // Additional Eslint rules
    'max-len': ['off', { code: 100 }],
    'prefer-promise-reject-errors': ['off'],
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false
      }
    ],
    'func-call-spacing': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'no-alert': 'warn',
    eqeqeq: ['error', 'always'],
    'no-eq-null': 'error',
    'no-trailing-spaces': 'error',
    'no-multi-spaces': 'error',
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['warn', 'always'],
    'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 1 }],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': ['error', { before: false, after: true }],
    'space-before-blocks': 'error',
    'space-in-parens': ['error', 'never'],
    'object-shorthand': ['error', 'always', { avoidQuotes: true }],
    'space-infix-ops': 'error',
    'brace-style': 'error',
    'key-spacing': ['error', { beforeColon: false }],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true }
    ]
  },
  overrides: [
    // node files
    {
      files: ['.eslintrc.js', 'scripts/**/*.js', 'config/**/*.js'],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      }
    }
  ]
};
