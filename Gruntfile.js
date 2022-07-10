const configureGrunt = function (grunt) {
  // load all grunt tasks
  require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

  const config = {
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      ts: {
        command:
          './node_modules/typescript/bin/tsc --project ./src/server/tsconfig.json',
      },
      client: {
        command: 'node ./node_modules/react-scripts/scripts/start.js',
      },
    },
    express: {
      dev: {
        options: {
          opts: ['-r', 'ts-node/register'],
          script: 'src/server/index.ts',
          debug: !!process.env.DEBUG,
          node_env: 'development',
          port: 3001,
        },
      },
      prod: {
        options: {
          script: 'build-server/server.js',
          node_env: 'production',
        },
      },
    },
    mkdir: {
      all: {
        options: {
          mode: parseInt('0700', 8),
          create: ['temp'],
        },
      },
    },
    watch: {
      options: {
        livereload: true,
      },
      express: {
        // Restart any time client or server js files change
        files: [
          'src/server/**/*.js',
          'src/server/**/*.ts',
          'src/server/**/*.json',
          'src/config/**/*.js',
          'src/config/**/*.ts',
          'src/server/**/*.hbs',
        ],
        tasks: ['express:dev'],
        options: {
          // Without this option specified express won't be reloaded
          spawn: false,
        },
      },
    },
  };

  grunt.initConfig(config);

  grunt.registerTask('dev', ['mkdir:all', 'exec:ts', 'express:dev', 'watch']);

  grunt.registerTask('prod', ['mkdir:all', 'exec:ts', 'express:prod', 'watch']);

  grunt.registerTask('build:prod', ['mkdir:all', 'exec:ts']);

  grunt.registerTask('client', ['exec:client']);

  grunt.registerTask('default', 'dev');
};

module.exports = configureGrunt;
