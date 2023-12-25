const fs = require('fs');

const pathToFile = process.argv[2];

if (!pathToFile) {
  throw new Error('Path to .asm file needed');
}

const lines = fs.readFileSync(pathToFile, { encoding: 'utf-8' }).split('\n');

const filteredLines = [];

lines.forEach((line) => {
  line = line.replace(/(\r|\s)/gm, '');



  if (!line.startsWith('//') && line !== '\r' && line.length > 0) {
    filteredLines.push(line);
  }
});

function parseAInstruction(instruction) {
  const value = Number(instruction.slice(1)).toString(2).padStart(15, '0');

  return `0${value}`;
}

const hasAssignment = (line) => line.includes('=');

const hasJump = (line) => line.includes(';');

const compMap = {
  '0': '0101010',
  '1': '0111111',
  '-1': '0111010',
  'D': '0001100',
  'A': '0110000',
  'M': '1110000',
  '!D': '00001101',
  '!A': '0110001',
  '!M': '1110001',
  '-D': '0001111',
  '-A': '0110011',
  '-M': '1110011',
  'D+1': '0011111',
  'A+1': '0110111',
  'M+1': '1110111',
  'D-1': '0001110',
  'A-1': '0110010',
  'M-1': '1110010',
  'D+A': '0000010',
  'D+M': '1000010',
  'D-A': '0010011',
  'D-M': '1010011',
  'A-D': '0000111',
  'M-D': '1000111',
  'D&A': '0000000',
  'D&M': '1000000',
  'D|A': '0010101',
  'D|M': '1010101'
}

const getCompCode = (inst) => {
  const assSplit = inst.split('=');
  const comp = assSplit[assSplit.length-1].split(';')[0];
  return compMap[comp];
}

const assignmentMap = {
  M: '001',
  D: '010',
  MD: '011',
  A: '100',
  AM: '101',
  AD: '110',
  AMD: '111'
};

const getDestCode = (inst) => {
  if (!hasAssignment(inst)) {
    return '000';
  }

  return assignmentMap[inst.split('=')[0]];
}

const jumpMap = {
  JGT: '001',
  JEQ: '010',
  JGE: '011',
  JLT: '100',
  JNE: '101',
  JLE: '110',
  JMP: '111'
}

const getJumpCode = (inst) => {
  if (!hasJump(inst)) {
    return '000';
  }

  return jumpMap[inst.slice(-3)];
}

function parseCInstruction(inst) {
  return `111${getCompCode(inst)}${getDestCode(inst)}${getJumpCode(inst)}`;
}

function parseInstruction(line) {
  if (line.startsWith('@')) {
    return parseAInstruction(line);
  }

  return parseCInstruction(line);
}

const result = [];
filteredLines.forEach((line) => { result.push(parseInstruction(line))})

const resultPath = pathToFile.replace('.asm', '.hack');

fs.writeFileSync(resultPath, result.join('\n'));

