
import { Observable } from 'rxjs';

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const YEAR = DAY * 365.2422;
const MONTH = YEAR / 12;

/**
 * Settings that determind how a time span will be described.
 */
export interface IConfig {
  /**
   * A string containing a `[t]` token to descibe a future time
   */
  describeFuture?: string;

  /**
   * A string containing a description for zero time difference
   */
   describeZero: string;

  /**
   * A string containing a `[t]` token to descibe a past time
   */
  describePast?: string;

  /**
   * The units to use to break up the time desciption into words.
   * Here here a WEEK or DECADE can be added
   */
  units: {
    /**
     * The time unit in milliseconds
     */
    ms: number,
    /**
     * A label to describe the time unit
     */
    label: string
  }[];

  /**
   * Option to add an `s` for english plural unit descriptions
   */
  addPluralS?: boolean;

  /**
   * Allows a user to choose the separation between words eg. " | " will result in "1 yr | 1 mth"
   */
  wordSeparator: string;
}

export const DEFAULT:IConfig = {
  describeFuture: 'in [t]',
  describePast: '[t] ago',
  describeZero: 'now',
  units: [
    { ms: YEAR, label: ' yr' },
    { ms: MONTH, label: ' mth' },
    { ms: DAY, label: ' day' },
    { ms: HOUR, label: ' hr' },
    { ms: MIN, label: ' min' },
    { ms: SEC, label: ' sec' },
  ],
  addPluralS: true,
  wordSeparator: ' ',
}

/**
 * 
 * @param ms Time difference in milliseconds. Typically the current time subtracted by
 * the evaluated time. Eg `Date.now() - prevBirthday` or `Date.now() - nextBirthday`
 * (future = negative, past = positive)
 * @param maxWordCount Max number of words to describe the time
 * @param config See `IConfig`
 * @returns 
 */
export function describe(ms:number, maxWordCount = 1, config:IConfig = DEFAULT):{description:string,msDurationValid:number} {
  let t = Math.floor(ms * 0.001) * 1000;
  let msDurationValid = SEC;
  const words:{value:number,label:string,ms:number}[] = [];
  let isMax = false;
  for (let i = 0; i < config.units.length; i++) {
    const unit = config.units[i];
    const isLastUnit = i + 1 === config.units.length;
    const nextUnit = config.units[i+1] ?? config.units[i];
    const at = Math.abs(t);
    if (t < -unit.ms || t >= unit.ms || words.length) {
      if (t < 0 && words.length) words[words.length - 1].value--;
      const value = Math.abs(Math.floor(t / unit.ms));
      if (!isMax) words.push({...unit, value});
      isMax = isMax || words.length >= maxWordCount;
      if (isLastUnit || isMax) {
        const rem = ms % unit.ms;
        msDurationValid = (ms < 0 ? (-rem || unit.ms) : (unit.ms - rem));
        if (ms >= 0 || isLastUnit || value > 1) break;
      }
      t = t % unit.ms;
    }
  }
  if(!words.length && ms < 0) {
    const lastUnit = config.units[config.units.length - 1]
    words.push({ ...lastUnit, value:1 });
    msDurationValid = -(ms % lastUnit.ms) || lastUnit.ms;
  }
  const tmpl = ms < 0 ? config.describeFuture : config.describePast;
  const phrase = words.map(w => `${w.value}${w.label}${config.addPluralS && w.value!==1 ? 's' : ''}`).join(config.wordSeparator);
  let description = tmpl ? tmpl.replace('[t]', phrase) : phrase;
  if (!words.length) {
    description = config.describeZero;
    msDurationValid = SEC - ms % SEC;
  }
  return {
    description,
    msDurationValid,
  };
}

export function describeTimespan(msTo:number, msFrom = Date.now(), maxWordCount = 1, config:IConfig = DEFAULT) {
  const ms = msFrom - msTo; // future = negative, past = positive
  return describe(ms, maxWordCount, config).description;
}

/**
 * Observe time span label
 * @param msTime Millisecond epoch
 * @returns Observable of time span label
 */
export function observeTimespan(msTime:number, maxWordCount = 1, config:IConfig = DEFAULT) {
  return new Observable<string>(subscriber => {
    let timer:any;
    const evaluate = (msTo:number) => {
      const desc = describe(Date.now() - msTo, maxWordCount, config);
      const timeout = desc.msDurationValid;
      if (0 < timeout && timeout < Number.MAX_SAFE_INTEGER) {
        timer = setTimeout(() => evaluate(msTo), timeout);
        subscriber.next(desc.description);
      } else {
        subscriber.next(desc.description);
        subscriber.error(`Timespan observer reevaluation time is out of bounds. Milliseconds: ${timeout}`);
      }
    }
    evaluate(msTime);
    return () => {
      clearTimeout(timer);
    }
  });
}
