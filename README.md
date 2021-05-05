# Obsidian Reminders

**Proof of Concept Only! No support provided**

A node script that looks for tasks in markdown files with this format:  

- [ ] Do a thing #remind 2021-05-05 13:55

And scheduled a notification to be sent at the reminder time. If time is omitted a default reminder time can be supplied.

## Install

1. Clone to repo
2. Run `npm install`

## Usage

`node app.js path/to/notes "default_time"`

example:

`node app.js ~/local-vault "12:00"`

Note: time is in 24hour format.

## How does this work?

1. Runs through all markdown files looking for lines with #remind YYYY-MM-DD HH:MM
2. Converts the datetime into cron syntax MM HH DD MM : 00 12 05 05 *
3. Uses `node-cron` to schedule a notification
4. Uses `node-notifier` to send notification at the time

## Problems

- You have to restart the script if you add a new reminder. You could probably build a directory watcher into it to avoid having to do this.

