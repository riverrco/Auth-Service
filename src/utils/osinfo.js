import os from "os";
import psize from "prettysize";
import dns from "dns";
import chalk from "chalk";
import { table } from "table";
import { promisify } from "util";

const dnslookup = promisify(dns.lookup);
const cpuCores = os.cpus().map(i => `${i.model}`);
const totalMem = psize(os.totalmem());
const freeMemory = psize(os.freemem());
const platform = `${os.platform()} v${os.release()} ${os.arch()}`;
const cpu = cpuCores[0];

const ip = async () => {
  const { address } = await dnslookup(os.hostname());
  return address;
};

// ::::::::::::::::::::::::::::::::::::::::::: PRINTS OS INFO WHEN SCRIPT STARTS

const startLog = async ({url, service}) => {
  const ipaddress = await ip();
  const memoryColored =
    parseInt(totalMem) < 2
      ? chalk.bold.red(totalMem)
      : parseInt(totalMem) < 8
        ? chalk.bold.yellow(totalMem)
        : chalk.bold.green(totalMem);
  const freeMemColored =
    parseInt(freeMemory) < 200
      ? chalk.bold.red(freeMemory)
      : parseInt(freeMemory) < 300
        ? chalk.bold.yellow(freeMemory)
        : chalk.bold.green(freeMemory);

  const data = [
    ["SERVICE","URL", "CPU", "TOTAL MEMORY", "FREE MEMORY", "PLATFORM", "IFACEIP"],
    [
      chalk.bold.yellow(service),
      chalk.bold.blue(url),
      chalk.bold.magenta(cpu),
      memoryColored,
      freeMemColored,
      chalk.bold.green(platform),
      chalk.bold.blue(ipaddress)
    ]
  ];

  const output = table(data);
  console.log(output);
};

export default startLog;
