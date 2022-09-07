export type BoardRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type BoardFile = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type FileToNum<F extends BoardFile> = {
  a: 1;
  b: 2;
  c: 3;
  d: 4;
  e: 5;
  f: 6;
  g: 7;
  h: 8;
}[F];
export type NumToFile<N extends FileToNum<BoardFile>> = [
  '',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h'
][N];
export default interface Position {
  rank: BoardRank;
  file: BoardFile;
  name: `${BoardFile}${BoardRank}`;
}

export function isPosition(position: any): position is Position {
  return (
    position !== null &&
    position !== undefined &&
    typeof position === 'object' &&
    [1, 2, 3, 4, 5, 6, 7, 8].includes(position.rank) &&
    'abcdefgh'.includes(position.file) &&
    position.name === position.file + position.rank
  );
}

export function fileToNum<F extends BoardFile>(file: F): FileToNum<F> {
  return ' abcdefgh'.indexOf(file) as FileToNum<F>;
}

export function numToFile<F extends FileToNum<BoardFile>>(
  file: F
): NumToFile<F> {
  return ' abcdefgh'[file] as NumToFile<F>;
}

export function getPosition(file: number | string, rank: number): Position {
  if (typeof file === 'string') {
    return {
      rank: rank as BoardRank,
      file: file as BoardFile,
      name: (file + rank) as Position['name'],
    };
  } else {
    return {
      rank: rank as BoardRank,
      file: numToFile(file as FileToNum<BoardFile>),
      name: (numToFile(file as FileToNum<BoardFile>) +
        rank) as Position['name'],
    };
  }
}
