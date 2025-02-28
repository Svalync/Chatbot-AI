import configEnv from '@/config';

export default class cronitorInstance {
  private instance: any;

  constructor() {
    let environment = 'development';
    if (configEnv.nextEnv === 'prod') {
      environment = 'production';
    }
    this.instance = require('cronitor')(configEnv.cronitor.apiKey, {
      environment: environment,
      timeout: 5000,
    });
    const nodeCron = require('node-cron');
    this.instance.wraps(nodeCron);
  }

  wrapJob(jobName, jobFunction) {
    return this.instance.wrap(jobName, jobFunction);
  }

  scheduleJob(jobName, time, jobFunction) {
    this.instance.schedule(jobName, time, jobFunction);
  }

  monitorJob(jobName) {
    const monitor = new this.instance.Monitor(jobName);
    return {
      start: () => monitor.ping({ state: 'run' }),
      complete: () => monitor.ping({ state: 'complete' }),
      fail: () => monitor.ping({ state: 'fail' }),
    };
  }
}
