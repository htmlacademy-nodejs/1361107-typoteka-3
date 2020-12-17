"use strict";

const version = require(`./version`);
const help = require(`./help`);
const generate = require(`./generate`);
const server = require(`./server`);
const fill = require(`./fill`);
const fillDb = require(`./fill-db`);

const cli = {
  [version.name]: version,
  [help.name]: help,
  [generate.name]: generate,
  [server.name]: server,
  [fill.name]: fill,
  [fillDb.name]: fillDb,
};

module.exports = {
  cli,
};
