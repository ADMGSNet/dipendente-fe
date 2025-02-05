//TODO deve creare dei file di log nella cartella di logs nominati per data
//es. data 2024-01-01.log
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
//test
const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = 'MMM-dd-YYYY HH:mm:ss';
export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        timestamp,
        message,
        data,
      };

      return JSON.stringify(response);
    })
  ),

  transports: [
    // log in file, ma ruota quotidianamente
    new DailyRotateFile({
      // ogni nome file include la data corrente logs/rotating-logs-%DATE%.log'
      //   filename: 'ssr-utils/logs/rotating-logs-%DATE%.log',
      filename: 'ssr-utils/logs/%DATE%/%DATE%.log',
      datePattern: 'YYYY-MMMM-DD',
      zippedArchive: false, // zip logs true/false
      maxSize: '20m', // ruota se la dimensione del file supera i 20 MB
    }),
  ],
});
