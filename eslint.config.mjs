import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'dev-dist/**/*', 'build/**/*', 'node_modules/**/*', 'home-tutor-project/**/*']
  },
  firebaseRulesPlugin.configs['flat/recommended']
];
