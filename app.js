const fs = require("fs");
const path = require("path");
const CronJob = require("cron").CronJob;
const notifier = require("node-notifier");

const directory = process.argv[2];
const defaultTime = process.argv[3];

function getReminders(directory) {
  const reminders = [];
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    if (path.extname(file) === ".md") {
      let data = fs.readFileSync(`${directory}/${file}`, "utf8");
      let dataArray = data.split("\n");
      dataArray.forEach((line) => {
        let reminder = line.match(
          /(.*) #remind (\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?)/
        );
        if (reminder && reminder[1]) {
          reminders.push({ task: reminder[1], date: reminder[2] });
        }
      });
    }
  });
  return reminders;
}

function setReminders() {
  const reminders = getReminders(directory);
  reminders.forEach((reminder) => {
    const withCron = convertToCron(reminder);
    console.log(withCron);
    setCron(withCron);
  });
}

function convertToCron(reminder) {
  const parsedHours = reminder.date.match(/(\d{2}:\d{2})/);
  const date = new Date(reminder.date);
  const mins =
    parsedHours && parsedHours[1]
      ? date.getMinutes()
      : defaultTime.split(":")[1];
  const hours =
    parsedHours && parsedHours[1] ? date.getHours() : defaultTime.split(":")[0];
  const dayofmonth =
    parsedHours && parsedHours[1] ? date.getDate() : date.getDate() + 1;
  const month = date.getMonth();
  reminder["cron"] = `${mins} ${hours} ${dayofmonth} ${month} *`;
  return reminder;
}

function setCron(reminder) {
  const job = new CronJob(reminder.cron, () => {
    notifier.notify({
      title: "Markdown Reminder",
      message: reminder.task,
      sound: true,
      wait: true,
    });
  });
  job.start();
}

notifier.notify("Started Reminder Script");
setReminders();
