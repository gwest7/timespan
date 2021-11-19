import { take } from 'rxjs';
import { describeTimespan, IConfig, observeTimespan } from '../index';

const sec = 1000;
const min = sec * 60;
const hour = min * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

test('Plain descriptions', () => {
  const msFrom = new Date(1000000000000).getTime() // Sunday, September 9, 2001 1:46:40 AM
  const msTo = msFrom;

  const config:IConfig = {
    describeFuture: 'in [t]',
    describePast: '[t] ago',
    units: [
      { ms: year, label: 'Y' },
      { ms: month, label: 'M' },
      { ms: week, label: 'w' },
      { ms: day, label: 'd' },
      { ms: hour, label: 'h' },
      { ms: min, label: 'm' },
      { ms: sec, label: 's' },
    ],
    addPluralS: false,
    wordSeparator: ' ',
  }

  expect(describeTimespan(msTo, msFrom, 1, config)).toBe('now');

  expect(describeTimespan(msTo - sec, msFrom, 1, config)).toBe('1s ago');
  expect(describeTimespan(msTo + sec, msFrom, 1, config)).toBe('in 1s');
  expect(describeTimespan(msTo - sec * 59, msFrom, 1, config)).toBe('59s ago');
  expect(describeTimespan(msTo + sec * 59, msFrom, 1, config)).toBe('in 59s');

  expect(describeTimespan(msTo - min, msFrom, 1, config)).toBe('1m ago');
  expect(describeTimespan(msTo + min, msFrom, 1, config)).toBe('in 1m');
  expect(describeTimespan(msTo - min * 59, msFrom, 1, config)).toBe('59m ago');
  expect(describeTimespan(msTo + min * 59, msFrom, 1, config)).toBe('in 59m');

  expect(describeTimespan(msTo - hour, msFrom, 1, config)).toBe('1h ago');
  expect(describeTimespan(msTo + hour, msFrom, 1, config)).toBe('in 1h');
  expect(describeTimespan(msTo - hour * 23, msFrom, 1, config)).toBe('23h ago');
  expect(describeTimespan(msTo + hour * 23, msFrom, 1, config)).toBe('in 23h');

  expect(describeTimespan(msTo - day, msFrom, 1, config)).toBe('1d ago');
  expect(describeTimespan(msTo + day, msFrom, 1, config)).toBe('in 1d');
  expect(describeTimespan(msTo - day * 6, msFrom, 1, config)).toBe('6d ago');
  expect(describeTimespan(msTo + day * 6, msFrom, 1, config)).toBe('in 6d');

  expect(describeTimespan(msTo - week, msFrom, 1, config)).toBe('1w ago');
  expect(describeTimespan(msTo + week, msFrom, 1, config)).toBe('in 1w');
  expect(describeTimespan(msTo - week * 4, msFrom, 1, config)).toBe('4w ago');
  expect(describeTimespan(msTo + week * 4, msFrom, 1, config)).toBe('in 4w');

  expect(describeTimespan(msTo - month, msFrom, 1, config)).toBe('1M ago');
  expect(describeTimespan(msTo + month, msFrom, 1, config)).toBe('in 1M');
  expect(describeTimespan(msTo - month * 11, msFrom, 1, config)).toBe('11M ago');
  expect(describeTimespan(msTo + month * 11, msFrom, 1, config)).toBe('in 11M');

  expect(describeTimespan(msTo - year, msFrom, 1, config)).toBe('1Y ago');
  expect(describeTimespan(msTo + year, msFrom, 1, config)).toBe('in 1Y');
});


test('2 word descriptions', () => {
  const msFrom = new Date(1000000000000).getTime() // Sunday, September 9, 2001 1:46:40 AM
  const msTo = msFrom;

  const config:IConfig = {
    describeFuture: 'in [t]',
    describePast: '[t] ago',
    units: [
      { ms: year, label: 'Y' },
      { ms: month, label: 'M' },
      { ms: week, label: 'w' },
      { ms: day, label: 'd' },
      { ms: hour, label: 'h' },
      { ms: min, label: 'm' },
      { ms: sec, label: 's' },
    ],
    addPluralS: false,
    wordSeparator: ' ',
  }

  expect(describeTimespan(msTo, msFrom, 2, config)).toBe('now');

  expect(describeTimespan(msTo - sec, msFrom, 2, config)).toBe('1s ago');
  expect(describeTimespan(msTo + sec, msFrom, 2, config)).toBe('in 1s');
  expect(describeTimespan(msTo - sec * 59, msFrom, 2, config)).toBe('59s ago');
  expect(describeTimespan(msTo + sec * 59, msFrom, 2, config)).toBe('in 59s');

  expect(describeTimespan(msTo - min, msFrom, 2, config)).toBe('1m 0s ago');
  expect(describeTimespan(msTo + min, msFrom, 2, config)).toBe('in 1m 0s');
  expect(describeTimespan(msTo - min * 59, msFrom, 2, config)).toBe('59m 0s ago');
  expect(describeTimespan(msTo + min * 59, msFrom, 2, config)).toBe('in 59m 0s');
  expect(describeTimespan(msTo - min * 59 - sec, msFrom, 2, config)).toBe('59m 1s ago');
  expect(describeTimespan(msTo + min * 59 + sec, msFrom, 2, config)).toBe('in 59m 1s');
  expect(describeTimespan(msTo - min * 59 - sec * 59, msFrom, 2, config)).toBe('59m 59s ago');
  expect(describeTimespan(msTo + min * 59 + sec * 59, msFrom, 2, config)).toBe('in 59m 59s');

  expect(describeTimespan(msTo - hour, msFrom, 2, config)).toBe('1h 0m ago');
  expect(describeTimespan(msTo + hour, msFrom, 2, config)).toBe('in 1h 0m');
  expect(describeTimespan(msTo - hour * 23, msFrom, 2, config)).toBe('23h 0m ago');
  expect(describeTimespan(msTo + hour * 23, msFrom, 2, config)).toBe('in 23h 0m');
  expect(describeTimespan(msTo - hour * 23 - min, msFrom, 2, config)).toBe('23h 1m ago');
  expect(describeTimespan(msTo + hour * 23 + min, msFrom, 2, config)).toBe('in 23h 1m');
  expect(describeTimespan(msTo - hour * 23 - min * 59, msFrom, 2, config)).toBe('23h 59m ago');
  expect(describeTimespan(msTo + hour * 23 + min * 59, msFrom, 2, config)).toBe('in 23h 59m');

  expect(describeTimespan(msTo - day, msFrom, 2, config)).toBe('1d 0h ago');
  expect(describeTimespan(msTo + day, msFrom, 2, config)).toBe('in 1d 0h');
  expect(describeTimespan(msTo - day * 6, msFrom, 2, config)).toBe('6d 0h ago');
  expect(describeTimespan(msTo + day * 6, msFrom, 2, config)).toBe('in 6d 0h');
  expect(describeTimespan(msTo - day * 6 - hour, msFrom, 2, config)).toBe('6d 1h ago');
  expect(describeTimespan(msTo + day * 6 + hour, msFrom, 2, config)).toBe('in 6d 1h');
  expect(describeTimespan(msTo - day * 6 - hour * 23, msFrom, 2, config)).toBe('6d 23h ago');
  expect(describeTimespan(msTo + day * 6 + hour * 23, msFrom, 2, config)).toBe('in 6d 23h');

  expect(describeTimespan(msTo - week, msFrom, 2, config)).toBe('1w 0d ago');
  expect(describeTimespan(msTo + week, msFrom, 2, config)).toBe('in 1w 0d');
  expect(describeTimespan(msTo - week * 4, msFrom, 2, config)).toBe('4w 0d ago');
  expect(describeTimespan(msTo + week * 4, msFrom, 2, config)).toBe('in 4w 0d');
  expect(describeTimespan(msTo - week * 4 - day, msFrom, 2, config)).toBe('4w 1d ago');
  expect(describeTimespan(msTo + week * 4 + day, msFrom, 2, config)).toBe('in 4w 1d');
  expect(describeTimespan(msTo - week * 3 - day * 6, msFrom, 2, config)).toBe('3w 6d ago');
  expect(describeTimespan(msTo + week * 3 + day * 6, msFrom, 2, config)).toBe('in 3w 6d');

  expect(describeTimespan(msTo - month, msFrom, 2, config)).toBe('1M 0w ago');
  expect(describeTimespan(msTo + month, msFrom, 2, config)).toBe('in 1M 0w');
  expect(describeTimespan(msTo - month * 11, msFrom, 2, config)).toBe('11M 0w ago');
  expect(describeTimespan(msTo + month * 11, msFrom, 2, config)).toBe('in 11M 0w');
  expect(describeTimespan(msTo - month * 11 - week, msFrom, 2, config)).toBe('11M 1w ago');
  expect(describeTimespan(msTo + month * 11 + week, msFrom, 2, config)).toBe('in 11M 1w');
  expect(describeTimespan(msTo - month * 11 - week * 4, msFrom, 2, config)).toBe('11M 4w ago');
  expect(describeTimespan(msTo + month * 11 + week * 4, msFrom, 2, config)).toBe('in 11M 4w');

  expect(describeTimespan(msTo - year, msFrom, 2, config)).toBe('1Y 0M ago');
  expect(describeTimespan(msTo + year, msFrom, 2, config)).toBe('in 1Y 0M');
  expect(describeTimespan(msTo - year - month, msFrom, 2, config)).toBe('1Y 1M ago');
  expect(describeTimespan(msTo + year + month, msFrom, 2, config)).toBe('in 1Y 1M');
  expect(describeTimespan(msTo - year - month * 11, msFrom, 2, config)).toBe('1Y 11M ago');
  expect(describeTimespan(msTo + year + month * 11, msFrom, 2, config)).toBe('in 1Y 11M');
});

test('Max word descriptions', () => {
  const msFrom = new Date(1000000000000).getTime() // Sunday, September 9, 2001 1:46:40 AM
  const msTo = msFrom;

  const config:IConfig = {
    describeFuture: 'in [t]',
    describePast: '[t] ago',
    units: [
      { ms: year, label: 'Y' },
      { ms: month, label: 'M' },
      { ms: week, label: 'w' },
      { ms: day, label: 'd' },
      { ms: hour, label: 'h' },
      { ms: min, label: 'm' },
      { ms: sec, label: 's' },
    ],
    addPluralS: false,
    wordSeparator: ' ',
  }

  expect(describeTimespan(msTo - year * 3 - month * 3 - week * 3 - day * 3 - hour * 3 - min * 3 - sec * 3, msFrom, 9, config)).toBe('3Y 3M 3w 3d 3h 3m 3s ago');
  expect(describeTimespan(msTo + year * 3 + month * 3 + week * 3 + day * 3 + hour * 3 + min * 3 + sec * 3, msFrom, 9, config)).toBe('in 3Y 3M 3w 3d 3h 3m 3s');

  expect(describeTimespan(msTo - year * 9 - sec, msFrom, 9, config)).toBe('9Y 0M 0w 0d 0h 0m 1s ago');
  expect(describeTimespan(msTo - year * 9, msFrom, 9, config)).toBe('9Y 0M 0w 0d 0h 0m 0s ago');
  expect(describeTimespan(msTo + year * 9, msFrom, 9, config)).toBe('in 9Y 0M 0w 0d 0h 0m 0s');
  expect(describeTimespan(msTo + year * 9 + sec, msFrom, 9, config)).toBe('in 9Y 0M 0w 0d 0h 0m 1s');

});

test('Transition from future minutes to future seconds', done => {
  const config:IConfig = {
    describeFuture: 'in [t]',
    describePast: '[t] ago',
    units: [
      { ms: hour, label: 'h' },
      { ms: min, label: 'm' },
      { ms: sec, label: 's' },
    ],
    addPluralS: false,
    wordSeparator: ' ',
  }

  const tests:string[] = [];
  observeTimespan(Date.now() + min + sec, 2, config).pipe(take(3)).subscribe({
    next(desciption) {tests.push(desciption)},
    error(er) {done(er)},
    complete() {
      expect(tests[0]).toBe('in 1m 1s');
      expect(tests[1]).toBe('in 1m 0s');
      expect(tests[2]).toBe('in 59s');
      done();
    }
  })
});

test('Transition from future to past', done => {
  const config:IConfig = {
    describeFuture: 'in [t]',
    describePast: '[t] ago',
    units: [
      { ms: min, label: 'm' },
      { ms: sec, label: 's' },
    ],
    addPluralS: false,
    wordSeparator: ' ',
  }

  const tests:string[] = [];
  observeTimespan(Date.now() + sec, 1, config).pipe(take(3)).subscribe({
    next(desciption) {tests.push(desciption)},
    error(er) {done(er)},
    complete() {
      expect(tests[0]).toBe('in 1s');
      expect(tests[1]).toBe('now');
      expect(tests[2]).toBe('1s ago');
      done();
    }
  })
});

test('Transition from past seconds to past minutes', done => {
  const config:IConfig = {
    describeFuture: 'in [t]',
    describePast: '[t] ago',
    units: [
      { ms: hour, label: 'h' },
      { ms: min, label: 'm' },
      { ms: sec, label: 's' },
    ],
    addPluralS: false,
    wordSeparator: ' ',
  }

  const tests:string[] = [];
  observeTimespan(Date.now() - min + sec, 2, config).pipe(take(3)).subscribe({
    next(desciption) {tests.push(desciption)},
    error(er) {done(er)},
    complete() {
      expect(tests[0]).toBe('59s ago');
      expect(tests[1]).toBe('1m 0s ago');
      expect(tests[2]).toBe('1m 1s ago');
      done();
    }
  })
});
