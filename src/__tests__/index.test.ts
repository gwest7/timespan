import { config, take } from 'rxjs';
import { describeTimespan, IConfig, describe, observeTimespan } from '../index';

const sec = 1000;
const min = sec * 60;
const hour = min * 60;
const day = hour * 24;
const week = day * 7;
const year = day * 365.2422;
const month = year / 12;

const conf = {
  describeFuture: 'in [t]',
  describePast: '[t] ago',
  describeZero: 'now',
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
const des = (ms:number, maxWordCount:number) => {
  return describe(ms, maxWordCount, conf).description;
};
const desx = (ms:number, maxWordCount:number) => {
  const {description,msDurationValid} = describe(ms, maxWordCount, conf);
  return `${description} x${msDurationValid}`;
};

test('Describe fine grained future time', () => {
  expect(des(-sec-1, 1)).toBe('in 2s');
  expect(des(-sec, 1)).toBe('in 1s');
  expect(des(-1, 1)).toBe('in 1s');
  expect(des(0, 1)).toBe('now');
});

test('Describe future unit transition', () => {
  expect(des(-min-sec, 1)).toBe('in 2m');
  expect(des(-min-1, 1)).toBe('in 2m');
  expect(des(-min, 1)).toBe('in 60s');
  expect(des(-min+sec-1, 1)).toBe('in 60s');
  expect(des(-min+sec, 1)).toBe('in 59s');
});

test('Describe future (single) unit overflow', () => {
  expect(des(-min-sec, 9)).toBe('in 1m 1s');
  expect(des(-min-sec, 2)).toBe('in 1m 1s');
  expect(des(-min-1, 9)).toBe('in 1m 1s');
  expect(des(-min-1, 2)).toBe('in 1m 1s');
  expect(des(-min, 9)).toBe('in 60s');
});

test('Describe future (multiple) unit overflow', () => {
  expect(des(-day, 9)).toBe('in 24h 0m 0s');
  expect(des(-day-1, 9)).toBe('in 1d 0h 0m 1s');
  expect(des(-day-sec-1, 9)).toBe('in 1d 0h 0m 2s');
});

test('Description expiry of future time', () => {
  expect(desx(-week-day-hour-min-sec, 4)).toBe(`in 1w 1d 1h 2m x${sec}`);
  expect(desx(-week-day-hour-min-sec, 3)).toBe(`in 1w 1d 2h x${min+sec}`);
  expect(desx(-week-day-hour-min-sec, 2)).toBe(`in 1w 2d x${hour+min+sec}`);
  expect(desx(-week-day-hour-min-sec, 1)).toBe(`in 2w x${day+hour+min+sec}`);
  expect(desx(-week-day-hour-min, 1)).toBe(`in 2w x${day+hour+min}`);
  expect(desx(-week-day-hour, 1)).toBe(`in 2w x${day+hour}`);
  expect(desx(-week-day, 1)).toBe(`in 2w x${day}`);
  expect(desx(-week-1, 1)).toBe(`in 2w x${1}`);
  expect(desx(-week, 1)).toBe(`in 7d x${day}`);
  expect(desx(-week+1, 1)).toBe(`in 7d x${day-1}`);
  expect(desx(-day-1, 1)).toBe(`in 2d x${1}`);
  expect(desx(-day, 1)).toBe(`in 24h x${hour}`);
  expect(desx(-day+1, 1)).toBe(`in 24h x${hour-1}`);
  expect(desx(-hour-1, 1)).toBe(`in 2h x${1}`);
  expect(desx(-hour, 1)).toBe(`in 60m x${min}`);
  expect(desx(-hour+1, 1)).toBe(`in 60m x${min-1}`);
  expect(desx(-min-1, 1)).toBe(`in 2m x${1}`);
  expect(desx(-min, 1)).toBe(`in 60s x${sec}`);
  expect(desx(-min+1, 1)).toBe(`in 60s x${sec-1}`);
  expect(desx(-sec*59 -1, 1)).toBe(`in 60s x${1}`);
  expect(desx(-sec, 1)).toBe(`in 1s x${sec}`);
  expect(desx(-sec+1, 1)).toBe(`in 1s x${sec-1}`);
});

test('Describe fine grained past time', () => {
  expect(des(1, 1)).toBe('now');
  expect(des(sec-1, 1)).toBe('now');
  expect(des(sec, 1)).toBe('1s ago');
  expect(des(sec+sec-1, 1)).toBe('1s ago');
});

test('Describe past unit transition', () => {
  expect(des(min-sec, 1)).toBe('59s ago');
  expect(des(min-1, 1)).toBe('59s ago');
  expect(des(min, 1)).toBe('1m ago');
  expect(des(min+sec, 1)).toBe('1m ago');
});

test('Describe past (single) unit overflow', () => {
  expect(des(min-1, 9)).toBe('59s ago');
  expect(des(min, 9)).toBe('1m 0s ago');
  expect(des(min+sec, 9)).toBe('1m 1s ago');
});

test('Describe past (multiple) unit overflow', () => {
  expect(des(day+sec-1, 9)).toBe('1d 0h 0m 0s ago');
  expect(des(day+sec, 9)).toBe('1d 0h 0m 1s ago');
});

test('Description expiry of past time', () => {
  expect(desx(sec-1, 1)).toBe(`now x${1}`);
  expect(desx(sec, 1)).toBe(`1s ago x${sec}`);
  expect(desx(min-1, 1)).toBe(`59s ago x${1}`);
  expect(desx(min, 1)).toBe(`1m ago x${min}`);
  expect(desx(hour-1, 1)).toBe(`59m ago x${1}`);
  expect(desx(hour, 1)).toBe(`1h ago x${hour}`);
  expect(desx(day-1, 1)).toBe(`23h ago x${1}`);
  expect(desx(day, 1)).toBe(`1d ago x${day}`);
  expect(desx(week-1, 1)).toBe(`6d ago x${1}`);
  expect(desx(week, 1)).toBe(`1w ago x${week}`);
  expect(desx(week, 2)).toBe(`1w 0d ago x${day}`);
  expect(desx(week, 3)).toBe(`1w 0d 0h ago x${hour}`);
  expect(desx(week, 4)).toBe(`1w 0d 0h 0m ago x${min}`);
  expect(desx(week, 5)).toBe(`1w 0d 0h 0m 0s ago x${sec}`);
});

